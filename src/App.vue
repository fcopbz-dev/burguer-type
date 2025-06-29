<template>
  <HeaderComponent />
  <section class="mx-auto w-4/5 h-1/2 mt-20 flex items-center">
    <RouterView />
  </section>
</template>

<script setup lang="ts">
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import { RouterView } from 'vue-router'
</script>
