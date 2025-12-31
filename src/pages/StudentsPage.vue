<template>
  <q-page>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Student Management</h1>
        <p class="text-grey-6 q-mt-xs">Manage student profiles, enrollment, and details.</p>
      </div>
      <div class="flex items-center q-gutter-sm">
        <q-input 
            outlined 
            dense 
            v-model="filter" 
            placeholder="Search students..." 
            bg-color="white"
            class="q-mr-sm"
        >
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>
        <q-btn unelevated color="primary" icon="person_add" label="Add Student" no-caps @click="openAddDialog" />
      </div>
    </div>

    <q-card flat class="bg-white q-pa-none border-radius-lg overflow-hidden">
       <q-table
        flat
        :rows="students"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="initialPagination"
        :filter="filter"
       >
        <!-- Custom Avatar Slot -->
        <template v-slot:body-cell-avatar="props">
          <q-td :props="props" auto-width>
            <q-avatar size="32px" class="bg-grey-3 text-grey-8">
                <img v-if="props.row.photo_url" :src="props.row.photo_url" />
                <span v-else>{{ props.row.full_name.charAt(0) }}</span>
            </q-avatar>
          </q-td>
        </template>

        <!-- Custom Status Slot -->
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <q-badge :color="props.row.status === 'active' ? 'green' : 'grey'">
                    {{ props.row.status }}
                </q-badge>
            </q-td>
        </template>

        <!-- Actions Slot -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round color="grey" icon="more_vert" size="sm">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup @click="viewProfile(props.row)">
                    <q-item-section avatar>
                       <q-icon name="visibility" size="xs" />
                    </q-item-section>
                    <q-item-section>View Profile</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openEditDialog(props.row)">
                    <q-item-section avatar>
                       <q-icon name="edit" size="xs" />
                    </q-item-section>
                    <q-item-section>Edit Details</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup class="text-red" @click="deleteStudent(props.row)">
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

    <!-- Add/Edit Student Dialog -->
    <q-dialog v-model="studentDialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-1">
        <q-toolbar class="bg-white text-grey-9 q-py-sm border-bottom">
          <q-toolbar-title class="text-weight-bold">
            {{ isEditing ? 'Edit Student Profile' : 'New Student Admission' }}
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-md scroll" style="max-height: calc(100vh - 60px)">
          <div class="row q-col-gutter-lg justify-center">
             <div class="col-12 col-md-8">
                <!-- Register Student Form Layout -->
                <q-form class="q-gutter-md">
                    
                    <div class="row q-col-gutter-md">
                        <!-- Full Name -->
                        <div class="col-12 col-md-6">
                            <label class="text-weight-medium text-grey-9 q-mb-sm block">Full Name *</label>
                            <q-input outlined v-model="form.full_name" placeholder="John Doe" dense :rules="[val => !!val || 'Required']" hide-bottom-space />
                        </div>
                        
                        <!-- Email Login -->
                        <div class="col-12 col-md-6">
                             <label class="text-weight-medium text-grey-9 q-mb-sm block">Email Login *</label>
                             <q-input outlined v-model="form.email" placeholder="student@institute.com" dense :rules="[val => !!val || 'Required', val => /.+@.+\..+/.test(val) || 'Invalid email']" hide-bottom-space bg-color="yellow-1">
                                <template v-slot:append>
                                    <q-icon name="lock" size="xs" color="orange" />
                                </template>
                             </q-input>
                        </div>

                         <!-- Password -->
                         <div class="col-12">
                             <label class="text-weight-medium text-grey-9 q-mb-sm block">Password *</label>
                             <div class="row items-center cursor-pointer border rounded-borders q-px-sm bg-grey-1" style="border: 1px solid #c2c2c2; height: 40px;">
                                 <div class="col text-subtitle1 text-weight-bold ellipsis">{{ form.password || '••••••••' }}</div>
                                 <q-btn flat round icon="content_copy" size="sm" color="grey-7" @click="copyPassword" v-if="form.password" />
                                 <q-btn flat round icon="cached" size="sm" color="grey-9" @click="generatePassword" />
                             </div>
                             <div class="text-caption text-grey-6 q-mt-xs" v-if="!isEditing">Click refresh to generate a secure password for the student account.</div>
                         </div>
                    </div>

                    <!-- Personal Details Section -->
                    <div class="text-subtitle1 text-weight-bold text-grey-8 q-mt-lg">Personal Details</div>
                    <q-separator class="q-mb-md" />

                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                            <label class="text-weight-medium text-grey-6 q-mb-sm block">School</label>
                            <q-input outlined v-model="form.school" dense hide-bottom-space />
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="text-weight-medium text-grey-6 q-mb-sm block">Current Grade</label>
                            <q-select outlined v-model="form.grade" :options="gradeOptions" dense hide-bottom-space options-dense />
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="text-weight-medium text-grey-6 q-mb-sm block">Admission No / Reg No</label>
                            <q-input outlined v-model="form.admission_no" placeholder="Auto or Manual" dense :rules="[val => !!val || 'Required']" hide-bottom-space />
                        </div>
                         <div class="col-12 col-md-6">
                            <label class="text-weight-medium text-grey-6 q-mb-sm block">Date of Birth</label>
                            <q-input outlined v-model="form.date_of_birth" type="date" dense hide-bottom-space />
                        </div>
                        <div class="col-12">
                            <label class="text-weight-medium text-grey-6 q-mb-sm block">Address</label>
                            <q-input outlined v-model="form.address" dense type="textarea" rows="2" hide-bottom-space />
                        </div>
                    </div>

                    <!-- Parent / Guardian Section -->
                    <div class="text-subtitle1 text-weight-bold text-grey-8 q-mt-lg">Parent / Guardian</div>
                    <q-separator class="q-mb-md" />

                    <div class="row q-col-gutter-md">
                         <div class="col-12 col-md-6">
                            <label class="text-weight-medium text-grey-6 q-mb-sm block">Parent Name</label>
                            <q-input outlined v-model="form.guardian_name" dense hide-bottom-space />
                        </div>
                        <div class="col-12 col-md-6">
                            <label class="text-weight-medium text-grey-6 q-mb-sm block">Parent Phone</label>
                            <q-input outlined v-model="form.mobile_guardian" placeholder="07X-XXXXXXX" dense mask="###-#######" hide-bottom-space />
                        </div>
                    </div>

                    <div class="flex justify-end q-gutter-sm q-mt-xl">
                        <q-btn flat label="Cancel" v-close-popup color="grey-8" no-caps />
                        <q-btn unelevated :label="isEditing ? 'Save Changes' : 'Register Student'" color="black" text-color="white" @click="saveStudent" :loading="saving" no-caps />
                    </div>

                </q-form>

             </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, copyToClipboard } from 'quasar'
