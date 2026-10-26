<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen bg-[#e8efe0] dark:bg-[#161716] text-[#22261f] dark:text-[#e6eae2] flex flex-col transition-colors">
    <Navbar />
    <div class="flex flex-1">
      <Sidebar class="hidden md:flex flex-shrink-0" />
      <main class="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <router-view />
      </main>
    </div>
  </div>
</template>
