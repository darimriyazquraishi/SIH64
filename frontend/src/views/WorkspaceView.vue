<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import type { Complaint, Institution, CaseLink, NotificationItem, KPIs } from '@/types'
import {
  Activity, AlertCircle, ArrowRight, ArrowUpRight, Building2,
  CalendarClock, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight,
  CircleAlert, Clock3, Download, FileSearch, FileSpreadsheet, Filter, CheckCircle2,
  GitCompare, Layers3, ListFilter, LoaderCircle, Plus, RefreshCw, Search,
  ShieldCheck, Upload, X, ClipboardCheck, FileText, Database,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

type Row = Record<string, any>

const isoDaysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}
const isoDaysFromNow = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

const sampleInstitutions: Row[] = [
  { id: 1, institution_code: 'AICTE-AP-0412', name: 'Apex Institute of Technology & Management', aliases: ['Apex Institute'], institution_type: 'Engineering & Technology', state: 'Madhya Pradesh', district: 'Indore', address: 'AB Road, Indore', total_complaints: 3, open_complaints: 3, disposed_complaints: 0, escalated_complaints: 0, bureaus_involved: ['PGRC', 'AB', 'PAPB'] },
  { id: 2, institution_code: 'AICTE-MH-1018', name: 'Western Valley College of Engineering', aliases: ['WVCE'], institution_type: 'Engineering & Technology', state: 'Maharashtra', district: 'Pune', total_complaints: 2, open_complaints: 1, disposed_complaints: 1, escalated_complaints: 0, bureaus_involved: ['AB', 'FAB'] },
  { id: 3, institution_code: 'AICTE-KA-0884', name: 'Deccan School of Applied Sciences', aliases: ['Deccan SAS'], institution_type: 'Applied Sciences', state: 'Karnataka', district: 'Mysuru', total_complaints: 1, open_complaints: 1, disposed_complaints: 0, escalated_complaints: 0, bureaus_involved: ['PGRC'] },
  { id: 4, institution_code: 'AICTE-RJ-0226', name: 'Rajasthan Institute of Technical Studies', aliases: ['RITS'], institution_type: 'Engineering & Technology', state: 'Rajasthan', district: 'Jaipur', total_complaints: 1, open_complaints: 1, disposed_complaints: 0, escalated_complaints: 1, bureaus_involved: ['RPC'] },
  { id: 5, institution_code: 'AICTE-TN-0675', name: 'Southern Polytechnic & Research Centre', aliases: ['SPRC'], institution_type: 'Polytechnic', state: 'Tamil Nadu', district: 'Coimbatore', total_complaints: 0, open_complaints: 0, disposed_complaints: 0, escalated_complaints: 0, bureaus_involved: [] },
  { id: 6, institution_code: 'AICTE-UP-0703', name: 'Northgate College of Engineering', aliases: ['Northgate'], institution_type: 'Engineering & Technology', state: 'Uttar Pradesh', district: 'Lucknow', total_complaints: 1, open_complaints: 1, disposed_complaints: 0, escalated_complaints: 0, bureaus_involved: ['AB'] },
]

const sampleComplaints: Row[] = [
  { id: 101, case_number: 'AICTE-26-PGRC-0101', external_reference: 'CPGRAMS/2026/004189', institution_id: 1, institution_name: sampleInstitutions[0].name, institution_code: sampleInstitutions[0].institution_code, institution_state: 'Madhya Pradesh', category: 'Fee irregularity', subject: 'Reported capitation fee collection during admission', description: 'The complainant reports an additional payment being requested outside the published fee schedule.', receiving_bureau_id: 1, receiving_bureau_code: 'PGRC', receiving_bureau_name: 'Public Grievance Redressal Cell', current_bureau_id: 1, current_bureau_code: 'PGRC', current_bureau_name: 'Public Grievance Redressal Cell', assigned_user_id: 2, assigned_officer_name: 'Ananya Rao', priority: 'Critical', status: 'Action Required', is_overdue: true, received_at: isoDaysAgo(18), due_at: isoDaysAgo(2), last_action_at: isoDaysAgo(5), created_at: isoDaysAgo(18) },
  { id: 102, case_number: 'AICTE-26-AB-0102', external_reference: 'CPGRAMS/2026/004189', institution_id: 1, institution_name: sampleInstitutions[0].name, institution_code: sampleInstitutions[0].institution_code, institution_state: 'Madhya Pradesh', category: 'Admission irregularity', subject: 'Review of admission-related fee complaint', description: 'Review requested on the institution fee schedule and additional admission charges reported by applicants.', receiving_bureau_id: 2, receiving_bureau_code: 'AB', receiving_bureau_name: 'Approval Bureau', current_bureau_id: 2, current_bureau_code: 'AB', current_bureau_name: 'Approval Bureau', assigned_user_id: 3, assigned_officer_name: 'Vikram Nair', priority: 'High', status: 'Under Review', is_overdue: false, received_at: isoDaysAgo(14), due_at: isoDaysFromNow(3), last_action_at: isoDaysAgo(1), created_at: isoDaysAgo(14) },
  { id: 103, case_number: 'AICTE-26-PAPB-0103', institution_id: 1, institution_name: sampleInstitutions[0].name, institution_code: sampleInstitutions[0].institution_code, institution_state: 'Madhya Pradesh', category: 'Faculty compliance', subject: 'Faculty qualification records need verification', description: 'Submitted faculty qualification documents appear incomplete and require a bureau-level review.', receiving_bureau_id: 3, receiving_bureau_code: 'PAPB', receiving_bureau_name: 'Policy & Academic Planning Bureau', current_bureau_id: 3, current_bureau_code: 'PAPB', current_bureau_name: 'Policy & Academic Planning Bureau', assigned_user_id: 4, assigned_officer_name: 'Meera Shah', priority: 'Medium', status: 'Awaiting Response', is_overdue: false, received_at: isoDaysAgo(9), due_at: isoDaysFromNow(6), last_action_at: isoDaysAgo(2), created_at: isoDaysAgo(9) },
  { id: 104, case_number: 'AICTE-26-RPC-0104', institution_id: 4, institution_name: sampleInstitutions[3].name, institution_code: sampleInstitutions[3].institution_code, institution_state: 'Rajasthan', category: 'Student safety', subject: 'Follow-up required on student safety report', description: 'A follow-up report requested from the institution has not yet been received.', receiving_bureau_id: 4, receiving_bureau_code: 'RPC', receiving_bureau_name: 'Ragging Prevention Cell', current_bureau_id: 4, current_bureau_code: 'RPC', current_bureau_name: 'Ragging Prevention Cell', assigned_user_id: 5, assigned_officer_name: 'Kunal Mehta', priority: 'High', status: 'Escalated', is_overdue: true, received_at: isoDaysAgo(23), due_at: isoDaysAgo(7), last_action_at: isoDaysAgo(8), created_at: isoDaysAgo(23) },
  { id: 105, case_number: 'AICTE-26-FAB-0105', institution_id: 2, institution_name: sampleInstitutions[1].name, institution_code: sampleInstitutions[1].institution_code, institution_state: 'Maharashtra', category: 'Financial records', subject: 'Scholarship disbursement reconciliation', description: 'Request to reconcile the recorded disbursement and the payment schedule supplied by the institution.', receiving_bureau_id: 5, receiving_bureau_code: 'FAB', receiving_bureau_name: 'Finance & Accounts Bureau', current_bureau_id: 5, current_bureau_code: 'FAB', current_bureau_name: 'Finance & Accounts Bureau', assigned_user_id: 6, assigned_officer_name: 'Sana Khan', priority: 'Medium', status: 'Under Review', is_overdue: false, received_at: isoDaysAgo(7), due_at: isoDaysFromNow(8), last_action_at: isoDaysAgo(2), created_at: isoDaysAgo(7) },
  { id: 106, case_number: 'AICTE-26-AB-0106', institution_id: 2, institution_name: sampleInstitutions[1].name, institution_code: sampleInstitutions[1].institution_code, institution_state: 'Maharashtra', category: 'Infrastructure', subject: 'Laboratory inventory records submitted', description: 'The institution submitted updated records in response to an earlier infrastructure query.', receiving_bureau_id: 2, receiving_bureau_code: 'AB', receiving_bureau_name: 'Approval Bureau', current_bureau_id: 2, current_bureau_code: 'AB', current_bureau_name: 'Approval Bureau', assigned_user_id: 3, assigned_officer_name: 'Vikram Nair', priority: 'Low', status: 'Disposed', is_overdue: false, received_at: isoDaysAgo(32), due_at: isoDaysAgo(12), last_action_at: isoDaysAgo(11), disposed_at: isoDaysAgo(11), created_at: isoDaysAgo(32) },
  { id: 107, case_number: 'AICTE-26-PGRC-0107', institution_id: 3, institution_name: sampleInstitutions[2].name, institution_code: sampleInstitutions[2].institution_code, institution_state: 'Karnataka', category: 'Faculty grievance', subject: 'Pending faculty salary clarification', description: 'A faculty member requests clarification about the timing of a salary payment.', receiving_bureau_id: 1, receiving_bureau_code: 'PGRC', receiving_bureau_name: 'Public Grievance Redressal Cell', current_bureau_id: 1, current_bureau_code: 'PGRC', current_bureau_name: 'Public Grievance Redressal Cell', assigned_user_id: 2, assigned_officer_name: 'Ananya Rao', priority: 'Medium', status: 'Received', is_overdue: false, received_at: isoDaysAgo(2), due_at: isoDaysFromNow(13), last_action_at: null, created_at: isoDaysAgo(2) },
  { id: 108, case_number: 'AICTE-26-AB-0108', institution_id: 6, institution_name: sampleInstitutions[5].name, institution_code: sampleInstitutions[5].institution_code, institution_state: 'Uttar Pradesh', category: 'Approval compliance', subject: 'Extension of approval documentation', description: 'A set of documents is awaiting administrative review before a decision can be recorded.', receiving_bureau_id: 2, receiving_bureau_code: 'AB', receiving_bureau_name: 'Approval Bureau', current_bureau_id: 2, current_bureau_code: 'AB', current_bureau_name: 'Approval Bureau', assigned_user_id: 3, assigned_officer_name: 'Vikram Nair', priority: 'High', status: 'Under Review', is_overdue: false, received_at: isoDaysAgo(5), due_at: isoDaysFromNow(2), last_action_at: isoDaysAgo(1), created_at: isoDaysAgo(5) },
]

