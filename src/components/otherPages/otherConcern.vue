<template>
  <div>
    <div class="content">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有您关注的人哦~" />
      </div>
      <div class="adou" v-for="item in userList" :key="item.id">
        <div class="adous">
          <img :src="item.advator == '' ? '/src/image/默认头像.jpg' : getIMG(item.advator)" alt="" class="adva" />
          <div class="abouto">
            <span class="username">{{ item.username }}</span>
            <span class="sign">{{ item.sign }}</span>
            <div class="bo">
              <span>{{ item.essayNum }} 文章 · </span>
              <span>{{ item.fans }} 粉丝</span>
            </div>
          </div>
        </div>
        <div class="guanzhu" v-show="item.id != myid">
          <el-button :type="myconcernList.indexOf(item.id)==-1? 'success' : 'danger'" plain @click="concernOrCancelConcern(item.id)">{{ myconcernList.indexOf(item.id)==-1? '关注ta' : '取消关注' }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElNotification,ElMessageBox } from 'element-plus'
import $http from '../../api'
import base from '../../api/base'
import Data from '../../globalResult/global'
type Info = {
  userid: number
  concernid: number
  p_id: number
  list: list
}

interface concernUser {
  userid: number
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
let myid = ref<number>(0)
let currentUserid = ref<number>(0)
let myconcernList = ref<number[]>([])

/**
 *
 * @param params 取消关注或者关注用户
 */
 const cancelOrConcernUsers = async (params: concernUser) => {
  let { data: res } = await $http.cancelOrConcernUser<Data<null>>(params)
  if (res.code === 200) {
    ElNotification({
      title: '提示',
      message: res.msg,
      type: 'success'
    })
    getMyConcernUsers(myid.value)
  }
}


const concernOrCancelConcern = (id: number) => {
  const userInfo: concernUser = {
    userid: myid.value,
    concernid: id
  }
  if(myconcernList.value.indexOf(id)!=-1){
    ElMessageBox.confirm('确认取消对该作者的关注吗', '提示', {
      confirmButtonText: '取消关注',
      cancelButtonText: '放弃操作',
      type: 'warning'
    })
      .then(() => {
        cancelOrConcernUsers(userInfo)
        myconcernList.value = myconcernList.value.filter(item=>item!=id)
      })
      .catch(() => {})
  }else{
    cancelOrConcernUsers(userInfo)
  }
}

/**
 *
 * @param userId 查询该作者关注的人的接口
 */
const getMyConcernUsers = async (userId: number) => {
  console.log(userId)
  let { data: res } = await $http.getMyConcernUser<Data<Info>>({ userId })
  if (res.code === 4001 && res.data != null) {
    if (userId == currentUserid.value) {
      console.log('这个用户关注的列表------------',res.data.list)
      loading.value = false
      userList.value = res.data.list
    }
    if(userId == myid.value){
      res.data.list.forEach(item=>{
        myconcernList.value.push(item.id)
      })
    }
  } else {
    loading.value = false
    userList.value = []
  }
  empty.value = userList.value.length == 0 ? true : false
}

const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
}

onMounted(() => {
  myid.value = JSON.parse(localStorage.getItem('user')!).userInfo.id
  currentUserid.value = JSON.parse(sessionStorage.getItem('users')!)
  getMyConcernUsers(currentUserid.value)
  getMyConcernUsers(myid.value)
})
</script>

<style scoped lang="less">
.content {
  .adou {
    display: flex;
    margin-top: 38px;
    justify-content: space-between;
    .adous {
      display: flex;
    }
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
      padding-right: 50px;
      padding-top: 20px;
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
