<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import apiClient from '@/api/client'
import type { Institution } from '@/types'
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-vue-next'

const search = ref('')
const stateFilter = ref('')
const typeFilter = ref('')
const institutions = ref<Institution[]>([])
const total = ref(0)
const page = ref(1)
const perPage = ref(12)
const pages = ref(1)
const loading = ref(false)

const states = [
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Odisha',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'Kerala',
]

async function fetchInstitutions() {
  loading.value = true
  try {
    const params: any = {
      page: page.value,
      per_page: perPage.value,
    }
    if (search.value) params.search = search.value
    if (stateFilter.value) params.state = stateFilter.value
    if (typeFilter.value) params.institution_type = typeFilter.value

    const res = await apiClient.get('/institutions', { params })
    institutions.value = res.data.items || []
    total.value = res.data.total || 0
    pages.value = res.data.pages || 1
  } catch (err) {
    console.error('Failed to load institutions:', err)
  } finally {
    loading.value = false
  }
}

let searchTimer: any = null
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchInstitutions()
  }, 300)
})

onMounted(() => {
  fetchInstitutions()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Institution Registry
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Unified institution profiles consolidating cross-bureau regulatory history
        </p>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
      <!-- Search -->
      <div class="relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          v-model="search"
          type="text"
          placeholder="Search by Institution Name, Permanent ID, alias..."
          class="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
        />
      </div>

      <!-- State Filter -->
      <div>
        <select
          v-model="stateFilter"
          class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition bg-white"
          @change="page = 1; fetchInstitutions()"
        >
          <option value="">All States / UTs</option>
          <option v-for="st in states" :key="st" :value="st">
            {{ st }}
          </option>
        </select>
      </div>

      <!-- Type Filter -->
      <div>
        <select
          v-model="typeFilter"
          class="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition bg-white"
          @change="page = 1; fetchInstitutions()"
        >
          <option value="">All Academic Disciplines</option>
          <option value="Engineering & Technology">Engineering & Technology</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Management">Management</option>
          <option value="Polytechnic">Polytechnic</option>
        </select>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="inst in institutions"
        :key="inst.id"
        class="rounded-xl border border-slate-200 bg-white p-5 shadow-subtle hover:shadow-elevated transition flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-2">
            <span class="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 border border-slate-200">
              ID: {{ inst.institution_code }}
            </span>
            <span class="text-[10px] font-semibold text-slate-500">
              {{ inst.institution_type }}
            </span>
          </div>

          <h3 class="font-bold text-sm text-slate-900 mt-2 line-clamp-2">
            {{ inst.name }}
          </h3>

          <p class="text-xs text-slate-500 mt-1">
            {{ inst.district ? `${inst.district}, ` : '' }}{{ inst.state }}
          </p>

          <!-- Associated aliases -->
          <div v-if="inst.aliases && inst.aliases.length > 0" class="mt-2.5 flex flex-wrap gap-1">
            <span
              v-for="a in inst.aliases"
              :key="a"
              class="rounded bg-slate-50 border border-slate-200/80 px-1.5 py-0.2 text-[10px] text-slate-600"
            >
              {{ a }}
            </span>
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div class="text-[11px] text-slate-600">
            <span class="font-bold text-slate-900">{{ inst.total_complaints || 0 }}</span> Total
            • <span class="font-bold text-amber-700">{{ inst.open_complaints || 0 }}</span> Active
            • <span class="font-bold text-emerald-700">{{ inst.disposed_complaints || 0 }}</span> Disposed
          </div>

          <router-link
            :to="`/institutions/${inst.id}`"
            class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Profile
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="institutions.length === 0 && !loading" class="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
      No institutions found matching your search.
    </div>

    <!-- Pagination -->
    <div v-if="pages > 1" class="flex items-center justify-between border-t border-slate-200 pt-4">
      <div class="text-xs text-slate-500">
        Page {{ page }} of {{ pages }} ({{ total }} institutions)
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :disabled="page <= 1"
          class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
          @click="page--; fetchInstitutions()"
        >
          Previous
        </button>
        <button
          type="button"
          :disabled="page >= pages"
          class="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
          @click="page++; fetchInstitutions()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
