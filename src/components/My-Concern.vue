<template>
  <div>
    <div class="content">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有您关注的人哦~" />
      </div>
      <div class="adou" v-for="ele in userList" :key="ele.id">
        <img :src="ele.advator == '' ? '/src/image/默认头像.jpg' : getIMG(ele.advator)" alt="" class="adva" />
        <div class="abouto">
          <span class="username">{{ ele.username }}</span>
          <span class="sign">{{ ele.sign }}</span>
          <div class="bo">
            <span>{{ ele.essayNum }} 文章 · </span>
            <span>{{ ele.fans }} 粉丝</span>
          </div>
        </div>
        <div class="guanzhu">
          <el-button type="danger" :icon="Check" @click="cancle(ele.id, ele.username)" plain>已关注</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { getCurrentInstance, onMounted, ref } from 'vue'
import $http from '../api'
import Data from '../globalResult/global'
import base from '../api/base'
// import { ElMessageBox } from 'element-plus'
const _confirm = getCurrentInstance()!.appContext.config.globalProperties.$confirm
const _message = getCurrentInstance()!.appContext.config.globalProperties._message
type Info = {
  userid: number
  concernid: number
  p_id: number
  list: list
}

interface concernUser {
  userid: number,
  concernid: number
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
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
let userList = ref<list>([])


/**
 * 
 * @param userId 查询我关注的人的接口
 */
const getMyConcernUsers = async (userId: number) => {
  let { data: res } = await $http.getMyConcernUser<Data<Info>>({ userId })
  if (res.code === 4001 && res.data!=null) {
    loading.value = false
    userList.value = res.data.list
  }else{
    loading.value = false
    userList.value.length = 0
  }
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
      getMyConcernUsers(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    }
}

const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
}

const cancle = (userId: number, username: string) => {
  const user: concernUser = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    concernid: userId
  }
  _confirm(`确认取消对 [${username}] 的关注吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      cancelOrConcernUsers(user)
    })
    .catch(() => {
      _message({
        type: 'info',
        message: '取消操作'
      })
    })
}

onMounted(() => {
  getMyConcernUsers(JSON.parse(localStorage.getItem('user')!).userInfo.id)
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
