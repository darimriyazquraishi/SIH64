<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-[#989898] dark:hover:bg-[#2d2d2d] dark:hover:text-[#cccccc] transition-colors focus:outline-none focus:ring-1 focus:ring-[#007acc]"
    :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    aria-label="Toggle color theme"
    @click="toggleTheme"
  >
    <Sun
      v-if="theme === 'dark'"
      class="h-4 w-4 text-[#cca700] transition-transform duration-200"
    />
    <Moon
      v-else
      class="h-4 w-4 text-slate-600 transition-transform duration-200"
    />
  </button>
</template>
