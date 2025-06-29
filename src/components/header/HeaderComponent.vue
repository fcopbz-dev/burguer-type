<template>
  <!-- ========== HEADER ========== -->
  <header class="sticky top-0 inset-x-0 flex flex-wrap z-50 pt-16 w-full">
    <nav class="mx-auto relative w-[90%] flex space-between">
      <!-- ========== NAVBAR BUTTONS ========== -->
      <div
        id="hs-navbar-header-floating"
        class="inline-flex w-full flex-row justify-between gap-2 py-4 px-[10%] border-primary rounded border-4 border-b-4 border-r-4"
      >
        <button
          v-for="button in buttons"
          :key="button.text"
          @click="button.action"
          class="group inline-flex items-center gap-x-2 py-2 px-6 text-xl text-text font-bold cursor-pointer hover:transform hover:scale-120 transition-all duration-300"
        >
          {{ button.text }}
        </button>
      </div>
    </nav>

    <!-- Logo -->
    <RouterLink :to="{ name: routes.home }" class="absolute left-1/2 -translate-x-1/2 self-center">
      <img
        src="@/assets/img/logo-2.png"
        alt="Logo"
        class="w-40 h-40 bg-background rounded-full cursor-pointer hover:transform hover:scale-120 transition-all duration-800"
      />
    </RouterLink>
    <!-- End Logo -->
  </header>
  <!-- ========== END HEADER ========== -->
</template>

<script setup lang="ts">
import { TEXTS_TO_TYPE } from '@/constans/texts'
import { routes } from '@/router'
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const currentRouteName = computed(() => route.name)
const buttons = [
  {
    text: 'Jugar',
    route: routes.home,
    action: newGame,
  },
  {
    text: 'Historial',
    route: routes.charts,
    action: () => {},
  },
]

function newGame(): void {
  if (currentRouteName.value === routes.type) {
    gameStore.resetGame(TEXTS_TO_TYPE[0])
  } else {
    router.push({ name: routes.type })
  }
}
</script>

<style scoped></style>
