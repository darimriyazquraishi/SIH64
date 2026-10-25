<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import ThemeToggle from '@/components/ThemeToggle.vue'
import DemostackIcon from '@/components/demostack/DemostackIcon.vue'
import {
  Bell,
  Search,
  Plus,
  Home,
  FileText,
  GitCompare,
  Building2,
  BarChart3,
  Shield,
  UploadCloud,
  Check,
} from 'lucide-vue-next'

const authStore = useAuthStore()
const notifStore = useNotificationsStore()
const router = useRouter()
const route = useRoute()

const isNotifOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const pageDetails = computed(() => {
  const p = route.path
  if (p === '/') return { title: 'Home', icon: Home }
  if (p.startsWith('/complaints')) return { title: 'Grievances', icon: FileText }
  if (p.startsWith('/overlaps')) return { title: 'Cross-Bureau Overlaps', icon: GitCompare }
  if (p.startsWith('/institutions')) return { title: 'Institutions', icon: Building2 }
  if (p.startsWith('/reports')) return { title: 'Reports & Analytics', icon: BarChart3 }
  if (p.startsWith('/notifications')) return { title: 'Notifications', icon: Bell }
  if (p.startsWith('/imports')) return { title: 'Data Ingestion', icon: UploadCloud }
  if (p.startsWith('/admin')) return { title: 'Administration', icon: Shield }
  return { title: 'AICTE Portal', icon: Home }
})

function handleSearchKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

function handleSearchSubmit() {
  if (!searchQuery.value.trim()) return
  router.push({ path: '/complaints', query: { q: searchQuery.value.trim() } })
}

onMounted(() => {
  window.addEventListener('keydown', handleSearchKeydown)
  if (authStore.isAuthenticated) {
    notifStore.fetchNotifications()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleSearchKeydown)
})

function handleNotificationClick(notif: any) {
  notifStore.markAsRead(notif.id)
  isNotifOpen.value = false
  if (notif.related_complaint_id) {
    router.push(`/complaints/${notif.related_complaint_id}`)
  } else if (notif.notification_type === 'overlap_detected') {
    router.push('/overlaps')
  }
}
</script>

<template>
  <header class="flex h-16 items-center justify-between border-b md:rounded-t-2xl border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#1c1c1c] px-4 md:px-7 select-none transition-colors">
    <!-- Left: Page Title & Demostack Search Bar -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <component :is="pageDetails.icon" class="w-4 h-4 text-slate-700 dark:text-[#cccccc]" aria-hidden="true" />
        <h1 class="text-base font-medium tracking-tight text-slate-900 dark:text-[#d4d4d4]">
          {{ pageDetails.title }}
        </h1>
      </div>

      <!-- Quick Search Bar with Ctrl+K -->
      <div class="hidden sm:flex items-center bg-slate-100 dark:bg-[#252526] rounded-xl px-3 py-1.5 w-64 md:w-80 border border-transparent focus-within:border-blue-500 dark:focus-within:border-[#007acc] transition">
        <Search class="w-3.5 h-3.5 text-slate-400 dark:text-[#aaaaaa] shrink-0 mr-2" />
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Quick search cases, institutions..."
          class="bg-transparent text-xs w-full text-slate-900 dark:text-[#cccccc] placeholder-slate-400 dark:placeholder-[#aaaaaa] focus:outline-none"
          @keydown.enter="handleSearchSubmit"
        />
        <div class="hidden md:flex items-center gap-0.5 rounded bg-white dark:bg-[#1c1c1c] px-1.5 py-0.5 border border-slate-200 dark:border-[#383838] text-xs font-mono text-slate-400 dark:text-[#989898]">
          <span>Ctrl</span>
          <span>K</span>
        </div>
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Create / Lodge Action Button (Demostack Pill Style) -->
      <router-link
        to="/complaints?action=new"
        class="inline-flex items-center gap-1.5 rounded-full bg-slate-900 dark:bg-[#007acc] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-[#1177bb] transition shadow-sm"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>Lodge Grievance</span>
      </router-link>

      <!-- Notifications Bell -->
      <div class="relative">
        <button
          type="button"
          class="rounded-full size-9 border border-slate-200 dark:border-[#2d2d2d] flex items-center justify-center text-slate-500 dark:text-[#989898] hover:bg-slate-100 dark:hover:bg-[#252526] hover:text-slate-900 dark:hover:text-white transition"
          aria-label="View notifications"
          @click="isNotifOpen = !isNotifOpen"
        >
          <Bell class="w-4 h-4" />
          <span
            v-if="notifStore.unreadCount > 0"
            class="absolute top-1 right-1 flex size-2 rounded-full bg-red-600 dark:bg-[#c72e2e]"
          />
        </button>

        <!-- Dropdown Popover -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-2xl z-50 overflow-hidden"
        >
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#2d2d2d] px-4 py-3 bg-slate-50 dark:bg-[#1c1c1c]">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-slate-900 dark:text-white">Notifications</span>
              <span v-if="notifStore.unreadCount > 0" class="rounded px-1.5 py-0.5 bg-red-100 dark:bg-[#441416] text-xs font-medium text-red-700 dark:text-[#f48771]">
                {{ notifStore.unreadCount }} new
              </span>
            </div>
            <button
              v-if="notifStore.unreadCount > 0"
              class="text-xs font-medium text-blue-600 dark:text-[#4fc1ff] hover:underline"
              @click="notifStore.markAllRead()"
            >
              Mark all read
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2d2d2d]">
            <div
              v-for="notif in notifStore.notifications.slice(0, 5)"
              :key="notif.id"
              class="p-3 text-xs hover:bg-slate-50 dark:hover:bg-[#282828] cursor-pointer transition"
              @click="handleNotificationClick(notif)"
            >
              <div class="flex items-start justify-between gap-2">
                <p class="font-medium text-slate-900 dark:text-[#cccccc]">{{ notif.title }}</p>
                <span class="text-xs text-slate-400 dark:text-[#989898] shrink-0">{{ notif.created_at?.slice(11, 16) }}</span>
              </div>
              <p class="mt-1 text-slate-500 dark:text-[#989898] leading-relaxed [text-wrap:pretty]">{{ notif.message }}</p>
            </div>
            <div v-if="notifStore.notifications.length === 0" class="p-6 text-center text-xs text-slate-400 dark:text-[#989898]">
              No unread notifications
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Switcher -->
      <ThemeToggle />
    </div>
  </header>
</template>
