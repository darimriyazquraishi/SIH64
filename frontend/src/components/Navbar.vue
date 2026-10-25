<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import SihLogo from '@/components/SihLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { Bell, LogOut, Search, Compass, ChevronDown } from 'lucide-vue-next'

const authStore = useAuthStore()
const notifStore = useNotificationsStore()
const router = useRouter()

const isNotifOpen = ref(false)
const isProfileOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

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

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

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
  <header class="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] px-5 transition-colors select-none">
    <!-- Brand / Title -->
    <div class="flex items-center gap-3">
      <router-link to="/" class="flex items-center gap-3 group">
        <SihLogo size="md" :show-subtitle="false" />
        <div class="hidden sm:block border-l border-slate-200 dark:border-[#383838] pl-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-800 dark:text-white">
              AICTE Complaint Monitoring Portal
            </span>
            <span class="rounded bg-orange-100 dark:bg-[#33200a] text-orange-700 dark:text-[#f97316] px-1.5 py-0.5 text-xs font-bold border border-orange-200 dark:border-[#522900]">
              SIH 2026
            </span>
          </div>
          <p class="text-xs text-slate-400 dark:text-[#989898] leading-tight">
            All India Council for Technical Education
          </p>
        </div>
      </router-link>
    </div>

    <!-- Center: Demostack Quick Search Input with Ctrl+K -->
    <div class="hidden md:flex items-center bg-slate-100 dark:bg-[#1e1e1e] rounded-lg px-3 py-1.5 w-64 lg:w-80 border border-slate-200 dark:border-[#3e3e42] focus-within:border-blue-500 dark:focus-within:border-[#007acc] transition">
      <Search class="w-3.5 h-3.5 text-slate-400 dark:text-[#aaaaaa] shrink-0 mr-2" />
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Search cases, colleges, dockets..."
        class="bg-transparent text-xs w-full text-slate-900 dark:text-[#cccccc] placeholder-slate-400 dark:placeholder-[#aaaaaa] focus:outline-none"
        @keydown.enter="handleSearchSubmit"
      />
      <div class="flex items-center gap-0.5 rounded bg-white dark:bg-[#252526] px-1.5 py-0.5 border border-slate-200 dark:border-[#3e3e42] text-xs font-mono text-slate-400 dark:text-[#989898]">
        <span>Ctrl</span>
        <span>K</span>
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-2.5">
      <!-- Public Landing Page Link -->
      <router-link
        to="/landing"
        class="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-slate-700 dark:text-[#cccccc] hover:bg-slate-100 dark:hover:bg-[#333336] border border-transparent hover:border-slate-200 dark:hover:border-[#3e3e42] transition-colors"
      >
        <Compass class="w-3.5 h-3.5 text-[#f97316]" aria-hidden="true" />
        <span>Landing Page</span>
      </router-link>

      <!-- Theme Switcher -->
      <ThemeToggle />

      <!-- Bureau / Role Badge -->
      <div v-if="authStore.user?.bureau_code" class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-[#093554] border border-slate-200 dark:border-[#14496b] text-xs font-medium text-slate-700 dark:text-[#4fc1ff]">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#4fc1ff]"></span>
        {{ authStore.user.bureau_name || authStore.user.bureau_code }}
      </div>
      <div v-else-if="authStore.isAdmin" class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 dark:bg-[#332b00] border border-amber-200 dark:border-[#554400] text-xs font-medium text-amber-800 dark:text-[#cca700]">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-[#cca700]"></span>
        System Administrator
      </div>
      <div v-else-if="authStore.isSeniorAuthority" class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-50 dark:bg-[#3b1c47] border border-purple-200 dark:border-[#562868] text-xs font-medium text-purple-800 dark:text-[#c586c0]">
        <span class="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-[#c586c0]"></span>
        Senior Authority (Read-Only)
      </div>

      <!-- Notifications Popover -->
      <div class="relative">
        <button
          type="button"
          class="relative rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-[#989898] dark:hover:bg-[#2a2d2e] dark:hover:text-white transition-colors"
          aria-label="View notifications"
          @click="isNotifOpen = !isNotifOpen"
        >
          <Bell class="h-4 w-4" aria-hidden="true" />
          <span
            v-if="notifStore.unreadCount > 0"
            class="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-700 dark:bg-[#c72e2e] text-xs font-bold text-white"
          >
            {{ notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount }}
          </span>
        </button>

        <!-- Dropdown Popover -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-2 w-80 sm:w-96 rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-lg z-50 overflow-hidden"
        >
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#2d2d2d] px-3.5 py-2.5 bg-slate-50 dark:bg-[#1e1e1e]">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-slate-900 dark:text-white">Notifications</span>
              <span v-if="notifStore.unreadCount > 0" class="rounded px-1.5 py-0.5 bg-red-100 dark:bg-[#441416] text-xs font-medium text-red-700 dark:text-[#f48771]">
                {{ notifStore.unreadCount }} unread
              </span>
            </div>
            <button
              v-if="notifStore.unreadCount > 0"
              class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-[#4fc1ff] dark:hover:underline"
              @click="notifStore.markAllRead()"
            >
              Mark all read
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2d2d2d]">
            <div
              v-for="notif in notifStore.notifications.slice(0, 6)"
              :key="notif.id"
              :class="[
                'p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-[#2a2d2e]',
                !notif.is_read ? 'bg-blue-50/40 dark:bg-[#1f2937]/30' : ''
              ]"
              @click="handleNotificationClick(notif)"
            >
              <div class="flex items-start justify-between gap-2">
                <p :class="['text-xs leading-snug', !notif.is_read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-[#cccccc]']">
                  {{ notif.title }}
                </p>
                <span v-if="!notif.is_read" class="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-[#4fc1ff] flex-shrink-0 mt-1"></span>
              </div>
              <p class="mt-1 text-xs text-slate-500 dark:text-[#989898] line-clamp-2">
                {{ notif.message }}
              </p>
            </div>

            <div v-if="notifStore.notifications.length === 0" class="p-6 text-center text-xs text-slate-400 dark:text-[#989898]">
              No unread notifications
            </div>
          </div>

          <div class="border-t border-slate-100 dark:border-[#2d2d2d] p-2 bg-slate-50 dark:bg-[#1e1e1e] text-center">
            <router-link
              to="/notifications"
              class="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-[#4fc1ff] dark:hover:underline"
              @click="isNotifOpen = false"
            >
              All notifications
            </router-link>
          </div>
        </div>
      </div>

      <!-- User Menu -->
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-2 rounded p-1 hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition-colors"
          aria-label="User account menu"
          @click="isProfileOpen = !isProfileOpen"
        >
          <div class="flex h-7 w-7 items-center justify-center rounded bg-slate-800 dark:bg-[#37373d] text-white text-xs font-semibold">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="text-left hidden lg:block">
            <p class="text-xs font-medium text-slate-900 dark:text-white leading-none">
              {{ authStore.user?.name || 'Dr. Rajiv Sharma' }}
            </p>
            <p class="text-xs text-slate-500 dark:text-[#989898] mt-0.5">
              {{ authStore.user?.designation || authStore.user?.role || 'Director IT & Chief Admin' }}
            </p>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isProfileOpen"
          class="absolute right-0 mt-2 w-52 rounded-md border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-lg z-50 p-1"
        >
          <div class="px-3 py-2 border-b border-slate-100 dark:border-[#2d2d2d]">
            <p class="text-xs font-semibold text-slate-900 dark:text-white">{{ authStore.user?.name || 'Dr. Rajiv Sharma' }}</p>
            <p class="text-xs text-slate-500 dark:text-[#989898] truncate">{{ authStore.user?.email || 'admin@aicte.gov.in' }}</p>
          </div>
          <button
            type="button"
            class="w-full flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium text-red-600 dark:text-[#f48771] hover:bg-red-50 dark:hover:bg-[#3b1214] transition-colors mt-1"
            @click="handleLogout"
          >
            <LogOut class="w-3.5 h-3.5" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
