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
  MessageSquare,
  Upload,
  Download
} from 'lucide-vue-next'
import PublicNav from '@/components/PublicNav.vue'
import GigwFooter from '@/components/GigwFooter.vue'
import IndianEmblem from '@/components/IndianEmblem.vue'
import Modal from '@/components/Modal.vue'
import aicteLogo from '@/assets/aicte-logo.png'

const route = useRoute()
const router = useRouter()

const searchTicket = ref('')
const loading = ref(false)
const error = ref('')
const complaint = ref<any>(null)

// Complainant Clarification Modal
const isResponseModalOpen = ref(false)
const responseText = ref('')
const responseFile = ref<File | null>(null)
const submittingResponse = ref(false)
const responseError = ref('')
const responseSuccess = ref('')

// Printable Slip Modal
const isPrintSlipOpen = ref(false)

// 5-Stage Public Progression
const currentStageNumber = computed(() => {
  if (!complaint.value) return 1
  const s = (complaint.value.status || '').toLowerCase()
  if (['disposed', 'closed', 'resolved'].includes(s)) return 5
  if (['action required', 'awaiting response', 'escalated', 'in progress'].includes(s)) return 4
  if (['assigned'].includes(s)) return 3
  if (['under review'].includes(s)) return 2
  if (complaint.value.bureau_name && s !== 'received' && s !== 'new') return 3
  return 1 // Complaint Submitted
})

