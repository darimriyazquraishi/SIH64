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
          <span class="public-brand-title"><strong>AICTE</strong> grievance portal</span>
          <span class="public-brand-subtitle">Public citizen & student redressal</span>
        </div>
      </router-link>

      <nav class="public-nav-links">
        <router-link
          to="/register"
          class="public-nav-link"
          :class="{ 'public-nav-active': route.path === '/register' }"
        >
          <FilePlus2 :size="15" />
          <span>Register grievance</span>
        </router-link>

        <router-link
          to="/track"
          class="public-nav-link"
          :class="{ 'public-nav-active': route.path === '/track' }"
        >
          <Search :size="15" />
          <span>Track status</span>
        </router-link>

        <span class="public-nav-divider" />

        <router-link to="/login" class="public-staff-btn">
          <LockKeyhole :size="14" />
          <span>Casework sign in</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>
