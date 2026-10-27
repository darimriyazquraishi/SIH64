<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/Modal.vue'
import {
  PlusCircle, Search, FileText, CheckCircle2, Clock3,
  Calendar, Building2, ShieldCheck, RefreshCw, ChevronRight,
  Printer, Copy, Check, Layers
} from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const complaints = ref<any[]>([])
const loading = ref(false)
const selectedComplaint = ref<any | null>(null)
const isDetailOpen = ref(false)
const ticketCopied = ref(false)

async function loadMyComplaints() {
  loading.value = true
  try {
    const res = await apiClient.get('/complaints')
    complaints.value = res.data.items || []
  } catch (err) {
    console.error('Failed to load user complaints:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMyComplaints()
})

function openDetail(comp: any) {
  selectedComplaint.value = comp
  isDetailOpen.value = true
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return String(iso)
  }
}

function getStatusPillClass(status: string | undefined): string {
  const s = (status || '').toLowerCase()
  if (['disposed', 'resolved', 'closed'].includes(s)) return 'status-pill-success'
  if (['under review'].includes(s)) return 'status-pill-info'
  if (['action required', 'escalated', 'awaiting response'].includes(s)) return 'status-pill-warning'
  return 'status-pill-neutral'
}

// 5-Stage computation for modal
const modalStageNumber = computed(() => {
  if (!selectedComplaint.value) return 1
  const s = (selectedComplaint.value.status || '').toLowerCase()
  if (['disposed', 'closed', 'resolved'].includes(s)) return 5
  if (['action required', 'awaiting response', 'escalated', 'in progress'].includes(s)) return 4
  if (['assigned'].includes(s) || (selectedComplaint.value.bureau_name && s !== 'received' && s !== 'new')) return 3
  if (['under review'].includes(s)) return 2
  return 1
})

const modalStageExplanation = computed(() => {
  const stage = modalStageNumber.value
  if (stage === 1) return 'Your complaint has been received and is waiting for initial review.'
  if (stage === 2) return 'AICTE officials are reviewing the submitted details and documentation.'
  if (stage === 3) return `Assigned to ${selectedComplaint.value?.bureau_name || 'the handling department'}.`
  if (stage === 4) return 'Statutory inquiry active with the concerned institution.'
  if (stage === 5) return 'Your complaint has been resolved. You can read the official resolution below.'
  return 'Case is being processed.'
})

async function copyTicket(ticket: string) {
  try {
    await navigator.clipboard.writeText(ticket)
    ticketCopied.value = true
    setTimeout(() => { ticketCopied.value = false }, 2000)
  } catch {
    ticketCopied.value = true
  }
}
</script>

