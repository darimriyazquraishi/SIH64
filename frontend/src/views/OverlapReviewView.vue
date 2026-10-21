<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOverlapsStore } from '@/stores/overlaps'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import Modal from '@/components/Modal.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { CaseLink } from '@/types'
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Tag,
  Building,
  ShieldAlert,
} from 'lucide-vue-next'

const store = useOverlapsStore()
const authStore = useAuthStore()

const currentTab = ref<'pending' | 'confirmed' | 'dismissed' | 'deferred'>('pending')

// Review Modal State
const isReviewModalOpen = ref(false)
const selectedLink = ref<CaseLink | null>(null)
const reviewDecision = ref<'confirmed_related' | 'unrelated' | 'deferred'>('confirmed_related')
const reviewRemarks = ref('')
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

onMounted(() => {
  store.fetchOverlaps(currentTab.value)
})

function switchTab(tab: 'pending' | 'confirmed' | 'dismissed' | 'deferred') {
  currentTab.value = tab
  store.fetchOverlaps(tab)
}

function openReviewModal(link: CaseLink, decision: 'confirmed_related' | 'unrelated' | 'deferred') {
  selectedLink.value = link
  reviewDecision.value = decision
  reviewRemarks.value = ''
  submitError.value = null
  isReviewModalOpen.value = true
}

