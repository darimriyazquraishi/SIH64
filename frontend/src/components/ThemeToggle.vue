<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative rounded-lg p-1.5 text-[#5f6656] hover:bg-[#e2ead6] hover:text-[#22261f] dark:text-[#989e92] dark:hover:bg-[#252922] dark:hover:text-[#b8ee82] transition-colors focus:outline-none focus:ring-1 focus:ring-[#7eaa3b] dark:focus:ring-[#b8ee82]"
    :title="theme === 'dark' ? 'Switch to Lemondrop (Light Mode)' : 'Switch to Glow (Dark Mode)'"
    aria-label="Toggle between Lemondrop and Glow themes"
    @click="toggleTheme"
  >
    <Sun
      v-if="theme === 'dark'"
      class="h-4 w-4 text-[#b8ee82] transition-transform duration-200"
    />
    <Moon
      v-else
      class="h-4 w-4 text-[#5e9a2e] transition-transform duration-200"
    />
  </button>
</template>
