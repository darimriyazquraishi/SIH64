<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api/client'
import Modal from '@/components/Modal.vue'
import type { User, Bureau } from '@/types'
import {
  Users,
  ShieldCheck,
  Activity,
  PlusCircle,
  Database,
  Terminal,
} from 'lucide-vue-next'

const users = ref<User[]>([])
const bureaus = ref<Bureau[]>([])
const auditLogs = ref<any[]>([])
const systemStatus = ref<any>(null)
const loading = ref(false)

const isCreateUserOpen = ref(false)
const userForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'officer',
  bureau_id: '',
  designation: '',
})
const userFormError = ref<string | null>(null)

async function loadAdminData() {
  loading.value = true
  try {
    const [uRes, bRes, aRes, sRes] = await Promise.all([
      apiClient.get('/admin/users'),
      apiClient.get('/bureaus'),
      apiClient.get('/admin/audit-logs'),
      apiClient.get('/admin/system-status'),
    ])
    users.value = uRes.data.users || []
    bureaus.value = bRes.data.bureaus || []
    auditLogs.value = aRes.data.audit_logs || []
    systemStatus.value = sRes.data || null
  } catch (err) {
    console.error('Failed to load admin data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAdminData()
})

async function handleCreateUser() {
  userFormError.value = null
  try {
    await apiClient.post('/admin/users', {
      ...userForm.value,
      bureau_id: userForm.value.bureau_id ? Number(userForm.value.bureau_id) : null,
    })
    isCreateUserOpen.value = false
    userForm.value = {
      name: '',
      email: '',
      password: '',
      role: 'officer',
      bureau_id: '',
      designation: '',
    }
    await loadAdminData()
  } catch (err: any) {
    userFormError.value = err.response?.data?.error || 'Failed to create user'
  }
}

async function toggleUserActive(u: User) {
  try {
    await apiClient.patch(`/admin/users/${u.id}`, {
      is_active: !u.is_active,
    })
    u.is_active = !u.is_active
  } catch (err) {
    // Ignore
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-[#d4d4d4]">
          Administration
        </h1>
        <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
          Manage user accounts, roles, and review system audit records
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded bg-slate-900 dark:bg-[#007acc] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-[#1177bb] transition"
        @click="isCreateUserOpen = true"
      >
        <PlusCircle class="w-3.5 h-3.5" />
        New User
      </button>
    </div>

    <!-- Diagnostic Health Status -->
    <div v-if="systemStatus" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded bg-emerald-100 dark:bg-[#89d185]/15 text-emerald-700 dark:text-[#89d185] border border-emerald-200 dark:border-[#89d185]/30 flex items-center justify-center">
          <Database class="w-4 h-4" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 dark:text-[#989898]">Database</p>
          <p class="text-xs font-medium text-slate-900 dark:text-[#d4d4d4]">{{ systemStatus.database }}</p>
          <p class="text-xs text-slate-400 dark:text-[#989898] truncate max-w-[200px]" :title="systemStatus.postgresql_version">
            {{ systemStatus.postgresql_version }}
          </p>
        </div>
      </div>

      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded bg-blue-100 dark:bg-[#007acc]/15 text-blue-700 dark:text-[#4fc1ff] border border-blue-200 dark:border-[#007acc]/30 flex items-center justify-center">
          <Activity class="w-4 h-4" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 dark:text-[#989898]">System Status</p>
          <p class="text-xs font-medium text-slate-900 dark:text-[#d4d4d4]">{{ systemStatus.status }}</p>
          <p class="text-xs text-slate-500 dark:text-[#989898]">{{ systemStatus.portal_version }}</p>
        </div>
      </div>

      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded bg-purple-100 dark:bg-[#cca700]/15 text-purple-700 dark:text-[#cca700] border border-purple-200 dark:border-[#cca700]/30 flex items-center justify-center">
          <ShieldCheck class="w-4 h-4" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-400 dark:text-[#989898]">Access Control</p>
          <p class="text-xs font-medium text-slate-900 dark:text-[#d4d4d4]">Role-based access</p>
          <p class="text-xs text-slate-500 dark:text-[#989898]">Bureau-level isolation</p>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] overflow-hidden">
      <div class="border-b border-slate-200 dark:border-[#2d2d2d] px-4 py-3 flex items-center justify-between">
        <h2 class="text-xs font-semibold text-slate-900 dark:text-[#cccccc] flex items-center gap-2">
          <Users class="w-4 h-4 text-slate-500 dark:text-[#989898]" />
          User Accounts
        </h2>
        <span class="text-xs text-slate-500 dark:text-[#989898]">{{ users.length }} accounts</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-[#2d2d2d] text-xs font-semibold text-slate-600 dark:text-[#cccccc]">
            <tr>
              <th class="py-2.5 px-4">Name</th>
              <th class="py-2.5 px-4">Email</th>
              <th class="py-2.5 px-4">Role</th>
              <th class="py-2.5 px-4">Bureau</th>
              <th class="py-2.5 px-4">Status</th>
              <th class="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-[#2d2d2d]">
            <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50 dark:hover:bg-[#2a2d2e]">
              <td class="py-2.5 px-4 font-medium text-slate-900 dark:text-[#d4d4d4]">
                {{ u.name }}
                <div class="text-xs text-slate-400 dark:text-[#989898]">{{ u.designation || 'Staff' }}</div>
              </td>
              <td class="py-2.5 px-4 font-mono text-slate-600 dark:text-[#989898]">{{ u.email }}</td>
              <td class="py-2.5 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-xs font-medium',
                    u.role === 'admin' ? 'bg-[#cca700]/15 text-[#cca700] border border-[#cca700]/30' :
                    u.role === 'senior_authority' ? 'bg-[#007acc]/15 text-[#4fc1ff] border border-[#007acc]/30' :
                    'bg-slate-200 dark:bg-[#2d2d2d] text-slate-800 dark:text-[#cccccc] border border-slate-300 dark:border-[#3e3e42]'
                  ]"
                >
                  {{ u.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="py-2.5 px-4 text-slate-700 dark:text-[#cccccc]">
                {{ u.bureau_name || u.bureau_code || 'All Bureaus' }}
              </td>
              <td class="py-2.5 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-xs font-medium',
                    u.is_active ? 'bg-[#89d185]/15 text-[#89d185] border border-[#89d185]/30' : 'bg-[#f48771]/15 text-[#f48771] border border-[#f48771]/30'
                  ]"
                >
                  {{ u.is_active ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td class="py-2.5 px-4 text-right">
                <button
                  type="button"
                  class="text-xs font-medium text-blue-600 dark:text-[#4fc1ff] hover:underline"
                  @click="toggleUserActive(u)"
                >
                  {{ u.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Audit Logs Feed -->
    <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] overflow-hidden">
      <div class="border-b border-slate-200 dark:border-[#2d2d2d] px-4 py-3 flex items-center justify-between">
        <h2 class="text-xs font-semibold text-slate-900 dark:text-[#cccccc] flex items-center gap-2">
          <Terminal class="w-4 h-4 text-slate-500 dark:text-[#989898]" />
          Audit Logs
        </h2>
        <span class="text-xs text-slate-400 dark:text-[#989898] font-mono">System Trail</span>
      </div>

      <div class="overflow-x-auto max-h-80 overflow-y-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-slate-50 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-[#2d2d2d] text-xs font-semibold text-slate-600 dark:text-[#cccccc] sticky top-0">
            <tr>
              <th class="py-2 px-4">Timestamp</th>
              <th class="py-2 px-4">Operator</th>
              <th class="py-2 px-4">Action</th>
              <th class="py-2 px-4">Entity</th>
              <th class="py-2 px-4">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-[#2d2d2d]">
            <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-slate-50 dark:hover:bg-[#2a2d2e]">
              <td class="py-2 px-4 text-slate-400 dark:text-[#989898] whitespace-nowrap">{{ log.created_at?.slice(0, 19).replace('T', ' ') }}</td>
              <td class="py-2 px-4 font-sans font-medium text-slate-900 dark:text-[#d4d4d4] whitespace-nowrap">{{ log.user_name }}</td>
              <td class="py-2 px-4 font-medium text-blue-700 dark:text-[#4fc1ff] whitespace-nowrap">{{ log.action }}</td>
              <td class="py-2 px-4 text-slate-600 dark:text-[#cccccc] whitespace-nowrap">{{ log.entity_type }} #{{ log.entity_id || '-' }}</td>
              <td class="py-2 px-4 text-slate-500 dark:text-[#989898] truncate max-w-xs font-sans text-xs">{{ JSON.stringify(log.details) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create User Modal -->
    <Modal
      :is-open="isCreateUserOpen"
      title="Create User"
      @close="isCreateUserOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleCreateUser">
        <div v-if="userFormError" class="p-3 rounded bg-red-50 dark:bg-[#f48771]/15 text-xs text-red-700 dark:text-[#f48771] border border-red-200 dark:border-[#f48771]/30">
          {{ userFormError }}
        </div>

        <div>
          <label for="admin-user-name" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Full name *</label>
          <input
            id="admin-user-name"
            v-model="userForm.name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#3e3e42] rounded bg-white dark:bg-[#3c3c3c] text-slate-900 dark:text-[#cccccc] focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]"
          />
        </div>

        <div>
          <label for="admin-user-email" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Email address *</label>
          <input
            id="admin-user-email"
            v-model="userForm.email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#3e3e42] rounded bg-white dark:bg-[#3c3c3c] text-slate-900 dark:text-[#cccccc] focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]"
          />
        </div>

        <div>
          <label for="admin-user-password" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Password *</label>
          <input
            id="admin-user-password"
            v-model="userForm.password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#3e3e42] rounded bg-white dark:bg-[#3c3c3c] text-slate-900 dark:text-[#cccccc] focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="admin-user-role" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Role *</label>
            <select
              id="admin-user-role"
              v-model="userForm.role"
              required
              class="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#3e3e42] rounded bg-white dark:bg-[#3c3c3c] text-slate-900 dark:text-[#cccccc] focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]"
            >
              <option value="officer">Bureau Officer</option>
              <option value="admin">System Administrator</option>
              <option value="senior_authority">Senior Authority</option>
            </select>
          </div>

          <div>
            <label for="admin-user-bureau" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Bureau affiliation</label>
            <select
              id="admin-user-bureau"
              v-model="userForm.bureau_id"
              class="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#3e3e42] rounded bg-white dark:bg-[#3c3c3c] text-slate-900 dark:text-[#cccccc] focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]"
            >
              <option value="">-- All Bureaus --</option>
              <option v-for="b in bureaus" :key="b.id" :value="b.id">
                {{ b.code }} — {{ b.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label for="admin-user-designation" class="block text-xs font-medium text-slate-700 dark:text-[#cccccc]">Designation</label>
          <input
            id="admin-user-designation"
            v-model="userForm.designation"
            type="text"
            placeholder="e.g. Joint Director, Officer"
            class="mt-1 block w-full px-3 py-1.5 text-xs border border-slate-300 dark:border-[#3e3e42] rounded bg-white dark:bg-[#3c3c3c] text-slate-900 dark:text-[#cccccc] focus:ring-1 focus:ring-[#007acc] focus:border-[#007acc]"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-3 py-1.5 rounded border border-slate-300 dark:border-[#3e3e42] text-xs font-medium text-slate-700 dark:text-[#cccccc] hover:bg-slate-100 dark:hover:bg-[#37373d]"
          @click="isCreateUserOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-1.5 rounded bg-slate-900 dark:bg-[#007acc] text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-[#1177bb]"
          @click="handleCreateUser"
        >
          Create User
        </button>
      </template>
    </Modal>
  </div>
</template>
