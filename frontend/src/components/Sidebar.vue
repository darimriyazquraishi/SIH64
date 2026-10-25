<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOverlapsStore } from '@/stores/overlaps'
import { useTheme } from '@/composables/useTheme'
import DemostackIcon from '@/components/demostack/DemostackIcon.vue'
import {
  Building2,
  BarChart3,
  Bell,
  UploadCloud,
  Shield,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()
const overlapsStore = useOverlapsStore()
const { theme, toggleTheme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const isOrgMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const selectedBureau = ref('AICTE Central HQ')

const bureaus = [
  { code: 'HQ', name: 'AICTE Central HQ', role: 'Apex Regulatory Authority' },
  { code: 'PGRC', name: 'Public Grievance Redressal', role: 'Citizen & Student Intake' },
  { code: 'AB', name: 'Approval Bureau', role: 'Institutions & EOA' },
  { code: 'RPC', name: 'Ragging Prevention Cell', role: 'Statutory Anti-Ragging' },
  { code: 'PAPB', name: 'Policy & Planning', role: 'Faculty & Norms' },
  { code: 'VIG', name: 'Vigilance & Ethics Cell', role: 'Integrity Investigations' },
]

const workspaceNav = computed(() => [
  { name: 'Home', path: '/', iconName: 'HomeIcon' },
  {
    name: 'Grievances',
    path: '/complaints',
    iconName: 'DemostacksIcon',
    badge: 'Live',
  },
  {
    name: 'Overlaps',
    path: '/overlaps',
    iconName: 'ShowcasesIcon',
    badge: overlapsStore.pendingCount > 0 ? `${overlapsStore.pendingCount} AI` : 'AI',
  },
  { name: 'Institutions', path: '/institutions', iconLucide: Building2 },
  { name: 'Reports', path: '/reports', iconLucide: BarChart3 },
])

const adminNav = computed(() => [
  ...(authStore.isAdmin ? [{ name: 'Administration', path: '/admin', iconLucide: Shield }] : []),
  { name: 'Notifications', path: '/notifications', iconLucide: Bell },
  { name: 'Data Ingestion', path: '/imports', iconLucide: UploadCloud },
])

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-64 border-r border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#1c1c1c] h-full flex flex-col justify-between p-3.5 transition-colors select-none">
    <!-- Top Section -->
    <div class="space-y-6">
      <!-- Organization / Bureau Switcher -->
      <div class="relative">
        <button
          type="button"
          class="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-slate-50 dark:bg-[#252526] hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition text-left"
          @click="isOrgMenuOpen = !isOrgMenuOpen"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="size-8 rounded-lg bg-indigo-600 dark:bg-[#007acc] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              AI
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-medium text-xs text-slate-900 dark:text-[#d4d4d4] truncate">
                {{ selectedBureau }}
              </p>
              <p class="text-xs text-slate-500 dark:text-[#989898] truncate">
                Apex Technical Authority
              </p>
            </div>
          </div>
          <ChevronDown class="w-3.5 h-3.5 text-slate-400 dark:text-[#989898] shrink-0 ml-1" />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isOrgMenuOpen"
          class="absolute left-0 top-full mt-1.5 w-60 rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-xl z-50 p-1.5 divide-y divide-slate-100 dark:divide-[#2d2d2d]"
        >
          <div class="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#989898]">
            Switch Bureau Context
          </div>
          <div class="py-1">
            <button
              v-for="b in bureaus"
              :key="b.code"
              type="button"
              :class="[
                'w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex flex-col',
                selectedBureau === b.name
                  ? 'bg-slate-100 dark:bg-[#37373d] text-slate-900 dark:text-white font-medium'
                  : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2a2d2e]'
              ]"
              @click="selectedBureau = b.name; isOrgMenuOpen = false"
            >
              <span class="font-medium">{{ b.code }} — {{ b.name }}</span>
              <span class="text-xs text-slate-400 dark:text-[#989898]">{{ b.role }}</span>
            </button>
          </div>
        </div>

        <!-- Bureau Chips -->
        <div class="mt-2.5 px-0.5">
          <div class="flex items-center justify-between text-xs text-slate-400 dark:text-[#989898]">
            <span>CENTRAL BUREAUS [6]</span>
          </div>
          <div class="flex flex-wrap gap-1 mt-1.5">
            <span
              v-for="b in bureaus"
              :key="b.code"
              :title="b.name"
              class="rounded bg-slate-100 dark:bg-[#252526] px-1.5 py-0.5 text-xs font-mono font-medium text-slate-700 dark:text-[#cccccc] border border-slate-200 dark:border-[#2d2d2d]"
            >
              {{ b.code }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Group: Workspace -->
      <div>
        <p class="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#989898] mb-2">
          Workspace
        </p>
        <nav class="space-y-1" aria-label="Workspace Navigation">
          <router-link
            v-for="item in workspaceNav"
            :key="item.name"
            :to="item.path"
            :class="[
              'group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors',
              isActive(item.path)
                ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-[#383838]'
                : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white border border-transparent'
            ]"
          >
            <div class="flex items-center gap-2.5">
              <DemostackIcon
                v-if="item.iconName"
                :name="item.iconName"
                :class-name="[
                  'w-4 h-4 transition-colors',
                  isActive(item.path)
                    ? 'text-indigo-600 dark:text-[#4fc1ff]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
                ]"
              />
              <component
                :is="item.iconLucide"
                v-else
                :class="[
                  'w-4 h-4 transition-colors',
                  isActive(item.path)
                    ? 'text-indigo-600 dark:text-[#4fc1ff]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
                ]"
              />
              <span>{{ item.name }}</span>
            </div>

            <span
              v-if="item.badge"
              class="rounded bg-indigo-50 dark:bg-[#4fc1ff]/15 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-[#4fc1ff]"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- Navigation Group: Admin -->
      <div>
        <p class="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#989898] mb-2">
          Administration
        </p>
        <nav class="space-y-1" aria-label="Admin Navigation">
          <router-link
            v-for="item in adminNav"
            :key="item.name"
            :to="item.path"
            :class="[
              'group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors',
              isActive(item.path)
                ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-[#383838]'
                : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white border border-transparent'
            ]"
          >
            <div class="flex items-center gap-2.5">
              <component
                :is="item.iconLucide"
                :class="[
                  'w-4 h-4 transition-colors',
                  isActive(item.path)
                    ? 'text-indigo-600 dark:text-[#4fc1ff]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
                ]"
              />
              <span>{{ item.name }}</span>
            </div>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Bottom User Profile Card (Demostack Style) -->
    <div class="relative pt-3 border-t border-slate-200 dark:border-[#2d2d2d]">
      <button
        type="button"
        class="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252526] transition text-left"
        @click="isProfileMenuOpen = !isProfileMenuOpen"
      >
        <div class="size-9 rounded-full bg-slate-900 dark:bg-[#007acc] text-white flex items-center justify-center font-bold text-xs shrink-0">
          RS
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-medium text-xs text-slate-900 dark:text-[#d4d4d4] truncate">
            {{ authStore.user?.name || 'Dr. Rajiv Sharma' }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898] truncate">
            {{ authStore.user?.email || 'admin@aicte.gov.in' }}
          </p>
        </div>
        <ChevronDown class="w-3.5 h-3.5 text-slate-400 dark:text-[#989898] shrink-0" />
      </button>

      <!-- Profile Menu Dropdown -->
      <div
        v-if="isProfileMenuOpen"
        class="absolute bottom-full left-0 mb-2 w-60 rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-xl z-50 p-1.5 divide-y divide-slate-100 dark:divide-[#2d2d2d]"
      >
        <div class="px-2 py-2">
          <p class="text-xs font-semibold text-slate-900 dark:text-white">
            {{ authStore.user?.name || 'Dr. Rajiv Sharma' }}
          </p>
          <p class="text-xs text-slate-500 dark:text-[#989898]">
            {{ authStore.user?.role || 'Director IT & Chief Administrator' }}
          </p>
        </div>
        <div class="py-1">
          <button
            type="button"
            class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition"
            @click="toggleTheme(); isProfileMenuOpen = false"
          >
            <Sun v-if="isDark" class="w-3.5 h-3.5" />
            <Moon v-else class="w-3.5 h-3.5" />
            <span>Switch to {{ isDark ? 'Light' : 'Dark' }} mode</span>
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