import { supabase } from 'boot/supabase'
import { createClient } from '@supabase/supabase-js'

const $q = useQuasar()
const students = ref([])
const loading = ref(true)
const saving = ref(false)
const studentDialog = ref(false)
const isEditing = ref(false)
const filter = ref('')

const form = ref({
    id: null,
    full_name: '',
    admission_no: '',
    date_of_birth: '',
    school: '',
    grade: '',
    address: '',
    mobile_student: '',
    mobile_guardian: '',
    guardian_name: '',
    email: '',
    password: '',
    status: 'active',
    photo_url: ''
})

const gradeOptions = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'A/L', 'Other']

const initialPagination = {
  sortBy: 'created_at',
  descending: true,
  rowsPerPage: 10
}

const columns = [
  { name: 'avatar', align: 'center', label: '', field: 'avatar' },
  { name: 'full_name', align: 'left', label: 'Student Name', field: 'full_name', sortable: true },
  { name: 'admission_no', align: 'left', label: 'Admission No', field: 'admission_no', sortable: true },
  { name: 'grade', align: 'left', label: 'Grade', field: 'grade', sortable: true },
  { name: 'mobile_student', align: 'left', label: 'Mobile', field: 'mobile_student' },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'actions', align: 'right', label: 'Actions' }
]

const fetchStudents = async () => {
    loading.value = true
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (error) throw error
        students.value = data
    } catch {
        $q.notify({ type: 'negative', message: 'Error fetching students' })
    } finally {
        loading.value = false
    }
}

