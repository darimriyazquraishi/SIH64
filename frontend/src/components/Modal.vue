<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  title: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const maxWidthClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}[props.maxWidth || 'lg']
</script>

<template>
  <Teleport to="body">
    <div
      v-if="props.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/60 transition-opacity"
        @click="emit('close')"
      />

      <!-- Dialog Card -->
      <div
        :class="[
          'relative w-full rounded bg-white dark:bg-[#252526] border border-slate-200 dark:border-[#2d2d2d] shadow-lg transition-all z-10 flex flex-col max-h-[90vh]',
          maxWidthClass,
        ]"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-[#2d2d2d] px-5 py-3.5">
          <h2 class="text-sm font-semibold text-slate-900 dark:text-[#d4d4d4]">
            {{ props.title }}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            class="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#2d2d2d] hover:text-slate-600 dark:hover:text-[#cccccc] transition"
            @click="emit('close')"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-5 py-4 overflow-y-auto">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="border-t border-slate-100 dark:border-[#2d2d2d] px-5 py-3 bg-slate-50 dark:bg-[#1e1e1e] rounded-b flex justify-end gap-2.5">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
