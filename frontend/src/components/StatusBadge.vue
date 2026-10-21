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
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-500',
      }
    case 'Under Review':
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-300',
        dot: 'bg-amber-500',
      }
    case 'Action Required':
      return {
        bg: 'bg-orange-50 text-orange-900 border-orange-300',
        dot: 'bg-orange-600 animate-pulse',
      }
    case 'Awaiting Response':
      return {
        bg: 'bg-sky-50 text-sky-900 border-sky-300',
        dot: 'bg-sky-500',
      }
    case 'Escalated':
      return {
        bg: 'bg-rose-50 text-rose-900 border-rose-300',
        dot: 'bg-rose-600',
      }
    case 'Disposed':
      return {
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        dot: 'bg-emerald-600',
      }
    case 'Closed':
      return {
        bg: 'bg-zinc-100 text-zinc-700 border-zinc-300',
        dot: 'bg-zinc-400',
      }
    default:
      return {
        bg: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-400',
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
