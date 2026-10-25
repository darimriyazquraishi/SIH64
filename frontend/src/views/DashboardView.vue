<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/components/StatCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import DemostackIcon from '@/components/demostack/DemostackIcon.vue'
import type { KPIs, Complaint } from '@/types'
import {
  AlertTriangle,
  GitCompare,
  Building,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  X,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(true)
const isProtocolsVisible = ref(true)

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

// Demostack Quick Action Cards
const actionCards = [
  {
    title: 'Lodge Institutional Grievance',
    description: 'Record an intake dossier and assign statutory SLA deadlines in under 2 minutes',
    route: '/complaints?action=new',
    iconName: 'DashboardFolderPlusIcon',
    badgeClass: 'bg-slate-900 dark:bg-[#007acc] text-white',
  },
  {
    title: 'Cross-Bureau Overlap Engine',
    description: 'Review duplicate filings and multi-forum petitions across central bureaus',
    route: '/overlaps',
    iconName: 'DashboardVideoIcon',
    badgeClass: 'bg-slate-800 dark:bg-[#252526] text-amber-500 dark:text-[#cca700] border border-slate-700 dark:border-[#3e3e42]',
  },
  {
    title: 'Explore Institution Directory',
    description: 'Search 24,000+ AICTE-approved colleges, aliases, and regulatory inspection profiles',
    route: '/institutions',
    iconName: 'DashboardImagesIcon',
    badgeClass: 'bg-slate-800 dark:bg-[#252526] text-emerald-500 dark:text-[#89d185] border border-slate-700 dark:border-[#3e3e42]',
  },
]

// Demostack Operational Protocols Guidance
const operationalProtocols = [
  {
    title: 'Cross-Bureau De-duplication Protocol',
    category: 'DEDUPLICATION',
    description: 'Similarity matching across Permanent IDs, aliases, and court docket references.',
    accentColor: '#007acc',
  },
  {
    title: 'Statutory SLA Escalation Timelines',
    category: 'SLA COMPLIANCE',
    description: 'Critical grievances trigger automated alerts and Member Secretary review upon statutory breaches.',
    accentColor: '#c72e2e',
  },
  {
    title: 'Institutional Aliasing Engine',
    category: 'CANONICAL RESOLUTION',
    description: 'Resolves acronyms, legacy campus renames, and polytechnic wings to single legal entities.',
    accentColor: '#89d185',
  },
  {
    title: 'Court Writs & Inquiries Coordination',
    category: 'LEGAL COORDINATION',
    description: 'Synchronize pending High Court writ responses with regional bureau inspection records.',
    accentColor: '#cca700',
  },
]

// Demostack Bureau Resource Definitions with 3D Folders
const bureauResources = [
  {
    code: 'PGRC',
    name: 'Public Grievance Redressal Cell',
    description: 'Student, faculty, and administrative grievance\u00A0intake',
    iconName: 'FigLightbulbIcon',
    folderColor: '#007acc',
  },
  {
    code: 'AB',
    name: 'Approval Bureau',
    description: 'Institutional affiliation, EOA, and faculty\u00A0deficiencies',
    iconName: 'FigGraduationIcon',
    folderColor: '#1e3a8a',
  },
  {
    code: 'RPC',
    name: 'Ragging Prevention Cell',
    description: 'Anti-ragging statutory compliance and FIR\u00A0tracking',
    iconName: 'FigPlayIcon',
    folderColor: '#0f766e',
  },
  {
    code: 'PAPB',
    name: 'Policy & Academic Planning',
    description: 'Faculty pay scale norms and governance\u00A0standards',
    iconName: 'FigSparkleIcon',
    folderColor: '#0369a1',
  },
  {
    code: 'FAB',
    name: 'Finance & Accounts Bureau',
    description: 'Grant disbursements and institutional financial\u00A0audits',
    iconName: 'DashboardFolderPlusIcon',
    folderColor: '#d97706',
  },
]

function getBureauStats(code: string) {
  const found = bureauWorkload.value.find((b) => b.code === code)
  return found || { open: 0, disposed: 0, total: 0 }
}

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
    <!-- Operations Header (Original Design) -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Operations Dashboard
        </h1>
        <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
          Active cases, statutory deadlines, and bureau workloads
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

    <!-- Urgent Alerts: Cross-Bureau Overlaps (Original Design) -->
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

    <!-- Urgent Alerts: Overdue Cases (Original Design) -->
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
        class="inline-flex items-center justify-center gap-1.5 rounded bg-red-700 dark:bg-[#c72e2e] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-red-800 dark:hover:bg-[#b02222] transition-colors"
      >
        View Overdue Cases
        <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
      </router-link>
    </div>

    <!-- Demostack Component: 3 Quick Action Cards -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        v-for="action in actionCards"
        :key="action.title"
        class="group flex w-full flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 transition-all hover:bg-slate-50 dark:hover:bg-[#2a2d2e] hover:border-slate-300 dark:hover:border-[#3e3e42] cursor-pointer"
        @click="router.push(action.route)"
      >
        <div :class="['relative flex size-10 items-center justify-center overflow-hidden rounded-lg shadow-sm', action.badgeClass]">
          <DemostackIcon :name="action.iconName" class-name="size-5 text-current" />
        </div>

        <div class="flex w-full flex-col gap-1">
          <p class="font-medium text-xs text-slate-900 dark:text-[#d4d4d4] group-hover:text-blue-600 dark:group-hover:text-[#4fc1ff] transition-colors">
            {{ action.title }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898] leading-relaxed [text-wrap:pretty]">
            {{ action.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Key Performance Indicators (Original StatCard 7-Metric Grid) -->
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

    <!-- Demostack Component: Operational Protocols & Guidance -->
    <section v-if="isProtocolsVisible" class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            Operational Protocols & Coordination Guidance
          </h2>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5 [text-wrap:pretty]">
            Standardized operational procedures for cross-bureau coordination, statutory escalation SLAs, and judicial proceedings
          </p>
        </div>

        <button
          type="button"
          class="h-auto shrink-0 rounded-full border border-slate-200 dark:border-[#3e3e42] bg-white dark:bg-[#252526] px-3 py-1 text-xs font-medium text-slate-700 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2e2e30] transition flex items-center gap-1.5"
          @click="isProtocolsVisible = false"
        >
          <span>Dismiss</span>
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="protocol in operationalProtocols"
          :key="protocol.title"
          class="rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#3e3e42] transition shadow-sm"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="rounded bg-slate-100 dark:bg-[#1c1c1c] px-2 py-0.5 text-xs font-mono font-semibold text-slate-800 dark:text-[#cccccc] tracking-wider border border-slate-200 dark:border-[#383838]">
                {{ protocol.category }}
              </span>
              <span class="size-2 rounded-full" :style="{ backgroundColor: protocol.accentColor }" />
            </div>
            <h3 class="font-medium text-xs text-slate-900 dark:text-[#d4d4d4] [text-wrap:balance]">
              {{ protocol.title }}
            </h3>
          </div>
          <p class="text-xs text-slate-500 dark:text-[#989898] leading-relaxed mt-2 [text-wrap:pretty]">
            {{ protocol.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Two-Column Section: Bureau Workload & Quick Navigation (Original Layout Enhanced with Demostack Folders) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- Autonomous Bureaus & Workload Distribution Card -->
      <div class="lg:col-span-2 rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-5">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#2d2d2d] pb-3">
          <div>
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Autonomous Bureaus & Workload Distribution
            </h2>
            <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
              Active intake, compliance jurisdiction, and live case resolution across bureaus
            </p>
          </div>
          <router-link
            to="/reports"
            class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-[#4fc1ff] dark:hover:underline flex items-center gap-1"
          >
            Detailed Reports
            <ArrowRight class="w-3 h-3" />
          </router-link>
        </div>

        <div class="mt-4 divide-y divide-slate-100 dark:divide-[#2d2d2d]">
          <div
            v-for="bureau in bureauResources"
            :key="bureau.code"
            class="group flex items-center justify-between py-3 px-2 rounded hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition-colors cursor-pointer"
            @click="router.push(`/complaints?bureau=${bureau.code}`)"
          >
            <!-- Left: Demostack 3D Folder Vector + Bureau Details -->
            <div class="flex items-center gap-3.5">
              <div class="relative flex size-10 shrink-0 items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                <DemostackIcon name="BgFolderVector" class-name="absolute inset-0 size-full" :fill0="bureau.folderColor" />
                <DemostackIcon :name="bureau.iconName" class-name="relative z-10 mt-1.5 size-3.5 text-white" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono font-semibold text-xs text-slate-900 dark:text-white">
                    {{ bureau.code }}
                  </span>
                  <span class="text-xs text-slate-500 dark:text-[#989898]">
                    — {{ bureau.name }}
                  </span>
                </div>
                <p class="text-xs text-slate-400 dark:text-[#989898] mt-0.5 [text-wrap:pretty]">
                  {{ bureau.description }}
                </p>
              </div>
            </div>

            <!-- Right: Workload Stats & Progress Bar -->
            <div class="flex items-center gap-4">
              <div class="text-right hidden sm:block">
                <span class="text-xs font-medium text-slate-700 dark:text-[#cccccc]">
                  {{ getBureauStats(bureau.code).open }} open
                </span>
                <span class="text-xs text-slate-400 dark:text-[#989898]">
                  / {{ getBureauStats(bureau.code).disposed }} disposed
                </span>
              </div>
              <div class="w-24 bg-slate-100 dark:bg-[#1e1e1e] h-2 rounded overflow-hidden hidden md:block border border-slate-200 dark:border-[#383838]">
                <div
                  class="bg-blue-600 dark:bg-[#007acc] h-full rounded"
                  :style="{
                    width: getBureauStats(bureau.code).total > 0
                      ? `${Math.round((getBureauStats(bureau.code).open / getBureauStats(bureau.code).total) * 100)}%`
                      : '0%',
                  }"
                />
              </div>
              <span class="text-xs font-semibold text-slate-900 dark:text-white w-6 text-right tabular-nums">
                {{ getBureauStats(bureau.code).total }}
              </span>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 dark:text-[#989898] group-hover:text-blue-600 dark:group-hover:text-[#4fc1ff] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Institutional Oversight Links (Original Design) -->
      <div class="rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-5 flex flex-col justify-between">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#2d2d2d] pb-3">
            Institutional Oversight
          </h2>
          <p class="text-xs text-slate-600 dark:text-[#989898] mt-2.5 leading-relaxed [text-wrap:pretty]">
            Search any college to view all complaints filed against it regardless of the receiving bureau.
          </p>

          <div class="mt-4 divide-y divide-slate-100 dark:divide-[#2d2d2d]">
            <router-link
              to="/institutions"
              class="flex items-center justify-between py-3 px-1.5 rounded hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-[#cccccc]">
                <Building class="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:text-[#989898] dark:group-hover:text-white" aria-hidden="true" />
                Institutions Directory
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 dark:text-[#989898]" aria-hidden="true" />
            </router-link>

            <router-link
              to="/overlaps"
              class="flex items-center justify-between py-3 px-1.5 rounded hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition-colors group"
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
              class="flex items-center justify-between py-3 px-1.5 rounded hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition-colors group"
            >
              <div class="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-[#cccccc]">
                <FileText class="w-4 h-4 text-slate-500 group-hover:text-slate-900 dark:text-[#989898] dark:group-hover:text-white" aria-hidden="true" />
                Import Case Batch
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-slate-400 dark:text-[#989898]" aria-hidden="true" />
            </router-link>
          </div>
        </div>

        <p class="mt-4 pt-3 border-t border-slate-100 dark:border-[#2d2d2d] text-xs text-slate-500 dark:text-[#989898]">
          Transfers and coordination notes are recorded in the audit log.
        </p>
      </div>
    </div>

    <!-- Recent Complaints Table (Original Complete Design with Minimal Badges) -->
    <div class="rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] overflow-hidden">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-[#2d2d2d] px-5 py-3.5">
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
            Recent Complaints
          </h2>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
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
            <tr class="border-b border-slate-200 dark:border-[#2d2d2d] bg-slate-50 dark:bg-[#1c1c1c] text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#989898]">
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
                <div v-if="comp.external_reference" class="text-xs text-slate-400 dark:text-[#989898] font-sans">
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
                <div class="text-xs text-slate-400 dark:text-[#989898] font-mono">
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
              <td class="py-3 px-4 max-w-[180px] truncate text-slate-600 dark:text-[#989898]" :title="comp.category">
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
                  class="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-[#cccccc] dark:hover:text-white"
                >
                  Open
                  <ArrowRight class="w-3.5 h-3.5" aria-hidden="true" />
                </router-link>
              </td>
            </tr>

            <tr v-if="recentComplaints.length === 0">
              <td colspan="8" class="py-8 text-center text-xs text-slate-400 dark:text-[#989898]">
                No complaint records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
