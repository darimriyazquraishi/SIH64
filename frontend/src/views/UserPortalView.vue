<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import Modal from '@/components/Modal.vue'
import IndianEmblem from '@/components/IndianEmblem.vue'
import aicteLogo from '@/assets/aicte-logo.png'
import {
  PlusCircle, Search, FileText, CheckCircle2, Clock3,
  Calendar, Building2, ShieldCheck, RefreshCw, ChevronRight,
  Printer, Copy, Check, Layers, MessageSquare, Paperclip,
  Upload, AlertCircle, Info, Download
} from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const complaints = ref<any[]>([])
const loading = ref(false)
const selectedComplaint = ref<any | null>(null)
const isDetailOpen = ref(false)
const isResponseModalOpen = ref(false)
const isPrintSlipOpen = ref(false)
const ticketCopied = ref(false)

// Complainant Clarification Form
const responseText = ref('')
const responseFile = ref<File | null>(null)
const submittingResponse = ref(false)
const responseError = ref('')
const responseSuccess = ref('')

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

function openResponseModal(comp: any) {
  selectedComplaint.value = comp
  responseText.value = ''
  responseFile.value = null
  responseError.value = ''
  responseSuccess.value = ''
  isResponseModalOpen.value = true
}

function openPrintSlip(comp: any) {
  selectedComplaint.value = comp
  isPrintSlipOpen.value = true
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    responseFile.value = target.files[0]
  }
}

