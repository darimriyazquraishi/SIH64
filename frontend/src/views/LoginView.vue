<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-vue-next'

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
  <div class="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Restrained background geometry -->
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center items-center gap-3 mb-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-xl shadow-lg">
          AI
        </div>
      </div>
      <h2 class="text-center text-xl font-bold tracking-tight text-white">
        AICTE Integrated Complaint Monitoring Portal
      </h2>
      <p class="mt-1 text-center text-xs text-slate-400">
        Cross-Bureau Case Tracking & Overlap Coordination Platform • SIH 2026
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
      <div class="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-slate-100 sm:px-10">
        <!-- Error Alert -->
        <div
          v-if="authStore.error"
          class="mb-5 rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200 flex items-start gap-2"
        >
          <span class="font-bold">Error:</span>
          <span>{{ authStore.error }}</span>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-semibold text-slate-700">Official Email</label>
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail class="h-4 w-4" />
              </div>
              <input
                v-model="email"
                type="email"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
                placeholder="officer@aicte.gov.in"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700">Password</label>
            <div class="mt-1 relative rounded-lg shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock class="h-4 w-4" />
              </div>
              <input
                v-model="password"
                type="password"
                required
                class="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition"
            >
              <span v-if="authStore.loading">Authenticating credentials...</span>
              <span v-else class="flex items-center gap-2">
                Sign In to Administrative Portal
                <ArrowRight class="w-4 h-4" />
              </span>
            </button>
          </div>
        </form>

        <!-- Quick Demo Switcher -->
        <div class="mt-6 pt-6 border-t border-slate-100">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Quick Demo Accounts (1-Click Fill)
          </p>
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              class="text-left p-2 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition"
              @click="selectDemoAccount('admin@aicte.gov.in', 'Admin@12345')"
            >
              <div class="font-semibold text-slate-900">System Admin</div>
              <div class="text-[10px] text-slate-500">All Bureaus & Config</div>
            </button>

            <button
              type="button"
              class="text-left p-2 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition"
              @click="selectDemoAccount('officer.pgrc@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-semibold text-slate-900">PGRC Officer</div>
              <div class="text-[10px] text-slate-500">Public Grievance Cell</div>
            </button>

            <button
              type="button"
              class="text-left p-2 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition"
              @click="selectDemoAccount('officer.ab@aicte.gov.in', 'Officer@12345')"
            >
              <div class="font-semibold text-slate-900">Approval Officer</div>
              <div class="text-[10px] text-slate-500">Approval Bureau (AB)</div>
            </button>

            <button
              type="button"
              class="text-left p-2 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition"
              @click="selectDemoAccount('director.monitoring@aicte.gov.in', 'Director@12345')"
            >
              <div class="font-semibold text-slate-900">Senior Authority</div>
              <div class="text-[10px] text-slate-500">Read-Only Analytics</div>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-slate-400">
        Official administrative system restricted to authorized AICTE personnel.
      </div>
    </div>
  </div>
</template>
