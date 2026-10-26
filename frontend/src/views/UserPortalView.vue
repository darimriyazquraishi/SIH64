<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/Modal.vue'
import {
  PlusCircle, Search, FileText, CheckCircle2, Clock3,
  Calendar, Building2, AlertTriangle, ExternalLink, ShieldCheck,
  RefreshCw, ChevronRight, FileCheck, User
} from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const complaints = ref<any[]>([])
const loading = ref(false)
const selectedComplaint = ref<any | null>(null)
const isDetailOpen = ref(false)

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
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusDotClass(status: string | undefined): string {
  const s = (status || '').toLowerCase()
  if (['action required', 'critical', 'escalated'].includes(s)) return 'status-critical'
  if (['under review', 'in progress', 'awaiting response'].includes(s)) return 'status-pending'
  if (['disposed', 'resolved', 'closed'].includes(s)) return 'status-good'
  if (['received', 'new'].includes(s)) return 'status-new'
  return 'status-neutral'
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
          Monitor your submitted grievances, receive statutory updates, and access official resolutions.
        </p>
      </div>

      <div class="user-hero-actions">
        <button class="button button-primary user-hero-btn" @click="router.push('/register')">
          <PlusCircle :size="16" />
          <span>Register New Grievance</span>
        </button>
        <button class="button button-secondary user-hero-btn" @click="router.push('/track')">
          <Search :size="16" />
          <span>Track by Ticket</span>
        </button>
      </div>
    </div>

    <!-- Quick Cards -->
    <div class="user-quick-grid">
      <div class="user-quick-card" @click="router.push('/register')">
        <div class="user-card-icon user-icon-green">
          <PlusCircle :size="20" />
        </div>
        <div class="user-card-copy">
          <h3>File New Complaint</h3>
          <p>Submit institutional grievances with instant AICTE ticket allocation.</p>
        </div>
        <ChevronRight :size="18" class="user-card-arrow" />
      </div>

      <div class="user-quick-card" @click="router.push('/track')">
        <div class="user-card-icon user-icon-blue">
          <Search :size="20" />
        </div>
        <div class="user-card-copy">
          <h3>Track Ticket Reference</h3>
          <p>Instant status verification using your AICTE-2026-XXXXXX number.</p>
        </div>
        <ChevronRight :size="18" class="user-card-arrow" />
      </div>

      <div class="user-quick-card" @click="loadMyComplaints">
        <div class="user-card-icon user-icon-amber">
          <RefreshCw :size="20" :class="{ 'animate-spin': loading }" />
        </div>
        <div class="user-card-copy">
          <h3>My Active Grievances</h3>
          <p>{{ complaints.length }} recorded in your verified complainant dossier.</p>
        </div>
        <ChevronRight :size="18" class="user-card-arrow" />
      </div>
    </div>

    <!-- My Registered Complaints Section -->
    <div class="user-section-card">
      <div class="user-section-header">
        <div>
          <h2 class="user-section-title">My Registered Grievances</h2>
          <p class="user-section-sub">
            Complaints submitted from this account or linked to {{ auth.user?.email }}.
          </p>
        </div>
        <button class="button button-secondary button-sm" :disabled="loading" @click="loadMyComplaints">
          <RefreshCw :size="14" :class="{ 'animate-spin': loading }" />
          <span>Refresh</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && complaints.length === 0" class="user-loading-box">
        <RefreshCw :size="24" class="animate-spin text-quiet" />
        <p>Loading your complaint history…</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="complaints.length === 0" class="user-empty-box">
        <FileText :size="40" class="text-quiet mb-3" />
        <h3>No complaints registered yet</h3>
        <p>You haven't filed any grievances through this account yet.</p>
        <button class="button button-primary mt-4" @click="router.push('/register')">
          <PlusCircle :size="16" />
          <span>Register your first grievance</span>
        </button>
      </div>

      <!-- Complaints Table -->
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ticket Reference</th>
              <th>Subject & Institution</th>
              <th>Category</th>
              <th>Filed On</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in complaints"
              :key="c.id || c.ticket_number"
              class="clickable-row"
              @click="openDetail(c)"
            >
              <td class="font-mono text-xs font-semibold text-primary">
                {{ c.ticket_number || c.case_number }}
              </td>
              <td>
                <div class="cell-stack">
                  <span class="font-medium text-slate-900 dark:text-slate-100">{{ c.subject }}</span>
                  <span class="text-xs text-quiet">{{ c.institution_name || 'AICTE Affiliated Institution' }}</span>
                </div>
              </td>
              <td>
                <span class="text-xs text-slate-700 dark:text-slate-300">{{ c.category }}</span>
              </td>
              <td>
                <span class="text-xs text-quiet">{{ formatDate(c.created_at || c.received_at) }}</span>
              </td>
              <td>
                <span class="status-label" :class="statusDotClass(c.status)">
                  <i></i>
                  <span>{{ c.status }}</span>
                </span>
              </td>
              <td class="text-right" @click.stop>
                <button class="button button-secondary button-sm" @click="openDetail(c)">
                  <span>View Details</span>
                  <ChevronRight :size="13" />
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
      :title="`Grievance Dossier: ${selectedComplaint?.ticket_number || selectedComplaint?.case_number || ''}`"
      @close="isDetailOpen = false"
    >
      <div v-if="selectedComplaint" class="space-y-5">
        <!-- Top Status Banner -->
        <div class="p-4 rounded border border-line bg-muted flex items-center justify-between">
          <div>
            <span class="text-xs text-quiet uppercase tracking-wider font-semibold block">Current Official Status</span>
            <span class="status-label mt-1 text-sm font-semibold" :class="statusDotClass(selectedComplaint.status)">
              <i></i>
              <span>{{ selectedComplaint.status }}</span>
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs text-quiet block">Allocated Department</span>
            <span class="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 mt-1 block">
              {{ selectedComplaint.bureau_name || selectedComplaint.bureau_code || 'Central Grievance Redressal' }}
            </span>
          </div>
        </div>

        <!-- Resolution Box if Disposed -->
        <div v-if="selectedComplaint.resolution_summary" class="p-4 rounded border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20">
          <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-1">
            <CheckCircle2 :size="16" />
            <span>Official Resolution Decision</span>
          </div>
          <p class="text-sm text-emerald-900 dark:text-emerald-200 [text-wrap:pretty]">
            {{ selectedComplaint.resolution_summary }}
          </p>
        </div>

        <!-- Key Information Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="p-3 rounded border border-line bg-muted">
            <span class="text-quiet block">Target Institution</span>
            <strong class="text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
              {{ selectedComplaint.institution_name || 'AICTE Institution' }}
            </strong>
            <span v-if="selectedComplaint.institution_state" class="text-quiet mt-0.5 block">
              State: {{ selectedComplaint.institution_state }}
            </span>
          </div>
          <div class="p-3 rounded border border-line bg-muted">
            <span class="text-quiet block">Category & Priority</span>
            <strong class="text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
              {{ selectedComplaint.category }}
            </strong>
            <span class="text-quiet mt-0.5 block">
              Statutory Urgency: {{ selectedComplaint.priority || 'Medium' }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-quiet mb-1.5">Grievance Particulars</h4>
          <div class="p-3.5 rounded border border-line bg-muted text-xs leading-relaxed text-slate-800 dark:text-slate-200 [text-wrap:pretty]">
            <strong class="block text-sm mb-1 text-slate-900 dark:text-slate-100">{{ selectedComplaint.subject }}</strong>
            <p>{{ selectedComplaint.description }}</p>
          </div>
        </div>

        <!-- Supporting Document Link if available -->
        <div v-if="selectedComplaint.supporting_document_name" class="p-3 rounded border border-line bg-muted flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <FileCheck :size="16" class="text-primary" />
            <span>Supporting Document: <strong>{{ selectedComplaint.supporting_document_name }}</strong></span>
          </div>
        </div>

        <!-- Milestone Updates Timeline -->
        <div v-if="selectedComplaint.updates && selectedComplaint.updates.length > 0">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-quiet mb-2">Statutory Progress Updates</h4>
          <div class="divide-y divide-line border border-line rounded bg-muted">
            <div v-for="(u, idx) in selectedComplaint.updates" :key="idx" class="p-3 text-xs flex items-start gap-3">
              <Clock3 :size="15" class="text-quiet mt-0.5 flex-none" />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <strong class="text-slate-900 dark:text-slate-100">{{ u.status }}</strong>
                  <span class="text-quiet">{{ formatDate(u.date) }}</span>
                </div>
                <p class="text-quiet mt-0.5">{{ u.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button class="button button-secondary" @click="isDetailOpen = false">Close</button>
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
.user-quick-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (min-width: 768px) {
  .user-quick-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.user-quick-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: all 0.15s ease;
}
.user-quick-card:hover {
  border-color: var(--primary);
  background: var(--muted);
}
.user-card-icon {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-icon-green { background: rgba(34, 197, 94, 0.12); color: #16a34a; }
.user-icon-blue { background: rgba(14, 165, 233, 0.12); color: #0284c7; }
.user-icon-amber { background: rgba(245, 158, 11, 0.12); color: #d97706; }
html.dark .user-icon-green { color: #4ade80; }
html.dark .user-icon-blue { color: #38bdf8; }
html.dark .user-icon-amber { color: #fbbf24; }
.user-card-copy h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink);
}
.user-card-copy p {
  font-size: 0.75rem;
  color: var(--quiet);
  margin-top: 2px;
}
.user-card-arrow {
  margin-left: auto;
  color: var(--quiet);
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
  padding: 3rem 1.5rem;
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
