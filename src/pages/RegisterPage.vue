<template>
  <q-page class="bg-black text-white flex flex-center relative-position overflow-hidden">
    <!-- Background Animation -->
    <div class="absolute-full" style="z-index: 1; opacity: 0.4;">
      <ThreeBackground />
    </div>

    <!-- Ambient Glow -->
    <div class="absolute-center bg-primary" style="width: 600px; height: 600px; filter: blur(300px); opacity: 0.1; border-radius: 50%;"></div>

    <!-- Register Card -->
    <div class="register-card q-pa-xl relative-position" style="z-index: 2; width: 100%; max-width: 450px;">
      <div class="text-center q-mb-xl">
        <div class="row items-center justify-center q-mb-md">
          <q-icon name="school" size="40px" class="q-mr-sm" />
          <div class="text-h4 text-weight-bold">ClassMaster</div>
        </div>
        <div class="text-grey-5 text-subtitle1">Create your institution account.</div>
      </div>

      <q-form @submit.prevent="handleRegister" class="q-gutter-y-lg">
        <q-input
          dark
          standout="bg-grey-9 text-white"
          v-model="email"
          label="Email Address"
          type="email"
          dense
          class="rounded-borders"
          bg-color="grey-10"
          input-class="text-white"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="grey-6" />
          </template>
        </q-input>

        <q-input
          dark
          standout="bg-grey-9 text-white"
          v-model="password"
          label="Password"
          type="password"
          dense
          class="rounded-borders"
          bg-color="grey-10"
          input-class="text-white"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="grey-6" />
          </template>
        </q-input>

         <q-input
          dark
          standout="bg-grey-9 text-white"
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          dense
          class="rounded-borders"
          bg-color="grey-10"
          input-class="text-white"
          :rules="[val => val === password || 'Passwords do not match']"
        >
          <template v-slot:prepend>
            <q-icon name="lock_clock" color="grey-6" />
          </template>
        </q-input>

        <q-btn
          unelevated
          color="white"
          text-color="black"
          label="Create Account"
          class="full-width text-weight-bold q-py-md text-body1"
          style="border-radius: 12px; letter-spacing: 1px;"
          type="submit"
          :loading="loading"
          no-caps
        />

        <div class="text-center text-grey-5 q-mt-lg">
          Already have an account? 
          <router-link to="/login" class="text-white text-weight-bold hover-underline" style="text-decoration: none;">
            Log In
          </router-link>
        </div>
      </q-form>
      
      <div class="absolute-top-left q-pa-lg">
          <q-btn flat icon="home" label="Home" color="white" to="/" no-caps />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import ThreeBackground from 'components/ThreeBackground.vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const router = useRouter()
const $q = useQuasar()

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
      $q.notify({ type: 'warning', message: 'Passwords do not match' })
      return
  }

  loading.value = true
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    $q.notify({
      type: 'positive',
      message: 'Registration successful! Please verify your email.',
      position: 'top',
    })
    
    // Redirect to login
    router.push('/login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Error registering',
      position: 'top',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.register-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.hover-white:hover { color: white !important; transition: color 0.3s; }
.hover-underline:hover { text-decoration: underline !important; }
</style>
