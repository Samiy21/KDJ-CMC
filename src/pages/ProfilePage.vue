<template>
  <q-page>
    <div class="row q-col-gutter-lg">
      <!-- Profile Card -->
      <div class="col-12 col-md-4">
        <q-card flat class="bg-white q-pa-lg border-radius-lg text-center">
           <div class="relative-position inline-block q-mb-md">
              <q-avatar size="100px" class="bg-primary-50 text-primary text-h3 text-weight-bold">
                 {{ userInitials }}
              </q-avatar>
              <q-btn
                round
                color="primary"
                icon="edit"
                size="sm"
                class="absolute-bottom-right"
                style="bottom: 0; right: 0;"
              />
           </div>
           
           <div class="text-h5 text-weight-bold text-grey-9">{{ userEmail }}</div>
           <div class="text-subtitle2 text-grey-5 q-mb-lg">Administrator</div>
           
           <div class="row justify-center q-gutter-md q-mb-lg">
              <div class="text-center">
                 <div class="text-weight-bold text-h6">24</div>
                 <div class="text-caption text-grey-5">Classes</div>
              </div>
              <q-separator vertical />
              <div class="text-center">
                 <div class="text-weight-bold text-h6">1.2k</div>
                 <div class="text-caption text-grey-5">Students</div>
              </div>
           </div>

           <q-list separator class="text-left">
              <q-item clickable v-ripple>
                 <q-item-section avatar><q-icon name="email" color="grey-6" /></q-item-section>
                 <q-item-section>
                    <q-item-label class="text-grey-6 text-caption">Email</q-item-label>
                    <q-item-label class="text-grey-9">{{ userEmail }}</q-item-label>
                 </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                 <q-item-section avatar><q-icon name="phone" color="grey-6" /></q-item-section>
                 <q-item-section>
                    <q-item-label class="text-grey-6 text-caption">Phone</q-item-label>
                    <q-item-label class="text-grey-9">+94 77 123 4567</q-item-label>
                 </q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                 <q-item-section avatar><q-icon name="location_on" color="grey-6" /></q-item-section>
                 <q-item-section>
                    <q-item-label class="text-grey-6 text-caption">Location</q-item-label>
                    <q-item-label class="text-grey-9">Colombo, Sri Lanka</q-item-label>
                 </q-item-section>
              </q-item>
           </q-list>
        </q-card>
      </div>

      <!-- Settings / Edit Profile -->
      <div class="col-12 col-md-8">
        <q-card flat class="bg-white q-pa-lg border-radius-lg full-height">
           <div class="text-h6 text-weight-bold text-grey-9 q-mb-lg">Edit Profile Details</div>
           
           <q-form @submit.prevent="updateProfile" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                 <div class="col-12 col-md-6">
                    <q-input outlined v-model="form.firstName" label="First Name" dense />
                 </div>
                 <div class="col-12 col-md-6">
                    <q-input outlined v-model="form.lastName" label="Last Name" dense />
                 </div>
                 <div class="col-12 col-md-6">
                    <q-input outlined v-model="form.phone" label="Phone Number" dense />
                 </div>
                 <div class="col-12 col-md-6">
                    <q-input outlined v-model="userEmail" label="Email" dense readonly hint="Contact support to change email" />
                 </div>
                 <div class="col-12">
                    <q-input outlined v-model="form.address" label="Institute Address" type="textarea" rows="3" dense />
                 </div>
              </div>

              <div class="q-mt-lg flex justify-end">
                 <q-btn outline color="grey-7" label="Cancel" class="q-mr-sm" no-caps />
                 <q-btn unelevated color="primary" type="submit" label="Save Changes" no-caps :loading="loading" />
              </div>
           </q-form>

           <q-separator class="q-my-xl" />

           <div class="text-h6 text-weight-bold text-red-5 q-mb-md">Danger Zone</div>
           <div class="row items-center justify-between p-4 border-red rounded-borders bg-red-1 q-pa-md">
              <div>
                 <div class="text-weight-bold text-red-9">Delete Account</div>
                 <div class="text-caption text-red-7">Permanently remove your account and all of its contents.</div>
              </div>
              <q-btn outline color="red" label="Delete Account" no-caps size="sm" />
           </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'

const userStore = useUserStore()
const $q = useQuasar()

const loading = ref(false)
const userEmail = computed(() => userStore.user?.email || '')
const userInitials = computed(() => userEmail.value.charAt(0).toUpperCase())

const form = ref({
  firstName: '',
  lastName: '',
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
</script>

<style scoped lang="scss">
.border-radius-lg { border-radius: 16px; }
.bg-primary-50 { background-color: #e3f2fd; }
.border-red { border: 1px solid #ef5350; }
</style>
