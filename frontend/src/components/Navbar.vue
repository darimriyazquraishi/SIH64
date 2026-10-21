<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import { Bell, LogOut, User as UserIcon, ShieldAlert, Check } from 'lucide-vue-next'

const authStore = useAuthStore()
const notifStore = useNotificationsStore()
const router = useRouter()

const isNotifOpen = ref(false)
const isProfileOpen = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    notifStore.fetchNotifications()
  }
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
  <header class="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
    <!-- Brand / Title -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-amber-400 font-bold text-lg shadow-sm">
        AI
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-sm font-bold tracking-tight text-slate-900">
            AICTE Case Monitoring & Coordination Portal
          </h1>
          <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
            SIH 2026
          </span>
        </div>
        <p class="text-[11px] text-slate-500 hidden sm:block">
          All India Council for Technical Education • Cross-Bureau Intelligence
        </p>
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-3">
      <!-- Bureau Badge -->
      <div v-if="authStore.user?.bureau_code" class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
        <span class="w-2 h-2 rounded-full bg-blue-600"></span>
        {{ authStore.user.bureau_name || authStore.user.bureau_code }}
      </div>
      <div v-else-if="authStore.isAdmin" class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
        <span class="w-2 h-2 rounded-full bg-amber-500"></span>
        System Administrator
      </div>
      <div v-else-if="authStore.isSeniorAuthority" class="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-medium text-purple-800">
        <span class="w-2 h-2 rounded-full bg-purple-500"></span>
        Senior Authority (Read-Only)
      </div>

      <!-- Notifications -->
      <div class="relative">
        <button
          type="button"
          class="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          @click="isNotifOpen = !isNotifOpen"
        >
          <Bell class="h-5 w-5" />
          <span
            v-if="notifStore.unreadCount > 0"
            class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white"
          >
            {{ notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount }}
          </span>
        </button>

        <!-- Dropdown Popover -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden"
        >
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-slate-900">Notifications</span>
              <span v-if="notifStore.unreadCount > 0" class="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                {{ notifStore.unreadCount }} unread
              </span>
            </div>
            <button
              v-if="notifStore.unreadCount > 0"
              class="text-[11px] font-medium text-blue-600 hover:text-blue-800"
              @click="notifStore.markAllRead()"
            >
              Mark all read
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
            <div
              v-for="notif in notifStore.notifications.slice(0, 6)"
              :key="notif.id"
              :class="[
                'p-3.5 text-left transition cursor-pointer hover:bg-slate-50',
                !notif.is_read ? 'bg-blue-50/40' : ''
              ]"
              @click="handleNotificationClick(notif)"
            >
              <div class="flex items-start justify-between gap-2">
                <p :class="['text-xs leading-snug', !notif.is_read ? 'font-semibold text-slate-900' : 'text-slate-700']">
                  {{ notif.title }}
                </p>
                <span v-if="!notif.is_read" class="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></span>
              </div>
              <p class="mt-1 text-[11px] text-slate-500 line-clamp-2">
                {{ notif.message }}
              </p>
            </div>

            <div v-if="notifStore.notifications.length === 0" class="p-6 text-center text-xs text-slate-400">
              No recent notifications
            </div>
          </div>

          <div class="border-t border-slate-100 p-2 bg-slate-50 text-center">
            <router-link
              to="/notifications"
              class="text-xs font-medium text-blue-600 hover:text-blue-800"
              @click="isNotifOpen = false"
            >
              View all notifications →
            </router-link>
          </div>
        </div>
      </div>

      <!-- User Menu -->
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition"
          @click="isProfileOpen = !isProfileOpen"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white text-xs font-semibold">
            {{ authStore.user?.name?.charAt(0) || 'U' }}
          </div>
          <div class="text-left hidden lg:block">
            <p class="text-xs font-semibold text-slate-900 leading-none">
              {{ authStore.user?.name }}
            </p>
            <p class="text-[10px] text-slate-500 mt-0.5">
              {{ authStore.user?.designation || authStore.user?.role }}
            </p>
          </div>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isProfileOpen"
          class="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-50 p-1.5"
        >
          <div class="px-3 py-2 border-b border-slate-100">
            <p class="text-xs font-semibold text-slate-900">{{ authStore.user?.name }}</p>
            <p class="text-[11px] text-slate-500 truncate">{{ authStore.user?.email }}</p>
          </div>
          <button
            type="button"
            class="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition mt-1"
            @click="handleLogout"
          >
            <LogOut class="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
