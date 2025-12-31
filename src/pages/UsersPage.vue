<template>
  <q-page>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">User Management</h1>
        <p class="text-grey-6 q-mt-xs">Manage system users and their roles.</p>
      </div>
      <div class="flex items-center q-gutter-sm">
        <q-input 
            outlined 
            dense 
            v-model="filter" 
            placeholder="Search users..." 
            bg-color="white"
            class="q-mr-sm"
        >
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>
        <q-btn unelevated color="primary" icon="add" label="Add User" no-caps @click="addUserDialog = true" />
      </div>
    </div>

    <q-card flat class="bg-white q-pa-none border-radius-lg overflow-hidden">
       <q-table
        flat
        :rows="users"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="initialPagination"
        :filter="filter"
       >
        <!-- Custom Role Slot -->
        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-badge 
                :color="getRoleColor(props.row.role)" 
                class="text-weight-bold cursor-pointer q-px-sm q-py-xs"
                @click="openEditDialog(props.row)"
            >
                {{ props.row.role }}
                <q-icon name="edit" size="12px" class="q-ml-xs" />
            </q-badge>
          </q-td>
        </template>
        
        <!-- Custom Created At Slot -->
        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            {{ new Date(props.row.created_at).toLocaleDateString() }}
          </q-td>
        </template>

        <!-- Actions Slot -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round color="grey" icon="more_vert" size="sm">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup @click="openEditDialog(props.row)">
                    <q-item-section avatar>
                       <q-icon name="edit" size="xs" />
                    </q-item-section>
                    <q-item-section>Edit Details</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup class="text-red" @click="deleteUser(props.row)">
                    <q-item-section avatar>
                       <q-icon name="delete" size="xs" />
                    </q-item-section>
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
       </q-table>
    </q-card>

    <!-- Add User Dialog -->
    <q-dialog v-model="addUserDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New User</div>
          <div class="text-caption text-grey-6">Create a new account for your system.</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
           <q-input outlined v-model="newUser.name" label="Full Name" dense />
           <q-input outlined v-model="newUser.email" label="Email Address" type="email" dense />
           <q-input 
             outlined 
             v-model="newUser.password" 
             label="Password" 
             :type="showPassword ? 'text' : 'password'" 
             dense
           >
             <template v-slot:append>
               <q-icon
                 :name="showPassword ? 'visibility_off' : 'visibility'"
                 class="cursor-pointer q-mr-xs"
                 @click="showPassword = !showPassword"
               />
               <q-btn round dense flat icon="autorenew" size="sm" color="primary" @click="generatePassword">
                 <q-tooltip>Generate Random Password</q-tooltip>
               </q-btn>
             </template>
           </q-input>
           <q-select
             outlined
             v-model="newUser.role"
             :options="roleOptions"
             label="Role"
             dense
             options-dense
           />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Create User" @click="createUser" :loading="creating" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit User Dialog -->
    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit User Details</div>
          <div class="text-caption text-grey-6">Update information for this user.</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
           <q-input outlined v-model="editForm.full_name" label="Full Name" dense />
           <q-input outlined v-model="editForm.email" label="Email Address" dense />
           <q-select
             outlined
             v-model="editForm.role"
             :options="roleOptions"
             label="Role"
             dense
             options-dense
           />
           <div class="text-caption text-orange-8 bg-orange-1 q-pa-sm rounded-borders q-mt-sm">
             <q-icon name="warning" />
             Note: Changing email here updates the profile only, not the login credentials.
           </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Changes" @click="updateUser" :loading="updating" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { createClient } from '@supabase/supabase-js'

const $q = useQuasar()
const users = ref([])
const loading = ref(true)
const updating = ref(false)
const creating = ref(false)
const editDialog = ref(false)
const addUserDialog = ref(false)
const selectedUser = ref(null)
const filter = ref('')

const newUser = ref({
    name: '',
    email: '',
    password: '',
    role: 'student'
})

const editForm = ref({
  id: '',
  full_name: '',
  email: '',
  role: ''
})

