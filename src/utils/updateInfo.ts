import $http from '/src/api/index.ts'
// import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
// const router = useRouter()
type updates = {
  username: string,
  password: string,
  phone: string,
  sex: number,
  email: string,
  status: number,
  image: string,
  occupation: string,
  sign: string,
  advator: string,
  about: string,
  province: string,
  city: string,
  account: string
}
interface info{
  code: number,
  msg: string,
  data: null
}
 
 /**
  * 
  * @param data 修改个人信息接口
  */

 export const updateInfos = async (datas: updates) => {
  console.log(datas.city)
  datas.sex = Number(datas.sex)
  let { data : res } = await $http.updateOrSave<info>(datas)
  if(res.code === 1001 || res.code === 3001){
    ElNotification({
      title: 'Success',
      message: res.msg,
      type: 'success',
    })
    const timeController = setTimeout(()=>{
     location.reload()
      clearTimeout(timeController)
     },800)
    return
  }
  ElMessage.error(res.msg)
 }