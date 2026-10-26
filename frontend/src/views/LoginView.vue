<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Shield, Lock, User as UserIcon, ArrowRight, KeyRound } from 'lucide-vue-next'
import ThemeToggle from '@/components/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const identifier = ref('admin')
const password = ref('admin')

async function handleLogin() {
  const success = await authStore.login(identifier.value, password.value)
  if (success) {
    const redirectPath = (route.query.redirect as string) || '/'
    router.push(redirectPath)
  }
}

function fillCredentials(userId: string, pass: string) {
  identifier.value = userId
  password.value = pass
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
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0c2340] text-[#f97316] font-bold text-lg shadow-sm border border-[#14325a]">
          AI
        </div>
      </div>
      <h1 class="text-center text-lg font-semibold tracking-tight text-[#22261f] dark:text-white [text-wrap:balance]">
        AICTE Case Monitoring & Coordination Portal
      </h1>
      <p class="mt-1 text-center text-xs text-[#5f6656] dark:text-[#989898] [text-wrap:pretty]">
        Mandatory Administrative & Bureau Officer Authentication
      </p>

      <!-- Default Credentials Banner -->
      <div class="mt-4 mx-4 sm:mx-0 p-3 rounded-lg bg-orange-50 dark:bg-[#2a1708] border border-orange-200 dark:border-[#4a2608] text-center">
        <div class="flex items-center justify-center gap-1.5 text-xs font-semibold text-orange-800 dark:text-[#f97316]">
          <KeyRound class="w-3.5 h-3.5" />
          <span>Default Credentials</span>
        </div>
        <p class="text-xs text-orange-900 dark:text-[#fcd34d] mt-0.5 font-mono">
          User ID: <span class="font-bold underline">admin</span> &nbsp;·&nbsp; Password: <span class="font-bold underline">admin</span>
        </p>
      </div>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
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
            <label for="login-identifier" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
              User ID / Official Email
            </label>
            <div class="mt-1 relative rounded shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5f6656] dark:text-[#989898]">
                <UserIcon class="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="login-identifier"
                v-model="identifier"
                type="text"
                name="username"
                autocomplete="username"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#161716] border border-[#dfe7d6] dark:border-[#2f332b] text-[#22261f] dark:text-white dark:placeholder-[#aaaaaa] rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label for="login-password" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
              Password
            </label>
            <div class="mt-1 relative rounded shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5f6656] dark:text-[#989898]">
                <Lock class="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="login-password"
                v-model="password"
                type="password"
                name="password"
                autocomplete="current-password"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#161716] border border-[#dfe7d6] dark:border-[#2f332b] text-[#22261f] dark:text-white dark:placeholder-[#aaaaaa] rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="admin"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-[#c2410c] hover:bg-[#9a3412] focus:outline-none disabled:opacity-50 transition-colors shadow-sm"
            >
              <span v-if="authStore.loading">Authenticating…</span>
              <span v-else class="flex items-center gap-1.5">
                Sign In to Portal
                <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>
        </form>

        <!-- Quick Credentials Switcher -->
        <div class="mt-5 pt-5 border-t border-[#dfe7d6] dark:border-[#2f332b]">
          <p class="text-xs font-medium uppercase tracking-wider text-[#5f6656] dark:text-[#989898] mb-2">
            Quick Fill Accounts
          </p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3e3e42] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252526] transition-colors"
              @click="fillCredentials('admin', 'admin')"
            >
              <div class="font-semibold text-[#22261f] dark:text-white">Admin (admin/admin)</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989898]">Full access</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3e3e42] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252526] transition-colors"
              @click="fillCredentials('officer.pgrc@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-semibold text-[#22261f] dark:text-white">PGRC Officer</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989898]">Grievance cell</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3e3e42] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252526] transition-colors"
              @click="fillCredentials('officer.ab@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-semibold text-[#22261f] dark:text-white">Approval Officer</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989898]">Approval bureau</div>
            </button>

            <button
              type="button"
              class="text-left p-2.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] hover:border-[#cbd7bf] dark:hover:border-[#3e3e42] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252526] transition-colors"
              @click="fillCredentials('director.monitoring@aicte.gov.in', 'Director@12345')"
            >
              <div class="font-semibold text-[#22261f] dark:text-white">Senior Authority</div>
              <div class="text-xs text-[#5f6656] dark:text-[#989898]">Read-only</div>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4 text-center text-xs text-[#5f6656] dark:text-[#989898]">
        Authorized AICTE personnel only · Official Government Portal
      </div>
    </div>
  </div>
</template>
