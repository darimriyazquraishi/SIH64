<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/StatCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import Modal from '@/components/Modal.vue'
import type { KPIs, Complaint, Bureau, Institution } from '@/types'
import {
  AlertTriangle,
  GitCompare,
  Building,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  FileText,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(true)

const kpis = ref<KPIs>({
  total_complaints: 0,
  open_cases: 0,
  action_required: 0,
  overdue_cases: 0,
  escalated_cases: 0,
  disposed_cases: 0,
  unreviewed_overlaps: 0,
})

const recentComplaints = ref<Complaint[]>([])
const bureauWorkload = ref<any[]>([])
const bureaus = ref<Bureau[]>([])
const institutions = ref<Institution[]>([])

// Lodge Complaint Modal State (Keep the Rest - custom entry & priority selection)
const isLodgeModalOpen = ref(false)
const isSubmitting = ref(false)
const formError = ref<string | null>(null)
const useCustomInstitution = ref(false)

const newComplaintForm = ref({
  institution_id: '',
  institution_name: '',
  receiving_bureau_id: '',
  category: 'Fee Overcharging / Capitation',
  priority: 'High',
  subject: '',
  description: '',
  external_reference: '',
})

const categories = [
  'Fee Overcharging / Capitation',
  'Faculty Quality / Non-Payment',
  'Infrastructure Deficiencies',
  'Ragging Incident',
  'Approval / Accreditation Fraud',
  'Admission Irregularity',
  'General Administration',
]

const priorityOptions = [
  { value: 'Critical', label: 'Critical', sla: '7-day statutory SLA', color: 'border-red-500 text-red-700 dark:text-[#f48771] bg-red-50 dark:bg-[#341416]' },
  { value: 'High', label: 'High', sla: '15-day statutory SLA', color: 'border-orange-500 text-orange-700 dark:text-[#f97316] bg-orange-50 dark:bg-[#2b1706]' },
  { value: 'Medium', label: 'Medium', sla: '30-day statutory SLA', color: 'border-blue-500 text-blue-700 dark:text-[#38bdf8] bg-blue-50 dark:bg-[#0c2444]' },
  { value: 'Low', label: 'Low', sla: '45-day statutory SLA', color: 'border-slate-400 text-slate-700 dark:text-[#cccccc] bg-slate-50 dark:bg-[#202020]' },
]

async function loadDashboardData() {
  loading.value = true
  try {
    const [kpiRes, complaintsRes, analyticsRes, bureausRes, instRes] = await Promise.all([
      apiClient.get('/reports/kpis'),
      apiClient.get('/complaints', { params: { per_page: 8 } }),
      apiClient.get('/reports/analytics'),
      apiClient.get('/bureaus'),
      apiClient.get('/institutions', { params: { per_page: 100 } }),
    ])

    kpis.value = kpiRes.data
    recentComplaints.value = complaintsRes.data.items || []
    bureauWorkload.value = analyticsRes.data.bureau_workload || []
    bureaus.value = bureausRes.data.bureaus || []
    institutions.value = instRes.data.items || []

    if (bureaus.value.length > 0 && !newComplaintForm.value.receiving_bureau_id) {
      newComplaintForm.value.receiving_bureau_id = String(bureaus.value[0].id)
    }
    if (institutions.value.length > 0 && !newComplaintForm.value.institution_id) {
      newComplaintForm.value.institution_id = String(institutions.value[0].id)
    }
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  } finally {
    loading.value = false
  }
}

async function handleRegisterComplaint() {
  formError.value = null

  if (!useCustomInstitution.value && !newComplaintForm.value.institution_id) {
    formError.value = 'Please select an institution or enter its name.'
    return
  }
  if (useCustomInstitution.value && !newComplaintForm.value.institution_name.trim()) {
    formError.value = 'Please enter the institution name.'
    return
  }
  if (!newComplaintForm.value.subject.trim()) {
    formError.value = 'Complaint subject is required.'
    return
  }
  if (!newComplaintForm.value.description.trim()) {
    formError.value = 'Complaint description is required.'
    return
  }

  isSubmitting.value = true
  try {
    const payload: any = {
      subject: newComplaintForm.value.subject.trim(),
      description: newComplaintForm.value.description.trim(),
      category: newComplaintForm.value.category,
      priority: newComplaintForm.value.priority,
      receiving_bureau_id: Number(newComplaintForm.value.receiving_bureau_id),
      external_reference: newComplaintForm.value.external_reference.trim() || undefined,
    }

    if (useCustomInstitution.value) {
      payload.institution_name = newComplaintForm.value.institution_name.trim()
    } else {
      payload.institution_id = Number(newComplaintForm.value.institution_id)
    }

    const res = await apiClient.post('/complaints', payload)
    isLodgeModalOpen.value = false

    // Reset Form
    newComplaintForm.value.subject = ''
    newComplaintForm.value.description = ''
    newComplaintForm.value.external_reference = ''
    newComplaintForm.value.institution_name = ''
    useCustomInstitution.value = false

    // Reload Dashboard Data
    await loadDashboardData()

    if (res.data?.complaint?.id) {
      router.push(`/complaints/${res.data.complaint.id}`)
    }
  } catch (err: any) {
    formError.value = err.response?.data?.error || 'Failed to register complaint. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-[#22261f] dark:text-white [text-wrap:balance]">
          Operations Dashboard
        </h1>
        <p class="text-xs text-[#5f6656] dark:text-[#989898] mt-0.5 [text-wrap:pretty]">
          Active cases, deadlines, and bureau workloads
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] bg-white dark:bg-[#1e201d] px-3 py-1.5 text-xs font-medium text-[#22261f] dark:text-[#cccccc] hover:bg-[#f3f7ed] dark:hover:bg-[#252526] transition-colors shadow-sm"
          @click="loadDashboardData"
        >
          <RefreshCw :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" aria-hidden="true" />
          <span>Refresh</span>
        </button>

        <button
          v-if="!authStore.isSeniorAuthority"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
          @click="isLodgeModalOpen = true"
        >
          <PlusCircle class="w-3.5 h-3.5" aria-hidden="true" />
          <span>Lodge Complaint</span>
        </button>
      </div>
    </div>

    <!-- Urgent Alerts: Cross-Bureau Overlaps -->
    <div
      v-if="kpis.unreviewed_overlaps > 0"
      class="rounded-xl border border-amber-300 dark:border-[#554400] bg-amber-50 dark:bg-[#332b00] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm"
      role="region"
      aria-label="Pending overlaps alert"
    >
      <div class="flex items-start gap-3">
        <div class="p-1.5 rounded-lg bg-amber-100 dark:bg-[#4d3800] text-amber-800 dark:text-[#cca700] mt-0.5">
          <GitCompare class="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h2 class="text-xs font-semibold text-amber-950 dark:text-[#e5b567] uppercase tracking-wider">
            Overlapping Cases Pending Review
          </h2>
          <p class="text-xs text-amber-900 dark:text-[#d7ba7d] mt-0.5 [text-wrap:pretty]">
            {{ kpis.unreviewed_overlaps }} case pair(s) flagged across bureaus for matching institutions or docket numbers.
          </p>
        </div>
      </div>
      <router-link
        to="/overlaps"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-700 dark:bg-[#cca700] px-3.5 py-1.5 text-xs font-medium text-white dark:text-[#1e1e1e] hover:bg-amber-800 dark:hover:bg-[#e5b567] transition-colors"
      >
        <span>Review Overlaps</span>
        <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
      </router-link>
    </div>

    <!-- Urgent Alerts: Overdue Cases -->
    <div
      v-if="kpis.overdue_cases > 0"
      class="rounded-xl border border-red-200 dark:border-[#521c20] bg-red-50 dark:bg-[#2c1517] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm"
      role="region"
      aria-label="Overdue cases alert"
    >
      <div class="flex items-start gap-3">
        <div class="p-1.5 rounded-lg bg-red-100 dark:bg-[#481c20] text-red-700 dark:text-[#f87171] mt-0.5">
          <AlertTriangle class="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h2 class="text-xs font-semibold text-red-950 dark:text-[#f87171] uppercase tracking-wider">
            Overdue Cases
          </h2>
          <p class="text-xs text-red-800 dark:text-[#f87171] mt-0.5 [text-wrap:pretty]">
            {{ kpis.overdue_cases }} active case(s) past statutory response deadline.
          </p>
        </div>
      </div>
      <router-link
        to="/complaints?is_overdue=true"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#c72e2e] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#a82222] transition-colors"
      >
        <span>View Overdue Cases</span>
        <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
      </router-link>
    </div>

    <!-- 7-Metric KPI Grid (First Design Architecture) -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <StatCard
        title="Total Cases"
        :value="kpis.total_complaints"
        subtitle="In registry"
        :loading="loading"
      />
      <StatCard
        title="Open Cases"
        :value="kpis.open_cases"
        variant="info"
        subtitle="Under processing"
        :loading="loading"
      />
      <StatCard
        title="Action Required"
        :value="kpis.action_required"
        variant="warning"
        subtitle="Awaiting input"
        :loading="loading"
      />
      <StatCard
        title="Overdue"
        :value="kpis.overdue_cases"
        variant="danger"
        subtitle="Past deadline"
        :loading="loading"
      />
      <StatCard
        title="Escalated"
        :value="kpis.escalated_cases"
        subtitle="Senior review"
        :loading="loading"
      />
      <StatCard
        title="Disposed"
        :value="kpis.disposed_cases"
        variant="success"
        subtitle="Resolved"
        :loading="loading"
      />
      <StatCard
        title="Pending Overlaps"
        :value="kpis.unreviewed_overlaps"
        variant="warning"
        subtitle="To review"
        :loading="loading"
      />
    </div>

    <!-- Two-Column Section: Bureau Workload & Institutional Oversight -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Bureau Distribution Card (2 Columns) -->
      <div class="lg:col-span-2 rounded-xl border border-[#dfe7d6] dark:border-[#2f332b] bg-white dark:bg-[#1e201d] p-4 shadow-sm">
        <div class="flex items-center justify-between border-b border-[#dfe7d6] dark:border-[#2f332b] pb-3">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-[#22261f] dark:text-white">
              Bureau Workload
            </h2>
            <p class="text-xs text-[#5f6656] dark:text-[#989898] mt-0.5">
              Open vs disposed cases across AICTE bureaus
            </p>
          </div>
          <router-link
            to="/reports"
            class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-[#4fc1ff] dark:hover:underline"
          >
            Detailed reports
          </router-link>
        </div>

        <div class="mt-2 divide-y divide-[#dfe7d6] dark:divide-[#2f332b]">
          <div
            v-for="bureau in bureauWorkload"
            :key="bureau.bureau_id"
            class="flex items-center justify-between py-2.5 px-1.5 hover:bg-[#f8faf4] dark:hover:bg-[#252526] transition-colors rounded-lg"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-6 w-11 items-center justify-center rounded bg-[#f3f7ed] dark:bg-[#161716] text-xs font-bold text-[#22261f] dark:text-[#4fc1ff] border border-[#dfe7d6] dark:border-[#2f332b]">
                {{ bureau.code }}
              </span>
              <div>
                <p class="text-xs font-medium text-[#22261f] dark:text-[#cccccc]">{{ bureau.name }}</p>
                <p class="text-xs text-[#5f6656] dark:text-[#989898]">
                  {{ bureau.open }} open, {{ bureau.disposed }} disposed
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-32 bg-[#e8efe0] dark:bg-[#161716] h-2 rounded overflow-hidden hidden sm:block">
                <div
                  class="bg-blue-600 dark:bg-[#007acc] h-full rounded"
                  :style="{
                    width: bureau.total > 0 ? `${Math.round((bureau.open / bureau.total) * 100)}%` : '0%',
                  }"
                />
              </div>
              <span class="text-xs font-semibold text-[#22261f] dark:text-white w-8 text-right tabular-nums">
                {{ bureau.total }}
              </span>
            </div>
          </div>

          <div v-if="bureauWorkload.length === 0" class="py-6 text-center text-xs text-[#5f6656] dark:text-[#989898]">
            No bureau records available.
          </div>
        </div>
      </div>

      <!-- Institutional Oversight Links (1 Column) -->
      <div class="rounded-xl border border-[#dfe7d6] dark:border-[#2f332b] bg-white dark:bg-[#1e201d] p-4 flex flex-col justify-between shadow-sm">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-[#22261f] dark:text-white border-b border-[#dfe7d6] dark:border-[#2f332b] pb-3">
            Institutional Oversight
          </h2>
          <p class="text-xs text-[#5f6656] dark:text-[#989898] mt-2.5 leading-relaxed [text-wrap:pretty]">
            Search any college to view all complaints filed against it regardless of the receiving bureau.
          </p>

          <div class="mt-3.5 divide-y divide-[#dfe7d6] dark:divide-[#2f332b]">
            <router-link
              to="/institutions"
              class="flex items-center justify-between py-2.5 px-1.5 rounded-lg hover:bg-[#f8faf4] dark:hover:bg-[#252526] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
                <Building class="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:text-[#989898] dark:group-hover:text-white" aria-hidden="true" />
                <span>Institutions Directory</span>
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 dark:text-[#989898]" aria-hidden="true" />
            </router-link>

            <router-link
              to="/overlaps"
              class="flex items-center justify-between py-2.5 px-1.5 rounded-lg hover:bg-[#f8faf4] dark:hover:bg-[#252526] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
                <GitCompare class="w-4 h-4 text-amber-600 dark:text-[#cca700]" aria-hidden="true" />
                <span>Overlap Review Queue</span>
              </div>
              <span class="rounded bg-amber-100 dark:bg-[#4d3800] text-amber-800 dark:text-[#cca700] px-1.5 py-0.5 text-xs font-semibold tabular-nums">
                {{ kpis.unreviewed_overlaps }}
              </span>
            </router-link>

            <router-link
              to="/imports"
              class="flex items-center justify-between py-2.5 px-1.5 rounded-lg hover:bg-[#f8faf4] dark:hover:bg-[#252526] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
                <FileText class="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:text-[#989898] dark:group-hover:text-white" aria-hidden="true" />
                <span>Import Case Batch</span>
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 dark:text-[#989898]" aria-hidden="true" />
            </router-link>
          </div>
        </div>

        <p class="mt-4 pt-3 border-t border-[#dfe7d6] dark:border-[#2f332b] text-xs text-[#5f6656] dark:text-[#989898] [text-wrap:pretty]">
          Transfers and coordination notes are recorded in the audit log.
        </p>
      </div>
    </div>

    <!-- Recent Complaints Table (First Design Architecture) -->
    <div class="rounded-xl border border-[#dfe7d6] dark:border-[#2f332b] bg-white dark:bg-[#1e201d] overflow-hidden shadow-sm">
      <div class="flex items-center justify-between border-b border-[#dfe7d6] dark:border-[#2f332b] px-5 py-3.5">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-[#22261f] dark:text-white">
            Recent Complaints
          </h2>
          <p class="text-xs text-[#5f6656] dark:text-[#989898] mt-0.5">
            Active and pending cases filed across all bureaus
          </p>
        </div>

        <router-link
          to="/complaints"
          class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-[#4fc1ff] dark:hover:underline transition-colors"
        >
          View all complaints ({{ kpis.total_complaints }})
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-[#dfe7d6] dark:border-[#2f332b] bg-[#f8faf4] dark:bg-[#161716] text-xs font-semibold uppercase tracking-wider text-[#5f6656] dark:text-[#989898]">
              <th scope="col" class="py-2.5 px-4">Case #</th>
              <th scope="col" class="py-2.5 px-4">Institution</th>
              <th scope="col" class="py-2.5 px-4">Bureau</th>
              <th scope="col" class="py-2.5 px-4">Category</th>
              <th scope="col" class="py-2.5 px-4">Priority</th>
              <th scope="col" class="py-2.5 px-4">Status</th>
              <th scope="col" class="py-2.5 px-4">Due Date</th>
              <th scope="col" class="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#dfe7d6] dark:divide-[#2f332b] text-xs">
            <tr
              v-for="comp in recentComplaints"
              :key="comp.id"
              class="hover:bg-[#f8faf4] dark:hover:bg-[#252526] transition-colors"
            >
              <!-- Case Number -->
              <td class="py-3 px-4 font-mono font-medium text-[#22261f] dark:text-[#cccccc] whitespace-nowrap">
                <router-link
                  :to="`/complaints/${comp.id}`"
                  class="text-blue-600 hover:underline hover:text-blue-800 dark:text-[#4fc1ff]"
                >
                  {{ comp.case_number }}
                </router-link>
                <div v-if="comp.external_reference" class="text-xs text-[#5f6656] dark:text-[#989898] font-sans">
                  Ref: {{ comp.external_reference }}
                </div>
              </td>

              <!-- Institution -->
              <td class="py-3 px-4 max-w-xs">
                <router-link
                  :to="`/institutions/${comp.institution_id}`"
                  class="font-medium text-[#22261f] dark:text-[#cccccc] hover:text-blue-600 dark:hover:text-[#4fc1ff] line-clamp-1"
                >
                  {{ comp.institution_name }}
                </router-link>
                <div class="text-xs text-[#5f6656] dark:text-[#989898] font-mono">
                  {{ comp.institution_code || 'N/A' }} · {{ comp.institution_state || 'All India' }}
                </div>
              </td>

              <!-- Bureau -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#f3f7ed] dark:bg-[#161716] text-[#22261f] dark:text-[#cccccc] border border-[#dfe7d6] dark:border-[#2f332b]">
                  {{ comp.current_bureau_code }}
                </span>
              </td>

              <!-- Category -->
              <td class="py-3 px-4 max-w-[180px] truncate text-[#5f6656] dark:text-[#989898]" :title="comp.category">
                {{ comp.category }}
              </td>

              <!-- Priority -->
              <td class="py-3 px-4 whitespace-nowrap">
                <PriorityBadge :priority="comp.priority" size="sm" />
              </td>

              <!-- Status -->
              <td class="py-3 px-4 whitespace-nowrap">
                <StatusBadge :status="comp.status" size="sm" />
              </td>

              <!-- Due Date -->
              <td class="py-3 px-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span
                    :class="[
                      comp.is_overdue
                        ? 'text-red-700 dark:text-[#f48771] font-semibold bg-red-50 dark:bg-[#3b1214] px-1.5 py-0.5 rounded border border-red-200 dark:border-[#5c1c20]'
                        : 'text-[#5f6656] dark:text-[#cccccc]',
                    ]"
                  >
                    {{ comp.due_at ? comp.due_at.slice(0, 10) : 'N/A' }}
                  </span>
                  <span
                    v-if="comp.is_overdue"
                    class="rounded bg-red-100 text-red-800 dark:bg-[#3b1214] dark:text-[#f48771] border border-red-300 dark:border-[#5c1c20] text-xs font-semibold px-1.5 py-0.5 uppercase tracking-wide"
                  >
                    Overdue
                  </span>
                </div>
              </td>

              <!-- Action Link -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <router-link
                  :to="`/complaints/${comp.id}`"
                  class="inline-flex items-center gap-1 text-xs font-medium text-[#22261f] hover:text-blue-600 dark:text-[#cccccc] dark:hover:text-white"
                >
                  <span>Open</span>
                  <ArrowRight class="w-3 h-3" aria-hidden="true" />
                </router-link>
              </td>
            </tr>

            <!-- Clean Empty State if no complaints exist -->
            <tr v-if="recentComplaints.length === 0">
              <td colspan="8" class="py-12">
                <div class="flex flex-col items-center justify-center text-center p-6">
                  <div class="flex items-center gap-2 mb-1 text-slate-400 dark:text-[#989898]">
                    <FileText class="w-4 h-4" />
                    <h3 class="text-xs font-semibold text-[#22261f] dark:text-white uppercase tracking-wider">
                      Registry Clean — No Active Complaints
                    </h3>
                  </div>
                  <p class="text-xs text-[#5f6656] dark:text-[#989898] max-w-sm [text-wrap:pretty]">
                    Unnecessary pre-added data has been cleared. Personally record a grievance and select priority below.
                  </p>
                  <button
                    type="button"
                    class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] px-4 py-2 text-xs font-semibold text-white transition shadow-sm"
                    @click="isLodgeModalOpen = true"
                  >
                    <PlusCircle class="w-3.5 h-3.5" />
                    <span>Lodge First Complaint</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lodge Grievance Modal (Keep the Rest: Personally Enter Details & Select Priority) -->
    <Modal
      :is-open="isLodgeModalOpen"
      title="Lodge Institutional Grievance"
      max-width="xl"
      @close="isLodgeModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleRegisterComplaint">
        <!-- Error Alert -->
        <div
          v-if="formError"
          class="rounded-lg bg-red-50 dark:bg-[#341416] p-3 text-xs text-red-700 dark:text-[#f87171] border border-red-200 dark:border-[#521c20]"
          role="alert"
        >
          <span class="font-semibold">Error:</span> {{ formError }}
        </div>

        <!-- Institution Selection -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label for="modal-institution" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
              Target Institution *
            </label>
            <button
              type="button"
              class="text-xs text-blue-600 dark:text-[#38bdf8] hover:underline"
              @click="useCustomInstitution = !useCustomInstitution"
            >
              {{ useCustomInstitution ? '← Pick from Directory' : '+ Enter custom institution name' }}
            </button>
          </div>

          <input
            v-if="useCustomInstitution"
            id="modal-custom-inst"
            v-model="newComplaintForm.institution_name"
            type="text"
            required
            placeholder="e.g. Apex Institute of Technology and Management"
            class="block w-full px-3 py-2 text-xs border border-[#dfe7d6] dark:border-[#2f332b] rounded-lg bg-white dark:bg-[#161716] text-[#22261f] dark:text-white dark:placeholder-[#aaaaaa] focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />

          <select
            v-else
            id="modal-institution"
            v-model="newComplaintForm.institution_id"
            required
            class="block w-full px-3 py-2 text-xs border border-[#dfe7d6] dark:border-[#2f332b] rounded-lg bg-white dark:bg-[#161716] text-[#22261f] dark:text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          >
            <option v-for="inst in institutions" :key="inst.id" :value="inst.id">
              {{ inst.name }} ({{ inst.institution_code || inst.state }})
            </option>
          </select>
        </div>

        <!-- Bureau & Category -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label for="modal-bureau" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
              Receiving Bureau *
            </label>
            <select
              id="modal-bureau"
              v-model="newComplaintForm.receiving_bureau_id"
              required
              class="mt-1 block w-full px-3 py-2 text-xs border border-[#dfe7d6] dark:border-[#2f332b] rounded-lg bg-white dark:bg-[#161716] text-[#22261f] dark:text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option v-for="b in bureaus" :key="b.id" :value="b.id">
                {{ b.code }} — {{ b.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="modal-category" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
              Grievance Category *
            </label>
            <select
              id="modal-category"
              v-model="newComplaintForm.category"
              required
              class="mt-1 block w-full px-3 py-2 text-xs border border-[#dfe7d6] dark:border-[#2f332b] rounded-lg bg-white dark:bg-[#161716] text-[#22261f] dark:text-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            >
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
        </div>

        <!-- Priority Selection (Special Feature Requested) -->
        <div>
          <label class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc] mb-1.5">
            Select Case Priority & Statutory SLA *
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              v-for="p in priorityOptions"
              :key="p.value"
              type="button"
              :class="[
                'p-2.5 rounded-lg border text-left transition-all',
                newComplaintForm.priority === p.value
                  ? [p.color, 'ring-2 ring-orange-500 shadow-sm font-bold']
                  : 'border-[#dfe7d6] dark:border-[#2f332b] bg-[#f8faf4] dark:bg-[#161716] hover:bg-[#f3f7ed] dark:hover:bg-[#252526] text-[#22261f] dark:text-[#cccccc]',
              ]"
              @click="newComplaintForm.priority = p.value"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-wider font-semibold">{{ p.label }}</span>
                <span v-if="newComplaintForm.priority === p.value" class="w-2 h-2 rounded-full bg-orange-500"></span>
              </div>
              <div class="text-xs text-[#5f6656] dark:text-[#989898] mt-1">{{ p.sla }}</div>
            </button>
          </div>
        </div>

        <!-- Docket or External Reference -->
        <div>
          <label for="modal-docket" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
            Docket Number / External Reference (optional)
          </label>
          <input
            id="modal-docket"
            v-model="newComplaintForm.external_reference"
            type="text"
            placeholder="e.g. CPGRAMS-2026-E-04829, FIR #312, or High Court Writ"
            class="mt-1 block w-full px-3 py-2 text-xs border border-[#dfe7d6] dark:border-[#2f332b] rounded-lg bg-white dark:bg-[#161716] text-[#22261f] dark:text-white dark:placeholder-[#aaaaaa] focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <!-- Subject -->
        <div>
          <label for="modal-subject" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
            Case Subject / Grievance Title *
          </label>
          <input
            id="modal-subject"
            v-model="newComplaintForm.subject"
            type="text"
            required
            placeholder="Brief concise summary of the issue"
            class="mt-1 block w-full px-3 py-2 text-xs border border-[#dfe7d6] dark:border-[#2f332b] rounded-lg bg-white dark:bg-[#161716] text-[#22261f] dark:text-white dark:placeholder-[#aaaaaa] focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="modal-desc" class="block text-xs font-medium text-[#22261f] dark:text-[#cccccc]">
            Detailed Allegations & Background *
          </label>
          <textarea
            id="modal-desc"
            v-model="newComplaintForm.description"
            rows="4"
            required
            placeholder="Specify dates, departments, fees charged, and supporting evidence..."
            class="mt-1 block w-full px-3 py-2 text-xs border border-[#dfe7d6] dark:border-[#2f332b] rounded-lg bg-white dark:bg-[#161716] text-[#22261f] dark:text-white dark:placeholder-[#aaaaaa] focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </form>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-lg border border-[#dfe7d6] dark:border-[#2f332b] text-xs font-medium text-[#22261f] dark:text-[#cccccc] hover:bg-[#f3f7ed] dark:hover:bg-[#252526]"
            @click="isLodgeModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="isSubmitting"
            class="px-4 py-1.5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-xs font-bold text-white disabled:opacity-50 transition shadow-sm"
            @click="handleRegisterComplaint"
          >
            <span v-if="isSubmitting">Registering Case…</span>
            <span v-else>Register Grievance</span>
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>
