<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  FilePlus2,
  ShieldCheck,
  Building2,
  UploadCloud,
  FileCheck2,
  X,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Search,
  ArrowRight,
  User,
  Mail,
  Phone,
  FileText,
  AlertTriangle
} from 'lucide-vue-next'
import PublicNav from '@/components/PublicNav.vue'

const router = useRouter()

// Form Data
const complainantName = ref('')
const complainantEmail = ref('')
const complainantMobile = ref('')

// Institution Selection
const institutionMode = ref<'search' | 'manual'>('search')
const institutionSearchQuery = ref('')
const institutionSearchResults = ref<any[]>([])
const selectedInstitution = ref<any>(null)
const manualInstitutionName = ref('')
const manualInstitutionState = ref('')

// Complaint Particulars
const category = ref('Fee Overcharging / Capitation')
const subject = ref('')
const description = ref('')
const priority = ref('Medium')

// Supporting File
const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// Inline Validation Errors (preserves values on failure)
const errors = reactive({
  name: '',
  email: '',
  mobile: '',
  institution: '',
  subject: '',
  description: '',
  file: '',
  general: ''
})

// State
const loading = ref(false)
const categories = ref<string[]>([
  'Fee Overcharging / Capitation',
  'Faculty Quality / Non-Payment',
  'Infrastructure Deficiencies',
  'Ragging Incident',
  'Approval / Accreditation Fraud',
  'Admission Irregularity',
  'General Administration'
])

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'All India'
]

// Auto-adjust priority if category is Ragging
watch(category, (newCat) => {
  if (newCat.toLowerCase().includes('ragging')) {
    priority.value = 'Critical'
  } else if (priority.value === 'Critical') {
    priority.value = 'Medium'
  }
})

// Clear inline errors when user edits
watch(complainantName, () => { errors.name = '' })
watch(complainantEmail, () => { errors.email = '' })
watch(subject, () => { errors.subject = '' })
watch(description, () => { errors.description = '' })
watch(selectedInstitution, () => { errors.institution = '' })
watch(manualInstitutionName, () => { errors.institution = '' })

