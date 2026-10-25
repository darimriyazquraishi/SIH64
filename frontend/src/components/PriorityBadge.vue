<script setup lang="ts">
import { computed } from 'vue'
import {
  ChevronsUp,
  ChevronUp,
  Minus,
  ChevronDown
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    priority: string
    size?: 'sm' | 'md'
    variant?: 'inline' | 'tag' | 'pill'
  }>(),
  {
    size: 'sm',
    variant: 'inline',
  }
)

const config = computed(() => {
  switch (props.priority?.toLowerCase()) {
    case 'critical':
      return {
        icon: ChevronsUp,
        iconColor: 'text-red-600 dark:text-[#f48771]',
        textColor: 'text-red-700 dark:text-[#f48771] font-semibold',
        tagBg: 'bg-red-50 text-red-700 border-red-200 dark:bg-[#f48771]/15 dark:text-[#f48771] dark:border-[#f48771]/30',
        dotColor: 'bg-red-600 dark:bg-[#f14c4c]',
        label: 'Critical',
      }
    case 'high':
      return {
        icon: ChevronUp,
        iconColor: 'text-amber-600 dark:text-[#ce9178]',
        textColor: 'text-amber-800 dark:text-[#ce9178] font-medium',
        tagBg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-[#ce9178]/15 dark:text-[#ce9178] dark:border-[#ce9178]/30',
        dotColor: 'bg-amber-600 dark:bg-[#ce9178]',
        label: 'High',
      }
    case 'medium':
      return {
        icon: Minus,
        iconColor: 'text-blue-600 dark:text-[#4fc1ff]',
        textColor: 'text-blue-800 dark:text-[#4fc1ff] font-medium',
        tagBg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-[#4fc1ff]/15 dark:text-[#4fc1ff] dark:border-[#4fc1ff]/30',
        dotColor: 'bg-blue-600 dark:bg-[#4fc1ff]',
        label: 'Medium',
      }
    case 'low':
      return {
        icon: ChevronDown,
        iconColor: 'text-slate-500 dark:text-[#989898]',
        textColor: 'text-slate-600 dark:text-[#989898] font-normal',
        tagBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#252526] dark:text-[#989898] dark:border-[#3e3e42]',
        dotColor: 'bg-slate-500 dark:bg-[#989898]',
        label: 'Low',
      }
    default:
      return {
        icon: Minus,
        iconColor: 'text-slate-500 dark:text-[#989898]',
        textColor: 'text-slate-600 dark:text-[#989898] font-normal',
        tagBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#252526] dark:text-[#989898] dark:border-[#3e3e42]',
        dotColor: 'bg-slate-500 dark:bg-[#989898]',
        label: props.priority || 'Medium',
      }
  }
})
</script>

<template>
  <!-- Inline Modern Style (Linear / GitHub / VS Code style) -->
  <span
    v-if="variant === 'inline'"
    class="inline-flex items-center gap-1.5 text-xs whitespace-nowrap"
  >
    <component
      :is="config.icon"
      :class="['shrink-0', size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4', config.iconColor]"
      aria-hidden="true"
    />
    <span :class="config.textColor">{{ config.label }}</span>
  </span>

  <!-- Flat Micro-Tag Style (VS Code Editor tag style) -->
  <span
    v-else-if="variant === 'tag'"
    :class="[
      'inline-flex items-center gap-1.5 rounded border whitespace-nowrap text-xs font-medium',
      size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1',
      config.tagBg,
    ]"
  >
    <component
      :is="config.icon"
      :class="['shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', config.iconColor]"
      aria-hidden="true"
    />
    <span>{{ config.label }}</span>
  </span>

  <!-- Refined Pill Style -->
  <span
    v-else
    :class="[
      'inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap text-xs font-medium',
      size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-0.5',
      config.tagBg,
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full shrink-0', config.dotColor]" />
    <span>{{ config.label }}</span>
  </span>
</template>
