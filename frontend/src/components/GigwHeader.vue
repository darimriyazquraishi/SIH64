<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import IndianEmblem from '@/components/IndianEmblem.vue'
import aicteLogo from '@/assets/aicte-logo.png'
import {
  FileText, Search, PlusCircle, LayoutDashboard, Building2,
  FileSearch, BarChart3, Bell, Database, Settings2, LogOut,
  User, CheckCircle2, AlertTriangle, Layers
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const currentFontSize = ref<'sm' | 'md' | 'lg'>('md')

function setFontSize(size: 'sm' | 'md' | 'lg') {
  currentFontSize.value = size
  const root = document.documentElement
  root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg')
  root.classList.add(`font-scale-${size}`)
  try {
    localStorage.setItem('aicte_font_scale', size)
  } catch {}
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('aicte_font_scale') as 'sm' | 'md' | 'lg' | null
    if (saved && ['sm', 'md', 'lg'].includes(saved)) {
      setFontSize(saved)
    }
  } catch {}
})

async function handleSignOut() {
  await auth.logout()
  router.push('/login')
}

function isActive(path: string, querySection?: string): boolean {
  if (querySection) {
    return route.path === path && route.query.section === querySection
  }
  if (path === '/') {
    return route.path === '/' && !route.query.section && !route.query.filter
  }
  return route.path === path || (route.path.startsWith(`${path}/`) && !route.path.includes('?'))
}
</script>