async function submitComplainantResponse() {
  if (!selectedComplaint.value) return
  if (!responseText.value.trim() && !responseFile.value) {
    responseError.value = 'Please provide clarification remarks or attach a document.'
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

    const res = await apiClient.post(`/complaints/${selectedComplaint.value.id}/respond`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    responseSuccess.value = 'Your information has been successfully recorded on the case timeline.'
    if (res.data.complaint) {
      selectedComplaint.value = res.data.complaint
    }
    await loadMyComplaints()

    setTimeout(() => {
      isResponseModalOpen.value = false
    }, 1500)
  } catch (err: any) {
    responseError.value = err?.response?.data?.error || 'Failed to submit additional information. Please retry.'
  } finally {
    submittingResponse.value = false
  }
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

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
  if (stage === 1) return 'Your complaint has been received and is registered in the AICTE central register.'
  if (stage === 2) return 'AICTE officials are reviewing the submitted details and documentation.'
  if (stage === 3) return `Assigned to ${selectedComplaint.value?.bureau_name || 'the responsible bureau'} for departmental examination.`
  if (stage === 4) return 'Statutory inquiry active with the concerned institution.'
  if (stage === 5) return 'Your complaint has been formally resolved. Official directives are recorded below.'
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

function triggerPrint() {
  window.print()
}
</script>

<template>
  <div class="user-portal-canvas">
    <!-- Complainant Top Banner -->
    <div class="user-portal-hero">
      <div class="user-hero-content">
        <div class="user-role-tag">
          <ShieldCheck :size="14" />
          <span>Public Grievance Redressal Service · AICTE</span>
        </div>
        <h1 class="user-hero-title">Welcome, {{ auth.user?.name || 'Complainant' }}</h1>
        <p class="user-hero-sub [text-wrap:pretty]">
          View your submitted grievances, track live departmental progress, submit clarifications on request, and print official submission acknowledgements.
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
          <span>File New Complaint</span>
        </button>

        <button
          type="button"
          class="button button-secondary user-hero-btn"
          @click="router.push('/track')"
        >
          <Search :size="16" />
          <span>Track by Ticket</span>
        </button>
      </div>
    </div>

    <!-- My Complaints Section -->
    <div class="user-section-card">
      <div class="user-section-header">
        <div>
          <h2 class="user-section-title">My Registered Complaints</h2>
          <p class="user-section-sub">
            All complaints submitted under account: <strong>{{ auth.user?.email }}</strong>. Internal Bureau notes are restricted to authorized officials.
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
        <p class="mt-2 text-sm text-quiet">Loading your complaints from AICTE register…</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="complaints.length === 0" class="user-empty-box">
        <FileText :size="40" class="text-quiet mb-3" />
        <h3>No complaints registered yet</h3>
        <p class="text-sm text-quiet max-w-md mx-auto mt-1 [text-wrap:pretty]">
          You have not submitted any complaints through this account. When you submit a complaint about an AICTE-approved institution, it will appear here with live departmental updates.
        </p>
        <div class="flex gap-3 mt-4">
          <button
            type="button"
            class="button button-primary"
            @click="router.push('/register')"
          >
            <PlusCircle :size="16" />
            <span>File New Complaint</span>
          </button>
          <button
            type="button"
            class="button button-secondary"
            @click="router.push('/track')"
          >
            <Search :size="16" />
            <span>Track by Ticket Number</span>
          </button>
        </div>
      </div>

      <!-- Clean Complaints Table with Permanent ID -->
      <div v-else class="table-container">
        <table class="data-table" aria-label="My registered complaints table">
          <thead>
            <tr>
              <th scope="col">Ticket Number</th>
              <th scope="col">Institution & Permanent ID</th>
              <th scope="col">Subject & Category</th>
              <th scope="col">Responsible Bureau</th>
              <th scope="col">Submission Date</th>
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

              <!-- Institution & Permanent ID -->
              <td>
                <span class="font-medium text-slate-900 block">{{ c.institution_name || 'AICTE Approved Institution' }}</span>
                <span class="gov-permanent-id" v-if="c.institution_code">
                  Permanent ID: <strong>{{ c.institution_code }}</strong>
                </span>
                <span v-else class="text-xs text-slate-500">ID Pending Verification</span>
              </td>

              <!-- Subject & Category -->
              <td>
                <span class="font-medium text-slate-900 block">{{ c.subject }}</span>
                <small class="text-xs text-quiet">{{ c.category }}</small>
              </td>

              <!-- Responsible Bureau -->
              <td>
                <span class="text-xs font-semibold text-slate-800">{{ c.bureau_name || c.current_bureau_code || 'PGRC' }}</span>
              </td>

              <!-- Submission Date -->
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

              <!-- Actions -->
              <td class="text-right" @click.stop>
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    class="button button-quiet button-sm"
                    title="Respond to query / submit additional info"
                    @click="openResponseModal(c)"
                  >
                    <MessageSquare :size="13" />
                    <span>Provide Info</span>
                  </button>

                  <button
                    type="button"
                    class="button button-quiet button-sm"
                    title="Download Official Acknowledgement Slip"
                    @click="openPrintSlip(c)"
                  >
                    <Download :size="13" />
                    <span>Slip</span>
                  </button>

                  <button
                    type="button"
                    class="button button-secondary button-sm"
                    @click="openDetail(c)"
                  >
                    <span>View</span>
                    <ChevronRight :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 1. COMPLAINT DETAIL MODAL -->
    <Modal
      :isOpen="isDetailOpen"
      :title="`Grievance Details: ${selectedComplaint?.ticket_number || selectedComplaint?.case_number || ''}`"
      @close="isDetailOpen = false"
    >
      <div v-if="selectedComplaint" class="space-y-4">
        <!-- Top Callout -->
        <div class="p-4 rounded border border-line bg-muted flex items-center justify-between flex-wrap gap-3">
          <div>
            <span class="text-xs text-quiet uppercase tracking-wider font-semibold block">Current Official Status</span>
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
              class="button button-primary button-sm"
              @click="openResponseModal(selectedComplaint)"
            >
              <MessageSquare :size="14" />
              <span>Submit Clarification / Documents</span>
            </button>

            <button
              type="button"
              class="button button-secondary button-sm"
              @click="openPrintSlip(selectedComplaint)"
            >
              <Printer :size="14" />
              <span>Print Acknowledgement</span>
            </button>
          </div>
        </div>

        <!-- 5-Stage Timeline Stepper in Modal -->
        <div class="p-4 rounded border border-line bg-canvas">
          <strong class="text-xs uppercase tracking-wider text-quiet block mb-2">Departmental Progression (Stage {{ modalStageNumber }} of 5)</strong>
          <p class="text-sm font-medium text-slate-800 mb-3">{{ modalStageExplanation }}</p>

          <div class="grid grid-cols-5 gap-2 text-center text-xs">
            <div
              v-for="(stg, idx) in ['Submitted', 'Under Review', 'Assigned', 'In Inquiry', 'Resolved']"
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
            <span class="text-quiet block">Concerned Technical Institution</span>
            <strong class="text-slate-900 text-sm mt-0.5 block">
              {{ selectedComplaint.institution_name || 'AICTE Institution' }}
            </strong>
            <span class="gov-permanent-id mt-1 block" v-if="selectedComplaint.institution_code">
              Permanent ID: <strong>{{ selectedComplaint.institution_code }}</strong>
            </span>
            <span v-if="selectedComplaint.institution_state" class="text-quiet mt-0.5 block">
              State / Region: {{ selectedComplaint.institution_state }}
            </span>
          </div>

          <div class="p-3 rounded border border-line bg-surface">
            <span class="text-quiet block">Handling Authority & Category</span>
            <strong class="text-slate-900 text-sm mt-0.5 block">
              {{ selectedComplaint.bureau_name || 'Public Grievance Redressal Cell' }}
            </strong>
            <span class="text-quiet mt-0.5 block">
              Category: {{ selectedComplaint.category }}
            </span>
            <span class="text-quiet mt-0.5 block">
              Submitted: {{ formatDate(selectedComplaint.received_at || selectedComplaint.created_at) }}
            </span>
          </div>
        </div>

        <!-- Complaint Subject & Description -->
        <div class="p-4 rounded border border-line bg-surface">
          <strong class="text-sm font-semibold text-slate-900 block mb-1">
            {{ selectedComplaint.subject }}
          </strong>
          <p class="text-xs leading-relaxed text-slate-800 [text-wrap:pretty]">
            {{ selectedComplaint.description }}
          </p>
          <div v-if="selectedComplaint.has_supporting_document" class="mt-2 text-xs text-primary font-medium flex items-center gap-1.5">
            <Paperclip :size="13" />
            <span>Document on file: {{ selectedComplaint.supporting_document_name || 'Attached file' }}</span>
          </div>
        </div>

        <!-- Action History (Public Timeline Only) -->
        <div class="p-4 rounded border border-line bg-surface" v-if="selectedComplaint.actions && selectedComplaint.actions.length">
          <strong class="text-xs uppercase tracking-wider text-quiet block mb-2">Public Action History</strong>
          <div class="space-y-2">
            <div
              v-for="act in selectedComplaint.actions"
              :key="act.id || act.created_at"
              class="p-2.5 rounded bg-muted border border-line text-xs"
            >
              <div class="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                <span>{{ act.description }}</span>
                <span class="text-quiet font-normal">{{ formatDateTime(act.created_at) }}</span>
              </div>
              <div class="text-quiet">Recorded by: {{ act.performed_by_name || 'AICTE Official' }}</div>
            </div>
          </div>
        </div>

        <!-- Resolution Box if Disposed -->
        <div v-if="selectedComplaint.resolution_summary" class="p-4 rounded border border-emerald-500/30 bg-emerald-50">
          <div class="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-1">
            <CheckCircle2 :size="16" />
            <span>Official Resolution & Redressal Directives</span>
          </div>
          <p class="text-xs text-emerald-900 [text-wrap:pretty]">
            {{ selectedComplaint.resolution_summary }}
          </p>
          <small v-if="selectedComplaint.disposed_at" class="text-xs text-emerald-700 block mt-1">
            Formally concluded on {{ formatDate(selectedComplaint.disposed_at) }}
          </small>
        </div>

        <div class="pt-2 flex justify-end">
          <button type="button" class="button button-secondary" @click="isDetailOpen = false">Close</button>
        </div>
      </div>
    </Modal>

    <!-- 2. SUBMIT CLARIFICATION / ADDITIONAL DOCUMENTS MODAL -->
    <Modal
      :isOpen="isResponseModalOpen"
      :title="`Provide Information: ${selectedComplaint?.ticket_number || ''}`"
      @close="isResponseModalOpen = false"
    >
      <div v-if="selectedComplaint" class="space-y-4">
        <div class="p-3 bg-muted rounded border border-line text-xs">
          <p class="text-slate-800 [text-wrap:pretty]">
            Use this form to submit clarifying remarks or upload missing supporting documents requested by the handling AICTE Bureau <strong>without filing a new complaint</strong>.
          </p>
        </div>

        <div v-if="responseError" class="p-3 bg-red-50 border border-red-300 rounded text-red-800 text-xs">
          {{ responseError }}
        </div>
        <div v-if="responseSuccess" class="p-3 bg-green-50 border border-green-300 rounded text-green-800 text-xs">
          {{ responseSuccess }}
        </div>

        <form @submit.prevent="submitComplainantResponse" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1" for="response-remarks">
              Response / Clarification Remarks <span class="text-red-600">*</span>
            </label>
            <textarea
              id="response-remarks"
              v-model="responseText"
              rows="4"
              class="w-full text-xs p-2.5 border border-line rounded bg-surface focus:outline-none focus:border-primary"
              placeholder="Explain the additional particulars or clarify the inquiry raised by the officer…"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-800 mb-1" for="response-file">
              Upload Supporting Document (PDF / JPEG / PNG, Max 10MB)
            </label>
            <input
              id="response-file"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              class="w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
              @change="handleFileChange"
            />
            <small class="text-quiet text-xs mt-1 block">
              Ensure documents are legible. Upload fee receipts, admissions letters, or relevant affidavits.
            </small>
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

    <!-- 3. OFFICIAL ACKNOWLEDGEMENT & STATUS SUMMARY SLIP (PRINTABLE) -->
    <Modal
      :isOpen="isPrintSlipOpen"
      :title="`Official Acknowledgement Slip: ${selectedComplaint?.ticket_number || ''}`"
      @close="isPrintSlipOpen = false"
    >
      <div v-if="selectedComplaint" class="print-slip-container">
        <!-- Print Trigger Bar -->
        <div class="print-action-bar no-print mb-4 flex items-center justify-between p-3 bg-muted rounded border border-line">
          <span class="text-xs text-slate-700">Official Computer-Generated Acknowledgement</span>
          <button type="button" class="button button-primary button-sm" @click="triggerPrint">
            <Printer :size="14" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        <!-- The Printable Document Paper -->
        <div class="official-acknowledgement-sheet" id="printable-slip">
          <!-- Letterhead Header -->
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

          <!-- Primary Metadata Table -->
          <table class="slip-meta-table">
            <tbody>
              <tr>
                <th scope="row">Ticket Number:</th>
                <td class="font-mono font-bold">{{ selectedComplaint.ticket_number || selectedComplaint.case_number }}</td>
                <th scope="row">Date of Receipt:</th>
                <td>{{ formatDate(selectedComplaint.received_at || selectedComplaint.created_at) }}</td>
              </tr>
              <tr>
                <th scope="row">Institution Name:</th>
                <td class="font-semibold">{{ selectedComplaint.institution_name || 'AICTE Approved Institution' }}</td>
                <th scope="row">AICTE Permanent ID:</th>
                <td class="font-mono font-bold">{{ selectedComplaint.institution_code || 'Pending Match' }}</td>
              </tr>
              <tr>
                <th scope="row">Institution State:</th>
                <td>{{ selectedComplaint.institution_state || 'Not Specified' }}</td>
                <th scope="row">Handling Bureau:</th>
                <td>{{ selectedComplaint.bureau_name || 'Public Grievance Redressal Cell' }}</td>
              </tr>
              <tr>
                <th scope="row">Complaint Category:</th>
                <td>{{ selectedComplaint.category }}</td>
                <th scope="row">Current Status:</th>
                <td class="font-bold">{{ selectedComplaint.status }}</td>
              </tr>
              <tr>
                <th scope="row">Complainant Name:</th>
                <td>{{ selectedComplaint.complainant_name || auth.user?.name || 'Verified Citizen' }}</td>
                <th scope="row">Registered Email:</th>
                <td>{{ selectedComplaint.complainant_email || auth.user?.email || '—' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Particulars -->
          <div class="slip-section">
            <div class="slip-section-heading">Grievance Subject & Particulars</div>
            <div class="slip-section-body">
              <strong>Subject:</strong> {{ selectedComplaint.subject }}<br />
              <strong class="mt-1 block">Description:</strong>
              <p class="mt-0.5 text-xs text-slate-800 [text-wrap:pretty]">{{ selectedComplaint.description }}</p>
            </div>
          </div>

          <!-- Recorded Progression Timeline -->
          <div class="slip-section" v-if="selectedComplaint.actions && selectedComplaint.actions.length">
            <div class="slip-section-heading">Official Action Chronology</div>
            <table class="slip-actions-table">
              <thead>
                <tr>
                  <th scope="col" style="width: 25%">Date & Time</th>
                  <th scope="col" style="width: 50%">Action Recorded</th>
                  <th scope="col" style="width: 25%">Authorized Official</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="act in selectedComplaint.actions" :key="act.id || act.created_at">
                  <td>{{ formatDateTime(act.created_at) }}</td>
                  <td>{{ act.description }}</td>
                  <td>{{ act.performed_by_name || 'AICTE Officer' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Official Resolution if Disposed -->
          <div class="slip-section" v-if="selectedComplaint.resolution_summary">
            <div class="slip-section-heading">Final Official Directives / Disposal Order</div>
            <div class="slip-section-body bg-emerald-50 border border-emerald-300">
              <p class="text-xs text-emerald-950 font-medium [text-wrap:pretty]">
                {{ selectedComplaint.resolution_summary }}
              </p>
              <small class="text-emerald-800 mt-1 block">
                Disposed on: {{ formatDate(selectedComplaint.disposed_at) }}
              </small>
            </div>
          </div>

          <!-- Digital Verification Seal -->
          <div class="slip-footer-seal">
            <div class="seal-text">
              <p>This is an official, computer-generated record issued by the AICTE Cross-Bureau Complaint Coordination System.</p>
              <p>For inquiries, quote the AICTE Ticket Number at <strong>pgrc@aicte.gov.in</strong> or AICTE Headquarters, New Delhi.</p>
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
  </div>
</template>

<style scoped>
.user-portal-canvas {
  padding: 0;
}
.user-portal-hero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #d2d6dc;
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
  background: #e6f0fa;
  border: 1px solid #bfdbfe;
  font-size: 12px;
  font-weight: 600;
  color: #002b49;
  margin-bottom: 0.5rem;
}
.user-hero-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #002b49;
  letter-spacing: -0.01em;
}
.user-hero-sub {
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 0.25rem;
  max-width: 650px;
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
.gov-permanent-id {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 1px 5px;
  border-radius: 3px;
  color: #0f172a;
}
.user-section-card {
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #d2d6dc;
  padding: 1.25rem;
}
.user-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}
.user-section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #002b49;
}
.user-section-sub {
  font-size: 0.75rem;
  color: #4b5563;
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
  color: #111827;
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
.slip-meta-table, .slip-actions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  margin-bottom: 12px;
}
.slip-meta-table th, .slip-meta-table td,
.slip-actions-table th, .slip-actions-table td {
  border: 1px solid #cbd5e1;
  padding: 5px 8px;
  text-align: left;
}
.slip-meta-table th {
  background: #f8fafc;
  color: #334155;
  width: 18%;
}
.slip-actions-table th {
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 700;
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
