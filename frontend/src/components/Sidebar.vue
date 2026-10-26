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
  <aside class="w-64 bg-[#1b1e18] dark:bg-[#101110] text-[#e6eae2] border-r border-[#2d3326] dark:border-[#242820] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-4 transition-colors select-none">
    <div class="space-y-6">
      <!-- Sidebar Brand Header (Mobile / Secondary) -->
      <div class="px-2 pt-1 pb-2 border-b border-[#2d3326] dark:border-[#242820]">
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
              ? 'bg-[#282d23] text-white shadow-sm font-semibold border-l-4 border-[#b86f00] dark:bg-[#1f2518] dark:text-[#b8ee82] dark:border-[#b8ee82]'
              : 'text-[#a7ada0] hover:bg-[#252920] hover:text-white dark:text-[#989e92] dark:hover:bg-[#1e221b] dark:hover:text-[#e6eae2]',
          ]"
        >
          <div class="flex items-center gap-3">
            <component
              :is="item.icon"
              :class="[
                'h-4 w-4 transition-colors',
                isActive(item.path)
                  ? 'text-[#b86f00] dark:text-[#b8ee82]'
                  : 'text-[#878e80] group-hover:text-white dark:text-[#788072] dark:group-hover:text-[#e6eae2]',
              ]"
              aria-hidden="true"
            />
            <span>{{ item.name }}</span>
          </div>

          <span
            v-if="item.badge"
            class="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-[#b86f00] dark:bg-[#b8ee82] text-xs font-bold text-white dark:text-[#10140d] shadow-sm"
          >
            {{ item.badge }}
          </span>
        </router-link>
      </nav>
    </div>

    <!-- Bottom Illustration: India Innovation Landmark -->
    <div class="pt-4 border-t border-[#2d3326] dark:border-[#242820] space-y-3">
      <div class="rounded-xl bg-[#141612] dark:bg-[#0c0d0c] p-3 border border-[#2d3326] dark:border-[#20241b] flex flex-col items-center text-center">
        <!-- India Gate Landmark Vector -->
        <svg
          class="w-16 h-12 text-[#7eaa3b] dark:text-[#b8ee82] opacity-85 mb-2"
          viewBox="0 0 64 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <!-- Sun Rays -->
          <circle cx="32" cy="18" r="8" stroke="#b86f00" class="dark:stroke-[#b8ee82]" stroke-width="1" stroke-dasharray="2 2" opacity="0.6" />
          <!-- India Gate Top Beam -->
          <rect x="14" y="14" width="36" height="3" rx="0.5" fill="currentColor" />
          <rect x="16" y="10" width="32" height="3" rx="0.5" fill="currentColor" />
          <rect x="20" y="7" width="24" height="2" rx="0.5" fill="currentColor" />
          <!-- Pillars -->
          <rect x="16" y="18" width="9" height="26" fill="currentColor" />
          <rect x="39" y="18" width="9" height="26" fill="currentColor" />
          <!-- Inner Arch -->
          <path d="M25 44V28C25 24.134 28.134 21 32 21C35.866 21 39 24.134 39 28V44H25Z" fill="#141612" class="dark:fill-[#0c0d0c]" stroke="currentColor" stroke-width="1.5" />
          <!-- Base Line -->
          <line x1="10" y1="44" x2="54" y2="44" stroke="currentColor" stroke-width="2" />
        </svg>

        <div class="flex items-center gap-1.5 text-xs font-semibold text-white">
          <Sparkles class="w-3 h-3 text-[#b86f00] dark:text-[#b8ee82]" />
          <span>Innovation Today</span>
        </div>
        <p class="text-xs text-[#878e80] dark:text-[#788072] mt-0.5 leading-tight [text-wrap:pretty]">
          for a better tomorrow
        </p>
      </div>

      <div class="flex items-center justify-between text-xs text-[#878e80] dark:text-[#788072] px-1 font-mono">
        <span>Smart India Hackathon</span>
        <span class="text-[#b86f00] dark:text-[#b8ee82] font-semibold">SIH64</span>
      </div>
    </div>
  </aside>
</template>