const stages = computed(() => {
  const c = complaint.value
  return [
    {
      num: 1,
      title: 'Complaint Submitted',
      description: 'Your complaint has been received and recorded in the AICTE central register.',
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
      title: 'Assigned to Bureau',
      description: c?.bureau_name
        ? `Routed to ${c.bureau_name} for departmental processing.`
        : 'Assigned to the responsible bureau for inquiry.',
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
  if (stage === 3) return `Your complaint has been assigned to ${complaint.value?.bureau_name || 'the handling bureau'}.`
  if (stage === 4) return 'Statutory inquiry is active with the concerned technical institution.'
  if (stage === 5) return 'Your complaint has been resolved. Please review the official directives below.'
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

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    responseFile.value = target.files[0]
  }
}

async function submitPublicClarification() {
  if (!complaint.value) return
  if (!responseText.value.trim() && !responseFile.value) {
    responseError.value = 'Please enter a message or select a file.'
    return
  }

  submittingResponse.value = true
  responseError.value = ''
  responseSuccess.value = ''

  try {
    const formData = new FormData()
    formData.append('message', responseText.value.trim())
    if (responseFile.value) {
      formData.append('file', responseFile.value)
    }

    const res = await fetch(`http://localhost:5000/api/v1/public/complaints/track/${encodeURIComponent(complaint.value.ticket_number)}/respond`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Submission failed.')
    }

    responseSuccess.value = 'Additional information submitted successfully and attached to your case history.'
    if (data.complaint) {
      complaint.value = data.complaint
    } else {
      await fetchComplaint(complaint.value.ticket_number)
    }

    setTimeout(() => {
      isResponseModalOpen.value = false
    }, 1500)
  } catch (err: any) {
    responseError.value = err.message || 'Failed to submit additional information. Please retry.'
  } finally {
    submittingResponse.value = false
  }
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

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

    <main class="public-main" id="main-content">
      <div class="public-container">
        <!-- Page Header -->
        <div class="public-page-header">
          <div class="header-icon-title">
            <Search :size="26" class="header-icon" />
            <h1>Track Complaint Status</h1>
          </div>
          <p class="public-page-subtitle [text-wrap:pretty]">
            Enter your official AICTE ticket number (e.g. <code>AICTE-2026-XXXXXX</code>) to view live departmental progress, respond to inquiries, or download your submission summary.
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
              <span v-if="loading">Checking Register…</span>
              <span v-else>Track Complaint</span>
            </button>
          </form>

          <div class="track-quick-links">
            <span class="quick-label">Need a reference?</span>
            <span class="quick-help">Check your submission confirmation email or printable receipt.</span>
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
              <span class="result-tag">AICTE OFFICIAL TICKET</span>
              <h2 class="result-ticket-number">{{ complaint.ticket_number }}</h2>
              <span class="result-case-sub">Submitted on {{ formatDate(complaint.received_at || complaint.created_at) }}</span>
            </div>

            <div class="result-header-actions">
              <span :class="['status-pill', getStatusPillClass(complaint.status)]">
                <CheckCircle2 :size="14" />
                {{ complaint.status }}
              </span>

              <button
                type="button"
                class="button button-primary button-small"
                @click="isResponseModalOpen = true"
              >
                <MessageSquare :size="14" />
                <span>Provide Info</span>
              </button>

              <button
                type="button"
                class="button button-quiet button-small"
                @click="isPrintSlipOpen = true"
              >
                <Download :size="14" />
                <span>Download Slip</span>
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
              <p class="[text-wrap:pretty]">{{ currentExplanation }}</p>
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

          <!-- Public Details Grid with AICTE Permanent ID -->
          <div class="result-grid">
            <div class="result-meta-item">
              <span class="meta-label"><Building2 :size="14" /> Concerned Institution</span>
              <strong class="meta-value">{{ complaint.institution_name || 'Technical Institution' }}</strong>
              <small class="meta-sub" v-if="complaint.institution_code">
                Permanent ID: <strong>{{ complaint.institution_code }}</strong>
              </small>
              <small class="meta-sub" v-if="complaint.institution_state">
                State: {{ complaint.institution_state }}
              </small>
            </div>

            <div class="result-meta-item">
              <span class="meta-label"><ShieldCheck :size="14" /> Responsible Bureau / Cell</span>
              <strong class="meta-value">{{ complaint.bureau_name || 'Public Grievance Redressal Cell' }}</strong>
              <small class="meta-sub">AICTE Statutory Directorate</small>
            </div>

            <div class="result-meta-item">
              <span class="meta-label"><Layers :size="14" /> Category</span>
              <strong class="meta-value">{{ complaint.category }}</strong>
              <small class="meta-sub">Official classification</small>
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
            <div class="prose-body [text-wrap:pretty]">{{ complaint.description }}</div>

            <div v-if="complaint.has_supporting_document" class="doc-attachment-badge">
              <Paperclip :size="14" />
              <span>Supporting document on file: <strong>{{ complaint.supporting_document_name || 'Document attached' }}</strong></span>
            </div>
          </div>

          <!-- Public Action History -->
          <div v-if="complaint.actions && complaint.actions.length" class="result-prose-section">
            <h3 class="prose-title"><Clock :size="15" /> Public Case Timeline</h3>
            <div class="space-y-2 mt-2">
              <div
                v-for="act in complaint.actions"
                :key="act.id || act.created_at"
                class="p-2.5 rounded bg-muted border border-line text-xs"
              >
                <div class="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                  <span>{{ act.description }}</span>
                  <span class="text-quiet font-normal">{{ formatDateTime(act.created_at) }}</span>
                </div>
                <div class="text-quiet">Authority: {{ act.performed_by_name || 'AICTE Official' }}</div>
              </div>
            </div>
          </div>

          <!-- Official Resolution Summary (Shown prominently when resolved) -->
          <div v-if="complaint.resolution_summary" class="resolution-box" role="region" aria-label="Official Resolution">
            <div class="resolution-header">
              <CheckCircle2 :size="18" class="resolution-icon" />
              <strong>Official AICTE Resolution & Directives</strong>
            </div>
            <p class="resolution-body [text-wrap:pretty]">{{ complaint.resolution_summary }}</p>
            <div class="resolution-footer" v-if="complaint.disposed_at">
              Formally concluded on {{ formatDate(complaint.disposed_at) }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 1. CLARIFICATION MODAL -->
    <Modal
      :isOpen="isResponseModalOpen"
      :title="`Provide Additional Info: ${complaint?.ticket_number || ''}`"
      @close="isResponseModalOpen = false"
    >
      <div v-if="complaint" class="space-y-4">
        <div class="p-3 bg-muted rounded border border-line text-xs">
          <p class="text-slate-800 [text-wrap:pretty]">
            Provide clarifying statements or upload missing documents requested by the investigating officer <strong>without filing a duplicate complaint</strong>.
          </p>
        </div>

        <div v-if="responseError" class="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs">
          {{ responseError }}
        </div>
        <div v-if="responseSuccess" class="p-3 bg-green-50 border border-green-300 rounded text-green-800 text-xs">
          {{ responseSuccess }}
        </div>

        <form @submit.prevent="submitPublicClarification" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1" for="track-response-remarks">
              Clarification / Response Notes <span class="text-red-600">*</span>
            </label>
            <textarea
              id="track-response-remarks"
              v-model="responseText"
              rows="4"
              class="w-full text-xs p-2.5 border border-line rounded bg-surface focus:outline-none focus:border-primary"
              placeholder="State your additional explanation or reply to the inquiry…"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1" for="track-response-file">
              Upload Supporting Document (PDF / JPEG / PNG, Max 10MB)
            </label>
            <input
              id="track-response-file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              class="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
              @change="handleFileChange"
            />
          </div>

          <div class="flex justify-end gap-2 pt-2 border-t border-line">
            <button
              type="button"
              class="button button-quiet"
              :disabled="submittingResponse"
              @click="isResponseModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="button button-primary"
              :disabled="submittingResponse"
            >
              <span>{{ submittingResponse ? 'Submitting…' : 'Submit Information' }}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- 2. PRINTABLE ACKNOWLEDGEMENT SLIP MODAL -->
    <Modal
      :isOpen="isPrintSlipOpen"
      :title="`Official Acknowledgement Slip: ${complaint?.ticket_number || ''}`"
      @close="isPrintSlipOpen = false"
    >
      <div v-if="complaint" class="print-slip-container">
        <div class="print-action-bar no-print mb-4 flex items-center justify-between p-3 bg-muted rounded border border-line">
          <span class="text-xs text-slate-700">Official Computer-Generated Acknowledgement</span>
          <button type="button" class="button button-primary button-sm" @click="printReceipt">
            <Printer :size="14" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        <div class="official-acknowledgement-sheet" id="printable-slip">
          <div class="letterhead-header">
            <div class="letterhead-emblem">
              <IndianEmblem width="40" height="52" />
            </div>
            <div class="letterhead-text">
              <h2 class="letterhead-org-hi">अखिल भारतीय तकनीकी शिक्षा परिषद</h2>
              <h3 class="letterhead-org-en">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h3>
              <p class="letterhead-sub">Ministry of Education, Government of India</p>
              <p class="letterhead-addr">Nelson Mandela Marg, Vasant Kunj, New Delhi-110070</p>
            </div>
            <div class="letterhead-logo">
              <img :src="aicteLogo" alt="AICTE" class="h-12 w-12 object-contain" />
            </div>
          </div>

          <div class="slip-title-banner">
            COMPLAINT SUBMISSION ACKNOWLEDGEMENT & STATUS SUMMARY
          </div>

          <table class="slip-meta-table">
            <tbody>
              <tr>
                <th scope="row">Ticket Number:</th>
                <td class="font-mono font-bold">{{ complaint.ticket_number }}</td>
                <th scope="row">Date of Receipt:</th>
                <td>{{ formatDate(complaint.received_at || complaint.created_at) }}</td>
              </tr>
              <tr>
                <th scope="row">Institution Name:</th>
                <td class="font-semibold">{{ complaint.institution_name || 'AICTE Approved Institution' }}</td>
                <th scope="row">AICTE Permanent ID:</th>
                <td class="font-mono font-bold">{{ complaint.institution_code || 'Pending Match' }}</td>
              </tr>
              <tr>
                <th scope="row">Institution State:</th>
                <td>{{ complaint.institution_state || 'Not Specified' }}</td>
                <th scope="row">Handling Bureau:</th>
                <td>{{ complaint.bureau_name || 'Public Grievance Redressal Cell' }}</td>
              </tr>
              <tr>
                <th scope="row">Complaint Category:</th>
                <td>{{ complaint.category }}</td>
                <th scope="row">Current Status:</th>
                <td class="font-bold">{{ complaint.status }}</td>
              </tr>
              <tr>
                <th scope="row">Complainant:</th>
                <td>{{ complaint.complainant_name || 'Citizen Complainant' }}</td>
                <th scope="row">Registered Contact:</th>
                <td>{{ complaint.complainant_email || '—' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="slip-section">
            <div class="slip-section-heading">Grievance Subject & Particulars</div>
            <div class="slip-section-body">
              <strong>Subject:</strong> {{ complaint.subject }}<br />
              <strong class="mt-1 block">Description:</strong>
              <p class="mt-0.5 text-xs text-slate-800 [text-wrap:pretty]">{{ complaint.description }}</p>
            </div>
          </div>

          <div class="slip-section" v-if="complaint.resolution_summary">
            <div class="slip-section-heading">Official AICTE Resolution</div>
            <div class="slip-section-body bg-emerald-50 border border-emerald-300">
              <p class="text-xs text-emerald-950 font-medium [text-wrap:pretty]">
                {{ complaint.resolution_summary }}
              </p>
              <small class="text-emerald-800 mt-1 block">
                Disposed on: {{ formatDate(complaint.disposed_at) }}
              </small>
            </div>
          </div>

          <div class="slip-footer-seal">
            <div class="seal-text">
              <p>This is an official computer-generated summary issued under the AICTE Cross-Bureau Complaint Coordination System.</p>
              <p>Quote ticket number for any official communication with AICTE.</p>
            </div>
            <div class="seal-mark">
              <CheckCircle2 :size="24" class="text-primary inline" />
              <span class="block text-xs font-bold text-primary mt-1">AICTE VERIFIED</span>
            </div>
          </div>
        </div>

        <div class="pt-3 flex justify-end no-print">
          <button type="button" class="button button-secondary" @click="isPrintSlipOpen = false">Close</button>
        </div>
      </div>
    </Modal>

    <GigwFooter />
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--canvas, #f4f6f8);
  font-family: 'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
}
.public-main {
  flex: 1;
  padding: 2rem 0 3rem;
}
.public-container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.25rem;
}
.public-page-header {
  margin-bottom: 1.5rem;
}
.header-icon-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #002b49;
}
.header-icon-title h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  color: #002b49;
}
.header-icon {
  color: #002b49;
}
.public-page-subtitle {
  font-size: 13px;
  color: #4b5563;
  margin-top: 4px;
}
.track-search-card {
  background: #ffffff;
  border: 1px solid #d2d6dc;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.track-search-form {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.track-input-wrap {
  position: relative;
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
}
.track-search-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  pointer-events: none;
}
.track-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #111827;
}
.track-input:focus {
  outline: none;
  border-color: #002b49;
  box-shadow: 0 0 0 2px rgba(0, 43, 73, 0.15);
}
.track-btn {
  padding: 9px 18px;
  font-size: 13px;
}
.track-quick-links {
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  gap: 6px;
}
.quick-label {
  font-weight: 600;
  color: #374151;
}

