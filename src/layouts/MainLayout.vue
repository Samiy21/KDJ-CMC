<template>
  <q-layout view="lHh Lpr lFf" class="bg-black text-white">
    <q-header class="bg-black text-white q-py-sm" height-hint="98">
      <q-toolbar class="container">
        <!-- Logo -->
        <q-toolbar-title shrink class="text-weight-bold row items-center no-wrap">
          <q-icon name="school" size="28px" class="q-mr-sm" />
          ClassMaster
        </q-toolbar-title>

        <!-- Centered Navigation -->
        <q-space />
        <div class="gt-sm row q-gutter-lg">
          <q-btn flat no-caps label="Features" class="text-white" />
          <q-btn flat no-caps label="Solutions" class="text-white" />
          <q-btn flat no-caps label="Pricing" class="text-white" />
          <q-btn flat no-caps label="About" class="text-white" />
        </div>
        <q-space />

        <!-- Right Side Actions -->
        <div class="row q-gutter-sm items-center" v-if="!userStore.user">
          <q-btn flat no-caps label="Log in" class="text-white" to="/login" />
          <q-btn unelevated color="white" text-color="black" label="Get Started" no-caps class="text-weight-bold" to="/register" />
        </div>
        <div class="row q-gutter-sm items-center" v-else>
           <q-btn flat no-caps label="Dashboard" class="text-white" to="/dashboard" />
           <q-btn flat no-caps icon="logout" class="text-white" @click="handleLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useUserStore } from 'stores/user-store'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const handleLogout = async () => {
    try {
        await userStore.logout()
        router.push('/')
        $q.notify({ type: 'positive', message: 'Logged out successfully' })
    } catch {
        $q.notify({ type: 'negative', message: 'Error logging out' })
    }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
