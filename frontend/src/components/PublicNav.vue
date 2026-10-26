<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ShieldCheck, FilePlus2, Search, LockKeyhole } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <header class="public-nav">
    <div class="public-nav-inner">
      <router-link to="/register" class="public-brand">
        <span class="public-brand-mark">
          <ShieldCheck :size="20" />
        </span>
        <div class="public-brand-text">
          <span class="public-brand-title"><strong>AICTE</strong> Grievance Portal</span>
          <span class="public-brand-subtitle">Public Citizen & Student Redressal</span>
        </div>
      </router-link>

      <nav class="public-nav-links">
        <router-link
          to="/register"
          class="public-nav-link"
          :class="{ 'public-nav-active': route.path === '/register' }"
        >
          <FilePlus2 :size="15" />
          <span>Register Grievance</span>
        </router-link>

        <router-link
          to="/track"
          class="public-nav-link"
          :class="{ 'public-nav-active': route.path === '/track' }"
        >
          <Search :size="15" />
          <span>Track Status</span>
        </router-link>

        <span class="public-nav-divider" />

        <router-link to="/login" class="public-staff-btn">
          <LockKeyhole :size="14" />
          <span>Casework Sign In</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>
