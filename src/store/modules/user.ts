import { defineStore } from 'pinia'
type Infomation = {
  id: number,
  username: string,
  advator: string
}
const useUserStore = defineStore('user',{
  state: () => {
    return {
      userInfo: {
        id: 0,
        username: '',
        advator: ''
      }
    }
  },
  actions: {
    saveInfo(playload: Infomation){
      this.userInfo = {
        id: playload.id,
        username: playload.username,
        advator: playload.advator
      }
      // console.log(this.userInfo)
    },
    clearData(){
      this.userInfo = {
        id: 0,
        username: '',
        advator: ''
      }
    }
  },
  persist: true
})
export default useUserStore