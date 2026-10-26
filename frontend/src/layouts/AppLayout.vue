<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useUiStore } from '@/stores/ui'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-vue-next'

const ui = useUiStore()
const sidebarOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <button v-if="sidebarOpen" class="sidebar-backdrop" aria-label="Close navigation" @click="sidebarOpen = false"></button>
    <div class="app-main">
      <Navbar @toggle-menu="sidebarOpen = !sidebarOpen" />
      <main class="main-canvas" id="main-content">
        <router-view />
        <footer class="app-footer">
          <span>AICTE · Complaint monitoring workspace</span>
          <span>SIH 2026 prototype <i class="footer-dot"></i> Internal demonstration</span>
        </footer>
      </main>
    </div>
    <Transition name="toast">
      <div v-if="ui.toastMessage" class="toast-message" :class="`toast-${ui.toastKind}`" role="status" aria-live="polite">
        <CheckCircle2 v-if="ui.toastKind === 'success'" :size="18" />
        <AlertCircle v-else-if="ui.toastKind === 'error'" :size="18" />
        <Info v-else :size="18" />
        <span>{{ ui.toastMessage }}</span>
        <button class="icon-button toast-close" aria-label="Dismiss notification" @click="ui.toastMessage = ''"><X :size="15" /></button>
      </div>
    </Transition>
  </div>
</template>
