<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bolder text-grey-9 q-my-none" style="letter-spacing: -1px;">Profile Settings</h1>
        <p class="text-grey-6 q-mt-sm text-subtitle1">Manage your personal information and account preferences.</p>
      </div>
      <div>
         <q-btn 
            unelevated 
            color="red-1" 
            text-color="red-7" 
            label="Log Out" 
            icon="logout"
            class="q-px-lg q-py-sm rounded-borders text-weight-bold"
            no-caps 
            @click="logout"
         />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Left Column: Profile Card -->
      <div class="col-12 col-md-4">
        <q-card flat class="bg-white q-pa-lg border-radius-lg text-center shadow-2">
           <div class="relative-position inline-block q-mb-lg q-mt-md">
              <q-avatar size="120px" class="bg-grey-2 text-grey-9 text-h2 text-weight-bolder shadow-1">
                 {{ userInitials }}
              </q-avatar>
              <q-btn
                round
                color="black"
                text-color="white"
                icon="camera_alt"
                size="sm"
                class="absolute-bottom-right shadow-2"
                style="bottom: 5px; right: 5px;"
              />
           </div>
           
           <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">{{ form.firstName || 'Admin' }} {{ form.lastName || 'User' }}</div>
           <div class="text-subtitle1 text-grey-5 q-mb-lg">{{ userEmail }}</div>
           
           <q-chip color="green-1" text-color="green-8" class="text-weight-bold q-px-md q-py-sm text-uppercase" size="sm">
               Administrator
           </q-chip>

           <q-separator class="q-my-lg" />
           
           <div class="row justify-center q-gutter-md q-mb-sm">
              <div class="col text-center">
                 <div class="text-h5 text-weight-bolder text-grey-9">24</div>
                 <div class="text-caption text-uppercase text-grey-5 text-weight-bold" style="letter-spacing: 0.5px">Classes</div>
              </div>
              <q-separator vertical />
              <div class="col text-center">
                 <div class="text-h5 text-weight-bolder text-grey-9">1.2k</div>
                 <div class="text-caption text-uppercase text-grey-5 text-weight-bold" style="letter-spacing: 0.5px">Students</div>
              </div>
           </div>
        </q-card>

        <q-card flat class="bg-white q-pa-md border-radius-lg shadow-2 q-mt-lg">
             <q-list>
                 <q-item clickable v-ripple class="rounded-borders">
                     <q-item-section avatar>
                         <q-avatar icon="security" color="grey-1" text-color="grey-8" font-size="20px" />
                     </q-item-section>
                     <q-item-section>
                         <q-item-label class="text-weight-bold text-grey-9">Security</q-item-label>
                         <q-item-label caption>Password & 2FA</q-item-label>
                     </q-item-section>
                     <q-item-section side>
                         <q-icon name="chevron_right" color="grey-5" />
                     </q-item-section>
                 </q-item>
                 <q-item clickable v-ripple class="rounded-borders q-mt-sm">
                     <q-item-section avatar>
                         <q-avatar icon="notifications" color="grey-1" text-color="grey-8" font-size="20px" />
                     </q-item-section>
                     <q-item-section>
                         <q-item-label class="text-weight-bold text-grey-9">Notifications</q-item-label>
                         <q-item-label caption>Email & Push</q-item-label>
                     </q-item-section>
                     <q-item-section side>
                         <q-icon name="chevron_right" color="grey-5" />
                     </q-item-section>
                 </q-item>
             </q-list>
        </q-card>
      </div>

      <!-- Right Column: Edit Details -->
      <div class="col-12 col-md-8">
        <q-card flat class="bg-white q-pa-xl border-radius-lg full-height shadow-2">
           <div class="text-h5 text-weight-bold text-grey-9 q-mb-md">Personal Information</div>
           <p class="text-grey-6 q-mb-xl">Update your photo and personal details here.</p>
           
           <q-form @submit.prevent="updateProfile" class="q-gutter-y-lg">
              <div class="row q-col-gutter-lg">
                 <div class="col-12 col-md-6">
                    <label class="text-weight-bold text-grey-8 text-caption q-mb-xs block">FIRST NAME</label>
                    <q-input outlined v-model="form.firstName" dense bg-color="white" placeholder="Jane" />
                 </div>
                 <div class="col-12 col-md-6">
                    <label class="text-weight-bold text-grey-8 text-caption q-mb-xs block">LAST NAME</label>
                    <q-input outlined v-model="form.lastName" dense bg-color="white" placeholder="Doe" />
                 </div>
                 <div class="col-12 col-md-6">
                    <label class="text-weight-bold text-grey-8 text-caption q-mb-xs block">EMAIL ADDRESS</label>
                    <q-input outlined v-model="userEmail" dense readonly bg-color="grey-1" color="grey-7" />
                 </div>
                 <div class="col-12 col-md-6">
                    <label class="text-weight-bold text-grey-8 text-caption q-mb-xs block">PHONE NUMBER</label>
                    <q-input outlined v-model="form.phone" dense bg-color="white" />
                 </div>
                 <div class="col-12">
                    <label class="text-weight-bold text-grey-8 text-caption q-mb-xs block">ADDRESS</label>
                    <q-input outlined v-model="form.address" type="textarea" rows="3" dense bg-color="white" />
                 </div>
              </div>

              <div class="row justify-end q-mt-xl">
                 <q-btn flat class="bg-grey-2 text-grey-9 text-weight-bold q-px-lg q-py-sm rounded-borders q-mr-md" label="Cancel" no-caps />
                 <q-btn unelevated color="black" text-color="white" class="text-weight-bold q-px-lg q-py-sm rounded-borders" type="submit" label="Save Changes" no-caps :loading="loading" />
              </div>
           </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const loading = ref(false)
const userEmail = computed(() => userStore.user?.email || '')
const userInitials = computed(() => userEmail.value.charAt(0).toUpperCase())

const form = ref({
  firstName: 'Sameera',
  lastName: 'Sandaruwan',
  phone: '+94 77 123 4567',
  address: 'No 123, Galle Road, Colombo 03',
})

const updateProfile = async () => {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
        loading.value = false
        $q.notify({
            type: 'positive',
            message: 'Profile updated successfully',
            position: 'top'
        })
    }, 1500)
}

const logout = async () => {
    try {
        await supabase.auth.signOut()
        router.push('/login')
        $q.notify({ type: 'positive', message: 'Logged out successfully' })
    } catch {
        $q.notify({ type: 'negative', message: 'Error logging out' })
    }
}
</script>

<style scoped lang="scss">
.border-radius-lg { border-radius: 20px; }
</style>