// Search institutions with debounce
let searchDebounceTimer: any = null
watch(institutionSearchQuery, (q) => {
  clearTimeout(searchDebounceTimer)
  if (!q || q.trim().length < 2) {
    institutionSearchResults.value = []
    return
  }
  searchDebounceTimer = setTimeout(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/public/institutions?q=${encodeURIComponent(q.trim())}`)
      if (res.ok) {
        const data = await res.json()
        institutionSearchResults.value = data.institutions || []
      }
    } catch {
      // Ignore network errors in preview
    }
  }, 250)
})

function selectInstitution(inst: any) {
  selectedInstitution.value = inst
  institutionSearchQuery.value = inst.name
  institutionSearchResults.value = []
  errors.institution = ''
}

function clearSelectedInstitution() {
  selectedInstitution.value = null
  institutionSearchQuery.value = ''
  institutionSearchResults.value = []
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    validateAndAssignFile(target.files[0])
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    validateAndAssignFile(event.dataTransfer.files[0])
  }
}

function validateAndAssignFile(file: File) {
  errors.file = ''
  if (file.size > 16 * 1024 * 1024) {
    errors.file = 'File exceeds maximum upload limit of 16MB.'
    return
  }
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt']
  const fileExt = '.' + (file.name.split('.').pop() || '').toLowerCase()
  if (!allowedExtensions.includes(fileExt)) {
    errors.file = 'File type not supported. Please upload a PDF, Word document, or image.'
    return
  }
  selectedFile.value = file
}

function removeFile() {
  selectedFile.value = null
  errors.file = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function loadMeta() {
  try {
    const res = await fetch('http://localhost:5000/api/v1/public/meta')
    if (res.ok) {
      const data = await res.json()
      if (data.categories && data.categories.length) {
        categories.value = data.categories
      }
    }
  } catch {
    // Keep default categories
  }
}

function validateForm(): boolean {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.institution = ''
  errors.subject = ''
  errors.description = ''
  errors.general = ''

  if (!complainantName.value.trim()) {
    errors.name = 'Please enter your full name.'
    valid = false
  }

  const email = complainantEmail.value.trim()
  if (!email) {
    errors.email = 'Email address is required for status notifications.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address (e.g. name@example.com).'
    valid = false
  }

  if (institutionMode.value === 'search' && !selectedInstitution.value && !institutionSearchQuery.value.trim()) {
    errors.institution = 'Please select or search for the technical college/institution.'
    valid = false
  }

  if (institutionMode.value === 'manual' && !manualInstitutionName.value.trim()) {
    errors.institution = 'Please enter the institution name.'
    valid = false
  }

  if (!subject.value.trim()) {
    errors.subject = 'Please enter a summary subject for your complaint.'
    valid = false
  } else if (subject.value.trim().length < 5) {
    errors.subject = 'Subject is too short (minimum 5 characters).'
    valid = false
  }

  if (!description.value.trim()) {
    errors.description = 'Please provide detailed facts about the complaint.'
    valid = false
  } else if (description.value.trim().length < 15) {
    errors.description = 'Please provide more details (minimum 15 characters).'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validateForm()) {
    // Scroll smoothly to top error
    const firstError = document.querySelector('.field-error-text')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  loading.value = true
  errors.general = ''

  try {
    const formData = new FormData()
    formData.append('complainant_name', complainantName.value.trim())
    formData.append('complainant_email', complainantEmail.value.trim())
    if (complainantMobile.value.trim()) {
      formData.append('complainant_mobile', complainantMobile.value.trim())
    }

    if (institutionMode.value === 'search' && selectedInstitution.value) {
      formData.append('institution_id', String(selectedInstitution.value.id))
      formData.append('institution_name', selectedInstitution.value.name)
    } else if (institutionMode.value === 'search' && institutionSearchQuery.value.trim()) {
      formData.append('institution_name', institutionSearchQuery.value.trim())
    } else {
      formData.append('institution_name', manualInstitutionName.value.trim())
      if (manualInstitutionState.value) {
        formData.append('institution_state', manualInstitutionState.value)
      }
    }

    formData.append('category', category.value)
    formData.append('subject', subject.value.trim())
    formData.append('description', description.value.trim())
    formData.append('priority', priority.value)

    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }

    const res = await fetch('http://localhost:5000/api/v1/public/complaints', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      errors.general = data.error || 'Failed to submit complaint. Please check your entries and try again.'
      loading.value = false
      return
    }

    // Success: Navigate to dedicated confirmation screen with ticket number
    router.push({
      path: '/confirmation',
      query: {
        ticket: data.ticket_number,
        subject: data.complaint?.subject || subject.value,
        institution: data.complaint?.institution_name || selectedInstitution.value?.name || manualInstitutionName.value,
        category: data.complaint?.category || category.value,
        bureau: data.complaint?.bureau_name || 'Public Grievance Redressal Cell'
      },
      state: {
        ticket_number: data.ticket_number,
        subject: data.complaint?.subject || subject.value,
        institution_name: data.complaint?.institution_name || selectedInstitution.value?.name || manualInstitutionName.value,
        category: data.complaint?.category || category.value,
        bureau_name: data.complaint?.bureau_name || 'Public Grievance Redressal Cell'
      }
    })
  } catch (err: any) {
    errors.general = 'Unable to reach the complaint registration service. Please verify your connection or try again shortly.'
    loading.value = false
  }
}

onMounted(() => {
  loadMeta()
})
</script>

<template>
  <div class="public-layout">
    <PublicNav />

    <main class="public-main">
      <div class="public-container">
        <!-- Explanatory Header / Flow Guide -->
        <div class="public-page-header">
          <div class="header-icon-title">
            <FilePlus2 :size="26" class="header-icon" />
            <h1>Register a Complaint</h1>
          </div>
          <p class="public-page-subtitle">
            Submit a formal complaint regarding any AICTE-approved technical institution or university. An official ticket number will be generated immediately for tracking.
          </p>

          <!-- 4-Step Process Bar for Public Clarity -->
          <div class="flow-steps-bar" role="navigation" aria-label="Complaint workflow">
            <div class="flow-step flow-step-active">
              <span class="flow-step-num">1</span>
              <div class="flow-step-text">
                <strong>Submit Details</strong>
                <small>Fill form & evidence</small>
              </div>
            </div>
            <span class="flow-arrow" aria-hidden="true">→</span>
            <div class="flow-step">
              <span class="flow-step-num">2</span>
              <div class="flow-step-text">
                <strong>Get Ticket</strong>
                <small>Instant AICTE ID</small>
              </div>
            </div>
            <span class="flow-arrow" aria-hidden="true">→</span>
            <div class="flow-step">
              <span class="flow-step-num">3</span>
              <div class="flow-step-text">
                <strong>Under Review</strong>
                <small>Departmental inquiry</small>
              </div>
            </div>
            <span class="flow-arrow" aria-hidden="true">→</span>
            <div class="flow-step">
              <span class="flow-step-num">4</span>
              <div class="flow-step-text">
                <strong>Resolution</strong>
                <small>Official outcome</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Container -->
        <div class="public-form-card">
          <form @submit.prevent="handleSubmit" novalidate>
            <!-- SECTION 1: COMPLAINANT CONTACT -->
            <div class="form-section">
              <div class="section-title-row">
                <span class="section-num">1</span>
                <div>
                  <h2 class="form-section-heading">Your Contact Information</h2>
                  <p class="form-section-desc">We will send your ticket number and case status updates to this email address.</p>
                </div>
              </div>

              <div class="form-grid-two">
                <div class="form-field">
                  <label for="complainant-name" class="field-label">
                    Full Name <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="complainant-name"
                    v-model="complainantName"
                    type="text"
                    class="public-input"
                    :class="{ 'input-has-error': errors.name }"
                    placeholder="e.g. Ramesh Kumar"
                    required
                    autocomplete="name"
                  />
                  <span v-if="errors.name" class="field-error-text">{{ errors.name }}</span>
                </div>

                <div class="form-field">
                  <label for="complainant-email" class="field-label">
                    Email Address <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="complainant-email"
                    v-model="complainantEmail"
                    type="email"
                    class="public-input"
                    :class="{ 'input-has-error': errors.email }"
                    placeholder="e.g. ramesh@example.com"
                    required
                    autocomplete="email"
                  />
                  <span v-if="errors.email" class="field-error-text">{{ errors.email }}</span>
                  <span v-else class="field-hint-text">Your ticket number and replies will be delivered here.</span>
                </div>
              </div>

              <div class="form-field mt-3">
                <label for="complainant-mobile" class="field-label">
                  Mobile Number <small class="text-quiet">(Optional)</small>
                </label>
                <input
                  id="complainant-mobile"
                  v-model="complainantMobile"
                  type="tel"
                  class="public-input"
                  placeholder="10-digit mobile number for SMS alerts"
                  autocomplete="tel"
                />
              </div>
            </div>

            <!-- Divider -->
            <div class="section-divider" />

            <!-- SECTION 2: TARGET INSTITUTION -->
            <div class="form-section">
              <div class="section-title-row">
                <span class="section-num">2</span>
                <div>
                  <h2 class="form-section-heading">Concerned Institution</h2>
                  <p class="form-section-desc">Search the official AICTE college directory or enter the name manually.</p>
                </div>
              </div>

              <!-- Mode Switcher -->
              <div class="inst-mode-toggle">
                <button
                  type="button"
                  :class="['mode-btn', { 'mode-btn-active': institutionMode === 'search' }]"
                  @click="institutionMode = 'search'"
                >
                  <Search :size="14" /> Search College Directory
                </button>
                <button
                  type="button"
                  :class="['mode-btn', { 'mode-btn-active': institutionMode === 'manual' }]"
                  @click="institutionMode = 'manual'"
                >
                  <Building2 :size="14" /> Enter College Manually
                </button>
              </div>

              <!-- Search Directory Mode -->
              <div v-if="institutionMode === 'search'" class="institution-search-wrap">
                <div class="search-input-box">
                  <Search :size="16" class="search-box-icon" />
                  <input
                    v-model="institutionSearchQuery"
                    type="text"
                    class="public-input"
                    :class="{ 'input-has-error': errors.institution }"
                    placeholder="Type college name, city, or AICTE permanent ID..."
                    :disabled="Boolean(selectedInstitution)"
                    aria-label="Search institution"
                  />
                  <button
                    v-if="selectedInstitution"
                    type="button"
                    class="button button-quiet clear-inst-btn"
                    @click="clearSelectedInstitution"
                  >
                    <X :size="14" /> Change College
                  </button>
                </div>
                <span v-if="errors.institution" class="field-error-text">{{ errors.institution }}</span>

                <!-- Selected Institution Pill -->
                <div v-if="selectedInstitution" class="selected-inst-pill">
                  <CheckCircle2 :size="18" class="check-icon" />
                  <div class="selected-inst-copy">
                    <strong>{{ selectedInstitution.name }}</strong>
                    <small>Permanent ID: {{ selectedInstitution.institution_code }} · {{ selectedInstitution.state }}{{ selectedInstitution.district ? `, ${selectedInstitution.district}` : '' }}</small>
                  </div>
                </div>

                <!-- Autocomplete Dropdown -->
                <ul
                  v-if="!selectedInstitution && institutionSearchResults.length > 0"
                  class="inst-autocomplete-list"
                  role="listbox"
                >
                  <li
                    v-for="inst in institutionSearchResults"
                    :key="inst.id"
                    class="inst-autocomplete-item"
                    role="option"
                    tabindex="0"
                    @click="selectInstitution(inst)"
                    @keydown.enter="selectInstitution(inst)"
                  >
                    <strong>{{ inst.name }}</strong>
                    <small>{{ inst.state }} · AICTE Permanent ID: {{ inst.institution_code }}</small>
                  </li>
                </ul>
              </div>

              <!-- Manual Mode -->
              <div v-else class="form-grid-two">
                <div class="form-field">
                  <label for="manual-inst-name" class="field-label">
                    Institution / College Name <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="manual-inst-name"
                    v-model="manualInstitutionName"
                    type="text"
                    class="public-input"
                    :class="{ 'input-has-error': errors.institution }"
                    placeholder="Full name of the college"
                    required
                  />
                  <span v-if="errors.institution" class="field-error-text">{{ errors.institution }}</span>
                </div>

                <div class="form-field">
                  <label for="manual-inst-state" class="field-label">State / Union Territory</label>
                  <select id="manual-inst-state" v-model="manualInstitutionState" class="public-select">
                    <option value="">Select State</option>
                    <option v-for="state in indianStates" :key="state" :value="state">
                      {{ state }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="section-divider" />

            <!-- SECTION 3: COMPLAINT DETAILS & EVIDENCE -->
            <div class="form-section">
              <div class="section-title-row">
                <span class="section-num">3</span>
                <div>
                  <h2 class="form-section-heading">Complaint Details & Evidence</h2>
                  <p class="form-section-desc">Select the category, describe the matter clearly, and upload any supporting proof.</p>
                </div>
              </div>

              <div class="form-grid-two">
                <div class="form-field">
                  <label for="complaint-category" class="field-label">
                    Category <span class="required" aria-hidden="true">*</span>
                  </label>
                  <select id="complaint-category" v-model="category" class="public-select" required>
                    <option v-for="cat in categories" :key="cat" :value="cat">
                      {{ cat }}
                    </option>
                  </select>
                  <span class="field-hint-text">Select the category that best matches your issue.</span>
                </div>

                <div class="form-field">
                  <label for="complaint-urgency" class="field-label">
                    Urgency Level
                  </label>
                  <select id="complaint-urgency" v-model="priority" class="public-select">
                    <option value="Low">Low - General inquiry or suggestion</option>
                    <option value="Medium">Medium - Standard academic or administrative issue</option>
                    <option value="High">High - Time-sensitive admission or fee dispute</option>
                    <option value="Critical">Critical - Immediate student safety or ragging matter</option>
                  </select>
                  <span class="field-hint-text">High and critical matters receive priority departmental review.</span>
                </div>
              </div>

              <!-- Ragging Warning Banner -->
              <div v-if="category.includes('Ragging')" class="ragging-alert" role="alert">
                <AlertCircle :size="18" />
                <span>Ragging reports receive critical priority and route directly to the AICTE Ragging Prevention Cell for immediate statutory action.</span>
              </div>

              <div class="form-field mt-3">
                <label for="complaint-subject" class="field-label">
                  Subject / Summary <span class="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="complaint-subject"
                  v-model="subject"
                  type="text"
                  class="public-input"
                  :class="{ 'input-has-error': errors.subject }"
                  placeholder="Short, clear summary of the complaint (e.g. Extra fees demanded for semester registration)"
                  required
                />
                <span v-if="errors.subject" class="field-error-text">{{ errors.subject }}</span>
              </div>

              <div class="form-field mt-3">
                <label for="complaint-description" class="field-label">
                  Detailed Description <span class="required" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="complaint-description"
                  v-model="description"
                  rows="5"
                  class="public-textarea"
                  :class="{ 'input-has-error': errors.description }"
                  placeholder="State the facts clearly: dates, amounts demanded, persons involved, departments concerned, and actions already taken..."
                  required
                />
                <div class="textarea-footer">
                  <span v-if="errors.description" class="field-error-text">{{ errors.description }}</span>
                  <span class="char-count" :class="{ 'char-count-valid': description.length >= 15 }">
                    {{ description.length }} characters (minimum 15)
                  </span>
                </div>
              </div>

              <!-- Supporting Document Upload -->
              <div class="form-field mt-4">
                <label class="field-label">
                  Supporting Documents <small class="text-quiet">(Optional but recommended)</small>
                </label>
                <p class="field-hint-text mb-2">
                  Attach fee receipts, official emails, college notices, or photos to speed up review. Accepted formats: <strong>PDF, JPG, PNG, DOC, DOCX</strong> up to <strong>16 MB</strong>.
                </p>

                <!-- Dropzone when no file selected -->
                <div
                  v-if="!selectedFile"
                  class="file-drop-area"
                  :class="{ 'file-drop-dragging': isDragging }"
                  tabindex="0"
                  role="button"
                  aria-label="Upload supporting document"
                  @click="fileInputRef?.click()"
                  @keydown.enter="fileInputRef?.click()"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="handleDrop"
                >
                  <input
                    ref="fileInputRef"
                    type="file"
                    class="file-input-hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                    @change="handleFileChange"
                  />
                  <div class="file-drop-content">
                    <UploadCloud :size="32" class="upload-icon" />
                    <strong>Click to select a file or drag and drop here</strong>
                    <span>PDF, Word documents, or images up to 16MB</span>
                  </div>
                </div>

                <!-- Selected File Display -->
                <div v-else class="file-selected-box">
                  <div class="file-info-group">
                    <FileCheck2 :size="20" class="file-icon" />
                    <div>
                      <strong>{{ selectedFile.name }}</strong>
                      <small>{{ formatFileSize(selectedFile.size) }}</small>
                    </div>
                  </div>
                  <button type="button" class="button button-quiet" @click="removeFile">
                    <X :size="15" /> Remove File
                  </button>
                </div>
                <span v-if="errors.file" class="field-error-text mt-1">{{ errors.file }}</span>
              </div>
            </div>

            <!-- General Error Banner -->
            <div v-if="errors.general" class="public-error-card" role="alert">
              <AlertCircle :size="18" class="error-icon" />
              <div class="error-copy">
                <strong>Submission Error</strong>
                <p>{{ errors.general }}</p>
              </div>
            </div>

            <!-- Submission Footer -->
            <div class="form-submit-row">
              <div class="submit-note">
                <ShieldCheck :size="16" />
                <span>Complaints are recorded officially under AICTE Regulations.</span>
              </div>

              <button
                type="submit"
                class="button button-primary submit-btn"
                :disabled="loading"
              >
                <span v-if="loading">Submitting Complaint…</span>
                <span v-else>Submit Complaint</span>
                <ArrowRight :size="16" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <footer class="public-footer">
      <div class="public-container public-footer-inner">
        <span>All India Council for Technical Education (AICTE) · Central Grievance Portal</span>
        <span>SIH 2026 Problem Statement 26264</span>
      </div>
    </footer>
  </div>
</template>
