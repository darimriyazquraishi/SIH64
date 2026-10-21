<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useComplaintsStore } from '@/stores/complaints'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/client'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import Modal from '@/components/Modal.vue'
import type { Complaint, Bureau, User } from '@/types'
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  UserCheck,
  Send,
  GitCompare,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useComplaintsStore()
const authStore = useAuthStore()

const complaintId = computed(() => Number(route.params.id))
const activeTab = ref<'overview' | 'timeline' | 'overlaps'>('overview')

const bureaus = ref<Bureau[]>([])
const bureauOfficers = ref<User[]>([])

// Modals state
const isStatusModalOpen = ref(false)
const isAssignModalOpen = ref(false)
const isTransferModalOpen = ref(false)

const newStatus = ref('Under Review')
const statusRemarks = ref('')

const selectedOfficerId = ref<number | ''>('')
const assignRemarks = ref('')

const selectedTargetBureauId = ref<number | ''>('')
const transferRemarks = ref('')

const actionError = ref<string | null>(null)
const isActionLoading = ref(false)

const canEdit = computed(() => {
  if (authStore.isAdmin) return true
  if (authStore.isSeniorAuthority) return false
  if (authStore.isOfficer && store.currentComplaint) {
    return store.currentComplaint.current_bureau_id === authStore.user?.bureau_id
  }
  return false
})

async function loadComplaint() {
  await store.fetchComplaintDetail(complaintId.value)
  if (store.currentComplaint) {
    newStatus.value = store.currentComplaint.status
    selectedOfficerId.value = store.currentComplaint.assigned_user_id || ''
  }
}

async function loadBureaus() {
  try {
    const res = await apiClient.get('/bureaus')
    bureaus.value = res.data.bureaus || []
  } catch (err) {
    // Ignore
  }
}

async function loadOfficersForCurrentBureau() {
  if (!store.currentComplaint?.current_bureau_id) return
  try {
    const res = await apiClient.get(`/bureaus/${store.currentComplaint.current_bureau_id}/officers`)
    bureauOfficers.value = res.data.officers || []
  } catch (err) {
    // Ignore
  }
}

onMounted(async () => {
  await loadComplaint()
  await loadBureaus()
  await loadOfficersForCurrentBureau()
})

async function handleUpdateStatus() {
  if (!newStatus.value) return
  isActionLoading.value = true
  actionError.value = null

  const res = await store.updateStatus(complaintId.value, newStatus.value, statusRemarks.value)
  isActionLoading.value = false

  if (res.success) {
    isStatusModalOpen.value = false
    statusRemarks.value = ''
  } else {
    actionError.value = res.error
  }
}

async function handleAssignOfficer() {
  if (!selectedOfficerId.value) return
  isActionLoading.value = true
  actionError.value = null

  const res = await store.assignOfficer(complaintId.value, Number(selectedOfficerId.value), assignRemarks.value)
  isActionLoading.value = false

  if (res.success) {
    isAssignModalOpen.value = false
    assignRemarks.value = ''
  } else {
    actionError.value = res.error
  }
}

async function handleTransferBureau() {
  if (!selectedTargetBureauId.value) return
  isActionLoading.value = true
  actionError.value = null

  const res = await store.transferBureau(complaintId.value, Number(selectedTargetBureauId.value), transferRemarks.value)
  isActionLoading.value = false

  if (res.success) {
    isTransferModalOpen.value = false
    transferRemarks.value = ''
    await loadOfficersForCurrentBureau()
  } else {
    actionError.value = res.error
  }
}
</script>

