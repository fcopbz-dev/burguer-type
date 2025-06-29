<template>
  <section class="mx-auto max-w-screen-xl flex items-center">
    <div class="mx-auto max-w-screen-xl text-center">
      <p class="pl-4 text-6xl text-start text-primary font-bold">Unas</p>
      <p class="my-4 px-4 h-18 w-fit text-6xl text-end text-background font-bold bg-primary">
        Hamburguesitas
      </p>
      <p class="pl-4 text-6xl text-start text-primary font-bold">O que ???</p>

      <div class="mt-20 flex gap-8 items-center">
        <p class="mx-auto mt-4 text-xl text-start font-bold">
          Un test de mecanografía para medir la velocidad y precisión de escritura. Con un diseño
          unico y divertido. Prepara tus manos y empieza a escribir.
        </p>
        <button
          class="rounded border-primary border-4 px-12 h-16 text-lg font-bold bg-primary text-background cursor-pointer"
        >
          <RouterLink to="/type"> Empezar </RouterLink>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped></style>
