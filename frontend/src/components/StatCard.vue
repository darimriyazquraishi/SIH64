<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  subtitle?: string
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
  loading?: boolean
}>()

const valueColor = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-red-600 dark:text-[#f48771]'
    case 'warning':
      return 'text-amber-700 dark:text-[#cca700]'
    case 'success':
      return 'text-emerald-700 dark:text-[#89d185]'
    case 'info':
      return 'text-blue-700 dark:text-[#4fc1ff]'
    default:
      return 'text-slate-900 dark:text-white'
  }
})
</script>

<template>
  <div
    class="bg-white dark:bg-[#252526] rounded-md border border-slate-200 dark:border-[#2d2d2d] p-4.5 transition-colors hover:border-slate-300 dark:hover:border-[#3e3e42]"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs font-medium text-slate-500 dark:text-[#858585]">
        {{ props.title }}
      </p>
      <slot name="icon" />
    </div>
    
    <div class="mt-2 flex items-baseline gap-2">
      <div v-if="props.loading" class="h-8 w-16 animate-pulse rounded bg-slate-100 dark:bg-[#1e1e1e]" />
      <span v-else :class="['text-2xl font-bold tracking-tight tabular-nums', valueColor]">
        {{ props.value }}
      </span>
    </div>

    <p v-if="props.subtitle" class="mt-1 text-xs text-slate-500 dark:text-[#858585]">
      {{ props.subtitle }}
    </p>
  </div>
</template>
