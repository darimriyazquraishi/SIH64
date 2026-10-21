<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  subtitle?: string
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
  loading?: boolean
}>()

const borderClass = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'border-l-4 border-l-red-500 border-slate-200'
    case 'warning':
      return 'border-l-4 border-l-amber-500 border-slate-200'
    case 'success':
      return 'border-l-4 border-l-emerald-500 border-slate-200'
    case 'info':
      return 'border-l-4 border-l-blue-600 border-slate-200'
    default:
      return 'border-slate-200'
  }
})

const valueColor = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-red-700'
    case 'warning':
      return 'text-amber-800'
    case 'success':
      return 'text-emerald-700'
    case 'info':
      return 'text-blue-700'
    default:
      return 'text-slate-900'
  }
})
</script>

<template>
  <div
    :class="[
      'bg-white rounded-lg border p-5 shadow-subtle transition-all duration-150 hover:shadow-elevated',
      borderClass,
    ]"
  >
    <div class="flex items-center justify-between">
      <p class="text-xs font-medium uppercase tracking-wider text-slate-500">
        {{ props.title }}
      </p>
      <slot name="icon" />
    </div>
    
    <div class="mt-2.5 flex items-baseline gap-2">
      <div v-if="props.loading" class="h-8 w-16 animate-pulse rounded bg-slate-100" />
      <span v-else :class="['text-2xl font-bold tracking-tight', valueColor]">
        {{ props.value }}
      </span>
    </div>

    <p v-if="props.subtitle" class="mt-1 text-xs text-slate-500">
      {{ props.subtitle }}
    </p>
  </div>
</template>
