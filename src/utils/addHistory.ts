import Data from '../globalResult/global';
import $http from '../api';
interface HistoryInfo {
  userid: number
  browsed_user: number
  esaayid: number
}
const addHistory = async (addInfo: HistoryInfo) => {
  let { data : res } = await $http.addHistories<Data<null>>(addInfo)
    if(res.code === 1001 || res.code === 3001){
      console.log('添加历史记录')
    }
}

export default addHistory