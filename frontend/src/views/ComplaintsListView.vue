<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useComplaintsStore } from '@/stores/complaints'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/api/client'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import Modal from '@/components/Modal.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { Bureau, Institution } from '@/types'
import {
  Search,
  Filter,
  RotateCcw,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useComplaintsStore()
const authStore = useAuthStore()

const bureaus = ref<Bureau[]>([])
const institutions = ref<Institution[]>([])
const isNewModalOpen = ref(false)

// New Complaint Form
const form = ref({
  institution_id: '',
  category: 'Fee Overcharging / Capitation',
  subject: '',
  description: '',
  receiving_bureau_id: '',
  priority: 'Medium',
  external_reference: '',
})
const formError = ref<string | null>(null)
const isSubmitting = ref(false)

const categories = [
  'Fee Overcharging / Capitation',
  'Faculty Quality / Non-Payment',
  'Infrastructure Deficiencies',
  'Ragging Incident',
  'Approval / Accreditation Fraud',
  'Admission Irregularity',
  'General Administration',
]

async function loadMetadata() {
  try {
    const [bRes, iRes] = await Promise.all([
      apiClient.get('/bureaus'),
      apiClient.get('/institutions', { params: { per_page: 50 } }),
    ])
    bureaus.value = bRes.data.bureaus || []
    institutions.value = iRes.data.items || []

    if (bureaus.value.length > 0 && !form.value.receiving_bureau_id) {
      form.value.receiving_bureau_id = String(authStore.user?.bureau_id || bureaus.value[0].id)
    }
    if (institutions.value.length > 0 && !form.value.institution_id) {
      form.value.institution_id = String(institutions.value[0].id)
    }
  } catch (err) {
    console.error('Metadata load error:', err)
  }
}

onMounted(async () => {
  await loadMetadata()

  // Read URL query params
  if (route.query.action === 'new' && !authStore.isSeniorAuthority) {
    isNewModalOpen.value = true
  }
  if (route.query.is_overdue === 'true') {
    store.isOverdueFilter = true
  }
  if (route.query.bureau_id) {
    store.bureauFilter = Number(route.query.bureau_id)
  }
  if (route.query.status) {
    store.statusFilter = String(route.query.status)
  }

  store.fetchComplaints()
})

// Debounced search
let searchTimer: any = null
watch(
  () => store.search,
  () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      store.page = 1
      store.fetchComplaints()
    }, 300)
  }
)