async function handleConfirmReview() {
  if (!selectedLink.value) return
  isSubmitting.value = true
  submitError.value = null

  const res = await store.reviewOverlap(
    selectedLink.value.id,
    reviewDecision.value,
    reviewRemarks.value
  )

  isSubmitting.value = false
  if (res.success) {
    isReviewModalOpen.value = false
  } else {
    submitError.value = res.error
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-xl font-bold tracking-tight text-slate-900">
            Cross-Bureau Overlap Detection & Coordination
          </h2>
          <span class="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900 border border-amber-300">
            Signature Feature
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-0.5">
          Multi-stage correlation pipeline flagging potential duplicates and related cases across departmental boundaries
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="authStore.isAdmin"
          type="button"
          :disabled="store.loading"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition"
          @click="store.rescanAll()"
        >
          <RefreshCw :class="['w-3.5 h-3.5', store.loading ? 'animate-spin' : '']" />
          Re-scan All Records
        </button>
      </div>
    </div>

    <!-- Transparent Engine Explanation Box -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-amber-500" />
        Transparent 4-Stage Matching Engine
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3 text-xs">
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <p class="font-bold text-slate-900">Stage A: Exact Identifiers</p>
          <p class="text-[11px] text-slate-500 mt-1">
            Matches AICTE Permanent IDs and external references (CPGRAMS, Court docket).
          </p>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <p class="font-bold text-slate-900">Stage B: Identity Resolution</p>
          <p class="text-[11px] text-slate-500 mt-1">
            Fuzzy token matching, alias normalization, and state boundary verification.
          </p>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <p class="font-bold text-slate-900">Stage C: Content Overlap</p>
          <p class="text-[11px] text-slate-500 mt-1">
            Category alignment, salient keyword extraction, and narrative similarity.
          </p>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <p class="font-bold text-slate-900">Stage D: Explainable Review</p>
          <p class="text-[11px] text-slate-500 mt-1">
            Transparent evidence synthesis for human-in-the-loop regulatory decisions.
          </p>
        </div>
      </div>
    </div>

    <!-- Review Status Tabs -->
    <div class="flex items-center gap-2 border-b border-slate-200 pb-2">
      <button
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2',
          currentTab === 'pending'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
        @click="switchTab('pending')"
      >
        <span>Pending Review Queue</span>
        <span
          v-if="store.pendingCount > 0"
          class="rounded-full bg-amber-500 text-white font-bold px-1.5 py-0.2 text-[10px]"
        >
          {{ store.pendingCount }}
        </span>
      </button>

      <button
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition',
          currentTab === 'confirmed'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
        @click="switchTab('confirmed')"
      >
        Confirmed Related
      </button>

      <button
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition',
          currentTab === 'dismissed'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
        @click="switchTab('dismissed')"
      >
        Marked Unrelated
      </button>

      <button
        type="button"
        :class="[
          'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition',
          currentTab === 'deferred'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        ]"
        @click="switchTab('deferred')"
      >
        Deferred
      </button>
    </div>

    <!-- Overlap Pairs Queue -->
    <div class="space-y-6">
      <div
        v-for="link in store.overlaps"
        :key="link.id"
        class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden transition hover:shadow-elevated"
      >
        <!-- Card Header: Score, Method & Actions -->
        <div class="bg-slate-50/90 border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1.5 rounded-lg bg-amber-500 text-white px-2.5 py-1 text-xs font-bold shadow-sm">
              <Sparkles class="w-3.5 h-3.5" />
              {{ Math.round(link.match_score * 100) }}% Overlap Match
            </span>

            <span class="text-xs font-mono font-medium text-slate-600">
              Method: {{ link.match_method }}
            </span>

            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                link.review_status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                link.review_status === 'dismissed' ? 'bg-slate-200 text-slate-700' :
                link.review_status === 'deferred' ? 'bg-purple-100 text-purple-800' :
                'bg-amber-100 text-amber-800'
              ]"
            >
              {{ link.review_status }}
            </span>
          </div>

          <!-- Official Action Buttons (for authorized officers / admins) -->
          <div v-if="!authStore.isSeniorAuthority" class="flex items-center gap-2">
            <button
              v-if="link.review_status !== 'confirmed'"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-800 shadow-sm transition"
              @click="openReviewModal(link, 'confirmed_related')"
            >
              <CheckCircle2 class="w-3.5 h-3.5" />
              Confirm Related
            </button>

            <button
              v-if="link.review_status !== 'dismissed'"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              @click="openReviewModal(link, 'unrelated')"
            >
              <XCircle class="w-3.5 h-3.5 text-slate-500" />
              Mark Unrelated
            </button>

            <button
              v-if="link.review_status !== 'deferred'"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              @click="openReviewModal(link, 'deferred')"
            >
              <Clock class="w-3.5 h-3.5 text-slate-500" />
              Defer
            </button>
          </div>
        </div>

        <!-- Explainable Rationale & Signals Breakdown -->
        <div class="px-6 py-3.5 bg-amber-50/40 border-b border-amber-100/60">
          <p class="text-xs text-amber-950 font-medium leading-relaxed">
            <strong class="font-bold">Explainable Match Reason:</strong> {{ link.match_reason }}
          </p>

          <!-- Evidence Badges -->
          <div class="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
            <span
              v-if="link.evidence.same_institution_id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold"
            >
              <Building class="w-3 h-3" />
              Identical Institution Permanent ID
            </span>

            <span
              v-if="link.evidence.same_external_reference"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold"
            >
              Identical External Docket Reference
            </span>

            <span
              v-if="link.evidence.cross_bureau"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold"
            >
              Cross-Departmental Case
            </span>

            <!-- Salient Keywords -->
            <div
              v-if="link.evidence.shared_keywords && link.evidence.shared_keywords.length > 0"
              class="flex items-center gap-1 ml-2"
            >
              <span class="text-slate-500 font-medium">Shared Keywords:</span>
              <span
                v-for="kw in link.evidence.shared_keywords"
                :key="kw"
                class="rounded bg-white border border-slate-200 px-1.5 py-0.2 text-[10px] font-mono text-slate-700"
              >
                #{{ kw }}
              </span>
            </div>
          </div>

          <!-- Review audit info if already reviewed -->
          <div v-if="link.reviewed_by_name" class="mt-2 pt-2 border-t border-amber-200/50 text-[11px] text-slate-600 flex items-center gap-3">
            <span>Reviewed by: <strong>{{ link.reviewed_by_name }}</strong></span>
            <span>Date: {{ link.reviewed_at?.slice(0, 16).replace('T', ' ') }}</span>
            <span v-if="link.review_remarks">Remarks: <em>"{{ link.review_remarks }}"</em></span>
          </div>
        </div>

        <!-- Side-by-Side Comparison Columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <!-- Case A Card -->
          <div v-if="link.case_a" class="p-6 space-y-3 bg-white">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Case A (Registered Primary)</span>
              <span class="rounded bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                {{ link.case_a.bureau_code }}
              </span>
            </div>

            <div>
              <router-link
                :to="`/complaints/${link.case_a.id}`"
                class="font-mono text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                {{ link.case_a.case_number }}
                <ExternalLink class="w-3.5 h-3.5" />
              </router-link>
              <p class="text-xs font-semibold text-slate-900 mt-1">
                {{ link.case_a.institution_name }} ({{ link.case_a.institution_code }})
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-600 font-medium">{{ link.case_a.category }}</span>
              •
              <PriorityBadge :priority="link.case_a.priority" size="sm" />
              <StatusBadge :status="link.case_a.status" size="sm" />
            </div>

            <p class="text-xs font-bold text-slate-800">
              {{ link.case_a.subject }}
            </p>

            <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {{ link.case_a.description }}
            </p>
          </div>

          <!-- Case B Card -->
          <div v-if="link.case_b" class="p-6 space-y-3 bg-white">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Case B (Comparison Matter)</span>
              <span class="rounded bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                {{ link.case_b.bureau_code }}
              </span>
            </div>

            <div>
              <router-link
                :to="`/complaints/${link.case_b.id}`"
                class="font-mono text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                {{ link.case_b.case_number }}
                <ExternalLink class="w-3.5 h-3.5" />
              </router-link>
              <p class="text-xs font-semibold text-slate-900 mt-1">
                {{ link.case_b.institution_name }} ({{ link.case_b.institution_code }})
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-600 font-medium">{{ link.case_b.category }}</span>
              •
              <PriorityBadge :priority="link.case_b.priority" size="sm" />
              <StatusBadge :status="link.case_b.status" size="sm" />
            </div>

            <p class="text-xs font-bold text-slate-800">
              {{ link.case_b.subject }}
            </p>

            <p class="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {{ link.case_b.description }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="store.overlaps.length === 0 && !store.loading">
        <EmptyState
          title="No records in this overlap queue"
          description="The detection pipeline continuously monitors incoming complaints. Any potential cross-bureau overlap will appear here for regulatory coordination."
        />
      </div>
    </div>

    <!-- Official Review Modal Dialog -->
    <Modal
      :is-open="isReviewModalOpen"
      :title="`Record Regulatory Decision: ${reviewDecision.replace('_', ' ').toUpperCase()}`"
      @close="isReviewModalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="handleConfirmReview">
        <div v-if="submitError" class="p-3 rounded-lg bg-red-50 text-xs text-red-700 border border-red-200">
          {{ submitError }}
        </div>

        <div class="rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs">
          <p class="font-bold text-slate-900">
            Comparing: {{ selectedLink?.case_a?.case_number }} ({{ selectedLink?.case_a?.bureau_code }})
            vs {{ selectedLink?.case_b?.case_number }} ({{ selectedLink?.case_b?.bureau_code }})
          </p>
          <p class="text-slate-500 mt-0.5">
            Institution: {{ selectedLink?.case_a?.institution_name }}
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Official Decision *</label>
          <select
            v-model="reviewDecision"
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-slate-900 focus:border-slate-900"
          >
            <option value="confirmed_related">Confirmed Related (Coordinate joint investigation across Bureaus)</option>
            <option value="unrelated">Mark Unrelated (Complaints cover distinct non-overlapping matters)</option>
            <option value="deferred">Defer Decision (Awaiting departmental preliminary verification)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700">Regulatory Review Directive / Remarks *</label>
          <textarea
            v-model="reviewRemarks"
            rows="3"
            required
            placeholder="Record the official rationale, coordination order, or instructions for the participating Bureau officers..."
            class="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </form>

      <template #footer>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
          @click="isReviewModalOpen = false"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="isSubmitting"
          class="px-4 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          @click="handleConfirmReview"
        >
          <span v-if="isSubmitting">Recording Decision...</span>
          <span v-else>Confirm Decision</span>
        </button>
      </template>
    </Modal>
  </div>
</template>
