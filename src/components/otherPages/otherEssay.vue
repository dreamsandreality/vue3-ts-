<template>
  <div class="box">
    <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有任何文章哦~" />
      </div>
    <div class="item" v-for="item in myEssays" :key="item.id">
      <div class="right">
        <span style="font-weight: 600;" class="title" @click="toWatch(item.id,item.userid)">{{ item.title }}</span>
        <el-row class="w-150px mb-2">
          <el-text truncated>{{ item.mdcontent }}</el-text>
        </el-row>
        <div class="bottom">
          <span>{{ item.updatetime }}</span>
        <el-divider direction="vertical" style="margin-top: 3px;"/>
          <span class="iconfont icon-yanjing"></span>
          <span style="margin-left: 5px;">{{ item.views }}</span>
          <span class="iconfont icon-good" style="margin-left: 15px;"></span>
          <span style="margin-left: 5px;">{{ item.likeNum }}</span>
          <span class="iconfont icon-pinglun" style="margin-left: 15px;"></span>
          <span style="margin-left: 5px;">{{ item.comment_num }}</span>
        </div>
      </div>
      <div class="left">
        <img :src="getIMG(item.cover)" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Data from '../../globalResult/global';
import $http from '../../api';
import moment from 'moment';
import base from '../../api/base';
import addHistory from '../../utils/addHistory.ts'
type records = {
  countId: null
  current: number
  maxLimit: null
  optimizeCountSql: boolean
  orders: []
  pages: number
  records: Essay
  searchCount: boolean
  size: number
  total: number
}
type Essay = {
  id: number
  topicName: string
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
  content: string
  title: string
  userName: string
  about: string
  essay_num: number
  column_num: number
  fans_num: number
  likeNum: number
  comment_num: number
  collect_num: number
  allNums: number
}[]

interface HistoryInfo {
  userid: number
  browsed_user: number
  esaayid: number
}

let currentUserid = ref<number>(0)
const myEssays = ref<Essay>([])
const router = useRouter()
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)

/**
 *
 * @param userId 请求文章接口
 * @param pageNum
 * @param pageSize
 */
 const getEssayOfDraft = async (userId: number, pageNum: number, pageSize: number, status?: number) => {
  let { data: res } = await $http.getMyDraftEssays<Data<records>>({ userId, pageNum, pageSize, status })
  if (res.code === 4001) {
    loading.value = false
    console.log(res.data.records)
    myEssays.value = res.data.records.map(item => {
      item.updatetime = moment(item.updatetime).format('YYYY-MM-DD')
      return item
    })
    empty.value = myEssays.value.length > 0 ? false : true
  }
}

const toWatch = (id: number,userid: number) => {
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

const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
}

onMounted(()=> {
  currentUserid.value = JSON.parse(sessionStorage.getItem('users')!)
  getEssayOfDraft(currentUserid.value,1, 8)
})
</script>

<style scoped lang="less">
.box {
  width: 100%;
  display: flex;
  flex-direction: column;
  .item {
    width: 100%;
    margin-top: 20px;
    display: flex;
    height: 100%;
    line-height: 25px;
    .right {
      display: flex;
      width: 82%;
      flex-direction: column;
      .title:hover{
        color: #1E80FF;
        cursor: pointer;
      }
      .bottom {
        display: flex;
        font-size: 13px;
        color: #72777B;
        .icon-good:hover{
          cursor: pointer;
          color: #1E80FF;
        }
        .icon-pinglun:hover{
          cursor: pointer;
          color: #1E80FF;
        }
      }
    }
    .left{
      flex: 1;
      img{
        width: 120px;
        height: 70px;
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
