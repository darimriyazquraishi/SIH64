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
  { name: 'All Complaints', path: '/complaints', icon: FileText },
  {
    name: 'Cross-Bureau Overlaps',
    path: '/overlaps',
    icon: GitCompare,
    badge: overlapsStore.pendingCount > 0 ? overlapsStore.pendingCount : null,
  },
  { name: 'Institution Directory', path: '/institutions', icon: Building2 },
  { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'CSV Data Import', path: '/imports', icon: UploadCloud },
  ...(authStore.isAdmin ? [{ name: 'Administration', path: '/admin', icon: Settings }] : []),
])

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
    <div class="space-y-6">
      <!-- Section Label -->
      <div>
        <p class="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Core Operations
        </p>
        <nav class="mt-2 space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.path"
            :class="[
              'group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition',
              isActive(item.path)
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            ]"
          >
            <div class="flex items-center gap-3">
              <component
                :is="item.icon"
                :class="[
                  'h-4 w-4 transition',
                  isActive(item.path) ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-600',
                ]"
              />
              <span>{{ item.name }}</span>
            </div>

            <span
              v-if="item.badge"
              class="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm animate-pulse"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <!-- Quick Context Box -->
      <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5">
        <div class="flex items-center gap-2 text-slate-900 font-semibold text-xs">
          <ShieldAlert class="w-4 h-4 text-amber-600" />
          Cross-Bureau Protocol
        </div>
        <p class="mt-1 text-[11px] text-slate-500 leading-relaxed">
          Complaints concerning identical institutions across departments are correlated transparently without destructive auto-merging.
        </p>
      </div>
    </div>

    <!-- System Footer -->
    <div class="border-t border-slate-100 pt-3 px-3">
      <div class="flex items-center justify-between text-[11px] text-slate-400">
        <span>AICTE Portal</span>
        <span class="font-mono">v1.0.0-SIH</span>
      </div>
    </div>
  </aside>
</template>
