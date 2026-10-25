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
        bg: 'bg-red-50 text-red-700 border-red-300 font-semibold dark:bg-[#3b1214] dark:text-[#f48771] dark:border-[#5c1c20]',
        dot: 'bg-red-600 dark:bg-[#f14c4c]',
        text: 'Critical',
      }
    case 'high':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-[#3d1e06] dark:text-[#ce9178] dark:border-[#5e2e0a]',
        dot: 'bg-amber-600 dark:bg-[#ce9178]',
        text: 'High',
      }
    case 'medium':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-[#093554] dark:text-[#4fc1ff] dark:border-[#14496b]',
        dot: 'bg-blue-600 dark:bg-[#4fc1ff]',
        text: 'Medium',
      }
    case 'low':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-[#252526] dark:text-[#858585] dark:border-[#3e3e42]',
        dot: 'bg-slate-500 dark:bg-[#858585]',
        text: 'Low',
      }
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-[#252526] dark:text-[#858585] dark:border-[#3e3e42]',
        dot: 'bg-slate-500 dark:bg-[#858585]',
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
    <span :class="['inline-flex rounded-full h-1.5 w-1.5', config.dot]" />
    {{ config.text }}
  </span>
</template>