.public-error-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fef2f2;
  border: 1px solid #f87171;
  border-radius: 6px;
  padding: 1rem;
  color: #991b1b;
  margin-bottom: 1.5rem;
}
.error-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.error-copy strong {
  font-size: 13px;
  display: block;
}
.error-copy p {
  font-size: 12px;
  margin-top: 2px;
}

.track-result-card {
  background: #ffffff;
  border: 1px solid #d2d6dc;
  border-radius: 6px;
  padding: 1.75rem;
}
.result-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.25rem;
}
.result-tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #002b49;
  background: #e6f0fa;
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 4px;
}
.result-ticket-number {
  font-size: 1.35rem;
  font-weight: 700;
  font-family: 'IBM Plex Mono', monospace;
  color: #002b49;
  margin: 0;
}
.result-case-sub {
  font-size: 12px;
  color: #6b7280;
}
.result-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.stage-announcement-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #f0f7ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  padding: 1rem;
  margin: 1.25rem 0;
  color: #1e3a8a;
}
.stage-announcement-icon {
  margin-top: 1px;
}
.stage-announcement-copy strong {
  font-size: 13px;
  display: block;
}
.stage-announcement-copy p {
  font-size: 12px;
  margin-top: 2px;
  color: #1e40af;
}

.track-stepper-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin: 1.5rem 0;
}
.stepper-track-line {
  position: absolute;
  top: 16px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}
