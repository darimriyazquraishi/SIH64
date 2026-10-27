<script setup lang="ts">
import { useRoute } from 'vue-router'
import { FilePlus2, Search, LockKeyhole } from 'lucide-vue-next'
import aicteLogo from '@/assets/aicte-logo.png'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
</script>

<template>
  <header class="public-nav">
    <div class="public-nav-inner">
      <router-link to="/register" class="public-brand">
        <img :src="aicteLogo" alt="AICTE" class="public-nav-logo" />
        <div class="public-brand-text">
          <span class="public-brand-title"><strong>AICTE</strong> Complaint Portal</span>
          <span class="public-brand-subtitle">Student & Public Redressal Service</span>
        </div>
      </router-link>

      <nav class="public-nav-links" aria-label="Public portal navigation">
        <router-link
          to="/register"
          class="public-nav-link"
          :class="{ 'public-nav-active': route.path === '/register' }"
        >
          <FilePlus2 :size="15" />
          <span>Register Complaint</span>
        </router-link>

        <router-link
          to="/track"
          class="public-nav-link"
          :class="{ 'public-nav-active': route.path === '/track' }"
        >
          <Search :size="15" />
          <span>Track Complaint</span>
        </router-link>

        <ThemeToggle />

        <span class="public-nav-divider" />

        <router-link to="/login" class="public-staff-btn">
          <LockKeyhole :size="14" />
          <span>Official Sign In</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>
