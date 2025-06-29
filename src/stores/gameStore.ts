import { INITIAL_TIME } from '@/constans/constans'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type GameStatus = 'waitingForStart' | 'inGame' | 'paused' | 'end'
export interface GameStats {
  time: number
  letters: string
  errors: number
}

export const useGameStore = defineStore('game', () => {
  const gameStatus = ref<GameStatus>('waitingForStart')
  const currentTime = ref(INITIAL_TIME)
  const words = ref<string[]>([])
  const errorCount = ref(0)
  const gamesStats = ref<GameStats[]>([])
  let timer: number | undefined

  const startTimer = () => {
    timer = setInterval(() => {
      if (currentTime.value > 0) {
        currentTime.value--
      }
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timer)
  }

  const incrementErrorCount = () => {
    errorCount.value++
  }

  const startGame = (text: string) => {
    console.log('START GAME')
    gameStatus.value = 'inGame'
    currentTime.value = INITIAL_TIME
    words.value = text.trim().split(' ')
    errorCount.value = 0
    startTimer()
  }

  const endGame = () => {
    console.log('END GAME')
    stopTimer()
    gamesStats.value.push({
      time: INITIAL_TIME - currentTime.value,
      letters: words.value.join(''),
      errors: errorCount.value,
    })
    gameStatus.value = 'end'
  }

  const resetGame = (text: string) => {
    console.log('RESET GAME')
    stopTimer()
    startGame(text)
  }

  const togglePause = () => {
    console.log('TOGGLE PAUSE')
    if (gameStatus.value === 'inGame') {
      gameStatus.value = 'paused'
      stopTimer()
    } else if (gameStatus.value === 'paused') {
      gameStatus.value = 'inGame'
      startTimer()
    }
  }

  return {
    // State
    gameStatus,
    currentTime,
    words,
    errorCount,
    gamesStats,

    // Actions
    incrementErrorCount,
    startGame,
    endGame,
    resetGame,
    togglePause,
  }
})
