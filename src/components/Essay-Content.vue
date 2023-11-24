<template>
  <div>
    <div class="content">
      <span class="my"> 我的文章 </span>
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有任何文章哦~" />
      </div>
      <div class="texts" v-for="item in myEssays" :key="item.id">
        <div class="lefts">
          <h3 @click="toWatch(item.id,item.userid)">{{ item.title }}</h3>
          <span class="cts">{{ item.mdcontent }}</span>
          <div class="tros">
            <span>{{ item.updatetime }}&nbsp;</span>
            <el-divider direction="vertical" />
            <span class="iconfont icon-yanjing">&nbsp;{{ item.views }}&nbsp;&nbsp;</span>
            <span class="iconfont icon-good">&nbsp;{{ item.likeNum }}&nbsp;&nbsp;</span>
            <span class="iconfont icon-shoucang">&nbsp;{{ item.collect_num }}&nbsp;&nbsp;</span>
            <span class="iconfont icon-pinglun">&nbsp;{{ item.comment_num }}&nbsp;</span>
          </div>
        </div>
        <div class="right">
          <img :src="getIMG(item.cover)" alt="" class="imgs" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import $http from '../api'
import base from '../api/base'
import Data from '../globalResult/global'
import addHistory from '../utils/addHistory.ts'
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

const myEssays = ref<Essay>([])
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
const router = useRouter()
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

const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
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

onMounted(() => {
  getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8)
})
</script>

<style lang="less" scoped>
.content {
  width: 580px;
  padding-left: 20px;
  background-color: #ffffff;
  height: 100%;
  padding-top: 15px;
  padding-bottom: 15px;
  .my {
    font-weight: 600;
    margin-top: 20px;
  }
  .texts {
    margin-top: 15px;
    padding-right: 10px;
    line-height: 30px;
    display: flex;
    width: 580px;
    h3 {
      cursor: pointer;
    }
    h3:hover {
      color: #175199;
    }
    .lefts {
      width: 70%;
      .cts {
        color: #8590a6;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .tros {
        span {
          font-size: 14px;
          color: #8590a6;
        }
      }
    }
    .right {
      width: 30%;
      margin-left: 20px;
      text-align: right;
      .imgs {
        width: 135px;
        height: 90px;
        // border-radius: 2px;
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
