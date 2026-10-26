<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Sun, Moon } from 'lucide-vue-next'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle-btn"
    :title="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    aria-label="Toggle color theme"
    @click="toggleTheme"
  >
    <Sun
      v-if="theme === 'dark'"
      :size="17"
      class="theme-icon sun-icon"
    />
    <Moon
      v-else
      :size="17"
      class="theme-icon moon-icon"
    />
  </button>
</template>

<style scoped>
.theme-toggle-btn {
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid #dce2da;
  border-radius: 6px;
  background: #fffefa;
  color: #475551;
  cursor: pointer;
  transition: all .16s ease;
}
.theme-toggle-btn:hover {
  background: #f1f4ed;
  border-color: #2b665b;
  color: #202a2d;
}
:global(html.dark) .theme-toggle-btn {
  background: #1c2224;
  border-color: #313a3d;
  color: #fdd878;
}
:global(html.dark) .theme-toggle-btn:hover {
  background: #252d30;
  border-color: #fdd878;
  color: #ffe699;
}
.theme-icon {
  flex: none;
  transition: transform .2s ease;
}
.theme-toggle-btn:hover .theme-icon {
  transform: rotate(15deg);
}
</style>
