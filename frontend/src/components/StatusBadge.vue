<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
  size?: 'sm' | 'md'
}>()

const badgeConfig = computed(() => {
  switch (props.status) {
    case 'Received':
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-[#2d2d2d] dark:text-[#cccccc] dark:border-[#3e3e42]',
        dot: 'bg-slate-500 dark:bg-[#858585]',
      }
    case 'Under Review':
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-[#332b00] dark:text-[#e5b567] dark:border-[#554400]',
        dot: 'bg-amber-500 dark:bg-[#cca700]',
      }
    case 'Action Required':
      return {
        bg: 'bg-orange-50 text-orange-900 border-orange-300 dark:bg-[#3d1e06] dark:text-[#ce9178] dark:border-[#5e2e0a]',
        dot: 'bg-orange-600 dark:bg-[#ce9178]',
      }
    case 'Awaiting Response':
      return {
        bg: 'bg-sky-50 text-sky-900 border-sky-300 dark:bg-[#093554] dark:text-[#4fc1ff] dark:border-[#14496b]',
        dot: 'bg-sky-500 dark:bg-[#4fc1ff]',
      }
    case 'Escalated':
      return {
        bg: 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-[#3b1214] dark:text-[#f48771] dark:border-[#5c1c20]',
        dot: 'bg-rose-600 dark:bg-[#f14c4c]',
      }
    case 'Disposed':
      return {
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-[#122e1b] dark:text-[#89d185] dark:border-[#1f4a2b]',
        dot: 'bg-emerald-600 dark:bg-[#89d185]',
      }
    case 'Closed':
      return {
        bg: 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-[#252526] dark:text-[#858585] dark:border-[#3e3e42]',
        dot: 'bg-zinc-400 dark:bg-[#858585]',
      }
    default:
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-[#2d2d2d] dark:text-[#cccccc] dark:border-[#3e3e42]',
        dot: 'bg-slate-400 dark:bg-[#858585]',
      }
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-medium border rounded-full',
      props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      badgeConfig.bg,
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', badgeConfig.dot]" />
    {{ props.status }}
  </span>
</template>
