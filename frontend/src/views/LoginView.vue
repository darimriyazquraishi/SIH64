<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ArrowUpRight, LockKeyhole, User, ShieldCheck } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'

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
    const destination = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(destination)
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
  <main class="login-page">
    <aside class="login-side">
      <div class="login-brand">
        <span class="login-brand-mark"><ShieldCheck :size="22" /></span>
        <div class="login-brand-text">
          <strong>AICTE Casework</strong>
          <small>Grievance Coordination</small>
        </div>
      </div>

      <div class="login-side-main">
        <h1>Centralized grievance monitoring</h1>
        <p class="login-side-description">
          Review complaints, monitor statutory deadlines, and coordinate case outcomes across AICTE central bureaus.
        </p>

        <div class="login-features-list">
          <div class="feature-item">
            <span class="feature-dot" />
            <span>Cross-bureau correlation & overlap review</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot" />
            <span>Statutory timeline & escalation tracking</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot" />
            <span>Direct public citizen registration & tracking</span>
          </div>
        </div>
      </div>

      <div class="login-side-footer">
        <span>Smart India Hackathon 2026</span>
        <span>AICTE Portal</span>
      </div>
    </aside>

    <section class="login-main">
      <div class="login-main-top">
        <span class="authorized-badge">Authorized casework access</span>
        <router-link to="/register" class="public-portal-top-link">
          Public grievance portal <ArrowUpRight :size="13" />
        </router-link>
      </div>

      <div class="login-form-wrap">
        <div class="login-heading">
          <h2>Sign in</h2>
          <p class="login-subtitle">Enter your official credentials to access the workspace.</p>
        </div>

        <div v-if="auth.error" class="login-error" role="alert">{{ auth.error }}</div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-field">
            <label class="field-label" for="login-email">User ID or email</label>
            <div class="login-input-wrap">
              <User :size="16" />
              <input
                id="login-email"
                v-model="email"
                type="text"
                autocomplete="username"
                required
                placeholder="User ID or email"
              />
            </div>
          </div>

          <div class="form-field mt-3">
            <label class="field-label" for="login-password">Password</label>
            <div class="login-input-wrap">
              <LockKeyhole :size="16" />
              <input
                id="login-password"
                v-model="password"
                type="password"
                autocomplete="current-password"
                required
                placeholder="Password"
              />
            </div>
          </div>

          <button class="button button-primary login-submit" type="submit" :disabled="auth.loading">
            <span>{{ auth.loading ? 'Signing in…' : 'Sign in' }}</span>
            <ArrowRight :size="15" />
          </button>
        </form>

        <!-- Compact quick-fill chips -->
        <div class="login-quick-section">
          <div class="quick-title-row">
            <span>Quick fill:</span>
            <div class="quick-chips">
              <button
                type="button"
                :class="['quick-chip', { 'quick-chip-active': email === 'admin' }]"
                @click="chooseAccount('admin', 'admin')"
              >
                Admin
              </button>
              <button
                type="button"
                :class="['quick-chip', { 'quick-chip-active': email === 'authority' }]"
                @click="chooseAccount('authority', 'authority')"
              >
                Authority
              </button>
              <button
                type="button"
                :class="['quick-chip', { 'quick-chip-active': email === 'user' }]"
                @click="chooseAccount('user', 'user')"
              >
                Caseworker
              </button>
            </div>
          </div>
        </div>

        <div class="login-alt-actions">
          <button type="button" class="demo-link-btn" @click="enterDemo">
            Explore demo workspace without login →
          </button>

          <div class="citizen-switch-line">
            <span>Filing a student or public complaint?</span>
            <router-link to="/register">Register here</router-link>
          </div>
        </div>
      </div>

      <footer class="login-footer">
        <span>AICTE Complaint Monitoring & Coordination Portal</span>
        <span>SIH 2026</span>
      </footer>
    </section>
  </main>
</template>
