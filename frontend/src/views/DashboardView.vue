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
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Executive Monitoring Dashboard
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Consolidated real-time operational metrics across all AICTE Bureaus and Cells
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          @click="loadDashboardData"
        >
          <RefreshCw :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" />
          Refresh Metrics
        </button>

        <router-link
          v-if="!authStore.isSeniorAuthority"
          to="/complaints?action=new"
          class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
        >
          <PlusCircle class="w-3.5 h-3.5" />
          Lodge Complaint
        </router-link>
      </div>
    </div>

    <!-- Urgent Alerts Banner: Cross-Bureau Overlaps -->
    <div
      v-if="kpis.unreviewed_overlaps > 0"
      class="rounded-xl border border-amber-300 bg-amber-50/90 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
          <GitCompare class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-xs font-bold text-amber-950 uppercase tracking-wider">
            Cross-Bureau Overlap Action Required
          </h4>
          <p class="text-xs text-amber-900 mt-0.5">
            {{ kpis.unreviewed_overlaps }} potential overlapping case pairs flagged between different Bureaus concerning the same institutions.
          </p>
        </div>
      </div>
      <router-link
        to="/overlaps"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-amber-700 transition"
      >
        Review Overlap Queue
        <ArrowRight class="w-3.5 h-3.5" />
      </router-link>
    </div>

    <!-- Urgent Alerts Banner: Overdue Cases -->
    <div
      v-if="kpis.overdue_cases > 0"
      class="rounded-xl border border-red-300 bg-red-50/90 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg bg-red-100 text-red-800 mt-0.5">
          <AlertTriangle class="w-5 h-5" />
        </div>
        <div>
          <h4 class="text-xs font-bold text-red-950 uppercase tracking-wider">
            Critical Compliance: Overdue Complaints
          </h4>
          <p class="text-xs text-red-900 mt-0.5">
            {{ kpis.overdue_cases }} active complaints have exceeded their statutory response deadlines and require regulatory escalation.
          </p>
        </div>
      </div>
      <router-link
        to="/complaints?is_overdue=true"
        class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-red-700 transition"
      >
        View Overdue Complaints
        <ArrowRight class="w-3.5 h-3.5" />
      </router-link>
    </div>

    <!-- KPIs Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
      <StatCard
        title="Total Cases"
        :value="kpis.total_complaints"
        subtitle="Registered in system"
        :loading="loading"
      />
      <StatCard
        title="Open Cases"
        :value="kpis.open_cases"
        variant="info"
        subtitle="In active pipeline"
        :loading="loading"
      />
      <StatCard
        title="Action Required"
        :value="kpis.action_required"
        variant="warning"
        subtitle="Awaiting response"
        :loading="loading"
      />
      <StatCard
        title="Overdue"
        :value="kpis.overdue_cases"
        variant="danger"
        subtitle="Exceeded deadline"
        :loading="loading"
      />
      <StatCard
        title="Escalated"
        :value="kpis.escalated_cases"
        subtitle="Senior scrutiny"
        :loading="loading"
      />
      <StatCard
        title="Disposed"
        :value="kpis.disposed_cases"
        variant="success"
        subtitle="Resolved with audit"
        :loading="loading"
      />
      <StatCard
        title="Pending Overlaps"
        :value="kpis.unreviewed_overlaps"
        variant="warning"
        subtitle="Awaiting review"
        :loading="loading"
      />
    </div>

    <!-- Two-Column Section: Bureau Workload & Quick Links -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Bureau Distribution Card -->
      <div class="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800">
              Departmental Workload Breakdown
            </h3>
            <p class="text-[11px] text-slate-500">
              Active vs Disposed case distribution by AICTE Bureau
            </p>
          </div>
          <router-link to="/reports" class="text-xs font-semibold text-blue-600 hover:text-blue-800">
            Full Analytics →
          </router-link>
        </div>

        <div class="mt-4 space-y-3">
          <div
            v-for="bureau in bureauWorkload"
            :key="bureau.bureau_id"
            class="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-7 w-12 items-center justify-center rounded bg-slate-900 text-[11px] font-bold text-amber-400">
                {{ bureau.code }}
              </span>
              <div>
                <p class="text-xs font-semibold text-slate-800">{{ bureau.name }}</p>
                <p class="text-[10px] text-slate-400">
                  {{ bureau.open }} Open • {{ bureau.disposed }} Disposed
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-32 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                <div
                  class="bg-blue-600 h-full rounded-full"
                  :style="{
                    width: bureau.total > 0 ? `${Math.round((bureau.open / bureau.total) * 100)}%` : '0%',
                  }"
                />
              </div>
              <span class="text-xs font-bold text-slate-800 w-8 text-right">
                {{ bureau.total }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Coordination Protocols Box -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle flex flex-col justify-between">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Institutional Oversight
          </h3>
          <p class="text-xs text-slate-600 mt-3 leading-relaxed">
            The platform provides immediate visibility into multiple complaints concerning a single college, regardless of which Bureau received them.
          </p>

          <div class="mt-4 space-y-2.5">
            <router-link
              to="/institutions"
              class="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition group"
            >
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Building class="w-4 h-4 text-slate-500 group-hover:text-slate-900" />
                Institutions Registry
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
            </router-link>

            <router-link
              to="/overlaps"
              class="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition group"
            >
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <GitCompare class="w-4 h-4 text-amber-600" />
                Overlap Review Queue
              </div>
              <span class="rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px] font-bold">
                {{ kpis.unreviewed_overlaps }}
              </span>
            </router-link>

            <router-link
              to="/imports"
              class="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white transition group"
            >
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <FileText class="w-4 h-4 text-slate-500 group-hover:text-slate-900" />
                Ingest CSV Batch
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900" />
            </router-link>
          </div>
        </div>

        <div class="mt-5 rounded-lg bg-slate-50 p-3 border border-slate-100 text-[11px] text-slate-500">
          <span class="font-semibold text-slate-700">Security Rule:</span> Cross-bureau transfers are audited with immutable timestamp records.
        </div>
      </div>
    </div>

    <!-- Complaints Dense Table -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
            Recent Institutional Cases
          </h3>
          <p class="text-[11px] text-slate-500 mt-0.5">
            Real-time feed of active and pending cases across Bureaus
          </p>
        </div>

        <router-link
          to="/complaints"
          class="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
        >
          View all complaints ({{ kpis.total_complaints }}) →
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th class="py-3 px-4">Case Number</th>
              <th class="py-3 px-4">Institution</th>
              <th class="py-3 px-4">Bureau</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Priority</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Due Date</th>
              <th class="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="comp in recentComplaints"
              :key="comp.id"
              class="hover:bg-slate-50/80 transition"
            >
              <!-- Case Number -->
              <td class="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                <router-link
                  :to="`/complaints/${comp.id}`"
                  class="text-blue-600 hover:underline hover:text-blue-800"
                >
                  {{ comp.case_number }}
                </router-link>
                <div v-if="comp.external_reference" class="text-[10px] text-slate-400 font-sans">
                  Ref: {{ comp.external_reference }}
                </div>
              </td>

              <!-- Institution -->
              <td class="py-3 px-4 max-w-xs">
                <router-link
                  :to="`/institutions/${comp.institution_id}`"
                  class="font-medium text-slate-900 hover:text-blue-600 line-clamp-1"
                >
                  {{ comp.institution_name }}
                </router-link>
                <div class="text-[10px] text-slate-400 font-mono">
                  {{ comp.institution_code }} • {{ comp.institution_state }}
                </div>
              </td>

              <!-- Bureau -->
              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {{ comp.current_bureau_code }}
                </span>
              </td>

              <!-- Category -->
              <td class="py-3 px-4 max-w-[180px] truncate text-slate-600" :title="comp.category">
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
                        ? 'text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200'
                        : 'text-slate-600',
                    ]"
                  >
                    {{ comp.due_at ? comp.due_at.slice(0, 10) : 'N/A' }}
                  </span>
                  <span
                    v-if="comp.is_overdue"
                    class="rounded bg-red-600 text-white text-[9px] font-black px-1 uppercase"
                  >
                    OVERDUE
                  </span>
                </div>
              </td>

              <!-- Action Link -->
              <td class="py-3 px-4 text-right whitespace-nowrap">
                <router-link
                  :to="`/complaints/${comp.id}`"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  Open
                  <ArrowRight class="w-3 h-3" />
                </router-link>
              </td>
            </tr>

            <tr v-if="recentComplaints.length === 0">
              <td colspan="8" class="py-8 text-center text-xs text-slate-400">
                No complaint records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