async function handleCreateComplaint() {
  if (!form.value.subject || !form.value.description) {
    formError.value = 'Subject and description are required.'
    return
  }
  isSubmitting.value = true
  formError.value = null

  const res = await store.createComplaint({
    ...form.value,
    institution_id: Number(form.value.institution_id),
    receiving_bureau_id: Number(form.value.receiving_bureau_id),
  })

  isSubmitting.value = false
  if (res.success) {
    isNewModalOpen.value = false
    form.value.subject = ''
    form.value.description = ''
    form.value.external_reference = ''
    router.push(`/complaints/${res.complaint.id}`)
  } else {
    formError.value = res.error
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Central Case Directory
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Unified case records with cross-bureau ownership tracking and SLA deadlines
        </p>
      </div>

      <button
        v-if="!authStore.isSeniorAuthority"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
        @click="isNewModalOpen = true"
      >
        <PlusCircle class="w-4 h-4" />
        Lodge New Complaint
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle space-y-3">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <!-- Search Input -->
        <div class="md:col-span-2 relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            v-model="store.search"
            type="text"
            placeholder="Search by case #, institution, category, keyword, or external ref..."
            class="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
          />
        </div>

        <!-- Bureau Filter -->
        <div>
          <select
            v-model="store.bureauFilter"
            class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition bg-white"
            @change="store.page = 1; store.fetchComplaints()"
          >
            <option :value="''">All AICTE Bureaus / Cells</option>
            <option v-for="b in bureaus" :key="b.id" :value="b.id">
              {{ b.code }} — {{ b.name }}
            </option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <select
            v-model="store.priorityFilter"
            class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition bg-white"
            @change="store.page = 1; store.fetchComplaints()"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <!-- Secondary Filter Row: Status Pills & Overdue Toggle -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Status:</span>
          <button
            v-for="st in ['', 'Received', 'Under Review', 'Action Required', 'Awaiting Response', 'Escalated', 'Disposed']"
            :key="st"
            type="button"
            :class="[
              'px-2.5 py-1 rounded-full text-xs font-medium transition',
              store.statusFilter === st
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
            @click="store.statusFilter = st; store.page = 1; store.fetchComplaints()"
          >
            {{ st || 'All' }}
          </button>
        </div>

        <div class="flex items-center gap-3">
          <!-- Overdue toggle -->
          <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              v-model="store.isOverdueFilter"
              type="checkbox"
              class="rounded border-slate-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5"
              @change="store.page = 1; store.fetchComplaints()"
            />
            <span class="flex items-center gap-1 text-red-700">
              <Clock class="w-3.5 h-3.5" />
              Overdue Only
            </span>
          </label>

          <button
            type="button"
            class="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800"
            @click="store.resetFilters()"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Case Table -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th class="py-3 px-4">Case #</th>
              <th class="py-3 px-4">Institution</th>
              <th class="py-3 px-4">Subject & Category</th>
              <th class="py-3 px-4">Bureau</th>
              <th class="py-3 px-4">Officer</th>
              <th class="py-3 px-4">Priority</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Due Date</th>
              <th class="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="c in store.complaints"
              :key="c.id"
              class="hover:bg-slate-50/80 transition"
            >
              <!-- Case Number -->
              <td class="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                <router-link
                  :to="`/complaints/${c.id}`"
                  class="text-blue-600 hover:underline hover:text-blue-800"
                >
                  {{ c.case_number }}
                </router-link>
                <div v-if="c.external_reference" class="text-[10px] text-slate-400 font-sans">
                  Ref: {{ c.external_reference }}
                </div>
              </td>

              <!-- Institution -->
              <td class="py-3 px-4 max-w-[200px]">
                <router-link
                  :to="`/institutions/${c.institution_id}`"
                  class="font-medium text-slate-900 hover:text-blue-600 line-clamp-1"
                >
                  {{ c.institution_name }}
                </router-link>
                <div class="text-[10px] text-slate-400 font-mono">
                  {{ c.institution_code }} • {{ c.institution_state }}
                </div>
              </td>

              <!-- Subject & Category -->
              <td class="py-3 px-4 max-w-xs">
                <p class="font-medium text-slate-800 line-clamp-1" :title="c.subject">
                  {{ c.subject }}
                </p>
                <span class="inline-block mt-0.5 text-[10px] text-slate-500 font-medium">
                  {{ c.category }}
                </span>
              </td>

              <!-- Bureau -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {{ c.current_bureau_code }}
                </span>
              </td>

              <!-- Officer -->
              <td class="py-3 px-4 whitespace-nowrap text-slate-600">
                {{ c.assigned_officer_name || 'Unassigned' }}
              </td>

              <!-- Priority -->
              <td class="py-3 px-4 whitespace-nowrap">
                <PriorityBadge :priority="c.priority" size="sm" />
              </td>

              <!-- Status -->
              <td class="py-3 px-4 whitespace-nowrap">
                <StatusBadge :status="c.status" size="sm" />
              </td>

              <!-- Due Date -->
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span
                    :class="[
                      c.is_overdue
                        ? 'text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200'
                        : 'text-slate-600',
                    ]"
                  >
                    {{ c.due_at ? c.due_at.slice(0, 10) : 'N/A' }}
                  </span>
                  <span
                    v-if="c.is_overdue"
                    class="rounded bg-red-600 text-white text-[9px] font-black px-1 uppercase"
                  >
                    OVERDUE
                  </span>
                </div>
              </td>

              <!-- Action Link -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <router-link
                  :to="`/complaints/${c.id}`"
                  class="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900"
                >
                  View
                  <ArrowRight class="w-3 h-3" />
                </router-link>
              </td>
            </tr>

            <tr v-if="store.complaints.length === 0 && !store.loading">
              <td colspan="9" class="py-12">
                <EmptyState
                  title="No complaints match the criteria"
                  description="Try adjusting your keywords, selecting different status filters, or resetting the filter options."
                >
                  <template #action>
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                      @click="store.resetFilters()"
                    >
                      Clear Filters
                    </button>
                  </template>
                </EmptyState>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="flex items-center justify-between border-t border-slate-200 px-6 py-3.5 bg-slate-50/50">
        <div class="text-xs text-slate-500">
          Showing <span class="font-semibold text-slate-800">{{ store.complaints.length }}</span> of <span class="font-semibold text-slate-800">{{ store.total }}</span> complaints
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="store.page <= 1"
            class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            @click="store.page--; store.fetchComplaints()"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            Previous
          </button>

          <span class="text-xs font-medium text-slate-700 px-2">
            Page {{ store.page }} of {{ store.pages }}
          </span>

          <button
            type="button"
            :disabled="store.page >= store.pages"
            class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            @click="store.page++; store.fetchComplaints()"
          >
            Next
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Lodge New Complaint -->
    <Modal
      :is-open="isNewModalOpen"
      title="Register Institutional Complaint"
      max-width="xl"
      @close="isNewModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleCreateComplaint">
        <div v-if="formError" class="p-3 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200">
          {{ formError }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Target Institution *</label>
          <select
            v-model="form.institution_id"
            required
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900 bg-white"
          >
            <option v-for="inst in institutions" :key="inst.id" :value="inst.id">
              {{ inst.name }} (ID: {{ inst.institution_code }}) • {{ inst.state }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700">Receiving Bureau *</label>
            <select
              v-model="form.receiving_bureau_id"
              required
              class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900 bg-white"
            >
              <option v-for="b in bureaus" :key="b.id" :value="b.id">
                {{ b.code }} — {{ b.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700">Priority Level *</label>
            <select
              v-model="form.priority"
              required
              class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900 bg-white"
            >
              <option value="Critical">Critical (7-day SLA)</option>
              <option value="High">High (15-day SLA)</option>
              <option value="Medium">Medium (30-day SLA)</option>
              <option value="Low">Low (45-day SLA)</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Complaint Category *</label>
          <select
            v-model="form.category"
            required
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900 bg-white"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">External Reference (Optional)</label>
          <input
            v-model="form.external_reference"
            type="text"
            placeholder="e.g. CPGRAMS Docket #, High Court Writ #, or Police FIR"
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Subject / Matter *</label>
          <input
            v-model="form.subject"
            type="text"
            required
            placeholder="Brief concise summary of the complaint"
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Detailed Complaint Narrative *</label>
          <textarea
            v-model="form.description"
            rows="4"
            required
            placeholder="Provide comprehensive details, names, dates, financial demands, and specific violations..."
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
          @click="isNewModalOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="isSubmitting"
          class="px-4 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          @click="handleCreateComplaint"
        >
          <span v-if="isSubmitting">Submitting & Analyzing Overlaps...</span>
          <span v-else>Register Complaint</span>
        </button>
      </template>
    </Modal>
  </div>
</template>