const sampleOverlaps: Row[] = [
  { id: 501, complaint_id_a: 101, complaint_id_b: 102, relationship_type: 'potential_overlap', match_score: 0.93, match_method: 'Identifier + text similarity', match_reason: 'Both records reference the same institution and external complaint reference. The descriptions concern admission-related fees.', review_status: 'pending', created_at: isoDaysAgo(1), case_a: { id: 101, case_number: sampleComplaints[0].case_number, subject: sampleComplaints[0].subject, description: sampleComplaints[0].description, category: sampleComplaints[0].category, status: sampleComplaints[0].status, priority: sampleComplaints[0].priority, bureau_code: 'PGRC', institution_name: sampleInstitutions[0].name, institution_code: sampleInstitutions[0].institution_code }, case_b: { id: 102, case_number: sampleComplaints[1].case_number, subject: sampleComplaints[1].subject, description: sampleComplaints[1].description, category: sampleComplaints[1].category, status: sampleComplaints[1].status, priority: sampleComplaints[1].priority, bureau_code: 'AB', institution_name: sampleInstitutions[0].name, institution_code: sampleInstitutions[0].institution_code } },
  { id: 502, complaint_id_a: 105, complaint_id_b: 106, relationship_type: 'potential_overlap', match_score: 0.54, match_method: 'Institution identity match', match_reason: 'Both records reference the same institution, but their subjects differ. This may be a shared-entity match rather than related casework.', review_status: 'pending', created_at: isoDaysAgo(3), case_a: { id: 105, case_number: sampleComplaints[4].case_number, subject: sampleComplaints[4].subject, description: sampleComplaints[4].description, category: sampleComplaints[4].category, status: sampleComplaints[4].status, priority: sampleComplaints[4].priority, bureau_code: 'FAB', institution_name: sampleInstitutions[1].name, institution_code: sampleInstitutions[1].institution_code }, case_b: { id: 106, case_number: sampleComplaints[5].case_number, subject: sampleComplaints[5].subject, description: sampleComplaints[5].description, category: sampleComplaints[5].category, status: sampleComplaints[5].status, priority: sampleComplaints[5].priority, bureau_code: 'AB', institution_name: sampleInstitutions[1].name, institution_code: sampleInstitutions[1].institution_code } },
  { id: 503, complaint_id_a: 101, complaint_id_b: 103, relationship_type: 'potential_overlap', match_score: 0.42, match_method: 'Institution identity match', match_reason: 'The records belong to the same institution, but their subjects concern different matters (admission fees and faculty qualification records). Review whether any coordination is needed; do not assume they are duplicates.', review_status: 'pending', created_at: isoDaysAgo(4), case_a: { id: 101, case_number: sampleComplaints[0].case_number, subject: sampleComplaints[0].subject, description: sampleComplaints[0].description, category: sampleComplaints[0].category, status: sampleComplaints[0].status, priority: sampleComplaints[0].priority, bureau_code: 'PGRC', institution_name: sampleInstitutions[0].name, institution_code: sampleInstitutions[0].institution_code }, case_b: { id: 103, case_number: sampleComplaints[2].case_number, subject: sampleComplaints[2].subject, description: sampleComplaints[2].description, category: sampleComplaints[2].category, status: sampleComplaints[2].status, priority: sampleComplaints[2].priority, bureau_code: 'PAPB', institution_name: sampleInstitutions[0].name, institution_code: sampleInstitutions[0].institution_code } },
]

const sampleNotifications: Row[] = [
  { id: 701, notification_type: 'overlap', title: 'Potential overlap needs review', message: `${sampleComplaints[0].case_number} may be related to ${sampleComplaints[1].case_number}.`, related_complaint_id: 101, is_read: false, created_at: isoDaysAgo(1) },
  { id: 702, notification_type: 'deadline', title: 'Case is past due', message: `${sampleComplaints[3].case_number} is 7 days past its due date.`, related_complaint_id: 104, is_read: false, created_at: isoDaysAgo(1) },
  { id: 703, notification_type: 'assignment', title: 'New case entered the register', message: `${sampleComplaints[6].case_number} was received and is awaiting initial review.`, related_complaint_id: 107, is_read: true, created_at: isoDaysAgo(2) },
]

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : structuredClone(fallback)
  } catch {
    return structuredClone(fallback)
  }
}
function saveStored(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage can be disabled */ }
}

const complaints = ref<Row[]>(readStored('casework_demo_complaints', sampleComplaints))
const institutions = ref<Row[]>(readStored('casework_demo_institutions', sampleInstitutions))
const overlaps = ref<Row[]>(readStored('casework_demo_overlaps', sampleOverlaps))
const notifications = ref<Row[]>(readStored('casework_demo_notifications', sampleNotifications))
const bureaus = ref<Row[]>([
  { id: 1, code: 'PGRC', name: 'Public Grievance Redressal Cell', description: 'Public, student and faculty grievances' },
  { id: 2, code: 'AB', name: 'Approval Bureau', description: 'Approval and compliance reviews' },
  { id: 3, code: 'PAPB', name: 'Policy & Academic Planning Bureau', description: 'Academic policy and faculty standards' },
  { id: 4, code: 'RPC', name: 'Ragging Prevention Cell', description: 'Student safety and prevention' },
  { id: 5, code: 'FAB', name: 'Finance & Accounts Bureau', description: 'Financial compliance and accounts' },
])
const kpis = ref<Row>({})
const loading = ref(false)
const forceDemoMode = ref(typeof sessionStorage !== 'undefined' && sessionStorage.getItem('casework_demo_mode') === '1')
const refreshing = ref(false)
const newComplaintOpen = ref(false)
const activeFilter = ref('All cases')
const statusFilter = ref('All statuses')
const bureauFilter = ref('All Bureaus')
const overlapFilter = ref('pending')
const institutionTypeFilter = ref('All types')
const notificationFilter = ref('all')
const pageNumber = ref(1)
const pageSize = 8
const selectedOverlap = ref<Row | null>(null)
const isReviewing = ref(false)
const selectedFile = ref<File | null>(null)
const importPreview = ref<Row | null>(null)
const importHistory = ref<Row[]>([])
const adminUsers = ref<Row[]>([])
const auditLogs = ref<Row[]>([])
const systemStatus = ref<Row | null>(null)
const toastLocal = (message: string, kind: 'success' | 'error' | 'info' = 'success') => ui.toast(message, kind)

const newForm = reactive({
  subject: '',
  description: '',
  institution_id: '1',
  bureau_id: '1',
  category: 'General administration',
  priority: 'Medium',
  due_at: isoDaysFromNow(14).slice(0, 10),
})

const page = computed(() => {
  const path = route.path
  if (path === '/') return 'dashboard'
  if (path === '/complaints') return 'complaints'
  if (path.startsWith('/complaints/')) return 'detail'
  if (path === '/institutions') return 'institutions'
  if (path.startsWith('/institutions/')) return 'institution'
  if (path === '/overlaps') return 'overlaps'
  if (path === '/reports') return 'reports'
  if (path === '/notifications') return 'notifications'
  if (path === '/imports') return 'imports'
  if (path === '/admin') return 'admin'
  return 'dashboard'
})
const pageHeading = computed(() => ({
  dashboard: 'Casework overview', complaints: 'Complaints register', detail: 'Complaint record', institutions: 'Institution directory', institution: 'Institution profile', overlaps: 'Overlap review', reports: 'Reports & analysis', notifications: 'Notifications', imports: 'Data imports', admin: 'Administration',
}[page.value] || 'Casework overview'))
const pageSubheading = computed(() => ({
  dashboard: 'A consolidated view of open work, deadlines and cases that need a decision.',
  complaints: 'Search, filter and manage institution-related cases across Bureaus and Cells.',
  detail: 'Review the case, its current owner and the actions already recorded.',
  institutions: 'Institution identities and the complaint history attached to each record.',
  institution: 'The case history across departments, brought into one place.',
  overlaps: 'Review potential case relationships before recording a decision.',
  reports: 'Case distribution, ageing and workload from the current register.',
  notifications: 'Operational alerts for deadlines, assignments and overlap reviews.',
  imports: 'Validate a CSV file before adding records to the complaint register.',
  admin: 'Manage access, review audit activity and check system connectivity.',
}[page.value] || ''))
const currentComplaintId = computed(() => Number(route.params.id || 0))
const currentInstitutionId = computed(() => Number(route.params.id || 0))
const currentComplaint = computed(() => complaints.value.find((item) => Number(item.id) === currentComplaintId.value) || null)
const currentInstitution = computed(() => institutions.value.find((item) => Number(item.id) === currentInstitutionId.value) || null)
const globalQuery = computed(() => ui.globalSearch.trim().toLowerCase())
const openComplaints = computed(() => complaints.value.filter((item) => !['Disposed', 'Closed'].includes(item.status)))
const overdueComplaints = computed(() => complaints.value.filter((item) => item.is_overdue || (item.due_at && new Date(item.due_at).getTime() < Date.now() && !['Disposed', 'Closed'].includes(item.status))))
const pendingOverlaps = computed(() => overlaps.value.filter((item) => (item.review_status || 'pending') === 'pending'))
const openCount = computed(() => kpis.value.open_cases ?? openComplaints.value.length)
const disposedCount = computed(() => kpis.value.disposed_cases ?? complaints.value.filter((item) => ['Disposed', 'Closed'].includes(item.status)).length)
const actionCount = computed(() => kpis.value.action_required ?? complaints.value.filter((item) => item.status === 'Action Required').length)
const overdueCount = computed(() => kpis.value.overdue_cases ?? overdueComplaints.value.length)
const totalCount = computed(() => kpis.value.total_complaints ?? complaints.value.length)
const unreadCount = computed(() => notifications.value.filter((item) => !item.is_read && !item.read_at).length)
const recentComplaints = computed(() => [...complaints.value].sort((a, b) => new Date(b.created_at || b.received_at).getTime() - new Date(a.created_at || a.received_at).getTime()).slice(0, 6))
const visibleComplaints = computed(() => {
  let rows = [...complaints.value]
  if (globalQuery.value) rows = rows.filter((item) => [item.case_number, item.subject, item.institution_name, item.institution_code, item.category, item.current_bureau_name].some((value) => String(value || '').toLowerCase().includes(globalQuery.value)))
  if (statusFilter.value !== 'All statuses') rows = rows.filter((item) => item.status === statusFilter.value)
  if (bureauFilter.value !== 'All Bureaus') rows = rows.filter((item) => (item.current_bureau_code || item.receiving_bureau_code) === bureauFilter.value)
  if (activeFilter.value === 'Open cases') rows = rows.filter((item) => !['Disposed', 'Closed'].includes(item.status))
  if (activeFilter.value === 'Overdue') rows = rows.filter((item) => item.is_overdue || (item.due_at && new Date(item.due_at).getTime() < Date.now() && !['Disposed', 'Closed'].includes(item.status)))
  if (activeFilter.value === 'Escalated') rows = rows.filter((item) => item.status === 'Escalated')
  return rows
})
const pagedComplaints = computed(() => visibleComplaints.value.slice((pageNumber.value - 1) * pageSize, pageNumber.value * pageSize))
const complaintPageCount = computed(() => Math.max(1, Math.ceil(visibleComplaints.value.length / pageSize)))
const visibleInstitutions = computed(() => {
  let rows = [...institutions.value]
  if (globalQuery.value) rows = rows.filter((item) => [item.name, item.institution_code, item.state, item.district, ...(item.aliases || [])].join(' ').toLowerCase().includes(globalQuery.value))
  if (institutionTypeFilter.value !== 'All types') rows = rows.filter((item) => item.institution_type === institutionTypeFilter.value)
  return rows
})
const visibleOverlaps = computed(() => {
  let rows = [...overlaps.value]
  if (overlapFilter.value !== 'all') rows = rows.filter((item) => item.review_status === overlapFilter.value || (overlapFilter.value === 'pending' && !item.review_status))
  if (globalQuery.value) rows = rows.filter((item) => JSON.stringify(item).toLowerCase().includes(globalQuery.value))
  return rows
})
const visibleNotifications = computed(() => {
  let rows = [...notifications.value]
  if (notificationFilter.value === 'unread') rows = rows.filter((item) => !item.is_read && !item.read_at)
  if (globalQuery.value) rows = rows.filter((item) => `${item.title} ${item.message}`.toLowerCase().includes(globalQuery.value))
  return rows
})
const bureauWorkload = computed<Row[]>(() => bureaus.value.map((bureau: Row): Row => {
  const rows = complaints.value.filter((item) => (item.current_bureau_code || item.receiving_bureau_code) === bureau.code)
  return { ...bureau, total: rows.length, open: rows.filter((item) => !['Disposed', 'Closed'].includes(item.status)).length, overdue: rows.filter((item) => item.is_overdue).length }
}).sort((a, b) => b.total - a.total))
const trendValues = computed(() => {
  const result = Array(7).fill(0)
  complaints.value.forEach((item) => {
    const date = new Date(item.received_at || item.created_at)
    const diff = Math.floor((Date.now() - date.getTime()) / 86400000)
    const index = 6 - diff
    if (index >= 0 && index < 7) result[index] += 1
  })
  return result
})
const trendPoints = computed(() => {
  const values = trendValues.value.map((n, i) => n + (i === 0 ? 0 : 1))
  const max = Math.max(3, ...values)
  return values.map((value, index) => `${18 + index * 53},${116 - (value / max) * 82}`).join(' ')
})
const deadlineList = computed(() => overdueComplaints.value.slice(0, 3))
const institutionTypeOptions = computed(() => ['All types', ...new Set(institutions.value.map((item) => item.institution_type).filter(Boolean))])

