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
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Executive Reports & Analytics
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Institutional complaint patterns, departmental resolution metrics, and authorized data exports
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
        @click="triggerCsvExport"
      >
        <FileSpreadsheet class="w-4 h-4" />
        Export Audit CSV
      </button>
    </div>

    <!-- Charts Row 1: Bureau Workload & Status Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Bureau Distribution -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers class="w-4 h-4 text-slate-600" />
            Case Distribution by AICTE Bureau
          </h3>
          <span class="text-[11px] text-slate-400">Total vs Active</span>
        </div>

        <div class="mt-4 space-y-4">
          <div
            v-for="b in analytics.bureau_workload"
            :key="b.bureau_id"
            class="space-y-1.5"
          >
            <div class="flex justify-between text-xs">
              <span class="font-semibold text-slate-800">
                {{ b.code }} — {{ b.name }}
              </span>
              <span class="font-mono text-slate-500">
                {{ b.open }} open / {{ b.total }} total
              </span>
            </div>

            <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
              <div
                class="bg-blue-600 h-full"
                :style="{ width: b.total > 0 ? `${(b.open / b.total) * 100}%` : '0%' }"
                title="Active Cases"
              />
              <div
                class="bg-emerald-500 h-full"
                :style="{ width: b.total > 0 ? `${(b.disposed / b.total) * 100}%` : '0%' }"
                title="Disposed Cases"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Status Distribution -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
        <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <PieChart class="w-4 h-4 text-slate-600" />
            Operational Case Status Breakdown
          </h3>
          <span class="text-[11px] text-slate-400">Active Pipeline</span>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div
            v-for="(count, status) in analytics.status_distribution"
            :key="status"
            class="p-3 rounded-lg border border-slate-100 bg-slate-50/70"
          >
            <p class="text-[11px] font-semibold text-slate-500">{{ status }}</p>
            <p class="text-xl font-bold text-slate-900 mt-1">{{ count }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2: Top Categories & Geographic States -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Categories -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <BarChart3 class="w-4 h-4 text-slate-600" />
          Leading Regulatory Violation Categories
        </h3>

        <div class="mt-4 space-y-3">
          <div
            v-for="cat in analytics.category_distribution"
            :key="cat.category"
            class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
          >
            <span class="text-xs font-medium text-slate-800 truncate max-w-xs">
              {{ cat.category }}
            </span>
            <span class="rounded bg-slate-900 px-2 py-0.5 text-xs font-bold text-amber-400">
              {{ cat.count }}
            </span>
          </div>
        </div>
      </div>

      <!-- State Geographic Distribution -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <MapPin class="w-4 h-4 text-slate-600" />
          Geographic Institutional Density (By State)
        </h3>

        <div class="mt-4 space-y-3">
          <div
            v-for="st in analytics.state_distribution"
            :key="st.state"
            class="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
          >
            <span class="text-xs font-medium text-slate-800">
              {{ st.state }}
            </span>
            <span class="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
              {{ st.count }} complaints
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
