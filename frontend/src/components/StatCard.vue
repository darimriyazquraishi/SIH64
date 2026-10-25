<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  value: number | string
  subtitle?: string
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
  loading?: boolean
  icon?: Component
  iconColor?: string
  iconBg?: string
  actionLabel?: string
  actionRoute?: string
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
    class="bg-white dark:bg-[#252526] rounded-xl border border-slate-200 dark:border-[#2d2d2d] p-4 sm:p-5 transition-all duration-150 hover:border-slate-300 dark:hover:border-[#3e3e42] shadow-sm flex flex-col justify-between"
  >
    <div>
      <div class="flex items-center justify-between">
        <!-- Colored Icon Container (Mockup Style) -->
        <div
          v-if="props.icon"
          :class="[
            'flex size-9 items-center justify-center rounded-lg border',
            props.iconBg || 'bg-blue-50 dark:bg-[#142e4e] border-blue-100 dark:border-[#1d4370]',
            props.iconColor || 'text-blue-600 dark:text-[#38bdf8]',
          ]"
        >
          <component :is="props.icon" class="w-4 h-4" aria-hidden="true" />
        </div>
        <slot name="icon" />
      </div>

      <p class="mt-3 text-xs font-medium text-slate-500 dark:text-[#989898]">
        {{ props.title }}
      </p>

      <div class="mt-1 flex items-baseline gap-2">
        <div v-if="props.loading" class="h-8 w-16 animate-pulse rounded bg-slate-100 dark:bg-[#1e1e1e]" />
        <span v-else :class="['text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums', valueColor]">
          {{ props.value }}
        </span>
      </div>

      <p v-if="props.subtitle" class="mt-1 text-xs text-slate-400 dark:text-[#989898]">
        {{ props.subtitle }}
      </p>
    </div>

    <!-- Bottom Action Link (Mockup Style) -->
    <div v-if="props.actionLabel && props.actionRoute" class="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-[#2d2d2d]">
      <router-link
        :to="props.actionRoute"
        class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-[#38bdf8] hover:text-blue-800 dark:hover:text-[#60cdff] transition-colors"
      >
        <span>{{ props.actionLabel }}</span>
        <ArrowRight class="w-3 h-3" aria-hidden="true" />
      </router-link>
    </div>
  </div>
</template>
