<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOverlapsStore } from '@/stores/overlaps'
import SihLogo from '@/components/SihLogo.vue'
import {
  LayoutDashboard,
  FileText,
  GitCompare,
  Building2,
  BarChart3,
  Bell,
  UploadCloud,
  Settings,
  Sparkles,
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
  { name: 'Announcements', path: '/notifications', icon: Bell },
  { name: 'Resources', path: '/imports', icon: UploadCloud },
  ...(authStore.isAdmin ? [{ name: 'Administration', path: '/admin', icon: Settings }] : []),
])

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-64 bg-[#0c2340] dark:bg-[#0b1a30] text-slate-200 border-r border-[#15325b] dark:border-[#132742] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 transition-colors select-none">
    <div class="space-y-6">
      <!-- Sidebar Brand Header (Mobile / Secondary) -->
      <div class="px-2 pt-1 pb-2 border-b border-[#183968]">
        <SihLogo light-text size="sm" :show-subtitle="true" />
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1" aria-label="Portal Navigation">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          :class="[
            'group flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-150',
            isActive(item.path)
              ? 'bg-[#1b3d6c] text-white shadow-sm font-semibold border-l-4 border-[#f97316]'
              : 'text-slate-300 hover:bg-[#132f54] hover:text-white',
          ]"
        >
          <div class="flex items-center gap-3">
            <component
              :is="item.icon"
              :class="[
                'h-4 w-4 transition-colors',
                isActive(item.path)
                  ? 'text-[#f97316]'
                  : 'text-slate-400 group-hover:text-slate-200',
              ]"
              aria-hidden="true"
            />
            <span>{{ item.name }}</span>
          </div>

          <span
            v-if="item.badge"
            class="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold text-white shadow-sm"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>
    </div>

    <!-- Bottom Illustration: India Innovation Landmark -->
    <div class="pt-4 border-t border-[#183968] space-y-3">
      <div class="rounded-xl bg-[#08182b] p-3 border border-[#132d4e] flex flex-col items-center text-center">
        <!-- India Gate Landmark Vector -->
        <svg
          class="w-16 h-12 text-[#38bdf8] opacity-80 mb-2"
          viewBox="0 0 64 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <!-- Sun Rays -->
          <circle cx="32" cy="18" r="8" stroke="#f97316" stroke-width="1" stroke-dasharray="2 2" opacity="0.6" />
          <!-- India Gate Top Beam -->
          <rect x="14" y="14" width="36" height="3" rx="0.5" fill="currentColor" />
          <rect x="16" y="10" width="32" height="3" rx="0.5" fill="currentColor" />
          <rect x="20" y="7" width="24" height="2" rx="0.5" fill="currentColor" />
          <!-- Pillars -->
          <rect x="16" y="18" width="9" height="26" fill="currentColor" />
          <rect x="39" y="18" width="9" height="26" fill="currentColor" />
          <!-- Inner Arch -->
          <path d="M25 44V28C25 24.134 28.134 21 32 21C35.866 21 39 24.134 39 28V44H25Z" fill="#08182b" stroke="currentColor" stroke-width="1.5" />
          <!-- Base Line -->
          <line x1="10" y1="44" x2="54" y2="44" stroke="currentColor" stroke-width="2" />
        </svg>

        <div class="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Sparkles class="w-3 h-3 text-[#f97316]" />
          <span>Innovation Today</span>
        </div>
        <p class="text-xs text-slate-400 mt-0.5 leading-tight [text-wrap:pretty]">
          for a better tomorrow
        </p>
      </div>

      <div class="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <span>Smart India Hackathon</span>
        <span class="text-[#f97316] font-semibold">SIH64</span>
      </div>
    </div>
  </aside>
</template>