.stepper-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.stepper-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #cbd5e1;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}
.step-done .stepper-circle {
  background: #002b49;
  border-color: #002b49;
  color: #ffffff;
}
.step-current .stepper-circle {
  background: #ffffff;
  border-color: #002b49;
  color: #002b49;
  box-shadow: 0 0 0 3px rgba(0, 43, 73, 0.15);
}
.stepper-title {
  font-size: 11px;
  font-weight: 600;
  color: #111827;
  display: block;
}
.stepper-desc {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
  line-height: 1.3;
}
.stepper-date {
  font-size: 9px;
  color: #94a3b8;
  margin-top: 2px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  margin: 1.25rem 0;
}
.result-meta-item {
  display: flex;
  flex-direction: column;
}
.meta-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}
.meta-value {
  font-size: 13px;
  color: #0f172a;
  margin-top: 2px;
}
.meta-sub {
  font-size: 11px;
  color: #64748b;
}

.result-prose-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.25rem;
  margin-top: 1.25rem;
}
.prose-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #002b49;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.prose-title-sub {
  margin-top: 12px;
}
.prose-subject {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
.prose-body {
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
}
.doc-attachment-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #334155;
  margin-top: 10px;
}

.resolution-box {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: 6px;
  padding: 1.25rem;
  margin-top: 1.5rem;
}
.resolution-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #065f46;
  font-size: 13px;
  margin-bottom: 6px;
}
.resolution-icon {
  color: #059669;
}
.resolution-body {
  font-size: 13px;
  color: #064e3b;
  line-height: 1.6;
}
.resolution-footer {
  font-size: 11px;
  color: #047857;
  margin-top: 8px;
  font-weight: 500;
}

