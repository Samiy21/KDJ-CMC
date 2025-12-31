<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Attendance & Activity</h1>
        <p class="text-grey-6 q-mt-xs">Mark attendance and manage class enrollments.</p>
      </div>
    </div>

    <q-card flat class="bg-white border-radius-lg overflow-hidden">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="mark" label="Mark Attendance" />
        <q-tab name="enroll" label="Class Enrollments" />
        <q-tab name="history" label="History" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Mark Attendance Tab -->
        <q-tab-panel name="mark">
          <div class="row q-col-gutter-md q-mb-md">
             <div class="col-12 col-md-4">
                 <q-select outlined v-model="selectedClass" :options="classOptions" label="Select Class" option-label="name" option-value="id" emit-value map-options dense @update:model-value="fetchAttendance" />
             </div>
             <div class="col-12 col-md-4">
                 <q-input outlined v-model="selectedDate" type="date" label="Date" dense @update:model-value="fetchAttendance" />
             </div>
          </div>

          <div v-if="loading" class="row justify-center q-my-lg">
              <q-spinner color="primary" size="3em" />
          </div>
          
          <div v-else-if="!selectedClass" class="text-center text-grey-6 q-py-xl">
              <q-icon name="class" size="4em" color="grey-4" />
              <div class="q-mt-sm">Please select a class to mark attendance</div>
          </div>

          <div v-else>
               <q-markup-table flat bordered>
                <thead>
                    <tr>
                        <th class="text-left">Student Name</th>
                        <th class="text-center">Status</th>
                        <th class="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student in attendanceList" :key="student.student_id">
                        <td class="text-left">
                            <div class="text-weight-bold">{{ student.full_name }}</div>
                            <div class="text-caption text-grey">{{ student.admission_no }}</div>
                        </td>
                        <td class="text-center">
                            <q-btn-toggle
                                v-model="student.status"
                                spread
                                no-caps
                                toggle-color="primary"
                                color="white"
                                text-color="grey-8"
                                :options="[
                                    {label: 'Present', value: 'present'},
                                    {label: 'Late', value: 'late'},
                                    {label: 'Absent', value: 'absent'},
                                    {label: 'Excused', value: 'excused'}
                                ]"
                            />
                        </td>
                        <td class="text-right">
                            <q-icon v-if="student.saved" name="check_circle" color="green" size="sm" />
                        </td>
                    </tr>
                    <tr v-if="attendanceList.length === 0">
                        <td colspan="3" class="text-center text-grey-6 q-py-md">
                            No students enrolled in this class. Go to 'Class Enrollments' tab to add students.
                        </td>
                    </tr>
                </tbody>
               </q-markup-table>

               <div class="row justify-end q-mt-md" v-if="attendanceList.length > 0">
                   <q-btn unelevated color="primary" label="Save Attendance" @click="saveAttendance" :loading="saving" />
               </div>
          </div>
        </q-tab-panel>

        <!-- Enrollments Tab -->
        <q-tab-panel name="enroll">
             <div class="row q-col-gutter-md q-mb-md">
                 <div class="col-12 col-md-4">
                     <q-select outlined v-model="enrollClass" :options="classOptions" label="Select Class" option-label="name" option-value="id" emit-value map-options dense @update:model-value="fetchEnrollments" />
                 </div>
                 <div class="col-12 col-md-8 flex justify-end">
                     <q-btn color="primary" icon="person_add" label="Enroll Student" :disable="!enrollClass" @click="openEnrollDialog" />
                 </div>
             </div>

             <q-table
                flat
                bordered
                :rows="enrolledStudents"
                :columns="enrollColumns"
                row-key="id"
                :loading="enrollLoading"
             >
                <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                        <q-btn flat round color="red" icon="remove_circle_outline" size="sm" @click="removeEnrollment(props.row)">
                            <q-tooltip>Remove from Class</q-tooltip>
                        </q-btn>
                    </q-td>
                </template>
             </q-table>
        </q-tab-panel>
        
        <!-- History Tab (Placeholder) -->
        <q-tab-panel name="history">
             <div class="text-center text-grey-6 q-py-xl">
                 <q-icon name="history" size="4em" />
                 <div class="q-mt-md">Attendance logs and reports will appear here.</div>
             </div>
        </q-tab-panel>

      </q-tab-panels>
    </q-card>

    <!-- Enroll Student Dialog -->
    <q-dialog v-model="enrollDialog">
        <q-card style="min-width: 400px; height: 60vh;">
            <q-card-section>
                <div class="text-h6">Enroll Student</div>
                <div class="text-caption">Select students to add to {{ getClassName(enrollClass) }}</div>
            </q-card-section>
            
            <q-card-section class="column full-height q-pa-none">
                 <div class="q-px-md q-mb-sm">
                     <q-input outlined v-model="studentFilter" placeholder="Search student..." dense />
                 </div>
                 <q-scroll-area class="col q-px-md">
                     <q-list separator>
                         <q-item v-for="student in filteredUnenrolledStudents" :key="student.id" tag="label" v-ripple>
                             <q-item-section side top>
                                 <q-checkbox v-model="selectedStudentsToEnroll" :val="student.id" />
                             </q-item-section>
                             <q-item-section>
                                 <q-item-label>{{ student.full_name }}</q-item-label>
                                 <q-item-label caption>{{ student.admission_no }}</q-item-label>
                             </q-item-section>
                         </q-item>
                     </q-list>
                 </q-scroll-area>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Enroll Selected" color="primary" @click="saveEnrollments" />
            </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar, date } from 'quasar'
