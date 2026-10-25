<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import apiClient from '@/api/client'
import {
  BarChart3,
  Download,
  Filter,
  PieChart,
  Layers,
  MapPin,
  FileSpreadsheet,
} from 'lucide-vue-next'

const loading = ref(true)
const analytics = ref<any>({
  bureau_workload: [],
  status_distribution: {},
  priority_distribution: {},
  category_distribution: [],
  overlap_distribution: {},
  state_distribution: [],
})

const exportBureauId = ref<number | ''>('')
const exportStatus = ref('')
const exportPriority = ref('')

async function loadAnalytics() {
  loading.value = true
  try {
    const res = await apiClient.get('/reports/analytics')
    analytics.value = res.data
  } catch (err) {
    console.error('Failed to load analytics:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnalytics()
})

function triggerCsvExport() {
  const params = new URLSearchParams()
  if (exportBureauId.value) params.append('bureau_id', String(exportBureauId.value))
  if (exportStatus.value) params.append('status', exportStatus.value)
  if (exportPriority.value) params.append('priority', exportPriority.value)

  // Use token in query or download via link
  window.open(`/api/v1/reports/export-csv?${params.toString()}`, '_blank')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-[#d4d4d4]">
          Reports
        </h1>
        <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
          Review complaint distribution, bureau workload, and export records
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded bg-slate-900 dark:bg-[#007acc] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-[#1177bb] transition"
        @click="triggerCsvExport"
      >
        <FileSpreadsheet class="w-3.5 h-3.5" />
        Export CSV
      </button>
    </div>

    <!-- Charts Row 1: Bureau Workload & Status Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Bureau Distribution -->
      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-5">
        <div class="border-b border-slate-100 dark:border-[#2d2d2d] pb-2.5 flex items-center justify-between">
          <h2 class="text-xs font-semibold text-slate-800 dark:text-[#cccccc] flex items-center gap-2">
            <Layers class="w-4 h-4 text-slate-500 dark:text-[#989898]" />
            Bureau Workload
          </h2>
          <span class="text-xs text-slate-400 dark:text-[#989898]">Open vs Total</span>
        </div>

        <div class="mt-4 space-y-4">
          <div
            v-for="b in analytics.bureau_workload"
            :key="b.bureau_id"
            class="space-y-1.5"
          >
            <div class="flex justify-between text-xs">
              <span class="font-medium text-slate-800 dark:text-[#cccccc]">
                {{ b.code }} — {{ b.name }}
              </span>
              <span class="font-mono text-slate-500 dark:text-[#989898]">
                {{ b.open }} open / {{ b.total }} total
              </span>
            </div>

            <div class="w-full bg-slate-100 dark:bg-[#1e1e1e] h-2.5 rounded-full overflow-hidden flex border dark:border-[#2d2d2d]">
              <div
                class="bg-[#4fc1ff] h-full"
                :style="{ width: b.total > 0 ? `${(b.open / b.total) * 100}%` : '0%' }"
                title="Active"
              />
              <div
                class="bg-[#89d185] h-full"
                :style="{ width: b.total > 0 ? `${(b.disposed / b.total) * 100}%` : '0%' }"
                title="Resolved"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Status Distribution -->
      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-5">
        <div class="border-b border-slate-100 dark:border-[#2d2d2d] pb-2.5 flex items-center justify-between">
          <h2 class="text-xs font-semibold text-slate-800 dark:text-[#cccccc] flex items-center gap-2">
            <PieChart class="w-4 h-4 text-slate-500 dark:text-[#989898]" />
            Status Breakdown
          </h2>
          <span class="text-xs text-slate-400 dark:text-[#989898]">All complaints</span>
        </div>

        <div class="mt-4 grid grid-cols-2 divide-x divide-y divide-slate-100 dark:divide-[#2d2d2d]">
          <div
            v-for="(count, status) in analytics.status_distribution"
            :key="status"
            class="p-3"
          >
            <p class="text-xs font-medium text-slate-500 dark:text-[#989898]">{{ status }}</p>
            <p class="text-xl font-semibold text-slate-900 dark:text-[#d4d4d4] mt-1 tabular-nums">{{ count }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2: Top Categories & Geographic States -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Categories -->
      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-5">
        <h2 class="text-xs font-semibold text-slate-800 dark:text-[#cccccc] border-b border-slate-100 dark:border-[#2d2d2d] pb-2.5 flex items-center gap-2">
          <BarChart3 class="w-4 h-4 text-slate-500 dark:text-[#989898]" />
          Complaints by Category
        </h2>

        <div class="mt-4 divide-y divide-slate-100 dark:divide-[#2d2d2d]">
          <div
            v-for="cat in analytics.category_distribution"
            :key="cat.category"
            class="flex items-center justify-between py-2.5 px-1"
          >
            <span class="text-xs font-medium text-slate-800 dark:text-[#cccccc] truncate max-w-xs">
              {{ cat.category }}
            </span>
            <span class="font-mono text-xs font-semibold text-amber-500 dark:text-[#cca700] tabular-nums">
              {{ cat.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- State Geographic Distribution -->
      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] p-5">
        <h2 class="text-xs font-semibold text-slate-800 dark:text-[#cccccc] border-b border-slate-100 dark:border-[#2d2d2d] pb-2.5 flex items-center gap-2">
          <MapPin class="w-4 h-4 text-slate-500 dark:text-[#989898]" />
          Complaints by State
        </h2>

        <div class="mt-4 divide-y divide-slate-100 dark:divide-[#2d2d2d]">
          <div
            v-for="st in analytics.state_distribution"
            :key="st.state"
            class="flex items-center justify-between py-2.5 px-1"
          >
            <span class="text-xs font-medium text-slate-800 dark:text-[#cccccc]">
              {{ st.state }}
            </span>
            <span class="font-mono text-xs font-semibold text-blue-600 dark:text-[#4fc1ff] tabular-nums">
              {{ st.count }} complaints
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
