<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <DashboardHeader @toggle-sidebar="toggleLeftDrawer" />
    
    <DashboardSidebar v-model="leftDrawerOpen" />

    <q-page-container>
      <div class="q-pa-md q-pa-lg-xl">
          <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardHeader from 'components/dashboard/DashboardHeader.vue'
import DashboardSidebar from 'components/dashboard/DashboardSidebar.vue'

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
