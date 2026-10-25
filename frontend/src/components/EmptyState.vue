<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-[#3e3e42] rounded bg-slate-50/50 dark:bg-[#1e1e1e]/60">
    <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#252526] flex items-center justify-center text-slate-400 dark:text-[#858585] mb-2.5 border dark:border-[#2d2d2d]">
      <slot name="icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
    </div>
    <h2 class="text-xs font-semibold text-slate-800 dark:text-[#cccccc]">{{ title }}</h2>
    <p v-if="description" class="mt-1 text-xs text-slate-500 dark:text-[#858585] max-w-sm">{{ description }}</p>
    <div v-if="$slots.action" class="mt-3">
      <slot name="action" />
    </div>
  </div>
</template>
