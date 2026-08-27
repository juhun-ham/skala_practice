import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  // Store가 보관하는 데이터
  state: () => ({
    unit: 'celsius',
    hotThreshold: 25,
  }),

  // state를 이용해 계산한 값
  getters: {
    unitSymbol: (state) => {
      return state.unit === 'celsius' ? '℃' : '℉'
    },

    hotThresholdLabel: (state) => {
      if (state.unit === 'fahrenheit') {
        const fahrenheit = Math.round((state.hotThreshold * 9) / 5 + 32)

        return `${fahrenheit}℉`
      }

      return `${state.hotThreshold}℃`
    },
  },

  // state를 변경하는 함수
  actions: {
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },
    increaseHotThreshold() {
      this.hotThreshold++
    },

    decreaseHotThreshold() {
      this.hotThreshold--
    },
  },
})
