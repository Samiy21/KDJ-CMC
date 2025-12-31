<template>
  <q-drawer
    v-model="isOpen"
    show-if-above
    side="left"
    bordered
    class="bg-white"
    :width="260"
  >
    <div class="column full-height">
      <!-- Logo Area -->
      <div class="q-pa-md flex items-center q-mb-md">
        <q-icon name="school" color="primary" size="32px" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold text-grey-9">ClassMaster</div>
      </div>

      <!-- Navigation -->
      <q-scroll-area class="col">
        <q-list padding class="text-grey-8">
          <q-item
            v-for="link in links"
            :key="link.text"
            clickable
            v-ripple
            active-class="bg-primary-50 text-primary"
            class="rounded-borders q-mx-sm q-mb-xs"
            :to="link.to"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section class="text-weight-medium">
              {{ link.text }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <!-- Bottom Actions -->
      <div class="q-pa-md border-top">
        <q-item clickable v-ripple class="rounded-borders text-grey-8" to="/">
           <q-item-section avatar>
              <q-icon name="home" />
           </q-item-section>
           <q-item-section class="text-weight-medium">Back to Home</q-item-section>
           <q-item-section side>
             <q-icon name="open_in_new" size="xs" />
           </q-item-section>
        </q-item>
        <div class="q-mt-sm text-caption text-grey-5 q-px-sm">
          v1.0.0
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const links = [
  { text: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
  { text: 'Users', icon: 'group', to: '/dashboard/users' },
  { text: 'Classes', icon: 'class', to: '/dashboard/classes' },
  { text: 'Students', icon: 'school', to: '/dashboard/students' },
  { text: 'Attendance', icon: 'event_available', to: '/dashboard/attendance' },
  { text: 'Profile', icon: 'person', to: '/dashboard/profile' },
]
</script>

<style scoped lang="scss">
.bg-primary-50 {
  background-color: #f0f7ff; // Very light blue/primary tint
  color: #1976D2; // Primary color
}
.border-top {
  border-top: 1px solid #eee;
}
</style>