/* Printable Slip Styles */
.official-acknowledgement-sheet {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 1.5rem;
  font-family: 'DM Sans', 'Segoe UI', serif;
  color: #0f172a;
}
.letterhead-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #002b49;
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.letterhead-text {
  text-align: center;
  flex: 1;
}
.letterhead-org-hi {
  font-size: 14px;
  font-weight: 700;
  color: #002b49;
  margin: 0;
}
.letterhead-org-en {
  font-size: 13px;
  font-weight: 700;
  color: #002b49;
  letter-spacing: 0.04em;
  margin: 1px 0;
}
.letterhead-sub {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  margin: 0;
}
.letterhead-addr {
  font-size: 10px;
  color: #64748b;
  margin: 0;
}
.slip-title-banner {
  background: #002b49;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 5px;
  margin-bottom: 12px;
}
.slip-meta-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  margin-bottom: 12px;
}
.slip-meta-table th, .slip-meta-table td {
  border: 1px solid #cbd5e1;
  padding: 5px 8px;
  text-align: left;
}
.slip-meta-table th {
  background: #f8fafc;
  color: #334155;
  width: 18%;
}
.slip-section {
  margin-bottom: 12px;
}
.slip-section-heading {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #002b49;
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 3px;
  margin-bottom: 5px;
}
.slip-section-body {
  font-size: 11px;
  line-height: 1.5;
  padding: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}
.slip-footer-seal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed #cbd5e1;
  padding-top: 10px;
  margin-top: 14px;
}
.seal-text {
  font-size: 10px;
  color: #64748b;
  line-height: 1.4;
  max-width: 440px;
}
.seal-mark {
  text-align: center;
}

@media print {
  body * {
    visibility: hidden;
  }
  #printable-slip, #printable-slip * {
    visibility: visible;
  }
  #printable-slip {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none;
    padding: 0;
  }
  .no-print {
    display: none !important;
  }
}
</style>