<template>
  <div v-if="store.currentComplaint" class="space-y-6">
    <!-- Back button & Header -->
    <div>
      <router-link
        to="/complaints"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        Back to Case Directory
      </router-link>

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-xl font-bold tracking-tight text-slate-900 font-mono">
              {{ store.currentComplaint.case_number }}
            </h2>
            <StatusBadge :status="store.currentComplaint.status" />
            <PriorityBadge :priority="store.currentComplaint.priority" />
            <span
              v-if="store.currentComplaint.is_overdue"
              class="rounded bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wider"
            >
              OVERDUE
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Registered on {{ store.currentComplaint.received_at?.slice(0, 10) }} • Last action recorded on {{ store.currentComplaint.last_action_at?.slice(0, 10) }}
          </p>
        </div>

        <!-- Action Buttons (Disabled if unauthorized) -->
        <div v-if="canEdit" class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            @click="isAssignModalOpen = true"
          >
            <UserCheck class="w-3.5 h-3.5 text-slate-500" />
            Assign Officer
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            @click="isTransferModalOpen = true"
          >
            <Send class="w-3.5 h-3.5 text-slate-500" />
            Transfer Bureau
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            @click="isStatusModalOpen = true"
          >
            <FileCheck2 class="w-3.5 h-3.5" />
            Update Status
          </button>
        </div>
        <div v-else class="text-xs text-slate-400 italic">
          {{ authStore.isSeniorAuthority ? 'Read-only access mode' : 'Modification restricted to responsible Bureau' }}
        </div>
      </div>
    </div>

    <!-- Overview Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Target Institution Card -->
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Target Institution
        </p>
        <router-link
          :to="`/institutions/${store.currentComplaint.institution_id}`"
          class="mt-1 block font-bold text-sm text-slate-900 hover:text-blue-600 transition"
        >
          {{ store.currentComplaint.institution_name }}
        </router-link>
        <p class="text-xs text-slate-500 mt-0.5 font-mono">
          AICTE Permanent ID: {{ store.currentComplaint.institution_code }}
        </p>
        <p class="text-xs text-slate-500">
          State: {{ store.currentComplaint.institution_state }}
        </p>
      </div>

      <!-- Department Ownership Card -->
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Responsible Department
        </p>
        <div class="mt-1 flex items-center gap-2">
          <span class="rounded bg-slate-900 px-2 py-0.5 text-xs font-bold text-amber-400">
            {{ store.currentComplaint.current_bureau_code }}
          </span>
          <span class="text-xs font-semibold text-slate-800">
            {{ store.currentComplaint.current_bureau_name }}
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Receiving Bureau: {{ store.currentComplaint.receiving_bureau_code }}
        </p>
        <p class="text-xs text-slate-700 font-medium">
          Assigned Officer: {{ store.currentComplaint.assigned_officer_name || 'Unassigned' }}
        </p>
      </div>

      <!-- Deadlines Card -->
      <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Compliance Deadlines
        </p>
        <div class="mt-1 flex items-baseline gap-2">
          <span class="text-sm font-bold text-slate-900">
            Due: {{ store.currentComplaint.due_at ? store.currentComplaint.due_at.slice(0, 10) : 'N/A' }}
          </span>
        </div>
        <p v-if="store.currentComplaint.is_overdue" class="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
          <Clock class="w-3.5 h-3.5" />
          Statutory SLA deadline breached!
        </p>
        <p v-else class="text-xs text-emerald-600 mt-1 font-medium">
          Within regulatory timeline
        </p>
        <p v-if="store.currentComplaint.external_reference" class="text-[11px] text-slate-400 mt-1">
          Ext Ref: {{ store.currentComplaint.external_reference }}
        </p>
      </div>
    </div>

    <!-- Continuous Tabs -->
    <div class="border-b border-slate-200">
      <nav class="flex gap-6 -mb-px text-xs font-semibold">
        <button
          type="button"
          :class="[
            'pb-3 border-b-2 transition flex items-center gap-2',
            activeTab === 'overview'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          ]"
          @click="activeTab = 'overview'"
        >
          Case Particulars & Narrative
        </button>

        <button
          type="button"
          :class="[
            'pb-3 border-b-2 transition flex items-center gap-2',
            activeTab === 'timeline'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          ]"
          @click="activeTab = 'timeline'"
        >
          Auditable Action Timeline
          <span class="rounded-full bg-slate-100 text-slate-700 px-1.5 py-0.2 text-[10px]">
            {{ store.currentComplaint.actions?.length || 0 }}
          </span>
        </button>

        <button
          type="button"
          :class="[
            'pb-3 border-b-2 transition flex items-center gap-2',
            activeTab === 'overlaps'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          ]"
          @click="activeTab = 'overlaps'"
        >
          Cross-Bureau Overlap Flags
          <span
            v-if="(store.currentComplaint.related_links?.length || 0) > 0"
            class="rounded-full bg-amber-500 text-white font-bold px-1.5 py-0.2 text-[10px]"
          >
            {{ store.currentComplaint.related_links?.length }}
          </span>
        </button>
      </nav>
    </div>

    <!-- Tab 1: Overview -->
    <div v-if="activeTab === 'overview'" class="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle space-y-6">
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Subject / Matter</h4>
        <p class="text-base font-bold text-slate-900 mt-1">
          {{ store.currentComplaint.subject }}
        </p>
      </div>

      <div class="border-t border-slate-100 pt-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Complaint Narrative</h4>
        <div class="mt-2 text-xs leading-relaxed text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap font-sans">
          {{ store.currentComplaint.description }}
        </div>
      </div>

      <div v-if="store.currentComplaint.resolution_summary" class="border-t border-slate-100 pt-4">
        <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
          <CheckCircle2 class="w-4 h-4" />
          Official Disposal & Resolution Order
        </h4>
        <div class="mt-2 text-xs leading-relaxed text-emerald-900 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          {{ store.currentComplaint.resolution_summary }}
        </div>
      </div>
    </div>

    <!-- Tab 2: Action Timeline -->
    <div v-else-if="activeTab === 'timeline'" class="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle">
      <div class="border-b border-slate-100 pb-3 mb-6">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800">
          Immutable Case Action Trail
        </h3>
        <p class="text-[11px] text-slate-500">
          Chronological record of status changes, departmental transfers, and regulatory directions
        </p>
      </div>

      <div class="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        <div
          v-for="act in store.currentComplaint.actions"
          :key="act.id"
          class="relative group"
        >
          <!-- Bullet dot -->
          <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-slate-900 ring-4 ring-white" />

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80 hover:bg-slate-100/60 transition">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 uppercase">
                {{ act.action_type.replace('_', ' ') }}
              </span>
              <span class="text-[11px] text-slate-400">
                {{ act.created_at?.slice(0, 16).replace('T', ' ') }}
              </span>
            </div>

            <p class="text-xs text-slate-800 mt-2 font-medium">
              {{ act.description }}
            </p>

            <div class="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
              <span>Recorded by: <strong>{{ act.performed_by_name }}</strong></span>
              <span v-if="act.old_status && act.new_status">
                Status: {{ act.old_status }} → <strong>{{ act.new_status }}</strong>
              </span>
              <span v-if="act.old_bureau_code && act.new_bureau_code && act.old_bureau_code !== act.new_bureau_code">
                Bureau: {{ act.old_bureau_code }} → <strong>{{ act.new_bureau_code }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Related Overlaps -->
    <div v-else-if="activeTab === 'overlaps'" class="space-y-4">
      <div v-if="(store.currentComplaint.related_links?.length || 0) === 0" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
        No potential cross-bureau overlap flags detected for this complaint.
      </div>

      <div
        v-for="link in store.currentComplaint.related_links"
        :key="link.id"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle space-y-4"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <span class="rounded bg-amber-500 text-white px-2 py-0.5 text-xs font-bold">
              {{ Math.round(link.match_score * 100) }}% Overlap Match
            </span>
            <span class="text-xs font-mono text-slate-500">
              Method: {{ link.match_method }}
            </span>
            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded uppercase',
                link.review_status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                link.review_status === 'dismissed' ? 'bg-slate-200 text-slate-700' :
                'bg-amber-100 text-amber-800'
              ]"
            >
              {{ link.review_status }}
            </span>
          </div>

          <router-link
            to="/overlaps"
            class="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Open in Overlap Review Queue
            <ExternalLink class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <p class="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
          <strong>Explainable Rationale:</strong> {{ link.match_reason }}
        </p>

        <!-- Correlated other case snapshot -->
        <div v-if="link.other_case" class="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80">
          <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Correlated Cross-Department Case
          </p>
          <div class="flex items-center justify-between mt-1">
            <router-link
              :to="`/complaints/${link.other_case.id}`"
              class="font-mono font-bold text-xs text-blue-600 hover:underline"
            >
              {{ link.other_case.case_number }}
            </router-link>
            <div class="flex items-center gap-2">
              <span class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-800">
                {{ link.other_case.bureau_code }}
              </span>
              <StatusBadge :status="link.other_case.status" size="sm" />
            </div>
          </div>
          <p class="text-xs font-semibold text-slate-800 mt-1">
            {{ link.other_case.subject }}
          </p>
          <p class="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
            {{ link.other_case.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal: Update Status -->
    <Modal
      :is-open="isStatusModalOpen"
      title="Update Complaint Status & Issue Action"
      @close="isStatusModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleUpdateStatus">
        <div v-if="actionError" class="p-3 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200">
          {{ actionError }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Target Status *</label>
          <select
            v-model="newStatus"
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-slate-900 focus:border-slate-900"
          >
            <option value="Under Review">Under Review</option>
            <option value="Action Required">Action Required</option>
            <option value="Awaiting Response">Awaiting Response</option>
            <option value="Escalated">Escalated</option>
            <option value="Disposed">Disposed (Resolution Reached)</option>
            <option value="Closed">Closed (Administratively Concluded)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">
            Action Description / Resolution Remarks *
          </label>
          <textarea
            v-model="statusRemarks"
            rows="3"
            required
            placeholder="Record official regulatory steps, show cause notice issued, hearing date, or resolution details..."
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
          @click="isStatusModalOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="isActionLoading"
          class="px-4 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          @click="handleUpdateStatus"
        >
          Commit Status Update
        </button>
      </template>
    </Modal>

    <!-- Modal: Assign Officer -->
    <Modal
      :is-open="isAssignModalOpen"
      title="Assign Responsible Bureau Officer"
      @close="isAssignModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleAssignOfficer">
        <div v-if="actionError" class="p-3 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200">
          {{ actionError }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Select Bureau Officer *</label>
          <select
            v-model="selectedOfficerId"
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-slate-900 focus:border-slate-900"
          >
            <option value="">-- Unassigned --</option>
            <option v-for="off in bureauOfficers" :key="off.id" :value="off.id">
              {{ off.name }} ({{ off.designation || off.role }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Assignment Directive / Remarks</label>
          <textarea
            v-model="assignRemarks"
            rows="2"
            placeholder="Instructions for the assigned officer..."
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
          @click="isAssignModalOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="isActionLoading"
          class="px-4 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          @click="handleAssignOfficer"
        >
          Save Assignment
        </button>
      </template>
    </Modal>

    <!-- Modal: Transfer Bureau -->
    <Modal
      :is-open="isTransferModalOpen"
      title="Departmental Case Transfer"
      @close="isTransferModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleTransferBureau">
        <div v-if="actionError" class="p-3 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200">
          {{ actionError }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Target AICTE Bureau / Cell *</label>
          <select
            v-model="selectedTargetBureauId"
            required
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-slate-900 focus:border-slate-900"
          >
            <option value="">-- Select Destination Bureau --</option>
            <option
              v-for="b in bureaus.filter(b => b.id !== store.currentComplaint?.current_bureau_id)"
              :key="b.id"
              :value="b.id"
            >
              {{ b.code }} — {{ b.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Transfer Justification *</label>
          <textarea
            v-model="transferRemarks"
            rows="3"
            required
            placeholder="Document why this case falls under the jurisdiction of the receiving Bureau..."
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
          @click="isTransferModalOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="isActionLoading"
          class="px-4 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          @click="handleTransferBureau"
        >
          Authorize Transfer
        </button>
      </template>
    </Modal>
  </div>
</template>
