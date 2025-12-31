import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: true
  }),

  actions: {
    async fetchUser() {
      this.loading = true
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
          
        this.user = { ...user, ...profile }
      } else {
        this.user = null
      }
      
      this.loading = false
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
    }
  }
})
