<template>
  <q-page>
    <!-- Welcome Section -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-grey-9 q-my-none">Overview</h1>
        <p class="text-grey-6 q-mt-xs">Here is what's happening with your institute today.</p>
      </div>
      <div>
         <q-btn unelevated color="primary" label="New Class" icon="add" no-caps class="q-mr-sm" />
         <q-btn outline color="grey-7" label="Reports" icon="file_download" no-caps />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3" v-for="(stat, index) in stats" :key="index">
        <q-card flat class="stat-card bg-white q-pa-md border-radius-lg">
          <div class="row items-start justify-between">
             <div class="column">
                <div class="text-grey-6 text-caption text-weight-bold uppercase">{{ stat.label }}</div>
                <div class="text-h4 text-weight-bolder text-grey-9 q-mt-xs">{{ stat.value }}</div>
             </div>
             <div class="icon-box q-pa-sm rounded-borders" :class="stat.bgClass">
                <q-icon :name="stat.icon" :color="stat.color" size="24px" />
             </div>
          </div>
          <div class="row items-center q-mt-md">
             <q-badge :color="stat.trend > 0 ? 'green-1' : 'red-1'" :text-color="stat.trend > 0 ? 'green-9' : 'red-9'" class="q-px-sm q-py-xs text-weight-bold rounded-borders">
                <q-icon :name="stat.trend > 0 ? 'arrow_upward' : 'arrow_downward'" size="12px" class="q-mr-xs" />
                {{ Math.abs(stat.trend) }}%
             </q-badge>
             <div class="text-caption text-grey-5 q-ml-sm">vs last month</div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="row q-col-gutter-lg">
       <!-- Recent Activity / Chart -->
       <div class="col-12 col-md-8">
          <q-card flat class="bg-white q-pa-lg border-radius-lg full-height">
             <div class="row items-center justify-between q-mb-lg">
                <div class="text-h6 text-weight-bold text-grey-9">Attendance Overview</div>
                <q-btn flat round icon="more_horiz" color="grey" />
             </div>
             
             <!-- Chart Component -->
             <div style="height: 350px;">
                <AttendanceChart />
             </div>
          </q-card>
       </div>
       
       <!-- Quick Actions / Upcoming Classes -->
       <div class="col-12 col-md-4">
          <q-card flat class="bg-white q-pa-lg border-radius-lg full-height">
             <div class="text-h6 text-weight-bold text-grey-9 q-mb-md">Upcoming Classes</div>
             <q-list separator>
                <q-item v-for="(cls, index) in upcomingClasses" :key="index" class="q-px-none q-py-md">
                   <q-item-section avatar>
                      <q-avatar :color="cls.bgColor" :text-color="cls.textColor" icon="class" size="40px" font-size="20px" />
                   </q-item-section>
                   <q-item-section>
                      <q-item-label class="text-weight-bold text-grey-9">{{ cls.subject }}</q-item-label>
                      <q-item-label caption>{{ cls.time }} • {{ cls.location }}</q-item-label>
                   </q-item-section>
                   <q-item-section side>
                       <q-btn flat round icon="chevron_right" size="sm" color="grey-5" />
                   </q-item-section>
                </q-item>
             </q-list>
             
             <q-btn outline color="primary" label="View Schedule" class="full-width q-mt-md" no-caps />
          </q-card>
       </div>
    </div>
  </q-page>
</template>

<script setup>
import AttendanceChart from 'components/dashboard/AttendanceChart.vue'

const stats = [
  { label: 'Total Students', value: '1,240', icon: 'people', trend: 12.5, bgClass: 'bg-blue-1', color: 'blue-8' },
  { label: 'Revenue', value: 'LKR 450k', icon: 'payments', trend: 8.2, bgClass: 'bg-green-1', color: 'green-8' },
  { label: 'Active Classes', value: '24', icon: 'school', trend: -2.4, bgClass: 'bg-orange-1', color: 'orange-8' },
  { label: 'Attendance', value: '98%', icon: 'check_circle', trend: 4.6, bgClass: 'bg-purple-1', color: 'purple-8' },
]

const upcomingClasses = [
    { subject: 'Maths - Grade 11', time: 'Today, 3:30 PM', location: 'Hall A', bgColor: 'blue-1', textColor: 'blue-8' },
    { subject: 'Science - Grade 10', time: 'Today, 5:00 PM', location: 'Lab 2', bgColor: 'green-1', textColor: 'green-8' },
    { subject: 'English - A/L', time: 'Tomorrow, 8:00 AM', location: 'Hall B', bgColor: 'purple-1', textColor: 'purple-8' },
    { subject: 'Physics - Revision', time: 'Tomorrow, 10:30 AM', location: 'Hall A', bgColor: 'orange-1', textColor: 'orange-8' },
]
</script>

<style scoped lang="scss">
.border-radius-lg { border-radius: 16px; }
.stat-card { transition: all 0.3s ease; border: 1px solid #f0f0f0; }
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08); border-color: transparent; }
.uppercase { text-transform: uppercase; letter-spacing: 0.5px; }
</style>
