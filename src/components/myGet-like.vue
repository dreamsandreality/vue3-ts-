<template>
  <div class="box">
    <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="empty" v-show="empty">
          <el-empty description="没有任何收到的赞哦~" />
        </div>
    <div class="alls" v-for="item in infoArr" :key="item.id">
      <div class="tops">
        <img :src="item.user.advator== '' ? '/src/image/默认头像.jpg' : getIMG(item.user.advator)" alt="" class="img_adv" />&nbsp;
        <span class="user" @click="toUser">{{ item.user.username }}&nbsp;&nbsp;</span>
        <span>点赞了你的文章</span>
      </div>
      <div class="centers">
        <span>{{ item.time }}</span>
      </div>
      <div class="hbox">
        <div class="rtop">
          <span class="title" @click="toWatchEssay(item.essay.id,item.user.id)">{{ item.essay.title }}</span>
        </div>
        <div class="essayC">
          <div class="left">
            <span class="text">
              {{ item.essay.mdcontent }}
            </span>
          </div>
          <div class="right">
            <img :src="getIMG(item.essay.cover)" alt="" class="img" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router'
import $http from '../api';
import Data from '../globalResult/global';
import moment from 'moment';
import base from '../api/base';

type ResponseEssayData = {
    id: number
    title: string
    userid: number
    updatetime: string
    topicid: number
    hcontent: string
    mdcontent: string
    status: number
    cover: string
    views: number
    columnid: number
    nav_id: number
    top: number
    content: null
  }

type ResponseUserData = {
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
    about: string
    province: string
    city: string
    account: null
  }

type ResponseData = {
  id: number
  userid: number
  essayid: number
  commentid: number
  status: number
  time: string
  belikeuserid: number
  todayData: number
  yestodayData: number
  user: ResponseUserData
  essay: ResponseEssayData
}[]

interface HistoryInfo {
  userid: number
  browsed_user: number
  esaayid: number
}

const router = useRouter()
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
const infoArr = ref<ResponseData>([])

/**
 * 
 * @param userId 查询我收到的点赞的信息
 */
const getLikeMeInfo = async (userId: number) => {
  let { data: res } = await $http.searchMyGetLike<Data<ResponseData>>({ userId })
    if(res.code === 4001){
      loading.value = false
      infoArr.value = res.data.map(item=>{
        item.time = moment(item.time).format("YYYY-MM-DD")
        return item
      })
    }
    empty.value = infoArr.value.length == 0 ? true : false
}

const getIMG = (img: string):string => {
  return `/api${base.imgUrl}?name=${img}`
}

const toUser = () => {
  router.push('/mine')
}


/**
 * 
 * @param addInfo 添加历史记录
 */

 const addHistory = async (addInfo: HistoryInfo) => {
  let { data : res } = await $http.addHistories<Data<null>>(addInfo)
    if(res.code === 1001 || res.code === 3001){
      console.log('添加历史记录')
    }
}

/**
 * 
 * @param id 更新点赞的未读状态
 * @param userid 
 */

 const updateInfo = async (userId: number) => {
  await $http.updateLikeInfoStatus<Data<null>>({ userId })
 }
 
const toWatchEssay = (id: number,userid: number) => {
  router.push({
    name: 'aboutEssay-index',
    params: {
      id: id,
      userid: userid
    }
  })
  const addHistoryInfo: HistoryInfo = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    browsed_user: userid,
    esaayid: id
  }
  addHistory(addHistoryInfo)
}

onMounted(() => {
  getLikeMeInfo(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  updateInfo(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.box {
  background: #ffffff;
  width: 580px;
  padding-left: 20px;
  padding-bottom: 10px;
  .alls {
    display: flex;
    flex-direction: column;
    .tops {
      display: flex;
      .img_adv {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .user {
        color: black;
        font-weight: 600;
      }
      .user:hover {
        color: #175199;
        cursor: pointer;
      }
    }
    .centers {
      display: flex;
      span {
        margin-left: 35px;
        margin-top: -10px;
        font-size: 13px;
        color: #8590a6;
      }
    }
    .hbox {
      display: flex;
      flex-direction: column;
      margin-left: 33px;
      margin-top: -5px;
      .rtop {
        display: flex;
        .title {
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }
        .eo {
          margin-left: 20px;
          margin-top: 5px;
        }
      }

      .title:hover {
        color: #175199;
      }
      .essayC {
        color: #8590a6;
        font-size: 14px;
        display: flex;
        .left {
          width: 70%;
          height: 80px;
          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
        .right {
          margin-left: 20px;
          margin-top: 8px;
          .img {
            width: 120px;
            height: 80px;
          }
        }
      }
    }
  }
  .sk {
      // width: 100%;
      height: 100%;
      background-color: #ffffff;
      margin-top: 15px;
      padding: 20px 20px;
    }
}
</style>
