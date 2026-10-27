<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Layers,
  AlertCircle,
  FileText,
  Paperclip,
  ArrowRight,
  Printer,
  ChevronRight,
  Check,
  Calendar,
  HelpCircle
} from 'lucide-vue-next'
import PublicNav from '@/components/PublicNav.vue'

const route = useRoute()
const router = useRouter()

const searchTicket = ref('')
const loading = ref(false)
const error = ref('')
const complaint = ref<any>(null)

// 5-Stage Public Progression
const currentStageNumber = computed(() => {
  if (!complaint.value) return 1
  const s = (complaint.value.status || '').toLowerCase()
  if (['disposed', 'closed', 'resolved'].includes(s)) return 5
  if (['action required', 'awaiting response', 'escalated', 'in progress'].includes(s)) return 4
  if (['assigned'].includes(s)) return 3
  if (['under review'].includes(s)) return 2
  // If bureau is designated and it's past received, mark at least stage 3
  if (complaint.value.bureau_name && s !== 'received' && s !== 'new') return 3
  return 1 // Complaint Submitted
})

const stages = computed(() => {
  const c = complaint.value
  return [
    {
      num: 1,
      title: 'Complaint Submitted',
      description: 'Your complaint has been received and recorded in the AICTE register.',
      date: c?.received_at || c?.created_at,
    },
    {
      num: 2,
      title: 'Under Review',
      description: 'Officials are verifying jurisdiction and evaluating submitted particulars.',
      date: c && currentStageNumber.value >= 2 ? c.last_action_at : null,
    },
    {
      num: 3,
      title: 'Assigned',
      description: c?.bureau_name
        ? `Routed to ${c.bureau_name} for departmental processing.`
        : 'Assigned to the responsible department for inquiry.',
      date: null,
    },
    {
      num: 4,
      title: 'Action in Progress',
      description: 'Statutory inquiry active; institutional response under examination.',
      date: c && currentStageNumber.value >= 4 ? c.last_action_at : null,
    },
    {
      num: 5,
      title: 'Resolved',
      description: c?.resolution_summary
        ? 'Matter finalized with official directives issued.'
        : 'Official closure recorded in the complaint register.',
      date: c?.disposed_at,
    },
  ]
})

const currentExplanation = computed(() => {
  const stage = currentStageNumber.value
  if (stage === 1) return 'Your complaint has been received and is waiting for initial review.'
  if (stage === 2) return 'AICTE officials are reviewing the submitted details and documentation.'
  if (stage === 3) return `Your complaint has been assigned to ${complaint.value?.bureau_name || 'the handling department'}.`
  if (stage === 4) return 'Action is in progress with the concerned institution.'
  if (stage === 5) return 'Your complaint has been resolved. Please review the official resolution below.'
  return 'Your complaint is being processed.'
})