import { supabase } from 'boot/supabase'

const $q = useQuasar()
const tab = ref('mark')
const loading = ref(false)
const saving = ref(false)
const classOptions = ref([])

// Mark Attendance State
const selectedClass = ref(null)
const selectedDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD'))
const attendanceList = ref([])

// Enrollments State
const enrollClass = ref(null)
const enrolledStudents = ref([])
const enrollLoading = ref(false)
const enrollDialog = ref(false)
const allStudents = ref([])
const studentFilter = ref('')
const selectedStudentsToEnroll = ref([])

const enrollColumns = [
    { name: 'full_name', align: 'left', label: 'Student Name', field: row => row.students.full_name, sortable: true },
    { name: 'admission_no', align: 'left', label: 'Admission No', field: row => row.students.admission_no, sortable: true },
    { name: 'actions', align: 'right', label: 'Actions' }
]

const getClassName = (id) => {
    const c = classOptions.value.find(x => x.id === id)
    return c ? c.name : ''
}

// Fetch Classes on Mount
onMounted(async () => {
    try {
        const { data, error } = await supabase.from('classes').select('*').order('name')
        if (error) throw error
        classOptions.value = data
    } catch {
        $q.notify({ type: 'negative', message: 'Error loading classes' })
    }
    
    // Fetch All Students for Enrollment Dialog
    try {
        const { data } = await supabase.from('students').select('id, full_name, admission_no').eq('status', 'active')
        allStudents.value = data || []
    } catch (e) {
        console.error('Error loading students', e)
    }
})

// --- Mark Attendance Logic ---

const fetchAttendance = async () => {
    if (!selectedClass.value || !selectedDate.value) return
    
    loading.value = true
    try {
        // 1. Get Enrollments for this class
        const { data: enrolls, error: enrollError } = await supabase
            .from('enrollments')
            .select(`
                student_id,
                students ( id, full_name, admission_no )
            `)
            .eq('class_id', selectedClass.value)
            
        if (enrollError) throw enrollError
        
        // 2. Get Existing Attendance for this date/class
        const { data: existing, error: attError } = await supabase
            .from('attendance')
            .select('student_id, status')
            .eq('class_id', selectedClass.value)
            .eq('date', selectedDate.value)
            
        if (attError) throw attError
        
        // Merge Data
        attendanceList.value = enrolls.map(e => {
            const record = existing.find(r => r.student_id === e.student_id)
            return {
                student_id: e.student_id,
                full_name: e.students.full_name,
                admission_no: e.students.admission_no,
                status: record ? record.status : 'present', // Default to present
                saved: !!record
            }
        })
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Error loading data' })
    } finally {
        loading.value = false
    }
}

const saveAttendance = async () => {
    saving.value = true
    try {
        const updates = attendanceList.value.map(s => ({
            class_id: selectedClass.value,
            student_id: s.student_id,
            date: selectedDate.value,
            status: s.status
        }))
        
        const { error } = await supabase
            .from('attendance')
            .upsert(updates, { onConflict: 'class_id, student_id, date' })
            
        if (error) throw error
        
        $q.notify({ type: 'positive', message: 'Attendance saved successfully' })
        fetchAttendance() // Refresh to show saved icons
    } catch {
        $q.notify({ type: 'negative', message: 'Error saving attendance' })
    } finally {
        saving.value = false
    }
}

// --- Enrollments Logic ---

const fetchEnrollments = async () => {
    if (!enrollClass.value) return
    enrollLoading.value = true
    try {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
                id,
                student_id,
                students ( full_name, admission_no )
            `)
            .eq('class_id', enrollClass.value)
        if (error) throw error
        enrolledStudents.value = data
    } catch {
        $q.notify({ type: 'negative', message: 'Error loading enrollments' })
    } finally {
        enrollLoading.value = false
    }
}

const filteredUnenrolledStudents = computed(() => {
    // Filter out students already enrolled in the CURRENTLY SELECTED CLASS
    const enrolledIds = enrolledStudents.value.map(e => e.student_id)
    return allStudents.value
        .filter(s => !enrolledIds.includes(s.id))
        .filter(s => s.full_name.toLowerCase().includes(studentFilter.value.toLowerCase()) || s.admission_no.includes(studentFilter.value))
})

const openEnrollDialog = () => {
    selectedStudentsToEnroll.value = []
    studentFilter.value = ''
    enrollDialog.value = true
}

const saveEnrollments = async () => {
    if (selectedStudentsToEnroll.value.length === 0) return
    
    try {
        const records = selectedStudentsToEnroll.value.map(sid => ({
            class_id: enrollClass.value,
            student_id: sid
        }))
        
        const { error } = await supabase.from('enrollments').insert(records)
        if (error) throw error
        
        $q.notify({ type: 'positive', message: 'Students enrolled' })
        enrollDialog.value = false
        fetchEnrollments()
        // If we were on the same class in Mark tab, refresh it too
        if (selectedClass.value === enrollClass.value) fetchAttendance()
    } catch {
        $q.notify({ type: 'negative', message: 'Error enrolling students' })
    }
}

const removeEnrollment = async (row) => {
    if(!confirm('Remove this student from the class?')) return
    try {
        const { error } = await supabase.from('enrollments').delete().eq('id', row.id)
        if (error) throw error
        fetchEnrollments()
    } catch {
        $q.notify({ type: 'negative', message: 'Error removing enrollment' })
    }
}

</script>

<style scoped>
.border-radius-lg { border-radius: 12px; }
</style>
