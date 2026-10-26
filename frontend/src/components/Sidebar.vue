<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Activity, BarChart3, Bell, Building2, ChevronRight, ClipboardList,
  Database, FileSearch, LayoutDashboard, Settings2, ShieldCheck, X,
} from 'lucide-vue-next'

withDefaults(defineProps<{ open?: boolean }>(), { open: false })
const emit = defineEmits<{ close: [] }>()
const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const auth = useAuthStore()

const primaryLinks = [
  { label: 'Overview', to: '/', icon: LayoutDashboard },
  { label: 'Complaints', to: '/complaints', icon: ClipboardList },
  { label: 'Institutions', to: '/institutions', icon: Building2 },
  { label: 'Overlap review', to: '/overlaps', icon: FileSearch, count: true },
]
const operationsLinks = computed(() => [
  { label: 'Reports', to: '/reports', icon: BarChart3 },
  { label: 'Data imports', to: '/imports', icon: Database },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  ...(auth.user?.role === 'admin' ? [{ label: 'Administration', to: '/admin', icon: Settings2 }] : []),
])
const currentPath = computed(() => route.path)
function active(to: string) {
  if (to === '/') return currentPath.value === '/'
  return currentPath.value === to || currentPath.value.startsWith(`${to}/`)
}
function go(to: string) {
  router.push(to)
  emit('close')
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': open }" aria-label="Primary navigation">
    <div class="brand-lockup">
      <div class="brand-mark"><ShieldCheck :size="21" :stroke-width="1.8" /></div>
      <div class="brand-copy">
        <span class="brand-name">casework<span class="brand-period">.</span></span>
        <span class="brand-subtitle">AICTE monitoring</span>
      </div>
      <button class="icon-button sidebar-dismiss" aria-label="Close navigation" @click="emit('close')"><X :size="17" /></button>
    </div>

    <div class="nav-caption">WORKSPACE</div>
    <nav class="nav-group">
      <button v-for="item in primaryLinks" :key="item.to" class="nav-link" :class="{ 'nav-active': active(item.to) }" @click="go(item.to)">
        <component :is="item.icon" :size="18" :stroke-width="1.8" />
        <span>{{ item.label }}</span>
        <span v-if="item.count" class="nav-indicator" aria-label="Review queue" />
        <ChevronRight v-if="active(item.to)" class="nav-chevron" :size="14" />
      </button>
    </nav>

    <div class="nav-caption nav-caption-spaced">OPERATIONS</div>
    <nav class="nav-group">
      <button v-for="item in operationsLinks" :key="item.to" class="nav-link" :class="{ 'nav-active': active(item.to) }" @click="go(item.to)">
        <component :is="item.icon" :size="18" :stroke-width="1.8" />
        <span>{{ item.label }}</span>
        <ChevronRight v-if="active(item.to)" class="nav-chevron" :size="14" />
      </button>
    </nav>

    <div class="sidebar-spacer"></div>
    <div class="sidebar-status">
      <span class="status-led" :class="{ 'status-led-demo': ui.isDemoMode }"></span>
      <div>
        <strong>{{ ui.isDemoMode ? 'Demo workspace' : 'API connected' }}</strong>
        <span>{{ ui.isDemoMode ? 'Showing fictional local records' : 'Connected data available' }}</span>
      </div>
    </div>
    <div class="sidebar-foot">
      <div class="sidebar-foot-emblem"><Activity :size="16" /></div>
      <div><strong>SIH 2026</strong><span>Problem statement 26264</span></div>
    </div>
  </aside>
</template>
