<script setup lang="ts">
import { computed, type Component } from 'vue'
import { ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  value: number | string
  subtitle?: string
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
  loading?: boolean
  icon?: Component
  iconColor?: string
  iconBg?: string
  actionLabel?: string
  actionRoute?: string
}>()

const valueColor = computed(() => {
  switch (props.variant) {
    case 'danger':
      return 'text-red-700 dark:text-[#f48771]'
    case 'warning':
      return 'text-amber-700 dark:text-[#cca700]'
    case 'success':
      return 'text-emerald-700 dark:text-[#34d399]'
    case 'info':
      return 'text-blue-700 dark:text-[#4fc1ff]'
    default:
      return 'text-[#22261f] dark:text-white'
  }
})
</script>

<template>
  <div
    class="bg-white dark:bg-[#1e201d] rounded-xl border border-[#dfe7d6] dark:border-[#2f332b] p-3.5 transition-all duration-150 hover:border-[#c5d4bc] dark:hover:border-[#3d4337] shadow-sm flex flex-col justify-between"
  >
    <div>
      <div class="flex items-center justify-between">
        <p class="text-xs font-medium text-[#5f6656] dark:text-[#989898]">
          {{ props.title }}
        </p>
        <div
          v-if="props.icon"
          :class="[
            'flex size-7 items-center justify-center rounded-lg border',
            props.iconBg || 'bg-[#f0f5e8] dark:bg-[#1e2518] border-[#dfe7d6] dark:border-[#2f3d20]',
            props.iconColor || 'text-[#5e9a2e] dark:text-[#b8ee82]',
          ]"
        >
          <component :is="props.icon" class="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <slot name="icon" />
      </div>

      <div class="mt-2 flex items-baseline gap-2">
        <div v-if="props.loading" class="h-8 w-16 animate-pulse rounded bg-[#e8efe0] dark:bg-[#252922]" />
        <span v-else :class="['text-2xl font-bold tracking-tight tabular-nums', valueColor]">
          {{ props.value }}
        </span>
      </div>

      <p v-if="props.subtitle" class="mt-1 text-xs text-[#5f6656] dark:text-[#989898]">
        {{ props.subtitle }}
      </p>
    </div>

    <!-- Bottom Action Link (Optional) -->
    <div v-if="props.actionLabel && props.actionRoute" class="mt-3 pt-2 border-t border-[#edf3e6] dark:border-[#282c24]">
      <router-link
        :to="props.actionRoute"
        class="inline-flex items-center gap-1 text-xs font-semibold text-[#5e9a2e] dark:text-[#b8ee82] hover:text-[#457321] dark:hover:text-[#cbf59b] transition-colors"
      >
        <span>{{ props.actionLabel }}</span>
        <ArrowRight class="w-3 h-3" aria-hidden="true" />
      </router-link>
    </div>
  </div>
</template>
