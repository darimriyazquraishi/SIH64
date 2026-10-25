<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/StatCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import type { KPIs, Complaint } from '@/types'
import {
  AlertTriangle,
  GitCompare,
  Clock,
  CheckCircle2,
  FileText,
  Building,
  ArrowRight,
  Filter,
  RefreshCw,
  PlusCircle,
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

async function loadDashboardData() {
  loading.value = true
  try {
    const [kpiRes, complaintsRes, analyticsRes] = await Promise.all([
      apiClient.get('/reports/kpis'),
      apiClient.get('/complaints', { params: { per_page: 8 } }),
      apiClient.get('/reports/analytics'),
    ])

    kpis.value = kpiRes.data
    recentComplaints.value = complaintsRes.data.items
    bureauWorkload.value = analyticsRes.data.bureau_workload || []
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  } finally {
    loading.value = false
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
        <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Operations Dashboard
        </h1>
        <p class="text-xs text-slate-500 dark:text-[#858585] mt-0.5">
          Active cases, deadlines, and bureau workloads
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded border border-slate-300 dark:border-[#3e3e42] bg-white dark:bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#37373d] transition-colors"
          @click="loadDashboardData"
        >
          <RefreshCw :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" aria-hidden="true" />
          Refresh
        </button>

        <router-link
          v-if="!authStore.isSeniorAuthority"
          to="/complaints?action=new"
          class="inline-flex items-center gap-1.5 rounded bg-slate-900 dark:bg-[#007acc] px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-[#1177bb] transition-colors"
        >
          <PlusCircle class="w-3.5 h-3.5" aria-hidden="true" />
          Lodge Complaint
        </router-link>
      </div>
    </div>

    <!-- Urgent Alerts: Cross-Bureau Overlaps -->
    <div
      v-if="kpis.unreviewed_overlaps > 0"
      class="rounded-md border border-amber-300 dark:border-[#554400] bg-amber-50 dark:bg-[#332b00] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      role="region"
      aria-label="Pending overlaps alert"
    >
      <div class="flex items-start gap-3">
        <div class="p-1.5 rounded bg-amber-100 dark:bg-[#4d3800] text-amber-800 dark:text-[#cca700] mt-0.5">
          <GitCompare class="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h2 class="text-xs font-semibold text-amber-950 dark:text-[#e5b567] uppercase tracking-wider">
            Overlapping Cases Pending Review
          </h2>
          <p class="text-xs text-amber-900 dark:text-[#d7ba7d] mt-0.5">
            {{ kpis.unreviewed_overlaps }} case pair(s) flagged across bureaus for matching institutions or docket numbers.
          </p>
        </div>
      </div>
      <router-link
        to="/overlaps"
        class="inline-flex items-center justify-center gap-1.5 rounded bg-amber-700 dark:bg-[#cca700] px-3.5 py-1.5 text-xs font-medium text-white dark:text-[#1e1e1e] hover:bg-amber-800 dark:hover:bg-[#e5b567] transition-colors"
      >
        Review Overlaps
        <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
      </router-link>
    </div>

    <!-- Urgent Alerts: Overdue Cases -->
    <div
      v-if="kpis.overdue_cases > 0"
      class="rounded-md border border-red-300 dark:border-[#5c1c20] bg-red-50 dark:bg-[#3b1214] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      role="region"
      aria-label="Overdue cases alert"
    >
      <div class="flex items-start gap-3">
        <div class="p-1.5 rounded bg-red-100 dark:bg-[#5c1c20] text-red-800 dark:text-[#f48771] mt-0.5">
          <AlertTriangle class="w-4 h-4" aria-hidden="true" />
        </div>
        <div>
          <h2 class="text-xs font-semibold text-red-950 dark:text-[#f48771] uppercase tracking-wider">
            Overdue Cases
          </h2>
          <p class="text-xs text-red-900 dark:text-[#f48771] mt-0.5">
            {{ kpis.overdue_cases }} active case(s) past statutory response deadline.
          </p>
        </div>
      </div>
      <router-link
        to="/complaints?is_overdue=true"
        class="inline-flex items-center justify-center gap-1.5 rounded bg-red-600 dark:bg-[#f14c4c] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 dark:hover:bg-[#d63b3b] transition-colors"
      >
        View Overdue Cases
        <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
      </router-link>
    </div>

    <!-- KPIs Grid -->
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

    <!-- Two-Column Section: Bureau Workload & Quick Navigation -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Bureau Distribution Card -->
      <div class="lg:col-span-2 rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4.5">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#2d2d2d] pb-3">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-white">
              Bureau Workload
            </h2>
            <p class="text-xs text-slate-500 dark:text-[#858585]">
              Open vs disposed cases across AICTE bureaus
            </p>
          </div>
          <router-link to="/reports" class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-[#4fc1ff] dark:hover:underline">
            Detailed reports
          </router-link>
        </div>

        <div class="mt-3.5 space-y-2.5">
          <div
            v-for="bureau in bureauWorkload"
            :key="bureau.bureau_id"
            class="flex items-center justify-between p-2.5 rounded border border-slate-100 dark:border-[#2d2d2d] hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-6 w-11 items-center justify-center rounded bg-slate-100 dark:bg-[#1e1e1e] text-xs font-bold text-slate-700 dark:text-[#4fc1ff] border border-slate-200 dark:border-[#3e3e42]">
                {{ bureau.code }}
              </span>
              <div>
                <p class="text-xs font-medium text-slate-800 dark:text-[#cccccc]">{{ bureau.name }}</p>
                <p class="text-xs text-slate-500 dark:text-[#858585]">
                  {{ bureau.open }} open, {{ bureau.disposed }} disposed
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-32 bg-slate-100 dark:bg-[#1e1e1e] h-2 rounded overflow-hidden hidden sm:block">
                <div
                  class="bg-blue-600 dark:bg-[#007acc] h-full rounded"
                  :style="{
                    width: bureau.total > 0 ? `${Math.round((bureau.open / bureau.total) * 100)}%` : '0%',
                  }"
                />
              </div>
              <span class="text-xs font-semibold text-slate-800 dark:text-white w-8 text-right tabular-nums">
                {{ bureau.total }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Institutional Oversight Links -->
      <div class="rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4.5 flex flex-col justify-between">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-white border-b border-slate-100 dark:border-[#2d2d2d] pb-3">
            Institutional Oversight
          </h2>
          <p class="text-xs text-slate-600 dark:text-[#858585] mt-2.5 leading-relaxed">
            Search any college to view all complaints filed against it regardless of the receiving bureau.
          </p>

          <div class="mt-3.5 space-y-2">
            <router-link
              to="/institutions"
              class="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-[#2d2d2d] hover:border-slate-300 dark:hover:border-[#3e3e42] bg-slate-50 dark:bg-[#1e1e1e] hover:bg-white dark:hover:bg-[#2a2d2e] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-[#cccccc]">
                <Building class="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:text-[#858585] dark:group-hover:text-white" aria-hidden="true" />
                Institutions Directory
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 dark:text-[#858585]" aria-hidden="true" />
            </router-link>

            <router-link
              to="/overlaps"
              class="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-[#2d2d2d] hover:border-slate-300 dark:hover:border-[#3e3e42] bg-slate-50 dark:bg-[#1e1e1e] hover:bg-white dark:hover:bg-[#2a2d2e] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-[#cccccc]">
                <GitCompare class="w-4 h-4 text-amber-600 dark:text-[#cca700]" aria-hidden="true" />
                Overlap Review Queue
              </div>
              <span class="rounded bg-amber-100 dark:bg-[#4d3800] text-amber-800 dark:text-[#cca700] px-1.5 py-0.5 text-xs font-semibold tabular-nums">
                {{ kpis.unreviewed_overlaps }}
              </span>
            </router-link>

            <router-link
              to="/imports"
              class="flex items-center justify-between p-2.5 rounded border border-slate-200 dark:border-[#2d2d2d] hover:border-slate-300 dark:hover:border-[#3e3e42] bg-slate-50 dark:bg-[#1e1e1e] hover:bg-white dark:hover:bg-[#2a2d2e] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-[#cccccc]">
                <FileText class="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:text-[#858585] dark:group-hover:text-white" aria-hidden="true" />
                Import Case Batch
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 dark:text-[#858585]" aria-hidden="true" />
            </router-link>
          </div>
        </div>

        <div class="mt-4 rounded bg-slate-50 dark:bg-[#1e1e1e] p-2.5 border border-slate-100 dark:border-[#2d2d2d] text-xs text-slate-500 dark:text-[#858585]">
          Transfers and coordination notes are saved in the immutable audit log.
        </div>
      </div>
    </div>

    <!-- Recent Complaints Table -->
    <div class="rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] overflow-hidden">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-[#2d2d2d] px-5 py-3.5">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            Recent Complaints
          </h2>
          <p class="text-xs text-slate-500 dark:text-[#858585] mt-0.5">
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
            <tr class="border-b border-slate-200 dark:border-[#2d2d2d] bg-slate-50 dark:bg-[#2d2d2d] text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#858585]">
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
          <tbody class="divide-y divide-slate-100 dark:divide-[#2d2d2d] text-xs">
            <tr
              v-for="comp in recentComplaints"
              :key="comp.id"
              class="hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition-colors"
            >
              <!-- Case Number -->
              <td class="py-3 px-4 font-mono font-medium text-slate-900 dark:text-[#cccccc] whitespace-nowrap">
                <router-link
                  :to="`/complaints/${comp.id}`"
                  class="text-blue-600 hover:underline hover:text-blue-800 dark:text-[#4fc1ff] dark:hover:text-[#9cdcfe]"
                >
                  {{ comp.case_number }}
                </router-link>
                <div v-if="comp.external_reference" class="text-xs text-slate-400 dark:text-[#858585] font-sans">
                  Ref: {{ comp.external_reference }}
                </div>
              </td>

              <!-- Institution -->
              <td class="py-3 px-4 max-w-xs">
                <router-link
                  :to="`/institutions/${comp.institution_id}`"
                  class="font-medium text-slate-900 dark:text-[#cccccc] hover:text-blue-600 dark:hover:text-[#4fc1ff] line-clamp-1"
                >
                  {{ comp.institution_name }}
                </router-link>
                <div class="text-xs text-slate-400 dark:text-[#858585] font-mono">
                  {{ comp.institution_code }} · {{ comp.institution_state }}
                </div>
              </td>

              <!-- Bureau -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-[#1e1e1e] text-slate-700 dark:text-[#cccccc] border border-slate-200 dark:border-[#3e3e42]">
                  {{ comp.current_bureau_code }}
                </span>
              </td>

              <!-- Category -->
              <td class="py-3 px-4 max-w-[180px] truncate text-slate-600 dark:text-[#858585]" :title="comp.category">
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
                        : 'text-slate-600 dark:text-[#cccccc]',
                    ]"
                  >
                    {{ comp.due_at ? comp.due_at.slice(0, 10) : 'N/A' }}
                  </span>
                  <span
                    v-if="comp.is_overdue"
                    class="rounded bg-red-600 dark:bg-[#f14c4c] text-white text-[10px] font-bold px-1 uppercase"
                  >
                    OVERDUE
                  </span>
                </div>
              </td>

              <!-- Action Link -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <router-link
                  :to="`/complaints/${comp.id}`"
                  class="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-[#cccccc] dark:hover:text-white"
                >
                  Open
                  <ArrowRight class="w-3 h-3" aria-hidden="true" />
                </router-link>
              </td>
            </tr>

            <tr v-if="recentComplaints.length === 0">
              <td colspan="8" class="py-8 text-center text-xs text-slate-400 dark:text-[#858585]">
                No complaint records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
