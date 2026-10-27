<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 130"
    :width="width"
    :height="height"
    class="indian-emblem"
    aria-label="State Emblem of India"
    role="img"
  >
    <!-- Ashoka Lion Capital Stylized Vector Graphic -->
    <g fill="currentColor">
      <!-- Abacus Base -->
      <rect x="20" y="98" width="60" height="7" rx="1.5" />
      <rect x="15" y="106" width="70" height="4" rx="1" />
      
      <!-- Ashoka Chakra in Center of Abacus -->
      <circle cx="50" cy="101.5" r="4" fill="none" stroke="#ffffff" stroke-width="0.8" />
      <circle cx="50" cy="101.5" r="1" fill="#ffffff" />
      
      <!-- Three Visible Lions Silhouettes -->
      <!-- Center Lion Face & Mane -->
      <path d="M42 42 C42 30 58 30 58 42 C61 46 63 54 60 62 C57 70 54 78 55 96 L45 96 C46 78 43 70 40 62 C37 54 39 46 42 42 Z" />
      <!-- Left Lion Face & Mane -->
      <path d="M30 46 C24 38 36 32 40 40 C38 48 36 56 32 64 C30 70 32 78 35 96 L27 96 C25 80 24 68 26 58 C27 52 28 48 30 46 Z" />
      <!-- Right Lion Face & Mane -->
      <path d="M70 46 C76 38 64 32 60 40 C62 48 64 56 68 64 C70 70 68 78 65 96 L73 96 C75 80 76 68 74 58 C73 52 72 48 70 46 Z" />
      
      <!-- Crown Top -->
      <path d="M44 26 C47 22 53 22 56 26 C54 28 46 28 44 26 Z" />
      <circle cx="50" cy="21" r="2.5" />
      
      <!-- Motto: SATYAMEVA JAYATE in Devanagari script representation -->
      <text
        x="50"
        y="122"
        font-family="'Noto Sans', 'Arial', sans-serif"
        font-size="8"
        font-weight="700"
        text-anchor="middle"
        letter-spacing="0.5"
      >
        सत्यमेव जयते
      </text>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: number | string
  height?: number | string
}>(), {
  width: 42,
  height: 52
})
</script>

<style scoped>
.indian-emblem {
  display: inline-block;
  color: #1b365d;
  flex-shrink: 0;
}
</style>