<template>
  <header class="gigw-header" role="banner">
    <!-- 1. Top Slim Accessibility Bar (GIGW Mandate) -->
    <div class="gigw-top-strip">
      <div class="gigw-container gigw-top-strip-inner">
        <div class="gigw-gov-title">
          <span class="gov-flag-emblem" aria-hidden="true">🇮🇳</span>
          <span class="gov-text-hi">भारत सरकार</span>
          <span class="gov-divider">|</span>
          <span class="gov-text-en">Government of India</span>
        </div>

        <div class="gigw-top-tools">
          <a href="#main-content" class="gigw-skip-btn">Skip to main content</a>
          <span class="gigw-tool-divider">|</span>
          <div class="gigw-font-controls" role="group" aria-label="Text size controls">
            <span class="gigw-font-label">Text Size:</span>
            <button
              type="button"
              class="font-ctrl-btn"
              :class="{ 'font-ctrl-active': currentFontSize === 'sm' }"
              title="Decrease text size"
              aria-label="Decrease text size"
              @click="setFontSize('sm')"
            >A-</button>
            <button
              type="button"
              class="font-ctrl-btn"
              :class="{ 'font-ctrl-active': currentFontSize === 'md' }"
              title="Standard text size"
              aria-label="Standard text size"
              @click="setFontSize('md')"
            >A</button>
            <button
              type="button"
              class="font-ctrl-btn"
              :class="{ 'font-ctrl-active': currentFontSize === 'lg' }"
              title="Increase text size"
              aria-label="Increase text size"
              @click="setFontSize('lg')"
            >A+</button>
          </div>
          <span class="gigw-tool-divider">|</span>
          <span class="gigw-lang-tag">English</span>
        </div>
      </div>
    </div>

    <!-- 2. Main Official Branding Banner -->
    <div class="gigw-brand-bar">
      <div class="gigw-container gigw-brand-inner">
        <div class="gigw-brand-left">
          <!-- State Emblem of India -->
          <div class="gigw-emblem-wrap" title="State Emblem of India">
            <IndianEmblem width="38" height="48" />
          </div>

          <div class="gigw-brand-divider" aria-hidden="true"></div>

          <!-- AICTE Official Logo -->
          <img :src="aicteLogo" alt="AICTE Emblem" class="gigw-aicte-logo" />

          <!-- Portal Title & Subtitles -->
          <div class="gigw-title-lockup">
            <div class="gigw-title-hi">अखिल भारतीय तकनीकी शिक्षा परिषद</div>
            <div class="gigw-title-en">All India Council for Technical Education</div>
            <h1 class="gigw-portal-name">Cross-Bureau Complaint Coordination System</h1>
            <div class="gigw-dept-name">Statutory Body under Ministry of Education, Government of India</div>
          </div>
        </div>

        <!-- Right Side: Officer / User Info & Sign Out -->
        <div class="gigw-brand-right">
          <template v-if="auth.isAuthenticated">
            <div class="gigw-user-badge">
              <div class="gigw-user-icon"><User :size="16" /></div>
              <div class="gigw-user-text">
                <strong class="gigw-user-name">{{ auth.user?.name || 'Official' }}</strong>
                <span class="gigw-user-role">
                  {{ auth.isSystemAdmin ? 'System Administrator' : (auth.isIndustry ? `${auth.user?.bureau_name || 'Bureau'} Official` : 'Complainant') }}
                </span>
              </div>
              <button
                type="button"
                class="gigw-logout-btn"
                title="Sign out of portal"
                aria-label="Sign out"
                @click="handleSignOut"
              >
                <LogOut :size="15" />
                <span>Sign Out</span>
              </button>
            </div>
          </template>
          <template v-else>
            <div class="gigw-auth-links">
              <router-link to="/login" class="gigw-login-btn">
                <span>Official / Citizen Sign In</span>
              </router-link>
            </div>
          </template>
        </div>
      </div>

      <!-- Government Tricolour Ribbon -->
      <div class="gigw-tricolour-ribbon" aria-hidden="true">
        <div class="stripe-saffron"></div>
        <div class="stripe-white"></div>
        <div class="stripe-green"></div>
      </div>
    </div>

    <!-- 3. Primary Government Navigation Bar (Formal Navy #002b49) -->
    <nav class="gigw-primary-nav" aria-label="Main Navigation">
      <div class="gigw-container gigw-nav-inner">
        <!-- Citizen Navigation -->
        <template v-if="auth.isUser">
          <router-link to="/user" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/user') }">
            <FileText :size="15" />
            <span>My Grievances</span>
          </router-link>
          <router-link to="/register" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/register') }">
            <PlusCircle :size="15" />
            <span>File New Complaint</span>
          </router-link>
          <router-link to="/track" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/track') }">
            <Search :size="15" />
            <span>Track Status</span>
          </router-link>
        </template>

        <!-- Bureau Official Navigation -->
        <template v-else-if="auth.isIndustry">
          <router-link to="/" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/') }">
            <LayoutDashboard :size="15" />
            <span>Casework Dashboard</span>
          </router-link>
          <router-link to="/complaints" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/complaints') }">
            <FileText :size="15" />
            <span>Complaints Register</span>
          </router-link>
          <router-link to="/overlaps" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/overlaps') }">
            <FileSearch :size="15" />
            <span>Overlap Verification</span>
          </router-link>
          <router-link to="/institutions" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/institutions') }">
            <Building2 :size="15" />
            <span>Institutions 360°</span>
          </router-link>
          <router-link to="/reports" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/reports') }">
            <BarChart3 :size="15" />
            <span>Reports</span>
          </router-link>
          <router-link to="/notifications" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/notifications') }">
            <Bell :size="15" />
            <span>Alerts</span>
            <span v-if="ui.unreadNotifications > 0" class="gigw-badge-dot"></span>
          </router-link>
          <router-link to="/imports" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/imports') }">
            <Database :size="15" />
            <span>Data Imports</span>
          </router-link>
        </template>

        <!-- System Administrator Navigation -->
        <template v-else-if="auth.isSystemAdmin">
          <router-link to="/" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/') }">
            <LayoutDashboard :size="15" />
            <span>System Dashboard</span>
          </router-link>
          <router-link to="/complaints" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/complaints') }">
            <FileText :size="15" />
            <span>Case Management</span>
          </router-link>
          <router-link to="/institutions" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/institutions') }">
            <Building2 :size="15" />
            <span>Institutions</span>
          </router-link>
          <router-link to="/overlaps" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/overlaps') }">
            <FileSearch :size="15" />
            <span>Cross-Bureau Overlaps</span>
          </router-link>
          <router-link to="/reports" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/reports') }">
            <BarChart3 :size="15" />
            <span>Reports & Exports</span>
          </router-link>
          <router-link to="/admin" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/admin') }">
            <Settings2 :size="15" />
            <span>Audit & Administration</span>
          </router-link>
        </template>

        <!-- Public / Unauthenticated Navigation -->
        <template v-else>
          <router-link to="/register" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/register') }">
            <PlusCircle :size="15" />
            <span>File New Complaint</span>
          </router-link>
          <router-link to="/track" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/track') }">
            <Search :size="15" />
            <span>Track Existing Complaint</span>
          </router-link>
          <router-link to="/login" class="gigw-nav-item" :class="{ 'gigw-nav-active': isActive('/login') }">
            <User :size="15" />
            <span>Official / Complainant Portal</span>
          </router-link>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.gigw-header {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #d2d6dc;
  font-family: 'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
}
.gigw-container {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* 1. Top Accessibility Strip */
.gigw-top-strip {
  background: #f0f2f5;
  border-bottom: 1px solid #e2e5e9;
  font-size: 12px;
  color: #334155;
  padding: 4px 0;
}
.gigw-top-strip-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.gigw-gov-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}
.gov-flag-emblem {
  font-size: 14px;
}
.gov-divider {
  color: #475569;
}
.gigw-top-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}
.gigw-skip-btn {
  color: #002b49;
  font-weight: 600;
  text-decoration: underline;
  padding: 2px 4px;
}
.gigw-skip-btn:focus {
  outline: 2px solid #002b49;
}
.gigw-tool-divider {
  color: #475569;
}
.gigw-font-controls {
  display: flex;
  align-items: center;
  gap: 3px;
}
.gigw-font-label {
  color: #334155;
  margin-right: 2px;
}
.font-ctrl-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  font-size: 12px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 2px;
  cursor: pointer;
  line-height: 1.2;
}
.font-ctrl-btn:hover {
  background: #e2e8f0;
}
.font-ctrl-btn.font-ctrl-active {
  background: #002b49;
  color: #ffffff;
  border-color: #002b49;
}
.gigw-lang-tag {
  font-weight: 600;
  color: #002b49;
}

