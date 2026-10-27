<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, LockKeyhole, User, ShieldCheck, CheckCircle2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import GigwHeader from '@/components/GigwHeader.vue'
import GigwFooter from '@/components/GigwFooter.vue'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()
const email = ref('admin')
const password = ref('admin')

async function handleLogin() {
  const ok = await auth.login(email.value, password.value)
  if (ok) {
    ui.isDemoMode = false
    if (auth.isUser) {
      router.replace('/user')
    } else {
      const destination = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.replace(destination)
    }
  }
}

function chooseAccount(nextEmail: string, nextPassword: string) {
  email.value = nextEmail
  password.value = nextPassword
}

function enterDemo() {
  sessionStorage.setItem('casework_demo_mode', '1')
  ui.isDemoMode = true
  auth.token = 'dev_bypass_token'
  auth.user = { id: 1, name: 'System Administrator', email: 'admin@aicte.gov.in', role: 'admin', is_active: true }
  localStorage.setItem('aicte_token', 'dev_bypass_token')
  localStorage.setItem('aicte_user', JSON.stringify(auth.user))
  router.push('/?demo=1')
}
</script>

<template>
  <div class="login-page-wrapper">
    <GigwHeader />

    <main class="login-page-content" id="main-content">
      <div class="login-box-container">
        <!-- Security / Portal Notice -->
        <div class="login-auth-banner">
          <ShieldCheck :size="16" class="text-primary" />
          <span>Single Sign-On Authentication Service · AICTE Central Portal</span>
        </div>

        <div class="login-card">
          <div class="login-card-header">
            <h2 class="login-title">Sign In to Your Account</h2>
            <p class="login-subtitle [text-wrap:pretty]">
              Select your role or enter authorized credentials to access your designated dashboard.
            </p>
          </div>

          <div v-if="auth.error" class="login-error-alert" role="alert">
            {{ auth.error }}
          </div>

          <!-- Role Selection Quick-Fill Buttons -->
          <div class="role-selector-block">
            <span class="role-selector-label">Quick Demo Access (Select Role):</span>
            <div class="role-chips-grid">
              <button
                type="button"
                :class="['role-chip-btn', { 'role-chip-selected': email === 'admin' }]"
                @click="chooseAccount('admin', 'admin')"
              >
                <span class="role-chip-title">System Administrator</span>
                <span class="role-chip-creds">admin / admin</span>
              </button>

              <button
                type="button"
                :class="['role-chip-btn', { 'role-chip-selected': email === 'industry' }]"
                @click="chooseAccount('industry', 'industry')"
              >
                <span class="role-chip-title">Bureau Official</span>
                <span class="role-chip-creds">industry / industry</span>
              </button>

              <button
                type="button"
                :class="['role-chip-btn', { 'role-chip-selected': email === 'user' }]"
                @click="chooseAccount('user', 'user')"
              >
                <span class="role-chip-title">Public Complainant</span>
                <span class="role-chip-creds">user / user</span>
              </button>
            </div>
          </div>

          <!-- Login Form -->
          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label" for="login-email">User ID or Official Email Address</label>
              <div class="input-with-icon">
                <User :size="16" class="input-icon" aria-hidden="true" />
                <input
                  id="login-email"
                  v-model="email"
                  type="text"
                  autocomplete="username"
                  required
                  placeholder="e.g. admin or officer.pgrc@aicte.gov.in"
                  class="gov-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <div class="input-with-icon">
                <LockKeyhole :size="16" class="input-icon" aria-hidden="true" />
                <input
                  id="login-password"
                  v-model="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  placeholder="Enter your account password"
                  class="gov-input"
                />
              </div>
            </div>

            <button
              class="gov-submit-btn"
              type="submit"
              :disabled="auth.loading"
            >
              <span>{{ auth.loading ? 'Authenticating Credentials…' : 'Sign In to Portal' }}</span>
              <ArrowRight :size="16" />
            </button>
          </form>

          <div class="login-footer-actions">
            <button type="button" class="demo-mode-link" @click="enterDemo">
              Explore Demo Mode without Backend Authentication →
            </button>

            <div class="register-prompt">
              <span>Are you a student, parent or faculty member wishing to lodge a grievance?</span>
              <router-link to="/register" class="register-link">Register New Complaint</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>

    <GigwFooter />
  </div>
</template>

<style scoped>
.login-page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f6f8;
  font-family: 'DM Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
}
.login-page-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
}
.login-box-container {
  width: 100%;
  max-width: 520px;
}

.login-auth-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #e6f0fa;
  border: 1px solid #bfdbfe;
  color: #002b49;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.login-card {
  background: #ffffff;
  border: 1px solid #d2d6dc;
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.login-card-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}
.login-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #002b49;
  margin: 0;
}
.login-subtitle {
  font-size: 14px;
  color: #374151;
  margin-top: 4px;
  line-height: 1.5;
}

.login-error-alert {
  background: #fef2f2;
  border: 1px solid #f87171;
  color: #991b1b;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 4px;
  margin-bottom: 1.25rem;
}

.role-selector-block {
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}
.role-selector-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.role-chips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.role-chip-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  background: #ffffff;
  border: 1px solid #94a3b8;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  color: #0f172a;
  transition: all 0.15s ease;
}
.role-chip-btn:hover {
  border-color: #002b49;
  background: #f0f7ff;
}
.role-chip-btn.role-chip-selected {
  background: #002b49;
  border-color: #002b49;
  color: #ffffff;
}
.role-chip-title {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
}
.role-chip-creds {
  font-size: 12px;
  font-family: 'IBM Plex Mono', monospace;
  margin-top: 3px;
  color: #334155;
}
.role-chip-selected .role-chip-creds {
  color: #e0f2fe;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 10px;
  color: #6b7280;
  pointer-events: none;
}
.gov-input {
  width: 100%;
  padding: 9px 12px 9px 34px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
}
.gov-input:focus {
  outline: none;
  border-color: #002b49;
  box-shadow: 0 0 0 2px rgba(0, 43, 73, 0.15);
}

.gov-submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #002b49;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;
  transition: background 0.15s ease;
}
.gov-submit-btn:hover:not(:disabled) {
  background: #001f35;
}
.gov-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer-actions {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
}
.demo-mode-link {
  background: none;
  border: none;
  color: #002b49;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
.register-prompt {
  font-size: 12px;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.register-link {
  color: #002b49;
  font-weight: 700;
  text-decoration: underline;
}
</style>
