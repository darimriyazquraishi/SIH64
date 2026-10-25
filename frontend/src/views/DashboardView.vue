<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import DemostackIcon from '@/components/demostack/DemostackIcon.vue'
import type { KPIs, Complaint } from '@/types'
import {
  GitCompare,
  Building2,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  X,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(true)
const isTipsVisible = ref(true)
const tipsScrollRef = ref<HTMLDivElement | null>(null)

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
    description: 'Review duplicate filings and multi-forum petitions across 6 central bureaus',
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

const bureauResources = [
  {
    code: 'PGRC',
    name: 'Public Grievance Redressal',
    description: 'Student, faculty, and administrative grievance intake',
    iconName: 'FigLightbulbIcon',
    folderColor: '#007acc',
  },
  {
    code: 'AB',
    name: 'Approval Bureau',
    description: 'Institutional affiliation, EOA, faculty deficiencies',
    iconName: 'FigGraduationIcon',
    folderColor: '#1e3a8a',
  },
  {
    code: 'PAPB',
    name: 'Policy & Planning',
    description: 'Faculty pay scale norms and governance standards',
    iconName: 'FigSparkleIcon',
    folderColor: '#0369a1',
  },
  {
    code: 'RPC',
    name: 'Ragging Prevention Cell',
    description: 'Anti-ragging statutory compliance and FIR tracking',
    iconName: 'FigPlayIcon',
    folderColor: '#0f766e',
  },
]

function scrollTipsRight() {
  if (tipsScrollRef.value) {
    tipsScrollRef.value.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }
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
  <div class="mx-auto w-full max-w-6xl space-y-10">
    <!-- Top Action Cards Grid (Demostack 3-Column Layout) -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        v-for="action in actionCards"
        :key="action.title"
        class="group flex w-full flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-5 transition-all hover:bg-slate-50 dark:hover:bg-[#2a2d2e] hover:border-slate-300 dark:hover:border-[#3e3e42] cursor-pointer"
        @click="router.push(action.route)"
      >
        <div :class="['relative flex size-12 items-center justify-center overflow-hidden rounded-xl shadow-sm', action.badgeClass]">
          <DemostackIcon :name="action.iconName" class-name="size-6 text-current" />
        </div>

        <div class="flex w-full flex-col gap-1.5">
          <p class="font-medium text-sm text-slate-900 dark:text-[#d4d4d4] group-hover:text-blue-600 dark:group-hover:text-[#4fc1ff] transition-colors">
            {{ action.title }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898] leading-relaxed [text-wrap:pretty]">
            {{ action.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Demostack Operational Guidance Carousel (Demostack Tips) -->
    <section v-if="isTipsVisible" class="flex flex-col gap-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-lg font-semibold tracking-tight text-slate-900 dark:text-[#d4d4d4]">
            Operational Protocols & Guidance
          </h2>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-1 max-w-prose [text-wrap:pretty]">
            Standardized operational procedures for cross-bureau coordination, statutory escalation SLAs, and judicial proceedings
          </p>
        </div>

        <button
          type="button"
          class="h-auto shrink-0 self-start rounded-full border border-slate-200 dark:border-[#3e3e42] bg-slate-50 dark:bg-[#252526] px-4 py-2 text-xs font-medium text-slate-700 dark:text-[#cccccc] hover:bg-slate-100 dark:hover:bg-[#2e2e30] transition flex items-center gap-1.5"
          @click="isTipsVisible = false"
        >
          <span>Dismiss</span>
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="relative overflow-hidden">
        <div
          ref="tipsScrollRef"
          class="flex gap-5 overflow-x-auto scroll-smooth pb-2 no-scrollbar px-3 pt-1"
        >
          <article
            v-for="tip in operationalProtocols"
            :key="tip.title"
            class="group flex w-72 shrink-0 flex-col items-start gap-3 cursor-pointer"
          >
            <div class="relative aspect-[3/2] w-72 overflow-hidden rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-slate-100 dark:bg-[#252526] p-4 flex flex-col justify-between shadow-sm">
              <div class="flex items-center justify-between">
                <span class="rounded bg-slate-200 dark:bg-[#1c1c1c] px-2 py-0.5 text-xs font-mono font-semibold text-slate-800 dark:text-[#cccccc] tracking-wider border border-slate-300 dark:border-[#383838]">
                  {{ tip.category }}
                </span>
                <span class="size-2 rounded-full" :style="{ backgroundColor: tip.accentColor }" />
              </div>
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-800 dark:text-[#d4d4d4]">AICTE Core Standard</p>
                <div class="h-1 w-8 rounded-full" :style="{ backgroundColor: tip.accentColor }" />
              </div>
            </div>

            <div class="flex w-full flex-col gap-1">
              <h3 class="font-medium text-xs text-slate-900 dark:text-[#d4d4d4] group-hover:text-blue-600 dark:group-hover:text-[#4fc1ff] transition-colors">
                {{ tip.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-[#989898] leading-relaxed [text-wrap:pretty]">
                {{ tip.description }}
              </p>
            </div>
          </article>
        </div>

        <button
          type="button"
          class="rounded-full size-9 bg-white dark:bg-[#252526] border border-slate-200 dark:border-[#3e3e42] shadow-md flex items-center justify-center text-slate-700 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2d2d2d] absolute right-2 top-16 z-10 transition"
          aria-label="Scroll right"
          @click="scrollTipsRight"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </section>

    <!-- Key Metrics Row (Demostack Minimal KPI Layout) -->
    <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-[#989898]">
          <span>Total Complaints</span>
          <FileText class="w-4 h-4 text-slate-400 dark:text-[#989898]" />
        </div>
        <div class="mt-3">
          <p class="text-2xl font-semibold text-slate-900 dark:text-[#d4d4d4] font-mono">
            {{ kpis.total_complaints }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
            {{ kpis.open_cases }} currently active
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-[#989898]">
          <span>Cross-Bureau Overlaps</span>
          <GitCompare class="w-4 h-4 text-amber-500 dark:text-[#cca700]" />
        </div>
        <div class="mt-3">
          <p class="text-2xl font-semibold text-amber-600 dark:text-[#cca700] font-mono">
            {{ kpis.unreviewed_overlaps }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
            Flagged for joint review
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-[#989898]">
          <span>Disposed Cases</span>
          <CheckCircle2 class="w-4 h-4 text-emerald-500 dark:text-[#89d185]" />
        </div>
        <div class="mt-3">
          <p class="text-2xl font-semibold text-emerald-600 dark:text-[#89d185] font-mono">
            {{ kpis.disposed_cases }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
            Resolved within SLA
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between text-xs text-slate-500 dark:text-[#989898]">
          <span>Statutory Overdue</span>
          <Clock class="w-4 h-4 text-red-500 dark:text-[#f48771]" />
        </div>
        <div class="mt-3">
          <p class="text-2xl font-semibold text-red-600 dark:text-[#f48771] font-mono">
            {{ kpis.overdue_cases }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
            Exceeded statutory SLA
          </p>
        </div>
      </div>
    </section>

    <!-- Two-Column Split (Resources & Priority Tasks) -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left: Demostack Resources (Autonomous Bureaus & Cells) -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 dark:text-[#d4d4d4]">
            Autonomous Bureaus & Cells
          </h2>
          <router-link to="/reports" class="text-xs font-medium text-blue-600 dark:text-[#4fc1ff] hover:underline flex items-center gap-1">
            Workload Analytics <ArrowRight class="w-3 h-3" />
          </router-link>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div
            v-for="bureau in bureauResources"
            :key="bureau.code"
            class="group flex flex-col items-start gap-2.5 rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-3.5 hover:border-slate-300 dark:hover:border-[#3e3e42] transition cursor-pointer"
            @click="router.push(`/complaints?bureau=${bureau.code}`)"
          >
            <div class="bg-slate-100 dark:bg-[#1c1c1c] flex h-24 w-full items-center justify-center overflow-hidden rounded-xl">
              <div class="relative flex size-16 items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-y-1">
                <DemostackIcon name="BgFolderVector" class-name="absolute inset-0 size-full" :fill0="bureau.folderColor" />
                <DemostackIcon :name="bureau.iconName" class-name="relative z-10 mt-3 size-5 text-white transition-transform duration-200 group-hover:scale-110" />
              </div>
            </div>
            <div class="w-full">
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-xs text-slate-900 dark:text-[#d4d4d4] group-hover:text-blue-600 dark:group-hover:text-[#4fc1ff] transition-colors truncate">
                  {{ bureau.code }}
                </h3>
                <span class="text-xs text-slate-400 dark:text-[#989898] font-mono">BUREAU</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-[#989898] truncate mt-0.5">
                {{ bureau.name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Demostack Inspiration / Priority Tasks -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 dark:text-[#d4d4d4]">
            Urgent Operational Cases
          </h2>
          <router-link to="/complaints" class="text-xs font-medium text-blue-600 dark:text-[#4fc1ff] hover:underline flex items-center gap-1">
            View All <ArrowRight class="w-3 h-3" />
          </router-link>
        </div>

        <div class="flex flex-col gap-2.5">
          <div
            v-for="c in recentComplaints.slice(0, 4)"
            :key="c.id"
            class="group flex items-center justify-between rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-3.5 hover:border-slate-300 dark:hover:border-[#3e3e42] transition cursor-pointer"
            @click="router.push(`/complaints/${c.id}`)"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="size-8 rounded-xl bg-slate-100 dark:bg-[#1c1c1c] flex items-center justify-center shrink-0 border border-slate-200 dark:border-[#2d2d2d]">
                <FileText class="w-4 h-4 text-slate-600 dark:text-[#cccccc]" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-semibold text-blue-600 dark:text-[#4fc1ff]">
                    {{ c.case_number }}
                  </span>
                  <PriorityBadge :priority="c.priority" size="sm" />
                </div>
                <p class="text-xs text-slate-700 dark:text-[#cccccc] truncate mt-0.5">
                  {{ c.institution_name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0 ml-2">
              <StatusBadge :status="c.status" size="sm" />
              <ArrowUpRight class="w-4 h-4 text-slate-400 dark:text-[#989898] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600 dark:group-hover:text-[#4fc1ff]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Case Table Section (Demostack Dense Operational Records) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-[#d4d4d4]">
            Recent Grievance Filings
          </h2>
          <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
            Live multi-bureau intake feed with automated SLA monitoring
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-[#3e3e42] bg-white dark:bg-[#252526] px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2d2d2d] transition"
          @click="loadDashboardData"
        >
          <RefreshCw :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" />
          <span>Refresh</span>
        </button>
      </div>

      <div class="rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-[#2d2d2d] bg-slate-50 dark:bg-[#1c1c1c] text-xs font-semibold text-slate-600 dark:text-[#cccccc]">
                <th class="py-3 px-4">Case #</th>
                <th class="py-3 px-4">Institution</th>
                <th class="py-3 px-4">Subject</th>
                <th class="py-3 px-4">Bureau</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-[#2d2d2d] text-xs">
              <tr
                v-for="c in recentComplaints"
                :key="c.id"
                class="hover:bg-slate-50/80 dark:hover:bg-[#2a2d2e] transition cursor-pointer"
                @click="router.push(`/complaints/${c.id}`)"
              >
                <td class="py-3 px-4 font-mono font-medium text-blue-600 dark:text-[#4fc1ff] whitespace-nowrap">
                  {{ c.case_number }}
                </td>
                <td class="py-3 px-4 max-w-[200px] truncate text-slate-900 dark:text-[#cccccc]" :title="c.institution_name">
                  {{ c.institution_name }}
                </td>
                <td class="py-3 px-4 max-w-[220px] truncate text-slate-600 dark:text-[#989898]" :title="c.subject">
                  {{ c.subject }}
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <span class="rounded bg-slate-100 dark:bg-[#1c1c1c] border border-slate-200 dark:border-[#383838] px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-[#cccccc]">
                    {{ c.current_bureau_code }}
                  </span>
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <PriorityBadge :priority="c.priority" size="sm" />
                </td>
                <td class="py-3 px-4 whitespace-nowrap">
                  <StatusBadge :status="c.status" size="sm" />
                </td>
                <td class="py-3 px-4 text-right whitespace-nowrap">
                  <span class="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-[#cccccc] group-hover:text-blue-600">
                    View
                    <ArrowRight class="w-3 h-3" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
