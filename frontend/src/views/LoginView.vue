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
  <div class="min-h-screen bg-[#e8efe0] dark:bg-[#161716] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors">
    <!-- Top theme toggle button -->
    <div class="absolute top-4 right-4 z-20">
      <ThemeToggle />
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center items-center gap-3 mb-4">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1b1e18] dark:bg-[#101110] text-[#b86f00] dark:text-[#b8ee82] font-bold text-lg shadow-sm border border-[#2d3326] dark:border-[#242820]">
          AI
        </div>
      </div>
      <h1 class="text-center text-lg font-semibold tracking-tight text-[#22261f] dark:text-white">
        AICTE Case Monitoring & Coordination Portal
      </h1>
      <p class="mt-1 text-center text-xs text-[#5f6656] dark:text-[#989e92]">
        Official case tracking and cross-bureau coordination
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
      <div class="bg-white dark:bg-[#1e201d] py-7 px-6 shadow-md rounded-xl border border-[#dfe7d6] dark:border-[#2f332b] sm:px-8 transition-colors">
        <!-- Error Alert -->
        <div
          v-if="authStore.error"
          class="mb-4 rounded-lg bg-red-50 dark:bg-[#341416] p-3 text-xs text-red-700 dark:text-[#f87171] border border-red-200 dark:border-[#521c20] flex items-start gap-2"
          role="alert"
        >
          <span class="font-semibold">Error:</span>
          <span>{{ authStore.error }}</span>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label for="login-email" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">Official Email</label>
            <div class="mt-1 relative rounded shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5f6656] dark:text-[#989e92]">
                <Mail class="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="login-email"
                v-model="email"
                type="email"
                name="email"
                autocomplete="username"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#161716] border border-[#dfe7d6] dark:border-[#2f332b] text-[#22261f] dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7eaa3b] dark:focus:ring-[#b8ee82] focus:border-[#7eaa3b] dark:focus:border-[#b8ee82] transition-colors"
                placeholder="officer@aicte.gov.in"
              />
            </div>
          </div>

          <div>
            <label for="login-password" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">Password</label>
            <div class="mt-1 relative rounded shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5f6656] dark:text-[#989e92]">
                <Lock class="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="login-password"
                v-model="password"
                type="password"
                name="password"
                autocomplete="current-password"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#161716] border border-[#dfe7d6] dark:border-[#2f332b] text-[#22261f] dark:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#7eaa3b] dark:focus:ring-[#b8ee82] focus:border-[#7eaa3b] dark:focus:border-[#b8ee82] transition-colors"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex justify-center items-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold text-white bg-[#c2410c] hover:bg-[#9a3412] dark:bg-[#b8ee82] dark:text-[#10140d] dark:hover:bg-[#cbf995] focus:outline-none disabled:opacity-50 transition-colors shadow-sm"
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
        <div class="mt-5 pt-5 border-t border-[#dfe7d6] dark:border-[#2f332b]">
          <p class="text-xs font-medium uppercase tracking-wider text-[#5f6656] dark:text-[#989e92] mb-2">
            Demo Accounts
          </p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3d4237] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252922] transition-colors"
              @click="selectDemoAccount('admin@aicte.gov.in', 'Admin@12345')"
            >
              <div class="font-medium text-[#22261f] dark:text-white">System Admin</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989e92]">Full access</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3d4237] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252922] transition-colors"
              @click="selectDemoAccount('officer.pgrc@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-medium text-[#22261f] dark:text-white">PGRC Officer</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989e92]">Grievance cell</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3d4237] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252922] transition-colors"
              @click="selectDemoAccount('officer.ab@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-medium text-[#22261f] dark:text-white">Approval Officer</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989e92]">Approval bureau</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3d4237] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252922] transition-colors"
              @click="selectDemoAccount('director.monitoring@aicte.gov.in', 'Director@12345')"
            >
              <div class="font-medium text-[#22261f] dark:text-white">Senior Authority</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989e92]">Analytics only</div>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4 text-center text-xs text-[#5f6656] dark:text-[#989e92]">
        Authorized AICTE personnel only.
      </div>
    </div>
  </div>
</template>