function statusClass(status = '') {
  const normalized = String(status).toLowerCase()
  if (['disposed', 'closed', 'resolved', 'confirmed'].includes(normalized)) return 'status-good'
  if (['escalated', 'critical', 'action required', 'overdue'].includes(normalized)) return 'status-critical'
  if (['under review', 'awaiting response', 'pending', 'deferred'].includes(normalized)) return 'status-pending'
  if (['received', 'new'].includes(normalized)) return 'status-new'
  return 'status-neutral'
}
function priorityClass(priority = '') {
  const p = String(priority).toLowerCase()
  if (p === 'critical') return 'priority-critical'
  if (p === 'high') return 'priority-high'
  if (p === 'medium') return 'priority-medium'
  return 'priority-low'
}
function shortDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
function dateTime(value?: string | null) {
  if (!value) return 'No action recorded'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
}
function daysLate(item: Row) {
  if (!item.due_at) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(item.due_at).getTime()) / 86400000))
}
function getCaseForLink(link: Row, side: 'a' | 'b') {
  const embedded = side === 'a' ? link.case_a : link.case_b
  if (embedded) return embedded
  const id = side === 'a' ? link.complaint_id_a : link.complaint_id_b
  return complaints.value.find((item) => Number(item.id) === Number(id)) || { case_number: `Case ${id}`, subject: 'Case information unavailable' }
}
function navigateToComplaint(id: number | string) { router.push(`/complaints/${id}`) }
function navigateToInstitution(id: number | string) { router.push(`/institutions/${id}`) }
function persistDemoData() {
  if (!ui.isDemoMode) return
  saveStored('casework_demo_complaints', complaints.value)
  saveStored('casework_demo_institutions', institutions.value)
  saveStored('casework_demo_overlaps', overlaps.value)
  saveStored('casework_demo_notifications', notifications.value)
}

async function safeGet(url: string, params?: Row) {
  try { return (await apiClient.get(url, { params })).data } catch { return null }
}
async function loadWorkspace() {
  loading.value = true
  if (route.query.demo === '1') {
    forceDemoMode.value = true
    sessionStorage.setItem('casework_demo_mode', '1')
  }
  if (forceDemoMode.value) {
    ui.isDemoMode = true
    kpis.value = {}
    complaints.value = readStored('casework_demo_complaints', sampleComplaints)
    institutions.value = readStored('casework_demo_institutions', sampleInstitutions)
    overlaps.value = readStored('casework_demo_overlaps', sampleOverlaps)
    notifications.value = readStored('casework_demo_notifications', sampleNotifications)
    if (page.value === 'admin') {
      adminUsers.value = [
        { id: 1, name: 'System Administrator', email: 'admin@aicte.gov.in', role: 'admin', is_active: true },
        { id: 2, name: 'Ananya Rao', email: 'officer.pgrc@aicte.gov.in', role: 'officer', bureau_name: 'PGRC', is_active: true },
        { id: 3, name: 'Vikram Nair', email: 'officer.ab@aicte.gov.in', role: 'officer', bureau_name: 'Approval Bureau', is_active: true },
        { id: 4, name: 'Monitoring Director', email: 'director.monitoring@aicte.gov.in', role: 'senior_authority', is_active: true },
      ]
      auditLogs.value = []
      systemStatus.value = { status: 'Demo mode', database: 'Not connected', portal_version: 'SIH 2026 prototype' }
    }
    if (page.value === 'imports') importHistory.value = []
    ui.unreadNotifications = unreadCount.value
    loading.value = false
    return
  }
  const responses = await Promise.all([
    safeGet('/reports/kpis'),
    safeGet('/complaints', { page: 1, per_page: 100 }),
    safeGet('/institutions', { page: 1, per_page: 100 }),
    safeGet('/overlaps', { review_status: 'all' }),
    safeGet('/notifications'),
    safeGet('/bureaus'),
  ])
  const [kpiData, complaintData, institutionData, overlapData, notificationData, bureauData] = responses
  const successCount = responses.filter((item) => item !== null).length
  ui.isDemoMode = successCount < responses.length
  if (kpiData) kpis.value = kpiData
  if (complaintData) complaints.value = complaintData.items || complaintData.complaints || []
  if (institutionData) institutions.value = institutionData.items || institutionData.institutions || []
  if (overlapData) overlaps.value = overlapData.overlaps || []
  if (notificationData) notifications.value = notificationData.notifications || notificationData.items || []
  if (bureauData?.bureaus?.length) bureaus.value = bureauData.bureaus
  if (!complaintData) complaints.value = readStored('casework_demo_complaints', sampleComplaints)
  if (!institutionData) institutions.value = readStored('casework_demo_institutions', sampleInstitutions)
  if (!overlapData) overlaps.value = readStored('casework_demo_overlaps', sampleOverlaps)
  if (!notificationData) notifications.value = readStored('casework_demo_notifications', sampleNotifications)
  if (page.value === 'admin') {
    const [users, logs, status] = await Promise.all([safeGet('/admin/users'), safeGet('/admin/audit-logs'), safeGet('/admin/system-status')])
    adminUsers.value = users?.users || [
      { id: 1, name: 'System Administrator', email: 'admin@aicte.gov.in', role: 'admin', is_active: true },
      { id: 2, name: 'Ananya Rao', email: 'officer.pgrc@aicte.gov.in', role: 'officer', bureau_name: 'PGRC', is_active: true },
      { id: 3, name: 'Vikram Nair', email: 'officer.ab@aicte.gov.in', role: 'officer', bureau_name: 'Approval Bureau', is_active: true },
      { id: 4, name: 'Monitoring Director', email: 'director.monitoring@aicte.gov.in', role: 'senior_authority', is_active: true },
    ]
    auditLogs.value = logs?.audit_logs || []
    systemStatus.value = status || { status: successCount ? 'API available' : 'Demo mode', database: successCount ? 'Status not verified' : 'Not connected', portal_version: 'SIH 2026 prototype' }
  }
  if (page.value === 'imports') {
    const history = await safeGet('/imports/history')
    importHistory.value = history?.batches || []
  }
  ui.unreadNotifications = unreadCount.value
  loading.value = false
}
async function refreshWorkspace() {
  refreshing.value = true
  await loadWorkspace()
  refreshing.value = false
  toastLocal(ui.isDemoMode ? 'Refreshed the local demonstration data.' : 'Workspace data refreshed.', 'info')
}

