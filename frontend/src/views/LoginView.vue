<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ArrowUpRight, LockKeyhole, Mail, ShieldCheck, FileText, GitCompare, Search, CheckCircle2 } from 'lucide-vue-next'
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
      <div class="login-brand"><span class="login-brand-mark"><ShieldCheck :size="23" /></span><span><strong>casework<span>.</span></strong><small>AICTE monitoring</small></span></div>
      <div class="login-side-main">
        <h1>One institution.<br />Every case in view.</h1>
        <p class="login-side-description">Bring complaint histories, statutory deadlines and related cases into one working record across central AICTE bureaus.</p>
        <div class="login-preview">
          <div class="login-preview-head"><span>CASE REGISTER</span><span><i></i> CROSS-BUREAU</span></div>
          <div class="login-preview-row"><span class="login-preview-icon"><FileText :size="15" /></span><div><strong>AICTE-26-PGRC-0101</strong><small>Admission fee complaint</small></div><span class="preview-status preview-status-warn">Review</span></div>
          <div class="login-preview-connector"><span></span><small>Possible relationship detected</small></div>
          <div class="login-preview-row"><span class="login-preview-icon"><GitCompare :size="15" /></span><div><strong>AICTE-26-AB-0102</strong><small>Fee schedule review</small></div><span class="preview-status">Compare</span></div>
          <div class="login-preview-foot"><CheckCircle2 :size="14" /><span>Records remain separate until reviewed</span></div>
        </div>
      </div>
      <div class="login-side-footer"><span>Smart India Hackathon 2026</span><span>Problem statement 26264</span></div>
    </aside>
    <section class="login-main">
      <div class="login-main-top">
        <span>Authorized personnel</span>
        <router-link to="/register" class="public-portal-top-link">
          Citizen / Student Portal <ArrowUpRight :size="13" />
        </router-link>
      </div>
      <div class="login-form-wrap">
        <div class="login-heading">
          <div class="login-title-row">
            <ShieldCheck :size="22" class="login-title-icon" />
            <h2>Sign in to Casework</h2>
          </div>
          <p class="login-subtitle">Use your official credentials to access the monitoring workspace.</p>
        </div>
        <div class="login-public-banner">
          <div class="public-banner-copy">
            <strong>Public Citizen or Student?</strong>
            <span>Register or track a grievance without an internal staff account.</span>
          </div>
          <router-link to="/register" class="button button-quiet button-small">
            Register Grievance <ArrowRight :size="13" />
          </router-link>
        </div>
        <div v-if="auth.error" class="login-error" role="alert">{{ auth.error }}</div>
        <form class="login-form" @submit.prevent="handleLogin">
          <label class="field-label" for="login-email">User ID or Official Email</label>
          <div class="login-input-wrap">
            <Mail :size="17" />
            <input id="login-email" v-model="email" type="text" autocomplete="username" required placeholder="admin or admin@aicte.gov.in" />
          </div>
          <label class="field-label" for="login-password">Password</label>
          <div class="login-input-wrap">
            <LockKeyhole :size="17" />
            <input id="login-password" v-model="password" type="password" autocomplete="current-password" required placeholder="admin" />
          </div>
          <button class="button button-primary login-submit" type="submit" :disabled="auth.loading">
            {{ auth.loading ? 'Signing in…' : 'Sign in' }} <ArrowRight :size="16" />
          </button>
        </form>
        <div class="login-divider"><span></span><small>OR USE A TEST ACCOUNT</small><span></span></div>
        <div class="login-demo-accounts">
          <button type="button" @click="chooseAccount('admin', 'admin')">
            <span class="demo-account-icon"><ShieldCheck :size="16" /></span>
            <span><strong>System administrator</strong><small>User ID: admin · Password: admin</small></span>
            <ArrowUpRight :size="15" />
          </button>
          <button type="button" @click="chooseAccount('officer.pgrc@aicte.gov.in', 'Officer@12345')">
            <span class="demo-account-icon"><FileText :size="16" /></span>
            <span><strong>PGRC officer</strong><small>Grievance casework</small></span>
            <ArrowUpRight :size="15" />
          </button>
          <button type="button" @click="chooseAccount('director.monitoring@aicte.gov.in', 'Director@12345')">
            <span class="demo-account-icon"><Search :size="16" /></span>
            <span><strong>Senior authority</strong><small>Monitoring and reports</small></span>
            <ArrowUpRight :size="15" />
          </button>
        </div>
        <button class="button button-quiet login-local-demo" type="button" @click="enterDemo">Explore local demonstration <ArrowRight :size="15" /></button>
        <p class="login-disclaimer">Fictional demonstration data only. This prototype is not connected to live AICTE systems.</p>
      </div>
      <footer class="login-footer"><span>AICTE Complaint Monitoring & Coordination Portal</span><span>Prototype · 2026</span></footer>
    </section>
  </main>
</template>
