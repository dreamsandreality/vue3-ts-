import {defineStore} from 'pinia'
import useUserStore from './modules/user'
export const useMain = defineStore('main', {
  state: () => {
    return {
      user: useUserStore()
    }
  },
  getters: {

  },
  actions: {

  }
})