const openAddDialog = () => {
    isEditing.value = false
    // Generate next admission number logic could go here, for now manual
    form.value = {
        id: null,
        full_name: '',
        admission_no: '',
        date_of_birth: '',
        school: '',
        grade: '',
        address: '',
        mobile_student: '',
        mobile_guardian: '',
        guardian_name: '',
        email: '',
        password: '',
        status: 'active',
        photo_url: ''
    }
    // Auto generate password
    generatePassword()
    studentDialog.value = true
}

const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let password = ""
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    form.value.password = password
}

const copyPassword = () => {
    copyToClipboard(form.value.password)
    .then(() => {
        $q.notify({ type: 'positive', message: 'Password copied to clipboard', timeout: 1000 })
    })
    .catch(() => {
        $q.notify({ type: 'negative', message: 'Failed to copy password' })
    })
}

const openEditDialog = (row) => {
    isEditing.value = true
    form.value = { ...row, password: '' } // Clear password for edit as we don't show it
    studentDialog.value = true
}

const saveStudent = async () => {
    if (!form.value.full_name || !form.value.admission_no) {
        $q.notify({ type: 'warning', message: 'Name and Admission No are required' })
        return
    }

    if (!isEditing.value && !form.value.email) {
        $q.notify({ type: 'warning', message: 'Email is required for registration' })
        return
    }

    saving.value = true
    try {
        let userId = null

        // 1. Create Auth User if New Student
        if (!isEditing.value && form.value.email && form.value.password) {
             const tempSupabase = createClient(
                import.meta.env.VITE_SUPABASE_URL,
                import.meta.env.VITE_SUPABASE_ANON_KEY,
                { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
            )

            const { data: authData, error: authError } = await tempSupabase.auth.signUp({
                email: form.value.email,
                password: form.value.password,
                options: {
                    data: {
                        full_name: form.value.full_name
                    }
                }
            })

            if (authError) throw authError
            if (authData.user) {
                userId = authData.user.id
                // Update Role to 'student' in profiles (Trigger handles insertion, we just update role)
                await supabase.from('profiles').update({ role: 'student' }).eq('id', userId)
            }
        }

        // 2. Save to Students Table
        const payload = { 
            full_name: form.value.full_name,
            admission_no: form.value.admission_no,
            date_of_birth: form.value.date_of_birth,
            school: form.value.school,
            grade: form.value.grade,
            address: form.value.address,
            mobile_student: form.value.mobile_student,
            mobile_guardian: form.value.mobile_guardian,
            guardian_name: form.value.guardian_name,
            email: form.value.email,
            status: form.value.status,
            photo_url: form.value.photo_url
            // We could add user_id here if we update the schema later
        }

        let error
        if (isEditing.value) {
            const { error: updateError } = await supabase
                .from('students')
                .update(payload)
                .eq('id', form.value.id)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from('students')
                .insert([payload])
            error = insertError
        }

        if (error) throw error

        $q.notify({ type: 'positive', message: isEditing.value ? 'Student updated' : 'Student registered successfully' })
        studentDialog.value = false
        fetchStudents()
    } catch (e) {
        console.error(e)
        if (e.code === '23505') {
             $q.notify({ type: 'negative', message: 'Admission Number or Email already exists' })
        } else {
             $q.notify({ type: 'negative', message: e.message || 'Error saving student' })
        }
    } finally {
        saving.value = false
    }
}

const deleteStudent = async (row) => {
    if(!confirm('Are you sure you want to delete this student profile?')) return

    try {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', row.id)

        if (error) throw error
        
        students.value = students.value.filter(s => s.id !== row.id)
        $q.notify({ type: 'positive', message: 'Student deleted' })
    } catch {
        $q.notify({ type: 'negative', message: 'Error deleting student' })
    }
}

const viewProfile = () => {
    // Placeholder for Phase 2.3
    $q.notify({ type: 'info', message: 'Profile view coming soon' })
}

onMounted(() => {
    fetchStudents()
})
</script>

<style scoped lang="scss">
.border-radius-lg { border-radius: 12px; }
.border-bottom { border-bottom: 1px solid #e0e0e0; }
</style>
