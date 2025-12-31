<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useUserStore } from 'stores/user-store'

const userStore = useUserStore()

onMounted(async () => {
  // Initial fetch
  await userStore.fetchUser()

  // Listen for changes
  supabase.auth.onAuthStateChange((event, session) => {
    userStore.user = session?.user || null
  })
})
</script>
