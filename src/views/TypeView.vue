<template>
  <!-- GAME SECTION -->
  <section
    class="mx-auto w-full flex justify-center flex-col gap-4 p-4 border-primary border-4 rounded relative"
  >
    <!-- TIMER -->
    <div class="flex justify-between items-center absolute -top-4 px-6 bg-background w-full">
      <time class="text-primary text-xl font-bold"
        >{{
          Math.floor(currentTime / 60)
            .toString()
            .padStart(2, '0')
        }}:{{ (currentTime % 60).toString().padStart(2, '0') }}</time
      >
      <!-- <div class="flex gap-4">
        <span class="text-red-600">Errores: {{ errorCount }}</span>
      </div> -->
    </div>

    <!-- TEXT TO TYPE -->
    <p
      v-if="gameStatus !== 'end'"
      class="text-2xl mx-auto mt-4 px-4 max-w-screen-xl text-justify flex flex-wrap gap-4"
    >
      <span v-for="(word, wIndex) in words" :key="wIndex" class="word">
        <span
          v-for="(letter, lIndex) in word"
          :key="lIndex"
          :class="getLetterClass(wIndex, lIndex, letter)"
          >{{ letter }}</span
        >
      </span>
    </p>

    <!-- END SCREEN -->
    <!-- <div v-if="gameStatus === 'end'" class="text-center p-8">
      <h2 class="text-3xl font-bold mb-4">¡Partida terminada!</h2>
      <button @click="restartGame" class="bg-primary text-white px-4 py-2 rounded">
        Jugar de nuevo
      </button>
    </div> -->

    <!-- INPUT -->
    <input
      type="text"
      ref="inputRef"
      class="absolute top-[-10rem] w-[1px] h-[1px]"
      v-model="currentInput"
      @keydown="onKeyDown"
      @blur="handleBlur"
    />
  </section>

  <!-- PAUSE SECTION     v-if="gameStatus === 'paused'"-->
  <section
    v-if="false"
    class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/30 backdrop-blur-md text-secondary rounded-[2rem] z-10"
    @click="togglePause"
  >
    <p class="text-3xl">Juego en pausa.</p>
    <p class="text-4xl font-bold">Haz click para continuar</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { KEY_CODES_TO_IGNORE } from '@/constans/constans'
import { TEXTS_TO_TYPE } from '@/constans/texts'
import { useGameStore } from '@/stores/gameStore'

// STORE
const gameStore = useGameStore()
const { startGame, endGame, togglePause, incrementErrorCount } = gameStore
const { gameStatus, words, currentTime, errorCount } = storeToRefs(gameStore)

// STATE
const currentInput = ref('')
const currentWordIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

// COMPUTED
const currentWord = computed(() => words.value[currentWordIndex.value] || '')

//LIFECYCLE
onMounted(() => {
  startGame(TEXTS_TO_TYPE[0])
  focusInput()
})

onUnmounted(() => {
  console.log('UNMOUNTED')
  if (gameStatus.value !== 'end') {
    endGame()
  }
})

// WATCHERS
watch(gameStatus, (newStatus) => {
  console.log('GAME STATUS', newStatus)
  if (newStatus === 'inGame') {
    focusInput()
  }
})

// METHODS
function getLetterClass(wordIndex: number, letterIndex: number, letter: string) {
  const isActive = wordIndex === currentWordIndex.value
  const isCurrentLetter = isActive && letterIndex === currentInput.value.length
  const isWordCompleted = currentInput.value === currentWord.value

  if (wordIndex > currentWordIndex.value) {
    return 'letter' // Word not yet typed
  }

  if (isActive) {
    if (isCurrentLetter) {
      return 'letter active'
    }
    if (currentInput.value.length === letterIndex + 1 && isWordCompleted) {
      return 'letter success completed'
    }
    if (letterIndex < currentInput.value.length) {
      return currentInput.value[letterIndex] === letter ? 'letter success' : 'letter error'
    }
  }

  if (wordIndex < currentWordIndex.value) {
    return 'letter success' // Word already typed correctly
  }

  return 'letter'
}

function handleBlur() {
  if (gameStatus.value === 'inGame') {
    togglePause()
  }
}

function focusInput() {
  inputRef.value?.focus()
}

function restartGame() {
  currentInput.value = ''
  currentWordIndex.value = 0
  startGame(TEXTS_TO_TYPE[1] || TEXTS_TO_TYPE[0]) // Start with another text if available
}

function onKeyDown(event: KeyboardEvent): void {
  if (gameStatus.value !== 'inGame') {
    event.preventDefault()
    return
  }

  // Ignore key codes
  if (KEY_CODES_TO_IGNORE.includes(event.code)) {
    event.preventDefault()
    return
  }

  // Handle Space
  if (event.code === 'Space') {
    event.preventDefault()
    if (currentInput.value === currentWord.value) {
      currentWordIndex.value++
      currentInput.value = ''
      if (currentWordIndex.value === words.value.length) {
        endGame()
      }
    }
    return
  }

  // Handle Backspace
  if (event.code === 'Backspace') {
    const currentLetter = currentWord.value[currentInput.value.length - 1]
    const typedLetter = currentInput.value[currentInput.value.length - 1]
    if (
      currentLetter === typedLetter &&
      currentInput.value === currentWord.value.slice(0, currentInput.value.length)
    ) {
      // Prevent deleting correct letters
      event.preventDefault()
    }
    return // Allow backspace only for correcting errors
  }

  // Handle character typing
  if (event.key.length === 1 && currentInput.value.length < currentWord.value.length) {
    const expectedChar = currentWord.value[currentInput.value.length]
    if (event.key !== expectedChar) {
      incrementErrorCount()
    }
  } else {
    event.preventDefault()
  }
}
</script>

<style scoped></style>
