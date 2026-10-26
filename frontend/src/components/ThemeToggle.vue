<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#989898] dark:hover:bg-[#252526] dark:hover:text-white transition-colors focus:outline-none"
    :title="theme === 'dark' ? 'Switch to Light Mode (Lemondrop)' : 'Switch to Dark Mode (Glow)'"
    aria-label="Toggle color theme"
    @click="toggleTheme"
  >
    <Sun
      v-if="theme === 'dark'"
      class="h-4 w-4 text-amber-400 transition-transform duration-200"
    />
    <Moon
      v-else
      class="h-4 w-4 text-slate-600 transition-transform duration-200"
    />
  </button>
</template>
