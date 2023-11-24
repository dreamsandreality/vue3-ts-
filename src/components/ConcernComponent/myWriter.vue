<template>
  <div class="box">
    <div class="text">
      <div class="ti">
        <h3>我关注的作者</h3>
        <el-input
      v-model="input2"
      class="w-50 m-2"
      placeholder="输入用户名"
      :suffix-icon="Search"
      @keyup.enter.native="toSearch"
    />
    <el-button type="primary" :icon="Search" class="searchBtn" @click="toSearch">搜索</el-button>
      </div>
      <el-divider class="driver"/>
     <div class="zwT">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有您关注的人哦~" />
      </div>
      <div class="zw" v-for="ele in userList" :key="ele.id">
      <div class="left">
        <div class="info">
        <img :src="ele.advator == '' ? '/src/image/默认头像.jpg' : getIMG(ele.advator)" alt="" style="width: 45px; height: 45px; border-radius: 50%;margin-left: 20px">
        <div class="user">
          <span class="username">{{ ele.username }}</span>
          <div class="xx">
            <span>{{ ele.essayNum }}篇优质文章</span>
            <span> · {{ ele.columnNum }}个专栏</span>
            <span> · {{ ele.problemNum }}个提问</span>
          </div>
        </div>
      </div>
      </div>
      <div class="right">
        <el-button type="danger" plain class="btn" @click="cancelConcern(ele.id)">取消关注</el-button>
      </div>
     </div>
     </div>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import $http from '../../api';
import Data from '../../globalResult/global';
import { ElMessageBox,ElNotification } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import base from '../../api/base';
interface concernUser {
  userid: number,
  concernid: number
}
type Info = {
  userid: number
  concernid: number
  p_id: number
  list: list
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
  problemNum: number
  columnNum: number
}[]
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
let userList = ref<list>([])
let input2 = ref<string>('')
const cancelConcern = (id: number) => {
  const userinfo: concernUser = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    concernid: id
  }
  ElMessageBox.confirm(
    '确认取消关注该作者吗?',
    '提示',
    {
      confirmButtonText: '取消关注',
      cancelButtonText: '放弃取消',
      type: 'warning',
    }
  )
    .then(() => {
      cancelOrConcernUsers(userinfo)
    })
    .catch(() => {
    })
}


const toSearch = () => {
  userList.value = userList.value.filter(item=> {
    if(item.username.indexOf(input2.value)!=-1){
      return item
    }
  })
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

onMounted(()=>{
  getMyConcernUsers(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})

</script>

<style lang="less" scoped>
.box{
  .text{
    .ti{
      padding-top: 20px;
      display: flex;
      align-items: center;
      .w-50{
        width: 30%;
        margin-left: 250px;
      }
      .searchBtn{
        margin-left: 10px;
      }
    }
    .driver{
      margin-top: 10px;
    }
    .zwT{
      margin-top: -10px;
      margin-left: -17px;
    }
    .zw{
      display: flex;
      line-height: 25px;
      margin-top: 20px;
      .left{
        display: flex;
        width: 80%;
        .info{
      display: flex;
      .user{
        display: flex;
        flex-direction: column;
        .username{
        margin-left: 22px;
        font-weight: 600;
      }
      .username:hover{
        cursor: pointer;
        color: #1e80ff;
      }
      .xx{
        margin-left: 22px;
        span{
          color: #8590a6;
          font-size: 13px;
        }
      }
      }
      
    }
      }
      .right{
        margin-top: 10px;
        margin-left: 40px;
      }
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