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
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Portal System Administration
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Access control policies, user administration, and system audit log trail
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
        @click="isCreateUserOpen = true"
      >
        <PlusCircle class="w-4 h-4" />
        Create Portal User
      </button>
    </div>

    <!-- Diagnostic Health Status -->
    <div v-if="systemStatus" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
          <Database class="w-5 h-5" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Engine</p>
          <p class="text-xs font-bold text-slate-900">{{ systemStatus.database }}</p>
          <p class="text-[10px] text-slate-400 truncate max-w-[200px]" :title="systemStatus.postgresql_version">
            {{ systemStatus.postgresql_version }}
          </p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
          <Activity class="w-5 h-5" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal Status</p>
          <p class="text-xs font-bold text-slate-900">{{ systemStatus.status }}</p>
          <p class="text-[10px] text-slate-500">{{ systemStatus.portal_version }}</p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security Policies</p>
          <p class="text-xs font-bold text-slate-900">RBAC Enforced</p>
          <p class="text-[10px] text-slate-500">Record-level isolation</p>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden">
      <div class="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Users class="w-4 h-4 text-slate-500" />
          Authorized User Accounts
        </h3>
        <span class="text-xs text-slate-500">{{ users.length }} active portal accounts</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
            <tr>
              <th class="py-3 px-4">Name</th>
              <th class="py-3 px-4">Official Email</th>
              <th class="py-3 px-4">System Role</th>
              <th class="py-3 px-4">Bureau Affiliation</th>
              <th class="py-3 px-4">Account Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-semibold text-slate-900">
                {{ u.name }}
                <div class="text-[10px] text-slate-400 font-normal">{{ u.designation || 'Staff' }}</div>
              </td>
              <td class="py-3 px-4 font-mono text-slate-600">{{ u.email }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                    u.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                    u.role === 'senior_authority' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  ]"
                >
                  {{ u.role.replace('_', ' ') }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-700">
                {{ u.bureau_name || u.bureau_code || 'All Bureaus' }}
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ u.is_active ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  class="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
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
    <div class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden">
      <div class="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Terminal class="w-4 h-4 text-slate-500" />
          Consequential System Audit Log
        </h3>
        <span class="text-xs text-slate-400 font-mono">Immutable Log Trail</span>
      </div>

      <div class="overflow-x-auto max-h-80 overflow-y-auto">
        <table class="w-full text-left text-xs font-mono">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-500 sticky top-0">
            <tr>
              <th class="py-2.5 px-4">Timestamp</th>
              <th class="py-2.5 px-4">Operator</th>
              <th class="py-2.5 px-4">Action</th>
              <th class="py-2.5 px-4">Entity</th>
              <th class="py-2.5 px-4">Audit Payload</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-[11px]">
            <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-slate-50">
              <td class="py-2 px-4 text-slate-400 whitespace-nowrap">{{ log.created_at?.slice(0, 19).replace('T', ' ') }}</td>
              <td class="py-2 px-4 font-sans font-medium text-slate-900 whitespace-nowrap">{{ log.user_name }}</td>
              <td class="py-2 px-4 font-bold text-blue-700 whitespace-nowrap">{{ log.action }}</td>
              <td class="py-2 px-4 text-slate-600 whitespace-nowrap">{{ log.entity_type }} #{{ log.entity_id || '-' }}</td>
              <td class="py-2 px-4 text-slate-500 truncate max-w-xs font-sans text-[10px]">{{ JSON.stringify(log.details) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create User Modal -->
    <Modal
      :is-open="isCreateUserOpen"
      title="Create Authorized Portal User"
      @close="isCreateUserOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleCreateUser">
        <div v-if="userFormError" class="p-3 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200">
          {{ userFormError }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Official Full Name *</label>
          <input
            v-model="userForm.name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Email Address *</label>
          <input
            v-model="userForm.email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Password *</label>
          <input
            v-model="userForm.password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700">Role *</label>
            <select
              v-model="userForm.role"
              required
              class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-slate-900 focus:border-slate-900"
            >
              <option value="officer">Bureau Officer</option>
              <option value="admin">System Administrator</option>
              <option value="senior_authority">Senior Authority (Read-Only)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700">Bureau Affiliation</label>
            <select
              v-model="userForm.bureau_id"
              class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-slate-900 focus:border-slate-900"
            >
              <option value="">-- None / All Bureaus --</option>
              <option v-for="b in bureaus" :key="b.id" :value="b.id">
                {{ b.code }} — {{ b.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Official Designation</label>
          <input
            v-model="userForm.designation"
            type="text"
            placeholder="e.g. Joint Director, Grievance Officer"
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
          @click="isCreateUserOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
          @click="handleCreateUser"
        >
          Create User
        </button>
      </template>
    </Modal>
  </div>
</template>
