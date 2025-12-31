<template>
  <q-header class="bg-white text-grey-9 shadow-1" height-hint="64">
    <q-toolbar class="q-px-lg" style="height: 64px;">
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-sidebar')"
        class="q-mr-sm mobile-only"
      />

      <q-toolbar-title class="text-subtitle1 text-weight-bold flex items-center">
         <span class="text-grey-6 text-weight-regular q-mr-sm">Pages /</span> Dashboard
      </q-toolbar-title>

      <q-space />

      <!-- Actions -->
      <div class="row q-gutter-sm items-center">
        <!-- Search (Hidden on mobile for clarity) -->
        <q-input
            dense
            outlined
            placeholder="Search..."
            class="gt-sm q-mr-md bg-grey-1"
            style="min-width: 250px; border-radius: 8px;"
            color="primary"
        >
            <template v-slot:prepend>
                <q-icon name="search" color="grey-5" />
            </template>
        </q-input>

        <q-btn flat round dense icon="notifications_none" color="grey-7">
           <q-badge color="red" floating rounded dot />
        </q-btn>
        
        <q-separator vertical inset class="q-mx-md" />

        <!-- User Menu -->
        <q-btn flat no-caps class="q-pl-xs q-pr-sm rounded-borders text-grey-8">
            <q-avatar size="32px" class="q-mr-sm bg-primary-50 text-primary">
                {{ userInitials }}
            </q-avatar>
            <div class="text-subtitle2 gt-xs">{{ userName }}</div>
            <q-icon name="keyboard_arrow_down" size="xs" class="q-ml-xs" />
            
            <q-menu auto-close class="q-mt-sm">
                <q-list style="min-width: 150px">
                    <q-item clickable to="/dashboard/profile">
                        <q-item-section avatar><q-icon name="person" size="xs" /></q-item-section>
                        <q-item-section>Profile</q-item-section>
                    </q-item>
                     <q-item clickable>
                        <q-item-section avatar><q-icon name="settings" size="xs" /></q-item-section>
                        <q-item-section>Settings</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable class="text-red-5" @click="logout">
                        <q-item-section avatar><q-icon name="logout" size="xs" /></q-item-section>
                        <q-item-section>Log Out</q-item-section>
                    </q-item>
                </q-list>
            </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from 'stores/user-store'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

defineEmits(['toggle-sidebar'])

const userName = computed(() => userStore.user?.email?.split('@')[0] || 'User')
const userInitials = computed(() => userName.value.charAt(0).toUpperCase())

const logout = async () => {
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
.bg-primary-50 {
    background-color: #e3f2fd;
}
</style>
