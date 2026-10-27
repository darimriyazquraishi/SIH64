<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GigwHeader from '@/components/GigwHeader.vue'
import GigwFooter from '@/components/GigwFooter.vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { X, CheckCircle2, AlertCircle, Info, Search, Bell } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const pageTitle = computed(() => {
  const p = route.path
  if (p === '/user') return 'My Registered Complaints'
  if (p === '/') return auth.isSystemAdmin ? 'System-Wide Administration' : 'Bureau Casework Dashboard'
  if (p.startsWith('/complaints/')) return 'Complaint Record Detail'
  if (p === '/complaints') return 'Complaints Register'
  if (p.startsWith('/institutions/')) return 'Institution 360° Profile'
  if (p === '/institutions') return 'AICTE Institution Directory'
  if (p === '/overlaps') return 'Cross-Bureau Overlap Verification'
  if (p === '/reports') return 'Statutory Reports & Analytics'
  if (p === '/notifications') return 'Operational Notifications'
  if (p === '/imports') return 'Bureau Data Import & Validation'
  if (p === '/admin') return 'System Administration & Quality Flags'
  return 'Workspace'
})

const breadcrumbSection = computed(() => {
  const p = route.path
  if (p === '/user') return 'Citizen Portal'
  if (auth.isSystemAdmin) return 'Administration'
  return 'Casework'
})
</script>

<template>
  <div class="gigw-layout-root">
    <!-- GIGW Official Header & Primary Nav -->
    <GigwHeader />

    <!-- Government Sub-Bar: Breadcrumbs & Quick Search -->
    <div class="gigw-subbar" v-if="auth.isAuthenticated">
      <div class="gigw-container gigw-subbar-inner">
        <nav class="gigw-breadcrumb" aria-label="Breadcrumb">
          <router-link to="/" class="bc-link">Home</router-link>
          <span class="bc-sep" aria-hidden="true">/</span>
          <span class="bc-section">{{ breadcrumbSection }}</span>
          <span class="bc-sep" aria-hidden="true">/</span>
          <strong class="bc-current" aria-current="page">{{ pageTitle }}</strong>
        </nav>

        <div class="gigw-subbar-tools" v-if="!auth.isUser">
          <label class="subbar-search-wrap">
            <Search :size="14" class="subbar-search-icon" aria-hidden="true" />
            <input
              v-model="ui.globalSearch"
              type="search"
              placeholder="Filter cases or Permanent ID…"
              class="subbar-search-input"
              aria-label="Filter cases or Permanent ID"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Main Workspace Body -->
    <main class="gigw-main-content" id="main-content">
      <div class="gigw-container">
        <router-view />
      </div>
    </main>

    <!-- Formal GIGW Footer -->
    <GigwFooter />

    <!-- Toast Notifications -->
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

<style scoped>
.gigw-layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--canvas, #f4f6f8);
  font-family: 'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
}
.gigw-container {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.25rem;
}
.gigw-subbar {
  background: #ffffff;
  border-bottom: 1px solid #d2d6dc;
  padding: 8px 0;
}
.gigw-subbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.gigw-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #4b5563;
}
.bc-link {
  color: #002b49;
  text-decoration: none;
  font-weight: 500;
}
.bc-link:hover {
  text-decoration: underline;
}
.bc-sep {
  color: #9ca3af;
}
.bc-section {
  color: #6b7280;
}
.bc-current {
  color: #111827;
  font-weight: 600;
}

.gigw-subbar-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}
.subbar-search-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  width: 260px;
}
.subbar-search-wrap:focus-within {
  border-color: #002b49;
  background: #ffffff;
}
.subbar-search-icon {
  color: #6b7280;
}
.subbar-search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 12px;
  color: #111827;
  width: 100%;
}
.subbar-search-input::placeholder {
  color: #9ca3af;
}

.gigw-main-content {
  flex: 1;
  padding: 1.5rem 0 3rem;
}
</style>