async function fetchComplaint(ticketToLookup: string) {
  const query = ticketToLookup.trim()
  if (!query) {
    error.value = 'Please enter a ticket number to track your complaint.'
    complaint.value = null
    return
  }

  loading.value = true
  error.value = ''
  complaint.value = null

  try {
    const res = await fetch(`http://localhost:5000/api/v1/public/complaints/track/${encodeURIComponent(query)}`)
    const data = await res.json()
    if (!res.ok) {
      error.value = data.error || 'No complaint record found matching this ticket number. Please verify the code.'
    } else {
      complaint.value = data.complaint
      router.replace({ query: { ticket: query } })
    }
  } catch (err: any) {
    error.value = 'Unable to connect to the complaint tracking service. Please ensure the backend is running.'
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchComplaint(searchTicket.value)
}

function quickFill(ticket: string) {
  searchTicket.value = ticket
  fetchComplaint(ticket)
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function getStatusPillClass(status: string): string {
  switch ((status || '').toLowerCase()) {
    case 'disposed':
    case 'resolved':
    case 'closed':
      return 'status-pill-success'
    case 'under review':
      return 'status-pill-info'
    case 'action required':
    case 'escalated':
      return 'status-pill-warning'
    default:
      return 'status-pill-neutral'
  }
}

function printReceipt() {
  window.print()
}

onMounted(() => {
  const initialTicket = (route.query.ticket as string) || ''
  if (initialTicket) {
    searchTicket.value = initialTicket
    fetchComplaint(initialTicket)
  }
})
</script>

<template>
  <div class="public-layout">
    <PublicNav />

    <main class="public-main">
      <div class="public-container">
        <!-- Page Header -->
        <div class="public-page-header">
          <div class="header-icon-title">
            <Search :size="26" class="header-icon" />
            <h1>Track Complaint Status</h1>
          </div>
          <p class="public-page-subtitle">
            Enter your official AICTE ticket number (e.g. <code>AICTE-2026-XXXXXX</code>) to check current progress and resolution status.
          </p>
        </div>

        <!-- Search Card -->
        <div class="track-search-card">
          <form class="track-search-form" @submit.prevent="handleSearch">
            <div class="track-input-wrap">
              <Search :size="18" class="track-search-icon" aria-hidden="true" />
              <input
                v-model="searchTicket"
                type="text"
                placeholder="Enter ticket number (e.g. AICTE-2026-XXXXXX)"
                class="track-input"
                autocomplete="off"
                required
                aria-label="Ticket number"
              />
            </div>
            <button
              type="submit"
              class="button button-primary track-btn"
              :disabled="loading"
            >
              <span v-if="loading">Checking…</span>
              <span v-else>Track Complaint</span>
            </button>
          </form>

          <div class="track-quick-links">
            <span class="quick-label">Need a reference?</span>
            <span class="quick-help">Check your submission confirmation screen or receipt.</span>
          </div>
        </div>

        <!-- Error Card -->
        <div v-if="error" class="public-error-card" role="alert">
          <AlertCircle :size="20" class="error-icon" />
          <div class="error-copy">
            <strong>Complaint Record Not Found</strong>
            <p>{{ error }}</p>
          </div>
        </div>

        <!-- Complaint Result Card -->
        <div v-if="complaint" class="track-result-card">
          <!-- Top Row: Ticket Number & Current Status -->
          <div class="result-header">
            <div>
              <span class="result-tag">AICTE TICKET</span>
              <h2 class="result-ticket-number">{{ complaint.ticket_number }}</h2>
              <span class="result-case-sub">Submitted on {{ formatDate(complaint.received_at || complaint.created_at) }}</span>
            </div>

            <div class="result-header-actions">
              <span :class="['status-pill', getStatusPillClass(complaint.status)]">
                <CheckCircle2 :size="14" />
                {{ complaint.status }}
              </span>
              <button type="button" class="button button-quiet button-small" @click="printReceipt">
                <Printer :size="14" />
                <span>Print Status</span>
              </button>
            </div>
          </div>

          <!-- Human-Friendly Active Stage Announcement Banner -->
          <div class="stage-announcement-card">
            <div class="stage-announcement-icon">
              <Clock v-if="currentStageNumber < 5" :size="20" />
              <CheckCircle2 v-else :size="20" />
            </div>
            <div class="stage-announcement-copy">
              <strong>Stage {{ currentStageNumber }} of 5: {{ stages[currentStageNumber - 1]?.title }}</strong>
              <p>{{ currentExplanation }}</p>
            </div>
          </div>

          <!-- 5-STAGE PROGRESSION TIMELINE -->
          <div class="track-stepper-container" aria-label="Complaint progress timeline">
            <div class="stepper-track-line" />
            <div
              v-for="stg in stages"
              :key="stg.num"
              class="stepper-step"
              :class="{
                'step-done': stg.num < currentStageNumber,
                'step-current': stg.num === currentStageNumber,
                'step-upcoming': stg.num > currentStageNumber
              }"
            >
              <div class="stepper-circle" :aria-label="`Step ${stg.num}: ${stg.title}`">
                <Check v-if="stg.num < currentStageNumber" :size="15" />
                <span v-else>{{ stg.num }}</span>
              </div>
              <div class="stepper-label-group">
                <strong class="stepper-title">{{ stg.title }}</strong>
                <p class="stepper-desc">{{ stg.description }}</p>
                <small v-if="stg.date" class="stepper-date">{{ formatDate(stg.date) }}</small>
              </div>
            </div>
          </div>

          <!-- Public Details Grid -->
          <div class="result-grid">
            <div class="result-meta-item">
              <span class="meta-label"><Building2 :size="14" /> Concerned Institution</span>
              <strong class="meta-value">{{ complaint.institution_name || 'Technical Institution' }}</strong>
              <small class="meta-sub" v-if="complaint.institution_state">
                {{ complaint.institution_state }}{{ complaint.institution_code ? ` · ID: ${complaint.institution_code}` : '' }}
              </small>
            </div>

            <div class="result-meta-item">
              <span class="meta-label"><ShieldCheck :size="14" /> Assigned Department</span>
              <strong class="meta-value">{{ complaint.bureau_name || 'Public Grievance Redressal Cell' }}</strong>
              <small class="meta-sub">Directing authority under AICTE</small>
            </div>

            <div class="result-meta-item">
              <span class="meta-label"><Layers :size="14" /> Category</span>
              <strong class="meta-value">{{ complaint.category }}</strong>
              <small class="meta-sub">Classified by subject matter</small>
            </div>

            <div class="result-meta-item">
              <span class="meta-label"><Calendar :size="14" /> Last Action Recorded</span>
              <strong class="meta-value">{{ formatDate(complaint.last_action_at || complaint.received_at) }}</strong>
              <small class="meta-sub">Updated in central register</small>
            </div>
          </div>

          <!-- Complaint Subject & Description -->
          <div class="result-prose-section">
            <h3 class="prose-title"><FileText :size="15" /> Complaint Subject</h3>
            <p class="prose-subject">{{ complaint.subject }}</p>

            <h3 class="prose-title prose-title-sub"><FileText :size="15" /> Submitted Description</h3>
            <div class="prose-body">{{ complaint.description }}</div>

            <div v-if="complaint.has_supporting_document" class="doc-attachment-badge">
              <Paperclip :size="14" />
              <span>Supporting proof on file: <strong>{{ complaint.supporting_document_name || 'Document attached' }}</strong></span>
            </div>
          </div>

          <!-- Official Resolution Summary (Shown prominently when resolved) -->
          <div v-if="complaint.resolution_summary" class="resolution-box" role="region" aria-label="Official Resolution">
            <div class="resolution-header">
              <CheckCircle2 :size="18" class="resolution-icon" />
              <strong>Official AICTE Resolution & Directives</strong>
            </div>
            <p class="resolution-body">{{ complaint.resolution_summary }}</p>
            <div class="resolution-footer" v-if="complaint.disposed_at">
              Formally concluded on {{ formatDate(complaint.disposed_at) }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="public-footer">
      <div class="public-container public-footer-inner">
        <span>All India Council for Technical Education · Grievance Redressal Portal</span>
        <span>SIH 2026 Problem Statement 26264</span>
      </div>
    </footer>
  </div>
</template>
