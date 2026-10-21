<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  priority: string
  size?: 'sm' | 'md'
}>()

const config = computed(() => {
  switch (props.priority?.toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-red-50 text-red-700 border-red-300 font-semibold',
        dot: 'bg-red-600 animate-ping',
        text: 'Critical',
      }
    case 'high':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        dot: 'bg-amber-600',
        text: 'High',
      }
    case 'medium':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300',
        dot: 'bg-blue-600',
        text: 'Medium',
      }
    case 'low':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        dot: 'bg-slate-500',
        text: 'Low',
      }
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        dot: 'bg-slate-500',
        text: props.priority || 'Medium',
      }
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 border rounded-full',
      props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs font-medium',
      config.bg,
    ]"
  >
    <span class="relative flex h-2 w-2">
      <span
        v-if="props.priority?.toLowerCase() === 'critical'"
        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
      />
      <span :class="['relative inline-flex rounded-full h-2 w-2', config.dot]" />
    </span>
    {{ config.text }}
  </span>
</template>