function openNewComplaint() {
  newForm.subject = ''
  newForm.description = ''
  newForm.institution_id = String(institutions.value[0]?.id || 1)
  newForm.bureau_id = String(bureaus.value[0]?.id || 1)
  newForm.category = 'General administration'
  newForm.priority = 'Medium'
  newForm.due_at = isoDaysFromNow(14).slice(0, 10)
  newComplaintOpen.value = true
}
async function submitNewComplaint() {
  if (!newForm.subject.trim() || !newForm.description.trim()) {
    toastLocal('Add a subject and complaint description before saving.', 'error')
    return
  }
  const bureau = bureaus.value.find((item) => String(item.id) === newForm.bureau_id) || bureaus.value[0]
  const institution = institutions.value.find((item) => String(item.id) === newForm.institution_id) || institutions.value[0]
  const payload = {
    subject: newForm.subject.trim(), description: newForm.description.trim(), institution_id: Number(newForm.institution_id),
    receiving_bureau_id: Number(newForm.bureau_id), current_bureau_id: Number(newForm.bureau_id), category: newForm.category,
    priority: newForm.priority, due_at: new Date(`${newForm.due_at}T12:00:00`).toISOString(),
  }
  try {
    if (ui.isDemoMode) throw new Error('Demo mode: do not submit to API')
    const response = await apiClient.post('/complaints', payload)
    const item = response.data.complaint || response.data
    complaints.value = [item, ...complaints.value]
    toastLocal('Complaint registered in the case register.')
  } catch {
    ui.isDemoMode = true
    const nextId = Math.max(100, ...complaints.value.map((item) => Number(item.id) || 0)) + 1
    const item: Row = {
      id: nextId, case_number: `DEMO-26-${bureau?.code || 'CASE'}-${String(nextId).padStart(4, '0')}`,
      institution_id: Number(institution?.id || newForm.institution_id), institution_name: institution?.name || 'Institution awaiting verification', institution_code: institution?.institution_code || '',
      institution_state: institution?.state || '', category: newForm.category, subject: newForm.subject.trim(), description: newForm.description.trim(),
      receiving_bureau_id: bureau?.id || 1, receiving_bureau_code: bureau?.code || 'PGRC', receiving_bureau_name: bureau?.name || 'PGRC',
      current_bureau_id: bureau?.id || 1, current_bureau_code: bureau?.code || 'PGRC', current_bureau_name: bureau?.name || 'PGRC',
      priority: newForm.priority, status: 'Received', is_overdue: false, received_at: new Date().toISOString(), due_at: new Date(`${newForm.due_at}T12:00:00`).toISOString(), created_at: new Date().toISOString(),
    }
    complaints.value = [item, ...complaints.value]
    toastLocal('Added to the local demo register. It has not been sent to a live system.', 'info')
  }
  persistDemoData()
  newComplaintOpen.value = false
  router.replace('/complaints')
}