const showPassword = ref(false)

const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    newUser.value.password = password
    showPassword.value = true
}

const roleOptions = ['student', 'teacher', 'admin', 'staff']

const initialPagination = {
  sortBy: 'created_at',
  descending: true,
  rowsPerPage: 10
}

const columns = [
  { name: 'full_name', align: 'left', label: 'Name', field: 'full_name', sortable: true },
  { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
  { name: 'role', align: 'left', label: 'Role', field: 'role', sortable: true },
  { name: 'created_at', align: 'left', label: 'Joined', field: 'created_at', sortable: true },
  { name: 'actions', align: 'right', label: 'Actions' }
]

const getRoleColor = (role) => {
    switch(role) {
        case 'admin': return 'purple';
        case 'teacher': return 'blue';
        case 'student': return 'green';
        case 'staff': return 'orange';
        default: return 'grey';
    }
}

const fetchUsers = async () => {
    loading.value = true
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (error) throw error
        users.value = data
    } catch {
        $q.notify({ type: 'negative', message: 'Error fetching users' })
    } finally {
        loading.value = false
    }
}

const createUser = async () => {
    if (!newUser.value.email || !newUser.value.password || !newUser.value.name) {
        $q.notify({ type: 'warning', message: 'Please fill all fields' })
        return
    }

    creating.value = true
    try {
        // Create a temporary client that doesn't persist session
        const tempSupabase = createClient(
            import.meta.env.VITE_SUPABASE_URL,
            import.meta.env.VITE_SUPABASE_ANON_KEY,
            { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
        )

        const { data: authData, error: authError } = await tempSupabase.auth.signUp({
            email: newUser.value.email,
            password: newUser.value.password,
            options: {
                data: {
                    full_name: newUser.value.name
                }
            }
        })

        if (authError) throw authError

        if (authData.user) {
            // Update Role if not student (standard trigger sets to student)
            if (newUser.value.role !== 'student') {
                 await supabase
                    .from('profiles')
                    .update({ role: newUser.value.role })
                    .eq('id', authData.user.id)
            }
            
            fetchUsers()
            addUserDialog.value = false
            $q.notify({ type: 'positive', message: 'User created successfully' })
            newUser.value = { name: '', email: '', password: '', role: 'student' } // Reset
        }
    } catch (error) {
        $q.notify({ type: 'negative', message: error.message || 'Error creating user' })
    } finally {
        creating.value = false
    }
}

const openEditDialog = (user) => {
    selectedUser.value = user
    editForm.value = {
        id: user.id || '',
        full_name: user.full_name || '',
        email: user.email || '',
        role: user.role || 'student'
    }
    editDialog.value = true
}

const updateUser = async () => {
    if (!editForm.value.id) return
    
    updating.value = true
    try {
        const { error } = await supabase
            .from('profiles')
            .update({ 
                full_name: editForm.value.full_name,
                email: editForm.value.email,
                role: editForm.value.role
            })
            .eq('id', editForm.value.id)
            
        if (error) throw error
        
        // Update local state
        const index = users.value.findIndex(u => u.id === editForm.value.id)
        if (index !== -1) {
            users.value[index] = { ...users.value[index], ...editForm.value }
        }
        
        $q.notify({ type: 'positive', message: 'User updated successfully' })
        editDialog.value = false
    } catch (error) {
         console.error(error)
        $q.notify({ type: 'negative', message: 'Error updating user' })
    } finally {
        updating.value = false
    }
}

const deleteUser = async (user) => {
    if(!confirm('Are you sure you signed to delete this user? This action cannot be undone.')) return

    try {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', user.id)

        if (error) throw error

        users.value = users.value.filter(u => u.id !== user.id)
        $q.notify({ type: 'positive', message: 'User profile deleted successfully' })
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Error deleting user' })
    }
}

onMounted(() => {
    fetchUsers()
})
</script>

<style scoped lang="scss">
.border-radius-lg { border-radius: 16px; }
</style>
