<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-vue-next'
import ThemeToggle from '@/components/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('admin@aicte.gov.in')
const password = ref('Admin@12345')

async function handleLogin() {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/')
  }
}

function selectDemoAccount(accEmail: string, accPass: string) {
  email.value = accEmail
  password.value = accPass
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 dark:bg-[#1e1e1e] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors">
    <!-- Top theme toggle button -->
    <div class="absolute top-4 right-4 z-20">
      <ThemeToggle />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center items-center gap-3 mb-4">
        <div class="flex h-10 w-10 items-center justify-center rounded bg-slate-900 dark:bg-[#007acc] text-white font-bold text-lg shadow-sm">
          AI
        </div>
      </div>
      <h1 class="text-center text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
        AICTE Case Monitoring & Coordination Portal
      </h1>
      <p class="mt-1 text-center text-xs text-slate-500 dark:text-[#858585]">
        Official case tracking and cross-bureau coordination
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
      <div class="bg-white dark:bg-[#252526] py-7 px-6 shadow rounded-md border border-slate-200 dark:border-[#2d2d2d] sm:px-8 transition-colors">
        <!-- Error Alert -->
        <div
          v-if="authStore.error"
          class="mb-4 rounded bg-red-50 dark:bg-[#3b1214] p-3 text-xs text-red-700 dark:text-[#f48771] border border-red-200 dark:border-[#5c1c20] flex items-start gap-2"
          role="alert"
        >
          <span class="font-semibold">Error:</span>
          <span>{{ authStore.error }}</span>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label for="login-email" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Official Email</label>
            <div class="mt-1 relative rounded shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-[#858585]">
                <Mail class="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="login-email"
                v-model="email"
                type="email"
                name="email"
                autocomplete="username"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#3c3c3c] border border-slate-300 dark:border-[#3e3e42] text-slate-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-colors"
                placeholder="officer@aicte.gov.in"
              />
            </div>
          </div>

          <div>
            <label for="login-password" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Password</label>
            <div class="mt-1 relative rounded shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-[#858585]">
                <Lock class="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="login-password"
                v-model="password"
                type="password"
                name="password"
                autocomplete="current-password"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#3c3c3c] border border-slate-300 dark:border-[#3e3e42] text-slate-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc] transition-colors"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex justify-center items-center gap-2 py-2 px-4 rounded text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-[#007acc] dark:hover:bg-[#1177bb] focus:outline-none focus:ring-1 focus:ring-[#007acc] disabled:opacity-50 transition-colors"
            >
              <span v-if="authStore.loading">Authenticating…</span>
              <span v-else class="flex items-center gap-1.5">
                Sign In
                <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>
        </form>

        <!-- Quick Demo Switcher -->
        <div class="mt-5 pt-5 border-t border-slate-100 dark:border-[#2d2d2d]">
          <p class="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-[#858585] mb-2">
            Demo Accounts
          </p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              class="text-left p-2.5 rounded border border-slate-200 dark:border-[#2d2d2d] hover:border-slate-300 dark:hover:border-[#3e3e42] bg-slate-50 dark:bg-[#1e1e1e] hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition-colors"
              @click="selectDemoAccount('admin@aicte.gov.in', 'Admin@12345')"
            >
              <div class="font-medium text-slate-900 dark:text-white">System Admin</div>
              <div class="text-xs text-slate-500 dark:text-[#858585]">Full access</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded border border-slate-200 dark:border-[#2d2d2d] hover:border-slate-300 dark:hover:border-[#3e3e42] bg-slate-50 dark:bg-[#1e1e1e] hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition-colors"
              @click="selectDemoAccount('officer.pgrc@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-medium text-slate-900 dark:text-white">PGRC Officer</div>
              <div class="text-xs text-slate-500 dark:text-[#858585]">Grievance cell</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded border border-slate-200 dark:border-[#2d2d2d] hover:border-slate-300 dark:hover:border-[#3e3e42] bg-slate-50 dark:bg-[#1e1e1e] hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition-colors"
              @click="selectDemoAccount('officer.ab@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-medium text-slate-900 dark:text-white">Approval Officer</div>
              <div class="text-xs text-slate-500 dark:text-[#858585]">Approval bureau</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded border border-slate-200 dark:border-[#2d2d2d] hover:border-slate-300 dark:hover:border-[#3e3e42] bg-slate-50 dark:bg-[#1e1e1e] hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition-colors"
              @click="selectDemoAccount('director.monitoring@aicte.gov.in', 'Director@12345')"
            >
              <div class="font-medium text-slate-900 dark:text-white">Senior Authority</div>
              <div class="text-xs text-slate-500 dark:text-[#858585]">Analytics only</div>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4 text-center text-xs text-slate-500 dark:text-[#858585]">
        Authorized AICTE personnel only.
      </div>
    </div>
  </div>
</template>
