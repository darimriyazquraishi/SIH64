<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiClient from '@/api/client'
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  History,
  ArrowRight,
} from 'lucide-vue-next'

const file = ref<File | null>(null)
const isDragging = ref(false)
const isPreviewing = ref(false)
const isCommitting = ref(false)
const previewData = ref<any>(null)
const previewError = ref<string | null>(null)
const commitResult = ref<any>(null)
const importHistory = ref<any[]>([])

async function loadHistory() {
  try {
    const res = await apiClient.get('/imports/history')
    importHistory.value = res.data.batches || []
  } catch (err) {
    // Ignore
  }
}

onMounted(() => {
  loadHistory()
})

function downloadTemplate() {
  window.open('/api/v1/imports/template', '_blank')
}

function handleFileDrop(e: DragEvent) {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    file.value = e.dataTransfer.files[0]
    previewFile()
  }
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
    previewFile()
  }
}

async function previewFile() {
  if (!file.value) return
  isPreviewing.value = true
  previewError.value = null
  commitResult.value = null

  try {
    const text = await file.value.text()
    const res = await apiClient.post('/imports/preview', text, {
      headers: { 'Content-Type': 'text/csv' }
    })
    previewData.value = res.data
  } catch (err: any) {
    previewError.value = err.response?.data?.error || 'Failed to parse CSV file. Ensure valid format.'
    previewData.value = null
  } finally {
    isPreviewing.value = false
  }
}