<template>
  <div class="user-portal-canvas">
    <!-- Complainant Top Banner -->
    <div class="user-portal-hero">
      <div class="user-hero-content">
        <div class="user-role-tag">
          <ShieldCheck :size="14" />
          <span>Public Complainant Portal</span>
        </div>
        <h1 class="user-hero-title">Welcome, {{ auth.user?.name || 'Complainant' }}</h1>
        <p class="user-hero-sub">
          Register new complaints, check status updates with your ticket number, and view official resolutions.
        </p>
      </div>

      <!-- Primary Actions - Immediately Visible -->
      <div class="user-hero-actions">
        <button
          type="button"
          class="button button-primary user-hero-btn"
          @click="router.push('/register')"
        >
          <PlusCircle :size="16" />
          <span>Register New Complaint</span>
        </button>

        <button
          type="button"
          class="button button-secondary user-hero-btn"
          @click="router.push('/track')"
        >
          <Search :size="16" />
          <span>Track Complaint</span>
        </button>
      </div>
    </div>

    <!-- My Complaints Section -->
    <div class="user-section-card">
      <div class="user-section-header">
        <div>
          <h2 class="user-section-title">My Registered Complaints</h2>
          <p class="user-section-sub">
            Complaints submitted from this account ({{ auth.user?.email }}).
          </p>
        </div>
        <button
          type="button"
          class="button button-secondary button-sm"
          :disabled="loading"
          @click="loadMyComplaints"
          title="Refresh complaint list"
        >
          <RefreshCw :size="14" :class="{ 'animate-spin': loading }" />
          <span>Refresh</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && complaints.length === 0" class="user-loading-box">
        <RefreshCw :size="24" class="animate-spin text-quiet" />
        <p class="mt-2 text-sm text-quiet">Loading your complaints…</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="complaints.length === 0" class="user-empty-box">
        <FileText :size="40" class="text-quiet mb-3" />
        <h3>No complaints registered yet</h3>
        <p class="text-sm text-quiet max-w-md mx-auto mt-1">
          You haven't submitted any complaints through this account. When you submit a complaint about an AICTE-approved college, it will appear here with live progress updates.
        </p>
        <div class="flex gap-3 mt-4">
          <button
            type="button"
            class="button button-primary"
            @click="router.push('/register')"
          >
            <PlusCircle :size="16" />
            <span>Register New Complaint</span>
          </button>
          <button
            type="button"
            class="button button-quiet"
            @click="router.push('/track')"
          >
            <Search :size="16" />
            <span>Track by Ticket Number</span>
          </button>
        </div>
      </div>

      <!-- Clean Complaints Table -->
      <div v-else class="table-container">
        <table class="data-table" aria-label="My complaints table">
          <thead>
            <tr>
              <th scope="col">Ticket Number</th>
              <th scope="col">Complaint Subject</th>
              <th scope="col">Institution</th>
              <th scope="col">Date Submitted</th>
              <th scope="col">Current Status</th>
              <th scope="col" class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in complaints"
              :key="c.id || c.ticket_number"
              class="clickable-row"
              @click="openDetail(c)"
            >
              <!-- Ticket Number -->
              <td class="font-mono text-xs font-semibold text-primary">
                {{ c.ticket_number || c.case_number }}
              </td>

              <!-- Complaint Subject -->
              <td>
                <span class="font-medium text-slate-900 dark:text-slate-100 block">{{ c.subject }}</span>
                <small class="text-xs text-quiet">{{ c.category }}</small>
              </td>

              <!-- Institution -->
              <td>
                <span class="text-sm text-slate-800 dark:text-slate-200 block">{{ c.institution_name || 'AICTE Affiliated Institution' }}</span>
                <small v-if="c.institution_state" class="text-xs text-quiet">{{ c.institution_state }}</small>
              </td>

              <!-- Date Submitted -->
              <td class="text-xs text-quiet">
                {{ formatDate(c.received_at || c.created_at) }}
              </td>

              <!-- Current Status -->
              <td>
                <span :class="['status-pill', getStatusPillClass(c.status)]">
                  <CheckCircle2 :size="13" />
                  <span>{{ c.status }}</span>
                </span>
              </td>

              <!-- View Details -->
              <td class="text-right" @click.stop>
                <button
                  type="button"
                  class="button button-secondary button-sm"
                  @click="openDetail(c)"
                >
                  <span>View Details</span>
                  <ChevronRight :size="14" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Complaint Detail Modal -->
    <Modal
      :isOpen="isDetailOpen"
      :title="`Complaint Details: ${selectedComplaint?.ticket_number || selectedComplaint?.case_number || ''}`"
      @close="isDetailOpen = false"
    >
      <div v-if="selectedComplaint" class="space-y-4">
        <!-- Top Callout -->
        <div class="p-4 rounded border border-line bg-muted flex items-center justify-between flex-wrap gap-3">
          <div>
            <span class="text-xs text-quiet uppercase tracking-wider font-semibold block">Current Status</span>
            <span :class="['status-pill mt-1', getStatusPillClass(selectedComplaint.status)]">
              <CheckCircle2 :size="14" />
              <span>{{ selectedComplaint.status }}</span>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="button button-quiet button-sm"
              @click="copyTicket(selectedComplaint.ticket_number || selectedComplaint.case_number)"
            >
              <Check v-if="ticketCopied" :size="14" />
              <Copy v-else :size="14" />
              <span>{{ ticketCopied ? 'Copied' : 'Copy Ticket' }}</span>
            </button>

            <button
              type="button"
              class="button button-quiet button-sm"
              @click="router.push({ path: '/track', query: { ticket: selectedComplaint.ticket_number || selectedComplaint.case_number } })"
            >
              <Search :size="14" />
              <span>Full Tracking Page</span>
            </button>
          </div>
        </div>

        <!-- 5-Stage Timeline Stepper in Modal -->
        <div class="p-4 rounded border border-line bg-canvas">
          <strong class="text-xs uppercase tracking-wider text-quiet block mb-2">Progress Stage (Stage {{ modalStageNumber }} of 5)</strong>
          <p class="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">{{ modalStageExplanation }}</p>

          <div class="grid grid-cols-5 gap-2 text-center text-xs">
            <div
              v-for="(stg, idx) in ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved']"
              :key="idx"
              class="p-2 rounded border"
              :class="idx + 1 <= modalStageNumber ? 'bg-primary/10 border-primary text-primary font-semibold' : 'bg-surface border-line text-quiet'"
            >
              <span class="block text-xs">{{ idx + 1 }}</span>
              <span class="block truncate mt-0.5">{{ stg }}</span>
            </div>
          </div>
        </div>

        <!-- Key Information Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div class="p-3 rounded border border-line bg-surface">
            <span class="text-quiet block">Concerned Institution</span>
            <strong class="text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
              {{ selectedComplaint.institution_name || 'AICTE Institution' }}
            </strong>
            <span v-if="selectedComplaint.institution_state" class="text-quiet mt-0.5 block">
              State: {{ selectedComplaint.institution_state }}
            </span>
          </div>

          <div class="p-3 rounded border border-line bg-surface">
            <span class="text-quiet block">Category</span>
            <strong class="text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
              {{ selectedComplaint.category }}
            </strong>
            <span class="text-quiet mt-0.5 block">
              Urgency: {{ selectedComplaint.priority || 'Medium' }}
            </span>
          </div>
        </div>

        <!-- Complaint Subject & Description -->
        <div class="p-4 rounded border border-line bg-surface">
          <strong class="text-sm font-semibold text-slate-900 dark:text-slate-100 block mb-1">
            {{ selectedComplaint.subject }}
          </strong>
          <p class="text-xs leading-relaxed text-slate-800 dark:text-slate-200 [text-wrap:pretty]">
            {{ selectedComplaint.description }}
          </p>
        </div>

        <!-- Resolution Box if Disposed -->
        <div v-if="selectedComplaint.resolution_summary" class="p-4 rounded border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20">
          <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-1">
            <CheckCircle2 :size="16" />
            <span>Official Resolution & Directives</span>
          </div>
          <p class="text-xs text-emerald-900 dark:text-emerald-200 [text-wrap:pretty]">
            {{ selectedComplaint.resolution_summary }}
          </p>
          <small v-if="selectedComplaint.disposed_at" class="text-xs text-emerald-700 dark:text-emerald-400 block mt-1">
            Closed on {{ formatDate(selectedComplaint.disposed_at) }}
          </small>
        </div>

        <div class="pt-2 flex justify-end">
          <button type="button" class="button button-secondary" @click="isDetailOpen = false">Close</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.user-portal-canvas {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}
.user-portal-hero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.75rem;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  margin-bottom: 1.5rem;
}
@media (min-width: 768px) {
  .user-portal-hero {
    flex-direction: row;
    align-items: center;
  }
}
.user-role-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--muted);
  border: 1px solid var(--line);
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.5rem;
}
.user-hero-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
}
.user-hero-sub {
  font-size: 0.875rem;
  color: var(--quiet);
  margin-top: 0.25rem;
  max-width: 600px;
}
.user-hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.user-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.user-section-card {
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 1.5rem;
}
.user-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--line);
}
.user-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ink);
}
.user-section-sub {
  font-size: 0.75rem;
  color: var(--quiet);
  margin-top: 2px;
}
.user-loading-box, .user-empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 1.5rem;
  text-align: center;
}
.user-empty-box h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
}
.user-empty-box p {
  font-size: 0.875rem;
  color: var(--quiet);
  margin-top: 4px;
}
</style>
