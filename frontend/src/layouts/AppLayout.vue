<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="h-screen flex overflow-hidden bg-slate-100 dark:bg-[#121212] text-slate-900 dark:text-[#cccccc]">
    <!-- Demostack Sidebar -->
    <Sidebar class="w-64 flex-shrink-0 hidden md:flex" />

    <!-- Main Demostack Column -->
    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <!-- Demostack Topbar -->
      <div class="sticky top-0 z-40 w-full shrink-0">
        <Navbar />
      </div>

      <!-- Demostack Scrollable Canvas -->
      <div class="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#1e1e1e] p-4 sm:p-6 lg:p-8">
        <router-view />
      </div>
    </main>
  </div>
</template>
