<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import EmptyState from '@/components/EmptyState.vue'
import {
  Bell,
  CheckCheck,
  Clock,
  GitCompare,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-vue-next'

const notifStore = useNotificationsStore()
const router = useRouter()
const unreadOnly = ref(false)

onMounted(() => {
  notifStore.fetchNotifications(unreadOnly.value)
})

function toggleUnread() {
  notifStore.fetchNotifications(unreadOnly.value)
}

function handleNotificationClick(notif: any) {
  notifStore.markAsRead(notif.id)
  if (notif.related_complaint_id) {
    router.push(`/complaints/${notif.related_complaint_id}`)
  } else if (notif.notification_type === 'overlap_detected') {
    router.push('/overlaps')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          In-App Notification Center
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Real-time alerts for cross-bureau overlaps, approaching deadlines, and case assignments
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          @click="notifStore.checkDeadlines()"
        >
          <Clock class="w-3.5 h-3.5 text-slate-500" />
          Scan Approaching Deadlines
        </button>

        <button
          v-if="notifStore.unreadCount > 0"
          type="button"
          class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
          @click="notifStore.markAllRead()"
        >
          <CheckCheck class="w-3.5 h-3.5" />
          Mark All Read
        </button>
      </div>
    </div>

    <!-- Filter Toggle -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-3">
      <label class="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
        <input
          v-model="unreadOnly"
          type="checkbox"
          class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
          @change="toggleUnread"
        />
        Show unread only
      </label>

      <span class="text-xs text-slate-500">
        {{ notifStore.unreadCount }} unread notifications
      </span>
    </div>

    <!-- Notification List -->
    <div class="space-y-3">
      <div
        v-for="notif in notifStore.notifications"
        :key="notif.id"
        :class="[
          'rounded-xl border p-4 shadow-subtle transition cursor-pointer hover:shadow-elevated',
          !notif.is_read
            ? 'bg-blue-50/40 border-blue-200'
            : 'bg-white border-slate-200'
        ]"
        @click="handleNotificationClick(notif)"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-3">
            <div
              :class="[
                'p-2 rounded-lg mt-0.5',
                notif.notification_type === 'overlap_detected' ? 'bg-amber-100 text-amber-800' :
                notif.notification_type === 'case_overdue' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              ]"
            >
              <GitCompare v-if="notif.notification_type === 'overlap_detected'" class="w-4 h-4" />
              <AlertTriangle v-else-if="notif.notification_type === 'case_overdue'" class="w-4 h-4" />
              <Bell v-else class="w-4 h-4" />
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h4 :class="['text-xs font-bold text-slate-900', !notif.is_read ? 'text-blue-950 font-extrabold' : '']">
                  {{ notif.title }}
                </h4>
                <span v-if="!notif.is_read" class="w-2 h-2 rounded-full bg-blue-600"></span>
              </div>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                {{ notif.message }}
              </p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-2 flex-shrink-0">
            <span class="text-[11px] text-slate-400">
              {{ notif.created_at?.slice(0, 16).replace('T', ' ') }}
            </span>
            <span class="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
              Open <ArrowRight class="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      <div v-if="notifStore.notifications.length === 0 && !notifStore.loading">
        <EmptyState
          title="No notifications in your inbox"
          description="You are completely caught up! Relevant case alerts, overlap notices, and assignments will appear here."
        />
      </div>
    </div>
  </div>
</template>