/* 2. Main Official Branding Bar */
.gigw-brand-bar {
  background: #ffffff;
  position: relative;
}
.gigw-brand-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 1.25rem;
  gap: 16px;
}
.gigw-brand-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.gigw-emblem-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.gigw-brand-divider {
  width: 1px;
  height: 48px;
  background: #d2d6dc;
}
.gigw-aicte-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
}
.gigw-title-lockup {
  display: flex;
  flex-direction: column;
}
.gigw-title-hi {
  font-size: 12px;
  font-weight: 600;
  color: #002b49;
  line-height: 1.2;
}
.gigw-title-en {
  font-size: 12px;
  font-weight: 600;
  color: #002b49;
  letter-spacing: 0.02em;
}
.gigw-portal-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #002b49;
  margin: 1px 0 0 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.gigw-dept-name {
  font-size: 12px;
  color: #475569;
  margin-top: 1px;
}

.gigw-brand-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.gigw-user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 4px;
}
.gigw-user-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #002b49;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gigw-user-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.gigw-user-name {
  font-size: 12px;
  color: #0f172a;
}
.gigw-user-role {
  font-size: 12px;
  color: #475569;
}
.gigw-logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 6px;
}
.gigw-logout-btn:hover {
  background: #fef2f2;
  border-color: #f87171;
}

.gigw-login-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #002b49;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: 4px;
  text-decoration: none;
}
.gigw-login-btn:hover {
  background: #001f35;
}

/* Tricolour Ribbon */
.gigw-tricolour-ribbon {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.stripe-saffron {
  height: 3px;
  background: #ff9933;
}
.stripe-white {
  height: 2px;
  background: #ffffff;
}
.stripe-green {
  height: 3px;
  background: #138808;
}

/* 3. Primary Government Navigation Bar */
.gigw-primary-nav {
  background: #002b49;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
.gigw-nav-inner {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  white-space: nowrap;
}
.gigw-nav-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 14px;
  text-decoration: none;
  border-bottom: 3px solid transparent;
  transition: all 0.15s ease;
  position: relative;
}
.gigw-nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}
.gigw-nav-item.gigw-nav-active {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  border-bottom-color: #ff9933;
  font-weight: 600;
}
.gigw-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  position: absolute;
  top: 8px;
  right: 6px;
}

@media (max-width: 900px) {
  .gigw-title-hi, .gigw-dept-name {
    display: none;
  }
  .gigw-brand-inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .gigw-brand-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
