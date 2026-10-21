<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import apiClient from '@/api/client'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import type { Institution, Complaint, CaseLink } from '@/types'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  GitCompare,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-vue-next'

const route = useRoute()
const institutionId = computed(() => Number(route.params.id))

const loading = ref(true)
const institution = ref<Institution | null>(null)
const complaints = ref<Complaint[]>([])
const summary = ref<any>(null)
const potentialOverlaps = ref<CaseLink[]>([])

async function loadProfile() {
  loading.value = true
  try {
    const res = await apiClient.get(`/institutions/${institutionId.value}`)
    institution.value = res.data.institution
    complaints.value = res.data.complaints || []
    summary.value = res.data.summary || null
    potentialOverlaps.value = res.data.potential_overlaps || []
  } catch (err) {
    console.error('Failed to load institution profile:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div v-if="institution" class="space-y-6">
    <!-- Back Button -->
    <div>
      <router-link
        to="/institutions"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-3"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        Back to Institution Directory
      </router-link>

      <!-- Title & Basic Info -->
      <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-subtle flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-700 border border-slate-200">
              AICTE ID: {{ institution.institution_code }}
            </span>
            <span class="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-semibold border border-blue-200">
              {{ institution.institution_type }}
            </span>
          </div>

          <h2 class="text-xl font-bold tracking-tight text-slate-900 mt-2">
            {{ institution.name }}
          </h2>

          <div class="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span class="flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5 text-slate-400" />
              {{ institution.address || `${institution.district}, ${institution.state}` }}
            </span>
            <span v-if="institution.website" class="flex items-center gap-1">
              <Globe class="w-3.5 h-3.5 text-slate-400" />
              <a :href="institution.website" target="_blank" class="text-blue-600 hover:underline">
                {{ institution.website }}
              </a>
            </span>
          </div>

          <!-- Aliases -->
          <div v-if="institution.aliases && institution.aliases.length > 0" class="mt-3 flex items-center gap-2">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Known Aliases:</span>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="a in institution.aliases"
                :key="a"
                class="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700"
              >
                {{ a }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Summary Metrics -->
        <div class="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cases</p>
            <p class="text-2xl font-bold text-slate-900">{{ summary?.total_complaints || 0 }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active</p>
            <p class="text-2xl font-bold text-amber-600">{{ summary?.open_cases || 0 }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Disposed</p>
            <p class="text-2xl font-bold text-emerald-600">{{ summary?.disposed_cases || 0 }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overdue</p>
            <p class="text-2xl font-bold text-red-600">{{ summary?.overdue_cases || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Cross-Bureau Distribution Alert -->
    <div
      v-if="potentialOverlaps.length > 0"
      class="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <GitCompare class="w-5 h-5 text-amber-700 flex-shrink-0" />
        <div>
          <h4 class="text-xs font-bold text-amber-950 uppercase">
            {{ potentialOverlaps.length }} Cross-Bureau Overlap Flags Active
          </h4>
          <p class="text-xs text-amber-900 mt-0.5">
            Complaints concerning this institution have been flagged for potential coordination across departments.
          </p>
        </div>
      </div>
      <router-link
        to="/overlaps"
        class="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
      >
        Review Overlaps
        <ArrowRight class="w-3.5 h-3.5" />
      </router-link>
    </div>

    <!-- Bureau Workload Distribution for this College -->
    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
        Departmental Complaint Presence
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
        <div
          v-for="(count, code) in summary?.bureau_distribution"
          :key="code"
          class="p-3 rounded-lg border border-slate-100 bg-slate-50 text-center"
        >
          <span class="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
            {{ code }}
          </span>
          <p class="text-lg font-bold text-slate-900 mt-1">{{ count }}</p>
          <p class="text-[10px] text-slate-500">Cases Filed</p>
        </div>
      </div>
    </div>

    <!-- Chronological Cross-Bureau Complaints Table -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-subtle overflow-hidden">
      <div class="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
            Cross-Bureau Case History
          </h3>
          <p class="text-[11px] text-slate-500 mt-0.5">
            Consolidated timeline of all complaint records concerning {{ institution.name }}
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th class="py-3 px-4">Case #</th>
              <th class="py-3 px-4">Subject & Description</th>
              <th class="py-3 px-4">Bureau</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Priority</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Received Date</th>
              <th class="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs">
            <tr
              v-for="c in complaints"
              :key="c.id"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                <router-link :to="`/complaints/${c.id}`" class="text-blue-600 hover:underline">
                  {{ c.case_number }}
                </router-link>
              </td>

              <td class="py-3 px-4 max-w-sm">
                <p class="font-medium text-slate-900 line-clamp-1">{{ c.subject }}</p>
                <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{{ c.description }}</p>
              </td>

              <td class="py-3 px-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {{ c.current_bureau_code }}
                </span>
              </td>

              <td class="py-3 px-4 text-slate-600">{{ c.category }}</td>

              <td class="py-3 px-4 whitespace-nowrap">
                <PriorityBadge :priority="c.priority" size="sm" />
              </td>

              <td class="py-3 px-4 whitespace-nowrap">
                <StatusBadge :status="c.status" size="sm" />
              </td>

              <td class="py-3 px-4 whitespace-nowrap text-slate-500">
                {{ c.received_at?.slice(0, 10) }}
              </td>

              <td class="py-3 px-4 text-right whitespace-nowrap">
                <router-link
                  :to="`/complaints/${c.id}`"
                  class="font-semibold text-slate-700 hover:text-slate-900"
                >
                  Inspect →
                </router-link>
              </td>
            </tr>

            <tr v-if="complaints.length === 0">
              <td colspan="8" class="py-8 text-center text-xs text-slate-400">
                No complaint records on file for this institution.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