async function changeStatus(status: string) {
  const item = currentComplaint.value
  if (!item) return
  try {
    if (ui.isDemoMode) throw new Error('Demo mode: keep the change local')
    const response = await apiClient.post(`/complaints/${item.id}/actions`, { status, remarks: 'Status updated from the casework portal.' })
    const updated = response.data.complaint || { ...item, status }
    complaints.value = complaints.value.map((row) => Number(row.id) === Number(item.id) ? { ...row, ...updated } : row)
    toastLocal('Case status updated.')
  } catch {
    ui.isDemoMode = true
    complaints.value = complaints.value.map((row) => Number(row.id) === Number(item.id) ? { ...row, status, is_overdue: false, last_action_at: new Date().toISOString() } : row)
    toastLocal('Updated the local demo record. No live system was changed.', 'info')
  }
  persistDemoData()
}
async function reviewOverlap(link: Row, decision: 'confirmed_related' | 'unrelated' | 'deferred') {
  if (isReviewing.value) return
  isReviewing.value = true
  const statusMap: Record<string, string> = { confirmed_related: 'confirmed', unrelated: 'dismissed', deferred: 'deferred' }
  try {
    if (ui.isDemoMode) throw new Error('Demo mode: keep the review local')
    await apiClient.post(`/overlaps/${link.id}/review`, { decision, remarks: 'Reviewed in the casework portal.' })
    overlaps.value = overlaps.value.map((item) => Number(item.id) === Number(link.id) ? { ...item, review_status: statusMap[decision], relationship_type: decision } : item)
    toastLocal('Review decision recorded.')
  } catch {
    ui.isDemoMode = true
    overlaps.value = overlaps.value.map((item) => Number(item.id) === Number(link.id) ? { ...item, review_status: statusMap[decision], relationship_type: decision, review_remarks: 'Reviewed in local demo mode.', reviewed_at: new Date().toISOString() } : item)
    toastLocal('Decision saved in the local demo workspace only.', 'info')
  } finally {
    isReviewing.value = false
    selectedOverlap.value = null
    persistDemoData()
  }
}
async function markRead(item: Row) {
  try {
    if (ui.isDemoMode) throw new Error('Demo mode: keep notification state local')
    await apiClient.patch(`/notifications/${item.id}/read`)
  } catch { ui.isDemoMode = true }
  notifications.value = notifications.value.map((row) => Number(row.id) === Number(item.id) ? { ...row, is_read: true, read_at: new Date().toISOString() } : row)
  ui.unreadNotifications = unreadCount.value
  persistDemoData()
}
async function markAllRead() {
  try { if (ui.isDemoMode) throw new Error('Demo mode'); await apiClient.post('/notifications/read-all') } catch { ui.isDemoMode = true }
  notifications.value = notifications.value.map((row) => ({ ...row, is_read: true, read_at: row.read_at || new Date().toISOString() }))
  ui.unreadNotifications = 0
  persistDemoData()
  toastLocal('All notifications marked as read.')
}
function exportDemoCsv() {
  const headers = ['Case ID', 'Institution', 'Subject', 'Bureau', 'Status', 'Priority', 'Received', 'Due date']
  const lines = visibleComplaints.value.map((row) => [row.case_number, row.institution_name, row.subject, row.current_bureau_code || row.receiving_bureau_code, row.status, row.priority, shortDate(row.received_at), shortDate(row.due_at)].map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
  const blob = new Blob([[headers.join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'casework-register-demo.csv'
  anchor.click()
  URL.revokeObjectURL(url)
  toastLocal(ui.isDemoMode ? 'Downloaded the current demo register as CSV.' : 'CSV export downloaded.')
}
async function exportCsv() {
  if (ui.isDemoMode) { exportDemoCsv(); return }
  try {
    const response = await apiClient.get('/reports/export-csv', { responseType: 'blob' })
    const url = URL.createObjectURL(response.data)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'aicte_complaints_export.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    toastLocal('Report downloaded.')
  } catch { exportDemoCsv() }
}
async function onFilePicked(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] || null
  importPreview.value = null
}
async function previewImport() {
  if (!selectedFile.value) { toastLocal('Choose a CSV file first.', 'error'); return }
  try {
    if (ui.isDemoMode) throw new Error('Demo mode: preview locally')
    const form = new FormData()
    form.append('file', selectedFile.value)
    const response = await apiClient.post('/imports/preview', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    importPreview.value = response.data
    toastLocal('Import preview is ready.', 'info')
  } catch {
    const text = await selectedFile.value.text()
    const rows = text.split(/\r?\n/).filter((line) => line.trim()).length
    importPreview.value = { is_valid: rows > 1, total_rows: Math.max(0, rows - 1), success_rows: Math.max(0, rows - 1), failed_rows: 0, valid_rows: [], errors: [], local_demo: true }
    ui.isDemoMode = true
    toastLocal('Previewed the file locally. Use the API for authoritative validation.', 'info')
  }
}
async function commitImport() {
  if (!importPreview.value) return
  if (importPreview.value.local_demo) {
    toastLocal('Local preview complete. Start the Flask API to commit imported records.', 'info')
    return
  }
  try {
    const response = await apiClient.post('/imports/commit', { valid_rows: importPreview.value.valid_rows, filename: selectedFile.value?.name || 'batch_import.csv' })
    toastLocal(response.data.message || 'Import committed.')
    importPreview.value = null
    selectedFile.value = null
    await loadWorkspace()
  } catch (error: any) { toastLocal(error?.response?.data?.error || 'The import could not be committed.', 'error') }
}
function downloadTemplate() {
  const template = 'institution_code,subject,description,category,priority,receiving_bureau_code,external_reference\nAICTE-DEMO-001,Example complaint,Replace with a fictional or authorized complaint description,General administration,Medium,PGRC,DEMO-REF-001\n'
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'complaint-import-template.csv'; a.click(); URL.revokeObjectURL(url)
}
function institutionCaseCount(id: number) { return complaints.value.filter((item) => Number(item.institution_id) === Number(id)).length }
function openReview(link: Row) { selectedOverlap.value = link }
function setStatusFilter(value: string) { statusFilter.value = value; pageNumber.value = 1 }
function setBureauFilter(value: string) { bureauFilter.value = value; pageNumber.value = 1 }
function clearFilters() { statusFilter.value = 'All statuses'; bureauFilter.value = 'All Bureaus'; activeFilter.value = 'All cases'; ui.globalSearch = ''; pageNumber.value = 1 }

watch(() => route.query.action, (action) => { if (action === 'new') openNewComplaint() }, { immediate: true })
watch(() => route.path, (path) => {
  if (path === '/admin' || path === '/imports') loadWorkspace()
  if (path.startsWith('/complaints/')) {
    const id = Number(route.params.id)
    if (id && !complaints.value.some((item) => Number(item.id) === id)) {
      safeGet(`/complaints/${id}`).then((data) => { if (data?.complaint) complaints.value = [data.complaint, ...complaints.value] })
    }
  }
})
watch(() => visibleComplaints.value.length, (length) => {
  if (pageNumber.value > Math.max(1, Math.ceil(length / pageSize))) pageNumber.value = Math.max(1, Math.ceil(length / pageSize))
})
watch(unreadCount, (value) => { ui.unreadNotifications = value }, { immediate: true })
onMounted(() => { loadWorkspace() })
onBeforeUnmount(() => {})
</script>

<template>
  <div class="workspace-view">
    <div class="page-heading-row">
      <div class="page-heading-copy">
        <h1>{{ pageHeading }}</h1>
        <p>{{ pageSubheading }}</p>
      </div>
      <div class="page-heading-actions">
        <button class="button button-quiet" :disabled="refreshing" @click="refreshWorkspace"><RefreshCw :size="16" :class="{ 'spin-once': refreshing }" /> Refresh</button>
        <button v-if="['dashboard', 'complaints'].includes(page) && auth.user?.role !== 'senior_authority'" class="button button-primary" @click="openNewComplaint"><Plus :size="17" /> Register complaint</button>
        <button v-else-if="page === 'reports'" class="button button-primary" @click="exportCsv"><Download :size="16" /> Export CSV</button>
        <button v-else-if="page === 'institutions' && auth.user?.role !== 'senior_authority'" class="button button-primary" @click="router.push('/imports')"><Upload :size="16" /> Import records</button>
      </div>
    </div>

    <div v-if="loading" class="loading-line"><LoaderCircle :size="18" class="spin" /> Updating the case register…</div>

    <!-- OVERVIEW -->
    <template v-if="page === 'dashboard'">
      <div class="overview-notice" v-if="pendingOverlaps.length">
        <div class="notice-symbol"><GitCompare :size="18" /></div>
        <div class="notice-copy"><strong>{{ pendingOverlaps.length }} potential case relationship{{ pendingOverlaps.length === 1 ? '' : 's' }} waiting for review</strong><span>Review the evidence before linking records. Similarity is a signal, not a final decision.</span></div>
        <button class="text-action" @click="router.push('/overlaps')">Review queue <ArrowRight :size="15" /></button>
      </div>

      <section class="metric-strip" aria-label="Case summary">
        <div class="metric-cell"><span class="metric-label">Total registered</span><strong class="metric-value">{{ totalCount.toLocaleString('en-IN') }}</strong><span class="metric-note"><FileText :size="13" /> All complaints in view</span></div>
        <div class="metric-cell"><span class="metric-label">Open cases</span><strong class="metric-value">{{ openCount.toLocaleString('en-IN') }}</strong><span class="metric-note"><Activity :size="13" /> Awaiting a final outcome</span></div>
        <div class="metric-cell"><span class="metric-label">Action required</span><strong class="metric-value metric-warn">{{ actionCount.toLocaleString('en-IN') }}</strong><span class="metric-note"><AlertCircle :size="13" /> Needs an officer's next step</span></div>
        <div class="metric-cell"><span class="metric-label">Past due</span><strong class="metric-value metric-danger">{{ overdueCount.toLocaleString('en-IN') }}</strong><span class="metric-note"><CalendarClock :size="13" /> Beyond the recorded due date</span></div>
        <div class="metric-cell"><span class="metric-label">Disposed</span><strong class="metric-value">{{ disposedCount.toLocaleString('en-IN') }}</strong><span class="metric-note"><CheckCircle2 :size="13" /> Recorded as complete</span></div>
      </section>

      <div class="overview-grid">
        <section class="content-section cases-section">
          <div class="section-heading"><div><h2>Recently updated cases</h2><p>Latest entries across the register</p></div><button class="text-action" @click="router.push('/complaints')">All complaints <ArrowRight :size="15" /></button></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Case / institution</th><th>Current Bureau</th><th>Status</th><th>Priority</th><th>Due</th><th></th></tr></thead>
              <tbody>
                <tr v-for="item in recentComplaints" :key="item.id" class="clickable-row" @click="navigateToComplaint(item.id)">
                  <td><div class="case-cell"><span class="case-id">{{ item.case_number }}</span><strong>{{ item.subject }}</strong><small>{{ item.institution_name || 'Institution not available' }}</small></div></td>
                  <td><span class="bureau-tag">{{ item.current_bureau_code || item.receiving_bureau_code || '—' }}</span></td>
                  <td><span class="status-label" :class="statusClass(item.status)"><i></i>{{ item.status }}</span></td>
                  <td><span class="priority-label" :class="priorityClass(item.priority)">{{ item.priority }}</span></td>
                  <td><span :class="{ 'date-overdue': item.is_overdue }">{{ shortDate(item.due_at) }}</span></td>
                  <td><ChevronRight :size="16" class="row-arrow" /></td>
                </tr>
                <tr v-if="!recentComplaints.length"><td colspan="6" class="empty-cell">No complaint records are available.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="table-foot"><span>Showing {{ recentComplaints.length }} recent records</span><span>Updated {{ dateTime(new Date().toISOString()) }}</span></div>
        </section>

        <aside class="right-rail">
          <section class="content-section review-section">
            <div class="section-heading"><div><h2>Needs a decision</h2><p>Potential overlaps requiring review</p></div><span class="count-mark">{{ pendingOverlaps.length }}</span></div>
            <div v-if="pendingOverlaps.length" class="review-list">
              <button v-for="link in pendingOverlaps.slice(0, 3)" :key="link.id" class="review-item" @click="openReview(link)">
                <div class="review-item-top"><span class="match-score">{{ Math.round((link.match_score || 0) * 100) }}% signal</span><span class="review-age">{{ shortDate(link.created_at) }}</span></div>
                <strong>{{ getCaseForLink(link, 'a').case_number }} <span>↔</span> {{ getCaseForLink(link, 'b').case_number }}</strong>
                <p>{{ link.match_reason }}</p>
                <span class="review-item-action">Compare records <ArrowRight :size="14" /></span>
              </button>
            </div>
            <div v-else class="quiet-empty"><CheckCircle2 :size="18" /><span>No cases are waiting in the review queue.</span></div>
            <button class="section-footer-link" @click="router.push('/overlaps')">Open review queue <ArrowRight :size="15" /></button>
          </section>

          <section class="content-section deadline-section">
            <div class="section-heading"><div><h2>Past due</h2><p>Open cases beyond due date</p></div><span class="count-mark count-mark-danger">{{ overdueComplaints.length }}</span></div>
            <div v-if="deadlineList.length" class="deadline-list">
              <button v-for="item in deadlineList" :key="item.id" class="deadline-item" @click="navigateToComplaint(item.id)">
                <span class="deadline-indicator"></span><span class="deadline-copy"><strong>{{ item.case_number }}</strong><small>{{ item.subject }}</small></span><span class="late-days">{{ daysLate(item) }}d late</span>
              </button>
            </div>
            <div v-else class="quiet-empty"><CheckCircle2 :size="18" /><span>No overdue cases in the current view.</span></div>
            <button class="section-footer-link" @click="activeFilter = 'Overdue'; router.push('/complaints')">View overdue cases <ArrowRight :size="15" /></button>
          </section>
        </aside>
      </div>

      <div class="lower-grid">
        <section class="content-section bureau-section">
          <div class="section-heading"><div><h2>Work by Bureau / Cell</h2><p>Current case distribution, based on available records</p></div><button class="text-action" @click="router.push('/reports')">View reports <ArrowRight :size="15" /></button></div>
          <div class="bureau-table">
            <div v-for="bureau in bureauWorkload" :key="bureau.code" class="bureau-row">
              <div class="bureau-name"><span class="bureau-avatar">{{ bureau.code.slice(0, 2) }}</span><span><strong>{{ bureau.code }}</strong><small>{{ bureau.name }}</small></span></div>
              <div class="bureau-track"><span :style="{ width: `${Math.max(3, (bureau.total / Math.max(1, ...bureauWorkload.map((b: Row) => b.total))) * 100)}%` }"></span></div>
              <div class="bureau-count"><strong>{{ bureau.total }}</strong><small>{{ bureau.open }} open</small></div>
            </div>
          </div>
        </section>
        <section class="content-section intake-section">
          <div class="section-heading"><div><h2>Seven-day intake</h2><p>Complaints received in the last week</p></div><span class="intake-total">{{ trendValues.reduce((sum, n) => sum + n, 0) }} <small>records</small></span></div>
          <div class="trend-visual">
            <svg viewBox="0 0 350 132" role="img" aria-label="Complaint intake line chart for the last seven days" preserveAspectRatio="none">
              <path d="M18 116 H336 M18 75 H336 M18 34 H336" class="chart-grid-line" />
              <polyline :points="trendPoints" class="chart-line" />
              <circle v-for="(point, i) in trendPoints.split(' ').map((pair) => pair.split(',').map(Number))" :key="i" :cx="point[0]" :cy="point[1]" r="3.5" class="chart-point" />
            </svg>
            <div class="trend-labels"><span>6 days ago</span><span>3 days ago</span><span>Today</span></div>
          </div>
          <p class="chart-footnote">Based on recorded receipt dates in the current dataset.</p>
        </section>
      </div>
    </template>

    <!-- COMPLAINT REGISTER -->
    <template v-else-if="page === 'complaints'">
      <section class="filter-bar">
        <div class="segmented-filter" role="group" aria-label="Case state filter">
          <button v-for="choice in ['All cases', 'Open cases', 'Overdue', 'Escalated']" :key="choice" :class="{ selected: activeFilter === choice }" @click="activeFilter = choice; pageNumber = 1">{{ choice }}<span v-if="choice === 'Overdue'">{{ overdueComplaints.length }}</span></button>
        </div>
        <div class="filter-controls">
          <label class="select-control"><Filter :size="15" /><select v-model="statusFilter" aria-label="Filter by status"><option>All statuses</option><option>Received</option><option>Under Review</option><option>Action Required</option><option>Awaiting Response</option><option>Escalated</option><option>Disposed</option><option>Closed</option></select><ChevronDown :size="14" /></label>
          <label class="select-control"><Layers3 :size="15" /><select v-model="bureauFilter" aria-label="Filter by Bureau"><option>All Bureaus</option><option v-for="bureau in bureaus" :key="bureau.code" :value="bureau.code">{{ bureau.code }}</option></select><ChevronDown :size="14" /></label>
          <button class="button button-quiet button-small" @click="clearFilters"><X :size="14" /> Clear</button>
        </div>
      </section>
      <section class="content-section register-table-section">
        <div class="section-heading table-title-row"><div><h2>Case register</h2><p>{{ visibleComplaints.length }} records match the current filters</p></div><button class="button button-quiet button-small" @click="exportCsv"><Download :size="15" /> Export</button></div>
        <div class="table-wrap">
          <table class="data-table register-table">
            <thead><tr><th>Case ID</th><th>Institution</th><th>Complaint</th><th>Bureau</th><th>Status</th><th>Priority</th><th>Received</th><th>Due date</th><th></th></tr></thead>
            <tbody>
              <tr v-for="item in pagedComplaints" :key="item.id" class="clickable-row" @click="navigateToComplaint(item.id)">
                <td><span class="case-id">{{ item.case_number }}</span></td>
                <td><button class="table-link" @click.stop="navigateToInstitution(item.institution_id)">{{ item.institution_name }}</button><small class="table-subline">{{ item.institution_code }}</small></td>
                <td><div class="case-cell"><strong>{{ item.subject }}</strong><small>{{ item.category }}</small></div></td>
                <td><span class="bureau-tag">{{ item.current_bureau_code || item.receiving_bureau_code }}</span></td>
                <td><span class="status-label" :class="statusClass(item.status)"><i></i>{{ item.status }}</span></td>
                <td><span class="priority-label" :class="priorityClass(item.priority)">{{ item.priority }}</span></td>
                <td>{{ shortDate(item.received_at) }}</td>
                <td><span :class="{ 'date-overdue': item.is_overdue }">{{ shortDate(item.due_at) }}</span></td>
                <td><ChevronRight :size="15" class="row-arrow" /></td>
              </tr>
              <tr v-if="!pagedComplaints.length"><td colspan="9" class="empty-cell">No cases match these filters. <button class="inline-link" @click.stop="clearFilters">Clear filters</button></td></tr>
            </tbody>
          </table>
        </div>
        <div class="pagination-row"><span>Page {{ pageNumber }} of {{ complaintPageCount }}</span><div class="pagination-controls"><button class="icon-button" :disabled="pageNumber <= 1" aria-label="Previous page" @click="pageNumber--"><ChevronLeft :size="17" /></button><button class="page-number">{{ pageNumber }}</button><button class="icon-button" :disabled="pageNumber >= complaintPageCount" aria-label="Next page" @click="pageNumber++"><ChevronRight :size="17" /></button></div></div>
      </section>
    </template>

    <!-- COMPLAINT DETAIL -->
    <template v-else-if="page === 'detail'">
      <div v-if="currentComplaint" class="detail-layout">
        <div class="detail-main-column">
          <section class="content-section detail-summary">
            <div class="detail-topline"><button class="back-link" @click="router.push('/complaints')"><ChevronLeft :size="15" /> All complaints</button><span class="case-id">{{ currentComplaint.case_number }}</span></div>
            <div class="detail-title-row"><div><h2>{{ currentComplaint.subject }}</h2><p>{{ currentComplaint.institution_name }} <span class="meta-dot"></span> {{ currentComplaint.category }}</p></div><span class="status-label" :class="statusClass(currentComplaint.status)"><i></i>{{ currentComplaint.status }}</span></div>
            <div class="detail-meta-grid"><div><span>Received</span><strong>{{ shortDate(currentComplaint.received_at) }}</strong></div><div><span>Due date</span><strong :class="{ 'date-overdue': currentComplaint.is_overdue }">{{ shortDate(currentComplaint.due_at) }}</strong></div><div><span>Current Bureau</span><strong>{{ currentComplaint.current_bureau_name || currentComplaint.current_bureau_code }}</strong></div><div><span>Assigned officer</span><strong>{{ currentComplaint.assigned_officer_name || 'Unassigned' }}</strong></div></div>
            <div class="detail-description"><h3>Complaint summary</h3><p>{{ currentComplaint.description }}</p></div>
          </section>
          <section class="content-section timeline-section">
            <div class="section-heading"><div><h2>Case history</h2><p>Recorded actions and status changes</p></div></div>
            <div v-if="currentComplaint.actions?.length" class="timeline-list">
              <div v-for="action in currentComplaint.actions" :key="action.id" class="timeline-item"><span class="timeline-point"></span><div><div class="timeline-item-head"><strong>{{ action.action_type || 'Case action' }}</strong><span>{{ dateTime(action.created_at) }}</span></div><p>{{ action.description }}</p><small>{{ action.performed_by_name || 'Authorized officer' }}</small></div></div>
            </div>
            <div v-else class="timeline-empty"><span class="timeline-point"></span><div><strong>Complaint registered</strong><p>The case record was created on {{ shortDate(currentComplaint.created_at || currentComplaint.received_at) }}.</p><small>Further actions will appear here when recorded.</small></div></div>
          </section>
        </div>
        <aside class="detail-side-column">
          <section class="content-section action-panel"><div class="section-heading"><div><h2>Update case</h2><p>Record a status change</p></div></div><label class="field-label" for="case-status">New status</label><select id="case-status" class="form-control" :value="currentComplaint.status" @change="changeStatus(($event.target as HTMLSelectElement).value)"><option>Received</option><option>Under Review</option><option>Action Required</option><option>Awaiting Response</option><option>Escalated</option><option>Disposed</option><option>Closed</option></select><p class="form-hint">Changes are stored in the API when connected. Local demo changes stay in this browser.</p><button class="button button-primary button-full" @click="router.push('/institutions/' + currentComplaint.institution_id)"><Building2 :size="16" /> View institution profile</button></section>
          <section class="content-section related-panel"><div class="section-heading"><div><h2>Related records</h2><p>Potential overlap signals</p></div></div><div v-for="link in overlaps.filter((item) => Number(item.complaint_id_a) === currentComplaint.id || Number(item.complaint_id_b) === currentComplaint.id)" :key="link.id" class="related-row"><span class="related-icon"><GitCompare :size="16" /></span><div><strong>{{ getCaseForLink(link, Number(link.complaint_id_a) === currentComplaint.id ? 'b' : 'a').case_number }}</strong><small>{{ link.review_status === 'pending' ? 'Awaiting review' : link.review_status }}</small></div><button class="icon-button" aria-label="Review relationship" @click="openReview(link)"><ArrowUpRight :size="16" /></button></div><div v-if="!overlaps.some((item) => Number(item.complaint_id_a) === currentComplaint.id || Number(item.complaint_id_b) === currentComplaint.id)" class="quiet-empty"><span>No related records flagged.</span></div></section>
        </aside>
      </div>
      <section v-else class="content-section not-found"><CircleAlert :size="25" /><h2>Case not found</h2><p>This case is not in the currently loaded register.</p><button class="button button-primary" @click="router.push('/complaints')">Return to complaints</button></section>
    </template>

    <!-- INSTITUTION DIRECTORY -->
    <template v-else-if="page === 'institutions'">
      <section class="filter-bar institution-filter-bar"><div class="filter-intro"><Building2 :size="19" /><span>{{ visibleInstitutions.length }} institutions in the directory</span></div><div class="filter-controls"><label class="select-control"><Filter :size="15" /><select v-model="institutionTypeFilter" aria-label="Filter by institution type"><option v-for="type in institutionTypeOptions" :key="type">{{ type }}</option></select><ChevronDown :size="14" /></label></div></section>
      <section class="content-section directory-section"><div class="section-heading"><div><h2>Institution records</h2><p>Open a profile to see all associated complaints</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Institution</th><th>Permanent ID</th><th>Location</th><th>Cases</th><th>Open</th><th>Bureaus involved</th><th></th></tr></thead><tbody><tr v-for="institution in visibleInstitutions" :key="institution.id" class="clickable-row" @click="navigateToInstitution(institution.id)"><td><div class="institution-name-cell"><span class="institution-avatar"><Building2 :size="17" /></span><span><strong>{{ institution.name }}</strong><small>{{ institution.institution_type }}</small></span></div></td><td><span class="case-id">{{ institution.institution_code }}</span></td><td>{{ institution.district ? `${institution.district}, ` : '' }}{{ institution.state }}</td><td><strong>{{ institution.total_complaints ?? institutionCaseCount(institution.id) }}</strong></td><td><span class="open-count">{{ institution.open_complaints ?? complaints.filter((item) => Number(item.institution_id) === Number(institution.id) && !['Disposed', 'Closed'].includes(item.status)).length }}</span></td><td><div class="bureau-stack"><span v-for="code in (institution.bureaus_involved || []).slice(0, 3)" :key="code">{{ code }}</span></div></td><td><ChevronRight :size="16" class="row-arrow" /></td></tr><tr v-if="!visibleInstitutions.length"><td colspan="7" class="empty-cell">No institutions match your search.</td></tr></tbody></table></div></section>
    </template>

    <!-- INSTITUTION PROFILE -->
    <template v-else-if="page === 'institution'">
      <div v-if="currentInstitution" class="institution-profile-page">
        <section class="content-section institution-profile-head"><button class="back-link" @click="router.push('/institutions')"><ChevronLeft :size="15" /> Institution directory</button><div class="institution-profile-name"><div class="institution-large-mark"><Building2 :size="24" /></div><div><div class="case-id">{{ currentInstitution.institution_code }}</div><h2>{{ currentInstitution.name }}</h2><p>{{ currentInstitution.institution_type }} <span class="meta-dot"></span> {{ currentInstitution.district ? `${currentInstitution.district}, ` : '' }}{{ currentInstitution.state }}</p></div></div><div class="profile-stats"><div><span>Total cases</span><strong>{{ currentInstitution.total_complaints ?? institutionCaseCount(currentInstitution.id) }}</strong></div><div><span>Open</span><strong>{{ currentInstitution.open_complaints ?? complaints.filter((item) => Number(item.institution_id) === Number(currentInstitution.id) && !['Disposed', 'Closed'].includes(item.status)).length }}</strong></div><div><span>Disposed</span><strong>{{ currentInstitution.disposed_complaints ?? complaints.filter((item) => Number(item.institution_id) === Number(currentInstitution.id) && ['Disposed', 'Closed'].includes(item.status)).length }}</strong></div><div><span>Bureaus involved</span><strong>{{ (currentInstitution.bureaus_involved || []).length || new Set(complaints.filter((item) => Number(item.institution_id) === Number(currentInstitution.id)).map((item) => item.current_bureau_code)).size }}</strong></div></div></section>
        <section class="content-section"><div class="section-heading"><div><h2>Complaint history</h2><p>Cases linked to this institution, regardless of Bureau</p></div><button class="button button-primary button-small" @click="openNewComplaint"><Plus :size="15" /> Add complaint</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Case ID</th><th>Subject</th><th>Bureau</th><th>Status</th><th>Priority</th><th>Received</th><th></th></tr></thead><tbody><tr v-for="item in complaints.filter((row) => Number(row.institution_id) === currentInstitution.id)" :key="item.id" class="clickable-row" @click="navigateToComplaint(item.id)"><td><span class="case-id">{{ item.case_number }}</span></td><td><div class="case-cell"><strong>{{ item.subject }}</strong><small>{{ item.category }}</small></div></td><td><span class="bureau-tag">{{ item.current_bureau_code || item.receiving_bureau_code }}</span></td><td><span class="status-label" :class="statusClass(item.status)"><i></i>{{ item.status }}</span></td><td><span class="priority-label" :class="priorityClass(item.priority)">{{ item.priority }}</span></td><td>{{ shortDate(item.received_at) }}</td><td><ChevronRight :size="15" class="row-arrow" /></td></tr></tbody></table></div></section>
        <section class="content-section"><div class="section-heading"><div><h2>Potential relationships</h2><p>Cases that may need coordination</p></div></div><div v-for="link in overlaps.filter((item) => Number(getCaseForLink(item, 'a').institution_id || item.case_a?.id) && (getCaseForLink(item, 'a').institution_code === currentInstitution.institution_code || getCaseForLink(item, 'b').institution_code === currentInstitution.institution_code || Number(item.case_a?.id) === currentInstitution.id || Number(item.case_b?.id) === currentInstitution.id))" :key="link.id" class="profile-overlap-row"><div><strong>{{ getCaseForLink(link, 'a').case_number }} ↔ {{ getCaseForLink(link, 'b').case_number }}</strong><p>{{ link.match_reason }}</p></div><span class="status-label" :class="statusClass(link.review_status)"><i></i>{{ link.review_status }}</span><button class="text-action" @click="openReview(link)">Review <ArrowRight :size="14" /></button></div><p v-if="!overlaps.length" class="empty-note">No potential relationships are currently recorded.</p></section>
      </div>
      <section v-else class="content-section not-found"><Building2 :size="25" /><h2>Institution not found</h2><p>The institution may not be in the currently loaded directory.</p><button class="button button-primary" @click="router.push('/institutions')">Return to directory</button></section>
    </template>

    <!-- OVERLAP REVIEW -->
    <template v-else-if="page === 'overlaps'">
      <section class="overlap-intro"><div class="overlap-intro-icon"><GitCompare :size="20" /></div><div><strong>Potential relationship is not a duplicate finding.</strong><p>Use the identifiers, subjects and descriptions below to decide whether coordination is appropriate. Original records remain separate.</p></div></section>
      <section class="filter-bar"><div class="segmented-filter" role="group" aria-label="Filter overlap review status"><button v-for="choice in [{ label: 'Awaiting review', value: 'pending' }, { label: 'Confirmed', value: 'confirmed' }, { label: 'Dismissed', value: 'dismissed' }, { label: 'All records', value: 'all' }]" :key="choice.value" :class="{ selected: overlapFilter === choice.value }" @click="overlapFilter = choice.value">{{ choice.label }}</button></div><span class="filter-result-count">{{ visibleOverlaps.length }} relationships</span></section>
      <section class="content-section overlap-table-section"><div class="section-heading"><div><h2>Relationship queue</h2><p>Order reflects the matching signal, not a probability of duplication</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Cases being compared</th><th>Matching evidence</th><th>Signal</th><th>Review status</th><th>Date flagged</th><th></th></tr></thead><tbody><tr v-for="link in visibleOverlaps" :key="link.id" class="clickable-row" @click="openReview(link)"><td><div class="comparison-cases"><span class="case-id">{{ getCaseForLink(link, 'a').case_number }}</span><span class="compare-divider">↔</span><span class="case-id">{{ getCaseForLink(link, 'b').case_number }}</span><small>{{ getCaseForLink(link, 'a').bureau_code || 'Bureau' }} / {{ getCaseForLink(link, 'b').bureau_code || 'Bureau' }}</small></div></td><td><div class="case-cell"><strong>{{ link.match_method || 'Review suggested' }}</strong><small>{{ link.match_reason }}</small></div></td><td><div class="signal-meter"><strong>{{ Math.round((link.match_score || 0) * 100) }}%</strong><span><i :style="{ width: `${Math.min(100, (link.match_score || 0) * 100)}%` }"></i></span></div></td><td><span class="status-label" :class="statusClass(link.review_status || 'pending')"><i></i>{{ link.review_status || 'pending' }}</span></td><td>{{ shortDate(link.created_at) }}</td><td><button class="button button-quiet button-small" @click.stop="openReview(link)">Compare <ArrowRight :size="14" /></button></td></tr><tr v-if="!visibleOverlaps.length"><td colspan="6" class="empty-cell">No relationship records in this view.</td></tr></tbody></table></div></section>
    </template>

    <!-- REPORTS -->
    <template v-else-if="page === 'reports'">
      <section class="metric-strip report-metrics"><div class="metric-cell"><span class="metric-label">Registered complaints</span><strong class="metric-value">{{ totalCount }}</strong><span class="metric-note">Across the loaded dataset</span></div><div class="metric-cell"><span class="metric-label">Open cases</span><strong class="metric-value">{{ openCount }}</strong><span class="metric-note">Still in progress</span></div><div class="metric-cell"><span class="metric-label">Disposed</span><strong class="metric-value">{{ disposedCount }}</strong><span class="metric-note">Recorded as complete</span></div><div class="metric-cell"><span class="metric-label">Past due</span><strong class="metric-value metric-danger">{{ overdueCount }}</strong><span class="metric-note">Require attention</span></div></section>
      <div class="reports-grid"><section class="content-section report-bureau"><div class="section-heading"><div><h2>Bureau distribution</h2><p>Cases by current handling department</p></div></div><div class="report-bars"><div v-for="bureau in bureauWorkload" :key="bureau.code" class="report-bar-row"><div class="report-bar-head"><span>{{ bureau.name }}</span><strong>{{ bureau.total }}</strong></div><div class="report-bar-track"><span :style="{ width: `${Math.max(2, bureau.total / Math.max(1, ...bureauWorkload.map((b: Row) => b.total)) * 100)}%` }"></span></div><small>{{ bureau.open }} open · {{ bureau.overdue }} past due</small></div></div></section><section class="content-section report-status"><div class="section-heading"><div><h2>Case status</h2><p>Current composition of the register</p></div></div><div class="status-breakdown"><div v-for="status in ['Received', 'Under Review', 'Action Required', 'Awaiting Response', 'Escalated', 'Disposed']" :key="status" class="status-breakdown-row"><span class="status-label" :class="statusClass(status)"><i></i>{{ status }}</span><div class="status-breakdown-track"><span :style="{ width: `${Math.max(0, complaints.filter((item) => item.status === status).length / Math.max(1, complaints.length) * 100)}%` }"></span></div><strong>{{ complaints.filter((item) => item.status === status).length }}</strong></div></div></section></div>
      <section class="content-section report-institution"><div class="section-heading"><div><h2>Institutions with the most open cases</h2><p>Use this list to guide workload review, not as a measure of institutional fault</p></div><button class="text-action" @click="router.push('/institutions')">Institution directory <ArrowRight :size="15" /></button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Institution</th><th>Permanent ID</th><th>Open cases</th><th>Total cases</th><th></th></tr></thead><tbody><tr v-for="inst in [...institutions].sort((a,b) => (b.open_complaints ?? complaints.filter((c) => Number(c.institution_id) === b.id && !['Disposed','Closed'].includes(c.status)).length) - (a.open_complaints ?? complaints.filter((c) => Number(c.institution_id) === a.id && !['Disposed','Closed'].includes(c.status)).length)).slice(0,5)" :key="inst.id" class="clickable-row" @click="navigateToInstitution(inst.id)"><td><strong>{{ inst.name }}</strong></td><td><span class="case-id">{{ inst.institution_code }}</span></td><td><strong class="report-open-number">{{ inst.open_complaints ?? complaints.filter((c) => Number(c.institution_id) === inst.id && !['Disposed','Closed'].includes(c.status)).length }}</strong></td><td>{{ inst.total_complaints ?? institutionCaseCount(inst.id) }}</td><td><ChevronRight :size="15" class="row-arrow" /></td></tr></tbody></table></div></section>
    </template>

    <!-- NOTIFICATIONS -->
    <template v-else-if="page === 'notifications'">
      <section class="filter-bar"><div class="segmented-filter"><button :class="{ selected: notificationFilter === 'all' }" @click="notificationFilter = 'all'">All activity</button><button :class="{ selected: notificationFilter === 'unread' }" @click="notificationFilter = 'unread'">Unread <span>{{ unreadCount }}</span></button></div><button class="text-action" @click="markAllRead"><CheckCheck :size="15" /> Mark all read</button></section>
      <section class="content-section notification-list-section"><div class="section-heading"><div><h2>Activity inbox</h2><p>Operational notices from this workspace</p></div></div><div v-for="item in visibleNotifications" :key="item.id" class="notification-row" :class="{ 'notification-unread': !item.is_read && !item.read_at }"><div class="notification-icon" :class="item.notification_type === 'deadline' ? 'notification-icon-danger' : item.notification_type === 'overlap' ? 'notification-icon-caution' : ''"><CalendarClock v-if="item.notification_type === 'deadline'" :size="18" /><GitCompare v-else-if="item.notification_type === 'overlap'" :size="18" /><Activity v-else :size="18" /></div><div class="notification-copy"><div class="notification-title-line"><strong>{{ item.title }}</strong><span>{{ dateTime(item.created_at) }}</span></div><p>{{ item.message }}</p><button v-if="item.related_complaint_id" class="inline-link" @click="navigateToComplaint(item.related_complaint_id)">Open case <ArrowRight :size="13" /></button></div><button v-if="!item.is_read && !item.read_at" class="button button-quiet button-small" @click="markRead(item)"><Check :size="14" /> Mark read</button><span v-else class="read-state">Read</span></div><div v-if="!visibleNotifications.length" class="empty-state-block"><CheckCircle2 :size="24" /><strong>You're all caught up</strong><p>No notifications match this view.</p></div></section>
    </template>

    <!-- IMPORTS -->
    <template v-else-if="page === 'imports'">
      <div class="import-layout"><section class="content-section import-main"><div class="section-heading"><div><h2>Import complaint records</h2><p>Upload a CSV, check the rows, then confirm the import.</p></div></div><div class="import-dropzone" :class="{ 'import-file-loaded': selectedFile }"><input id="complaint-csv-file" type="file" accept=".csv,text/csv" aria-label="Choose CSV file" @change="onFilePicked" /><div class="import-upload-icon"><FileSpreadsheet :size="24" /></div><strong>{{ selectedFile ? selectedFile.name : 'Choose a CSV file' }}</strong><p>{{ selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB · Ready to preview` : 'CSV format · Keep identifiers and column headings intact' }}</p><label class="button button-quiet" for="complaint-csv-file">Browse files</label><span class="import-supported">Files are validated before any records are committed.</span></div><div class="import-action-row"><button class="text-action" @click="downloadTemplate"><Download :size="15" /> Download CSV template</button><button class="button button-primary" :disabled="!selectedFile" @click="previewImport"><FileSearch :size="16" /> Validate file</button></div><div v-if="importPreview" class="import-preview"><div class="import-preview-header"><div><CheckCircle2 v-if="importPreview.is_valid" :size="19" /><AlertCircle v-else :size="19" /><strong>{{ importPreview.local_demo ? 'Local preview complete' : 'Import validation result' }}</strong></div><span class="status-label" :class="importPreview.is_valid ? 'status-good' : 'status-critical'"><i></i>{{ importPreview.is_valid ? 'Ready to review' : 'Needs corrections' }}</span></div><div class="import-counts"><div><span>Rows found</span><strong>{{ importPreview.total_rows ?? importPreview.total_count ?? 0 }}</strong></div><div><span>Valid rows</span><strong>{{ importPreview.success_rows ?? importPreview.valid_rows?.length ?? 0 }}</strong></div><div><span>Errors</span><strong>{{ importPreview.failed_rows ?? importPreview.errors?.length ?? 0 }}</strong></div></div><p v-if="importPreview.local_demo" class="form-hint">This is a basic local preview. Start the Flask API for authoritative field-level validation and commit.</p><button class="button button-primary" :disabled="!importPreview.is_valid" @click="commitImport">Confirm import <ArrowRight :size="15" /></button></div></section><aside class="content-section import-guide"><div class="section-heading"><div><h2>Before you import</h2><p>Keep the register consistent</p></div></div><ol class="import-steps"><li><span>1</span><div><strong>Use the template</strong><p>Keep column headings unchanged so the importer can map fields correctly.</p></div></li><li><span>2</span><div><strong>Check institution IDs</strong><p>Use a Permanent ID already present in the institution directory.</p></div></li><li><span>3</span><div><strong>Review the preview</strong><p>Resolve validation errors before confirming any changes.</p></div></li></ol><div class="import-safety"><ShieldCheck :size="17" /><span>Only import data you are authorized to process. Use fictional records for demonstrations.</span></div></aside></div><section v-if="importHistory.length" class="content-section import-history"><div class="section-heading"><div><h2>Recent imports</h2><p>Latest completed and attempted batches</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>File</th><th>Status</th><th>Rows processed</th><th>Created by</th><th>Date</th></tr></thead><tbody><tr v-for="batch in importHistory" :key="batch.id"><td><strong>{{ batch.filename }}</strong></td><td><span class="status-label" :class="statusClass(batch.status)"><i></i>{{ batch.status }}</span></td><td>{{ batch.success_rows }} / {{ batch.total_rows }}</td><td>{{ batch.created_by_name }}</td><td>{{ shortDate(batch.created_at) }}</td></tr></tbody></table></div></section>
    </template>

    <!-- ADMINISTRATION -->
    <template v-else-if="page === 'admin'">
      <div class="admin-status-row"><section class="content-section system-status-panel"><div class="system-status-title"><span class="system-status-icon"><Activity :size="19" /></span><div><h2>System status</h2><p>Connectivity as observed from this browser session</p></div></div><div class="system-status-grid"><div><span>API service</span><strong><i :class="ui.isDemoMode ? 'led-warn' : 'led-good'"></i>{{ ui.isDemoMode ? 'Not reachable' : 'Responding' }}</strong></div><div><span>Database</span><strong><i :class="systemStatus?.database?.toLowerCase().includes('healthy') ? 'led-good' : 'led-warn'"></i>{{ systemStatus?.database || 'Not verified' }}</strong></div><div><span>Version</span><strong>{{ systemStatus?.portal_version || 'SIH 2026 prototype' }}</strong></div></div><button class="button button-quiet button-small" @click="loadWorkspace"><RefreshCw :size="14" /> Check again</button></section><section class="content-section admin-note-panel"><ShieldCheck :size="20" /><h2>Access is role-based</h2><p>Production access must be enforced by Flask for every record and action. Frontend navigation is not an authorization boundary.</p></section></div>
      <section class="content-section admin-users-section"><div class="section-heading"><div><h2>User directory</h2><p>{{ adminUsers.length }} accounts in the current view</p></div><span class="subtle-note">Password changes are handled by the backend.</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Bureau</th><th>Account</th></tr></thead><tbody><tr v-for="user in adminUsers" :key="user.id"><td><div class="user-table-cell"><span class="user-table-avatar">{{ (user.name || 'U').split(' ').map((x: string) => x[0]).join('').slice(0,2) }}</span><strong>{{ user.name }}</strong></div></td><td>{{ user.email }}</td><td>{{ String(user.role || '').replace('_', ' ') }}</td><td>{{ user.bureau_name || 'All Bureaus' }}</td><td><span class="status-label" :class="user.is_active ? 'status-good' : 'status-critical'"><i></i>{{ user.is_active ? 'Active' : 'Inactive' }}</span></td></tr></tbody></table></div></section>
      <section class="content-section admin-audit-section"><div class="section-heading"><div><h2>Recent audit activity</h2><p>Consequential actions, when the connected API makes them available</p></div></div><div v-if="auditLogs.length" class="audit-list"><div v-for="log in auditLogs.slice(0,8)" :key="log.id" class="audit-row"><div class="audit-icon"><ClipboardCheck :size="16" /></div><div><strong>{{ log.action || log.action_type || 'Recorded action' }}</strong><p>{{ log.description || log.entity_type || 'Administrative event' }}</p></div><span>{{ dateTime(log.created_at) }}</span></div></div><div v-else class="quiet-empty"><Database :size="18" /><span>{{ ui.isDemoMode ? 'Audit events are not available while running in local demo mode.' : 'No audit events were returned by the API.' }}</span></div></section>
    </template>
  </div>

  <!-- New complaint drawer -->
  <Transition name="drawer">
    <div v-if="newComplaintOpen" class="modal-backdrop" @click.self="newComplaintOpen = false">
      <section class="form-drawer" role="dialog" aria-modal="true" aria-labelledby="new-complaint-title">
        <div class="drawer-header"><div><h2 id="new-complaint-title">Register a complaint</h2><p>Create a case in the centralized register.</p></div><button class="icon-button" aria-label="Close form" @click="newComplaintOpen = false"><X :size="19" /></button></div>
        <form class="new-complaint-form" @submit.prevent="submitNewComplaint">
          <label class="field-label" for="new-subject">Complaint subject <span>*</span></label><input id="new-subject" v-model="newForm.subject" class="form-control" required maxlength="180" placeholder="State the issue in one line" />
          <label class="field-label" for="new-institution">Institution <span>*</span></label><select id="new-institution" v-model="newForm.institution_id" class="form-control" required><option v-for="institution in institutions" :key="institution.id" :value="String(institution.id)">{{ institution.name }}</option></select>
          <label class="field-label" for="new-description">Complaint description <span>*</span></label><textarea id="new-description" v-model="newForm.description" class="form-control form-textarea" required rows="5" placeholder="Summarize the report and the action requested."></textarea>
          <div class="form-two-column"><div><label class="field-label" for="new-category">Category</label><select id="new-category" v-model="newForm.category" class="form-control"><option>General administration</option><option>Fee irregularity</option><option>Admission irregularity</option><option>Faculty compliance</option><option>Infrastructure</option><option>Student safety</option><option>Financial records</option><option>Approval compliance</option></select></div><div><label class="field-label" for="new-priority">Priority</label><select id="new-priority" v-model="newForm.priority" class="form-control"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div></div>
          <label class="field-label" for="new-bureau">Receiving Bureau / Cell</label><select id="new-bureau" v-model="newForm.bureau_id" class="form-control"><option v-for="bureau in bureaus" :key="bureau.id" :value="String(bureau.id)">{{ bureau.code }} — {{ bureau.name }}</option></select>
          <label class="field-label" for="new-due-date">Target due date</label><input id="new-due-date" v-model="newForm.due_at" class="form-control" type="date" />
          <div class="form-drawer-footer"><button type="button" class="button button-quiet" @click="newComplaintOpen = false">Cancel</button><button type="submit" class="button button-primary"><Check :size="16" /> Save complaint</button></div>
        </form>
      </section>
    </div>
  </Transition>

  <!-- Overlap comparison drawer -->
  <Transition name="drawer">
    <div v-if="selectedOverlap" class="modal-backdrop" @click.self="selectedOverlap = null">
      <section class="form-drawer comparison-drawer" role="dialog" aria-modal="true" aria-labelledby="overlap-review-title">
        <div class="drawer-header"><div><h2 id="overlap-review-title">Review potential relationship</h2><p>Keep the cases separate unless a reviewer confirms coordination.</p></div><button class="icon-button" aria-label="Close review" @click="selectedOverlap = null"><X :size="19" /></button></div>
        <div class="review-explanation"><div class="review-score-large">{{ Math.round((selectedOverlap.match_score || 0) * 100) }}<small>%</small></div><div><strong>{{ selectedOverlap.match_method || 'Matching signal' }}</strong><p>{{ selectedOverlap.match_reason }}</p></div></div>
        <div class="compare-records"><article><div class="compare-label"><span class="case-id">{{ getCaseForLink(selectedOverlap, 'a').case_number }}</span><span class="bureau-tag">{{ getCaseForLink(selectedOverlap, 'a').bureau_code || 'Bureau A' }}</span></div><h3>{{ getCaseForLink(selectedOverlap, 'a').subject }}</h3><p>{{ getCaseForLink(selectedOverlap, 'a').description }}</p><dl><div><dt>Institution</dt><dd>{{ getCaseForLink(selectedOverlap, 'a').institution_name || 'Not supplied' }}</dd></div><div><dt>Status</dt><dd>{{ getCaseForLink(selectedOverlap, 'a').status || 'Unknown' }}</dd></div></dl><button class="text-action" @click="navigateToComplaint(getCaseForLink(selectedOverlap, 'a').id); selectedOverlap = null">Open record <ArrowUpRight :size="14" /></button></article><article><div class="compare-label"><span class="case-id">{{ getCaseForLink(selectedOverlap, 'b').case_number }}</span><span class="bureau-tag">{{ getCaseForLink(selectedOverlap, 'b').bureau_code || 'Bureau B' }}</span></div><h3>{{ getCaseForLink(selectedOverlap, 'b').subject }}</h3><p>{{ getCaseForLink(selectedOverlap, 'b').description }}</p><dl><div><dt>Institution</dt><dd>{{ getCaseForLink(selectedOverlap, 'b').institution_name || 'Not supplied' }}</dd></div><div><dt>Status</dt><dd>{{ getCaseForLink(selectedOverlap, 'b').status || 'Unknown' }}</dd></div></dl><button class="text-action" @click="navigateToComplaint(getCaseForLink(selectedOverlap, 'b').id); selectedOverlap = null">Open record <ArrowUpRight :size="14" /></button></article></div>
        <div class="review-human-note"><ShieldCheck :size="17" /><span>Decision is recorded with the reviewer and does not merge or close either complaint.</span></div>
        <div class="form-drawer-footer review-actions"><button class="button button-quiet" :disabled="isReviewing" @click="reviewOverlap(selectedOverlap, 'deferred')">Defer</button><button class="button button-outline-danger" :disabled="isReviewing" @click="reviewOverlap(selectedOverlap, 'unrelated')">Mark unrelated</button><button class="button button-primary" :disabled="isReviewing" @click="reviewOverlap(selectedOverlap, 'confirmed_related')"><Check :size="16" /> Confirm related</button></div>
      </section>
    </div>
  </Transition>
</template>
