<template>
  <!-- GAME SECTION -->
  <section
    class="mx-auto w-full flex justify-center flex-col gap-4 p-4 border-primary border-4 rounded relative"
  >
    <!-- TIMER -->
    <div class="flex justify-between items-center absolute -top-4 px-6 bg-background">
      <time class="text-primary text-xl font-bold"
        >{{
          Math.floor(currentTime / 60)
            .toString()
            .padStart(2, '0')
        }}:{{ (currentTime % 60).toString().padStart(2, '0') }}</time
      >
      <!-- <div class="flex gap-4">
        <span class="text-green-600">Letras: {{ words.length }}</span>
        <span class="text-red-600">Errores: {{ errorCount }}</span> 
      </div> -->
    </div>

    <!-- TEXT TO TYPE -->
    <p class="text-2xl mx-auto mt-4 px-4 max-w-screen-xl text-justify flex flex-wrap gap-4">
      <span v-for="(word, wordIndex) in words" :key="wordIndex" class="word">
        <span
          v-for="(letter, letterIndex) in word"
          :key="letterIndex"
          :class="{
            letter: true,
            active:
              wordIndexValue === wordIndex &&
              (inputValue.length === letterIndex ||
                (inputValue.length === word.length &&
                  inputValue.length === letterIndex + 1 &&
                  inputValue !== word)),
            completed:
              wordIndexValue === wordIndex &&
              inputValue.length === letterIndex + 1 &&
              inputValue === word,
            success:
              wordIndexValue > wordIndex ||
              (wordIndexValue === wordIndex &&
                inputValue[letterIndex] &&
                inputValue[letterIndex] === letter),
            error:
              wordIndexValue === wordIndex &&
              inputValue[letterIndex] &&
              inputValue[letterIndex] !== letter,
          }"
          >{{ letter }}</span
        >
      </span>

      <br />
      <!-- <span
        v-for="(letter, letterIndex) in words"
        :key="letterIndex"
        :class="{
          active: inputValue.length === letterIndex,
          success: inputValue[letterIndex] && inputValue[letterIndex] === letter,
          error: inputValue[letterIndex] && inputValue[letterIndex] !== letter,
        }"
        >{{ letter }}</span
      > -->
    </p>

    <!-- INPUT -->
    <input
      type="text"
      ref="inputRef"
      class="absolute top-[-10rem] w-[1px] h-[1px]"
      v-model="input"
      @keydown="onKeyDown"
      @blur="pauseGame"
    />
  </section>

  <!-- PAUSE SECTION v-if="isPaused" -->
  <section
    v-if="isPaused"
    class="absolute inset-x-0 w-full h-1/2 flex flex-col items-center justify-center gap-4 bg-background/30 backdrop-blur-md text-secondary rounded-[2rem] z-60"
    @click="resumeGame"
  >
    <p class="text-3xl mx-auto whitespace-normal break-keep break-words text-justify tracking-wide">
      Juego en pausa.
    </p>
    <p
      class="text-4xl font-bold mx-auto whitespace-normal break-keep break-words text-justify tracking-wide"
    >
      Haz click para continuar
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { KEY_CODES_TO_IGNORE } from '@/constans/constans'
import { useGameStore, type GameStatus } from '@/stores/gameStore'

// VARIABLES
const input = ref('')
const wordIndex = ref(0)
const inputValue = computed(() => input.value)
const wordIndexValue = computed(() => wordIndex.value)
const inputRef = ref<HTMLInputElement | null>(null)
const gameStore = useGameStore()
const { startGame, endGame, setCurrentTime, pauseGame, resumeGame, incrementErrorCount } = gameStore
const words = computed(() => gameStore.words)
const currentTime = computed(() => gameStore.currentTime)
const errorCount = computed(() => gameStore.errorCount)
const { gameStatus } = storeToRefs(gameStore)
const isPaused = ref(false)
let interval: number

// LIFECYCLE
onMounted(() => {
  input.value = ''
  startGame()
})
onUnmounted(() => {
  clearTimeInterval()
})

// WATCHERS
watch(gameStatus, (value: GameStatus) => {
  console.log(value)
  if (value === 'inGame') {
    continueGame()
  }
  if (value === 'restart') {
    input.value = ''
    wordIndex.value = 0
    startGame()
  }
  if (value === 'paused') {
    isPaused.value = true
    clearTimeInterval()
  }
})

//FUNCTIONS
function continueGame(): void {
  isPaused.value = false
  inputRef.value?.focus()
  initTimeInterval()
}

function initTimeInterval(): void {
  interval = setInterval(() => {
    setCurrentTime(currentTime.value + 1)
  }, 1000)
}

function clearTimeInterval(): void {
  clearInterval(interval)
}

function onKeyDown(event: KeyboardEvent): void {
  // Ignore key events
  if (KEY_CODES_TO_IGNORE.includes(event.code)) {
    console.log('Ignoring key', event.key)
    event.preventDefault()
    return
  }

  // Ignore backspace when input and words are the same
  if (
    event.code === 'Backspace' &&
    input.value === words.value[wordIndex.value].slice(0, input.value.length)
  ) {
    event.preventDefault()
    return
  }

  // Manage typing
  if (!event.ctrlKey && !event.altKey && event.key.length === 1) {
    const currentIndex = input.value.length
    const expectedChar = words.value[wordIndex.value][currentIndex]
    console.log(
      `input value: ${input.value} | Expected char: ${expectedChar} | event.key: ${event.key} | Current index: ${currentIndex} | Current word: ${words.value[wordIndex.value]}, key iqual space: ${event.key === ' '}`,
    )

    // Manage space key
    if (
      expectedChar === undefined &&
      event.key === ' ' &&
      input.value === words.value[wordIndex.value]
    ) {
      input.value = ''
      wordIndex.value++
      event.preventDefault()
      return
    }

    // Manage last char error
    if (currentIndex === words.value[wordIndex.value].length && event.key !== expectedChar) {
      event.preventDefault()
      return
    }

    if (currentIndex === words.value.length - 1 && event.key === expectedChar) {
      endGame()
      return
    }

    if (event.key !== expectedChar) {
      incrementErrorCount()
    }
  }
}
</script>

<style scoped></style>
