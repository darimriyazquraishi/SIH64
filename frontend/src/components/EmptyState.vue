<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center">
    <div class="flex items-center gap-2 mb-1 text-slate-400 dark:text-[#989898]">
      <slot name="icon">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
      <h2 class="text-xs font-semibold text-[#22261f] dark:text-[#e6eae2]">{{ title }}</h2>
    </div>
    <p v-if="description" class="text-xs text-[#5f6656] dark:text-[#989898] max-w-sm [text-wrap:pretty]">{{ description }}</p>
    <div v-if="$slots.action" class="mt-3">
      <slot name="action" />
    </div>
  </div>
</template>
