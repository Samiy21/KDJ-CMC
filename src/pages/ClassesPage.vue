<template>
  <q-page>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Class Management</h1>
        <p class="text-grey-6 q-mt-xs">Manage classes, subjects, and schedules.</p>
      </div>
      <div class="flex items-center q-gutter-sm">
        <q-input 
            outlined 
            dense 
            v-model="filter" 
            placeholder="Search classes..." 
            bg-color="white"
            class="q-mr-sm"
        >
            <template v-slot:prepend>
                <q-icon name="search" />
            </template>
        </q-input>
        <q-btn unelevated color="primary" icon="add" label="Add Class" no-caps @click="openAddDialog" />
      </div>
    </div>

    <q-card flat class="bg-white q-pa-none border-radius-lg overflow-hidden">
       <q-table
        flat
        :rows="classes"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :pagination="initialPagination"
        :filter="filter"
       >
        <!-- Custom Teacher Slot -->
        <template v-slot:body-cell-teacher="props">
          <q-td :props="props">
             <div v-if="props.row.profiles">
                 <div class="text-weight-bold">{{ props.row.profiles.full_name }}</div>
                 <div class="text-caption text-grey-7">{{ props.row.profiles.email }}</div>
             </div>
             <div v-else class="text-grey-5">Unassigned</div>
          </q-td>
        </template>
        
        <!-- Custom Schedule Slot -->
        <template v-slot:body-cell-schedule="props">
            <q-td :props="props">
                <q-badge color="grey-3" text-color="grey-9" class="q-pa-xs">
                    {{ props.row.schedule_day }} @ {{ props.row.schedule_time }}
                </q-badge>
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
                  <q-item clickable v-close-popup class="text-red" @click="deleteClass(props.row)">
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

    <!-- Add/Edit Class Dialog -->
    <q-dialog v-model="classDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit Class' : 'Add New Class' }}</div>
          <div class="text-caption text-grey-6">{{ isEditing ? 'Update class details.' : 'Create a new class schedule.' }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
           <q-input outlined v-model="form.name" label="Class Name (e.g. Science 2026)" dense :rules="[val => !!val || 'Required']" />
           <div class="row q-col-gutter-sm">
               <div class="col-6">
                   <q-input outlined v-model="form.subject" label="Subject" dense :rules="[val => !!val || 'Required']" />
               </div>
               <div class="col-6">
                   <q-input outlined v-model="form.grade" label="Grade" dense :rules="[val => !!val || 'Required']" />
               </div>
           </div>
           
           <q-select
             outlined
             v-model="form.teacher_id"
             :options="teacherOptions"
             label="Assign Teacher"
             dense
             emit-value
             map-options
             option-label="full_name"
             option-value="id"
             :rules="[val => !!val || 'Required']"
           >
             <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                    <q-item-section>
                        <q-item-label>{{ scope.opt.full_name }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                    </q-item-section>
                </q-item>
             </template>
           </q-select>

           <q-input outlined v-model="form.fee" label="Monthly Fee (Rs)" type="number" dense prefix="Rs." />
           
           <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-select 
                        outlined 
                        v-model="form.schedule_day" 
                        :options="dayOptions" 
                        label="Day" 
                        dense 
                    />
                </div>
                <div class="col-6">
                    <q-input outlined v-model="form.schedule_time" label="Time" dense mask="time" :rules="['time']">
                        <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-time v-model="form.schedule_time">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </div>
           </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat :label="isEditing ? 'Save Changes' : 'Create Class'" @click="saveClass" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const $q = useQuasar()
const classes = ref([])
const teacherOptions = ref([])
const loading = ref(true)
const saving = ref(false)
const classDialog = ref(false)
const isEditing = ref(false)
const filter = ref('')

const form = ref({
    id: null,
    name: '',
    subject: '',
    grade: '',
    teacher_id: '',
    fee: 0,
    schedule_day: 'Monday',
    schedule_time: '08:00'
})

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const initialPagination = {
  sortBy: 'created_at',
  descending: true,
  rowsPerPage: 10
}

const columns = [
  { name: 'name', align: 'left', label: 'Class Name', field: 'name', sortable: true },
  { name: 'subject', align: 'left', label: 'Subject', field: 'subject', sortable: true },
  { name: 'grade', align: 'left', label: 'Grade', field: 'grade', sortable: true },
  { name: 'teacher', align: 'left', label: 'Teacher', field: row => row.profiles?.full_name, sortable: true },
  { name: 'schedule', align: 'left', label: 'Schedule', field: 'schedule_day' },
  { name: 'fee', align: 'right', label: 'Fee (Rs)', field: 'fee', format: val => `Rs. ${val}` },
  { name: 'actions', align: 'right', label: 'Actions' }
]

const fetchTeachers = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('role', ['teacher', 'admin'])
        
        if (error) throw error
        teacherOptions.value = data
    } catch (error) {
        console.error('Error fetching teachers:', error)
    }
}

const fetchClasses = async () => {
    loading.value = true
    try {
        const { data, error } = await supabase
            .from('classes')
            .select(`
                *,
                profiles (
                    full_name,
                    email
                )
            `)
            .order('created_at', { ascending: false })
            
        if (error) throw error
        classes.value = data
    } catch {
        $q.notify({ type: 'negative', message: 'Error fetching classes' })
    } finally {
        loading.value = false
    }
}

const openAddDialog = () => {
    isEditing.value = false
    form.value = {
        id: null,
        name: '',
        subject: '',
        grade: '',
        teacher_id: '',
        fee: 0,
        schedule_day: 'Monday',
        schedule_time: '08:00'
    }
    classDialog.value = true
}

const openEditDialog = (row) => {
    isEditing.value = true
    form.value = {
        id: row.id,
        name: row.name,
        subject: row.subject,
        grade: row.grade,
        teacher_id: row.teacher_id,
        fee: row.fee,
        schedule_day: row.schedule_day,
        schedule_time: row.schedule_time
    }
    classDialog.value = true
}

const saveClass = async () => {
    // Basic validation
    if (!form.value.name || !form.value.subject || !form.value.teacher_id) {
        $q.notify({ type: 'warning', message: 'Please fill required fields' })
        return
    }

    saving.value = true
    try {
        const payload = {
            name: form.value.name,
            subject: form.value.subject,
            grade: form.value.grade,
            teacher_id: form.value.teacher_id,
            fee: form.value.fee,
            schedule_day: form.value.schedule_day,
            schedule_time: form.value.schedule_time
        }

        let error
        if (isEditing.value) {
            const { error: updateError } = await supabase
                .from('classes')
                .update(payload)
                .eq('id', form.value.id)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from('classes')
                .insert([payload])
            error = insertError
        }

        if (error) throw error

        $q.notify({ type: 'positive', message: isEditing.value ? 'Class updated' : 'Class created' })
        classDialog.value = false
        fetchClasses()
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Error saving class' })
    } finally {
        saving.value = false
    }
}

const deleteClass = async (row) => {
    if(!confirm('Are you sure you want to delete this class?')) return

    try {
        const { error } = await supabase
            .from('classes')
            .delete()
            .eq('id', row.id)

        if (error) throw error
        
        classes.value = classes.value.filter(c => c.id !== row.id)
        $q.notify({ type: 'positive', message: 'Class deleted' })
    } catch {
        $q.notify({ type: 'negative', message: 'Error deleting class' })
    }
}

onMounted(() => {
    fetchTeachers()
    fetchClasses()
})
</script>

<style scoped lang="scss">
.border-radius-lg { border-radius: 16px; }
</style>
