<template>
  <div>
    <div class="content">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有任何用户哦~" />
      </div>
      <div class="adou" v-for="ele in userList" :key="ele.id">
        <img :src="ele.advator== '' ? '/src/image/默认头像.jpg' : getIMG(ele.advator)" alt="" class="adva" />
        <div class="abouto">
          <span class="username">{{ ele.username }}</span>
          <span class="sign">{{ ele.sign }}</span>
          <div class="bo">
            <span>{{ ele.answerNum }} 回答 · </span>
            <span>{{ ele.essayNum }} 文章 · </span>
            <span>{{ ele.fans }} 关注者</span>
          </div>
        </div>
        <div class="guanzhu">
          <el-button :type="getType(ele.id)" @click="concernOrCancelConcern(ele.id,ele.username)">{{ Lists.indexOf(ele.id)==-1 ? '关注ta' : '取消关注' }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import $http from '../api'
import { ElNotification,ElMessageBox,ElMessage } from 'element-plus'
import Data from '../globalResult/global'
import base from '../api/base'
type Info = {
  userid: number
  concernid: number
  p_id: number
  list: list
  haveList: number[]
}
type list = {
  id: number
  username: string
  password: null
  phone: string
  sex: number
  email: null
  status: number
  image: string
  occupation: string
  sign: string
  advator: string
  about: ''
  province: string
  city: string
  account: null
  emailOrPhoneOraccount: null
  code: null
  answerNum: number
  essayNum: number
  fans: number
}[]
interface concernUser {
  userid: number,
  concernid: number
}
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
let userList = ref<list>([])
let currentUserid = ref<number>(0)
let Lists = ref<number[]>([])
/**
 *
 * @param userId 查询关注我的人的列表
 */
const getConcernMeUsers = async (userId: number) => {
  let { data: res } = await $http.getConcernMeUser<Data<Info>>({ userId })
  if (res.code === 4001) {
    console.log(res.data.list)
    loading.value = false
    userList.value = res.data.list
    Lists.value = res.data.haveList
  }
  res.data.list.forEach(ele=>{
    console.log(typeof ele.advator)
    console.log(ele.advator)
  })
  empty.value = userList.value.length == 0 ? true : false
}

/**
 * 
 * @param params 取消关注或者关注用户
 */
const cancelOrConcernUsers = async (params: concernUser) => {
  let { data : res } = await $http.cancelOrConcernUser<Data<null>>(params)
    if(res.code === 200){
      ElNotification({
        title: '提示',
        message: res.msg,
        type: 'success'
      })
      getConcernMeUsers(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    }
}


/**
 * 
 * @param userId 更新未读信息
 */
const updateConcernStatus = async (userId: number) => {
  let { data : res } = await $http.updateConcernStatus<Data<null>>({ userId })
    if(res.code === 3001){
      console.log('更新成功')
    }
}

const concernOrCancelConcern = (id: number,username: string) => {
  const user: concernUser = {
        userid: currentUserid.value,
        concernid: id
    }
  if(Lists.value.indexOf(id)!=-1){
    ElMessageBox.confirm(
    `确认取消对[${username}]的关注吗`,
    '警告',
    {
      confirmButtonText: '取消关注',
      cancelButtonText: '返回',
      type: 'warning',
    }
  )
    .then(() => {
      cancelOrConcernUsers(user)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
  }else{
    cancelOrConcernUsers(user)
  }
}

const getType = (id: number):string => {
  if(Lists.value.indexOf(id)!=-1){
    return 'danger'
  }
  return 'primary'
}

const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
}

onMounted(() => {
  currentUserid.value = JSON.parse(localStorage.getItem('user')!).userInfo.id
  getConcernMeUsers(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  updateConcernStatus(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.content {
  .adou {
    display: flex;
    margin-top: 38px;
    .adva {
      width: 60px;
      height: 60px;
      border-radius: 5px;
    }
    .abouto {
      display: flex;
      margin-top: -5px;
      flex-direction: column;
      line-height: 27px;
      margin-left: 16px;
      .username {
        font-weight: 600;
      }
      .username:hover {
        cursor: pointer;
        color: #175199;
      }
      .sign {
        color: #828282;
      }
      .bo {
        span {
          color: #8590a6;
          font-size: 14px;
        }
      }
    }
    .guanzhu {
      margin-left: 150px;
      height: 100%;
      margin-top: 15px;
    }
  }
  .sk {
    height: 100%;
    background-color: #ffffff;
    margin-top: 15px;
    padding: 20px 20px;
  }
}
</style>
