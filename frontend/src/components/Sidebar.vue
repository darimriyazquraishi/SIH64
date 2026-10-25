<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOverlapsStore } from '@/stores/overlaps'
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  Building2,
  BarChart3,
  Bell,
  UploadCloud,
  Settings,
  ShieldAlert,
} from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()
const overlapsStore = useOverlapsStore()

const navigation = computed(() => [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Complaints', path: '/complaints', icon: FileText },
  {
    name: 'Overlaps',
    path: '/overlaps',
    icon: GitCompare,
    badge: overlapsStore.pendingCount > 0 ? overlapsStore.pendingCount : null,
  },
  { name: 'Institutions', path: '/institutions', icon: Building2 },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Import', path: '/imports', icon: UploadCloud },
  ...(authStore.isAdmin ? [{ name: 'Administration', path: '/admin', icon: Settings }] : []),
])

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-64 border-r border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3.5 transition-colors">
    <div class="space-y-5">
      <!-- Section Label -->
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#989898]">
          Navigation
        </p>
        <nav class="mt-2 space-y-0.5" aria-label="Portal Navigation">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            :class="[
              'group flex items-center justify-between rounded px-3 py-2 text-xs font-medium transition-colors',
              isActive(item.path)
                ? 'bg-slate-100 dark:bg-[#37373d] text-slate-900 dark:text-white font-semibold'
                : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2a2d2e] hover:text-slate-900 dark:hover:text-white',
            ]"
          >
            <div class="flex items-center gap-2.5">
              <component
                :is="item.icon"
                :class="[
                  'h-4 w-4 transition-colors',
                  isActive(item.path)
                    ? 'text-blue-600 dark:text-[#007acc]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-600 dark:group-hover:text-[#cccccc]',
                ]"
                aria-hidden="true"
              />
              <span>{{ item.name }}</span>
            </div>

            <span
              v-if="item.badge"
              class="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-amber-600 dark:bg-[#cca700] text-xs font-semibold text-white dark:text-[#1e1e1e]"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- Coordination Policy Box -->
      <div class="rounded border border-slate-200 dark:border-[#2d2d2d] bg-slate-50 dark:bg-[#1e1e1e] p-3">
        <div class="flex items-center gap-2 text-slate-800 dark:text-[#d4d4d4] font-medium text-xs">
          <ShieldAlert class="w-4 h-4 text-amber-600 dark:text-[#cca700]" aria-hidden="true" />
          Cross-Bureau Cases
        </div>
        <p class="mt-1 text-xs text-slate-500 dark:text-[#989898] leading-relaxed [text-wrap:pretty]">
          Cases involving the same institution across bureaus are linked for joint review while preserving individual bureau records.
        </p>
      </div>
    </div>

    <!-- System Footer -->
    <div class="border-t border-slate-100 dark:border-[#2d2d2d] pt-3 px-3">
      <div class="flex items-center justify-between text-xs text-slate-400 dark:text-[#989898]">
        <span>AICTE Portal</span>
        <span class="font-mono">v1.0.0</span>
      </div>
    </div>
  </aside>
</template>