async function commitValidRows() {
  if (!previewData.value?.valid_rows || previewData.value.valid_rows.length === 0) return
  isCommitting.value = true

  try {
    const res = await apiClient.post('/imports/commit', {
      filename: file.value?.name || 'import.csv',
      valid_rows: previewData.value.valid_rows,
    })
    commitResult.value = res.data
    previewData.value = null
    file.value = null
    await loadHistory()
  } catch (err: any) {
    previewError.value = err.response?.data?.error || 'Failed to commit import records.'
  } finally {
    isCommitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          CSV Batch Import & Verification
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Safely ingest institutional complaint records with strict row-by-row pre-validation
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
        @click="downloadTemplate"
      >
        <Download class="w-3.5 h-3.5 text-slate-500" />
        Download Official CSV Template
      </button>
    </div>

    <!-- Success Feedback Banner -->
    <div
      v-if="commitResult"
      class="rounded-xl border border-emerald-300 bg-emerald-50 p-4 shadow-sm flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <CheckCircle2 class="w-5 h-5 text-emerald-600" />
        <div>
          <h4 class="text-xs font-bold text-emerald-950 uppercase">
            Batch Import Successfully Committed
          </h4>
          <p class="text-xs text-emerald-800 mt-0.5">
            {{ commitResult.committed_count }} complaint records committed to PostgreSQL. Automated overlap scan initiated!
          </p>
        </div>
      </div>
      <router-link
        to="/complaints"
        class="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
      >
        View Complaints →
      </router-link>
    </div>

    <!-- Upload Drag-and-Drop Area -->
    <div
      :class="[
        'rounded-xl border-2 border-dashed p-8 text-center transition flex flex-col items-center justify-center',
        isDragging
          ? 'border-blue-500 bg-blue-50/50'
          : 'border-slate-300 bg-white hover:border-slate-400'
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleFileDrop"
    >
      <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
        <UploadCloud class="w-6 h-6" />
      </div>

      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800">
        Upload Complaint CSV Batch
      </h3>
      <p class="text-xs text-slate-500 mt-1 max-w-sm">
        Drag and drop your prepared CSV file here, or click browse to inspect records before committing.
      </p>

      <label class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 cursor-pointer transition">
        <span>Browse CSV File</span>
        <input
          type="file"
          accept=".csv"
          class="hidden"
          @change="handleFileSelect"
        />
      </label>

      <p v-if="file" class="mt-3 text-xs font-semibold text-blue-600">
        Selected file: {{ file.name }} ({{ (file.size / 1024).toFixed(1) }} KB)
      </p>
    </div>

    <!-- Error Banner -->
    <div
      v-if="previewError"
      class="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-2"
    >
      <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
      <div>
        <p class="font-bold">Import Validation Error</p>
        <p class="mt-0.5">{{ previewError }}</p>
      </div>
    </div>

    <!-- Preview Results Section -->
    <div v-if="previewData" class="space-y-4">
      <!-- Summary Stats Header -->
      <div class="grid grid-cols-3 gap-4">
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
          <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Rows</p>
          <p class="text-2xl font-bold text-slate-900 mt-1">{{ previewData.total_rows }}</p>
        </div>

        <div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-subtle">
          <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Ready to Commit</p>
          <p class="text-2xl font-bold text-emerald-700 mt-1">{{ previewData.valid_count }} rows</p>
        </div>

        <div class="rounded-xl border border-red-200 bg-red-50/60 p-4 shadow-subtle">
          <p class="text-[10px] font-bold uppercase tracking-wider text-red-800">Rejected / Error</p>
          <p class="text-2xl font-bold text-red-700 mt-1">{{ previewData.invalid_count }} rows</p>
        </div>
      </div>

      <!-- Action Button to Commit -->
      <div class="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-md">
        <div>
          <p class="text-xs font-bold">Review Complete</p>
          <p class="text-[11px] text-slate-300">
            {{ previewData.valid_count }} verified rows can be safely added without corrupting database integrity.
          </p>
        </div>

        <button
          type="button"
          :disabled="isCommitting || previewData.valid_count === 0"
          class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow transition disabled:opacity-50"
          @click="commitValidRows"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span v-if="isCommitting">Committing Records...</span>
          <span v-else>Commit {{ previewData.valid_count }} Records</span>
        </button>
      </div>

      <!-- Invalid Rows Table (if any) -->
      <div v-if="previewData.invalid_count > 0" class="rounded-xl border border-red-200 bg-white shadow-subtle overflow-hidden">
        <div class="px-6 py-3 bg-red-50/70 border-b border-red-100 flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-red-900">
            Rejected Rows & Validation Errors ({{ previewData.invalid_count }})
          </span>
          <span class="text-[11px] text-red-600">These rows will not be imported</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase">
              <tr>
                <th class="py-2.5 px-4">Row #</th>
                <th class="py-2.5 px-4">Institution Ref</th>
                <th class="py-2.5 px-4">Subject</th>
                <th class="py-2.5 px-4">Validation Errors</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="inv in previewData.invalid_rows" :key="inv.row_index" class="bg-red-50/20">
                <td class="py-2.5 px-4 font-mono font-bold text-slate-700">{{ inv.row_index }}</td>
                <td class="py-2.5 px-4">{{ inv.institution_code || inv.institution_name || 'Empty' }}</td>
                <td class="py-2.5 px-4 truncate max-w-xs">{{ inv.subject || 'Empty' }}</td>
                <td class="py-2.5 px-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="err in inv.errors"
                      :key="err"
                      class="rounded bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-semibold"
                    >
                      {{ err }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Valid Rows Preview Table -->
      <div v-if="previewData.valid_count > 0" class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden">
        <div class="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-800">
            Verified Valid Rows ({{ previewData.valid_count }})
          </span>
          <span class="text-[11px] text-slate-500">Ready for ingest</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase">
              <tr>
                <th class="py-2.5 px-4">Institution</th>
                <th class="py-2.5 px-4">Bureau</th>
                <th class="py-2.5 px-4">Category</th>
                <th class="py-2.5 px-4">Priority</th>
                <th class="py-2.5 px-4">Subject</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="v in previewData.valid_rows" :key="v.row_index" class="hover:bg-slate-50">
                <td class="py-2.5 px-4 font-medium text-slate-900">{{ v.institution_name }}</td>
                <td class="py-2.5 px-4 font-bold font-mono">{{ v.bureau_code }}</td>
                <td class="py-2.5 px-4 text-slate-600">{{ v.category }}</td>
                <td class="py-2.5 px-4">{{ v.priority }}</td>
                <td class="py-2.5 px-4 truncate max-w-sm">{{ v.subject }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Past Import Batches History -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden">
      <div class="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <History class="w-4 h-4 text-slate-500" />
          Data Ingestion Audit History
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
            <tr>
              <th class="py-3 px-4">Batch ID</th>
              <th class="py-3 px-4">Filename</th>
              <th class="py-3 px-4">Committed Rows</th>
              <th class="py-3 px-4">Failed Rows</th>
              <th class="py-3 px-4">Operator</th>
              <th class="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="b in importHistory" :key="b.id" class="hover:bg-slate-50">
              <td class="py-3 px-4 font-mono font-bold text-slate-800">#{{ b.id }}</td>
              <td class="py-3 px-4 font-semibold text-slate-900">{{ b.filename }}</td>
              <td class="py-3 px-4 text-emerald-700 font-bold">{{ b.success_rows }} rows</td>
              <td class="py-3 px-4 text-red-600 font-bold">{{ b.failed_rows }} rows</td>
              <td class="py-3 px-4 text-slate-600">{{ b.created_by_name }}</td>
              <td class="py-3 px-4 text-slate-400 font-mono">{{ b.created_at?.slice(0, 16).replace('T', ' ') }}</td>
            </tr>

            <tr v-if="importHistory.length === 0">
              <td colspan="6" class="py-6 text-center text-xs text-slate-400">
                No past import batches on record.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
