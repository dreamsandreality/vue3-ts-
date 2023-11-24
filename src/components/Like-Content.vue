<template>
  <div>
    <div class="content">
      <span class="my">我的收藏</span>
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有任何文章哦~" />
      </div>
      <div class="texts" v-for="item in essayList" :key="item.id">
        <div class="lefts">
          <h3>{{ item.title }}</h3>
          <span class="cts">{{ item.mdcontent }}</span>
          <div class="tros">
            <span>{{ item.updatetime }}&nbsp;</span>
            <el-divider direction="vertical" />
            <span class="iconfont icon-yanjing">&nbsp;{{ item.views }}&nbsp;&nbsp;</span>
            <span class="iconfont icon-good">&nbsp;{{ item.likeNum }}&nbsp;&nbsp;</span>
            <span class="iconfont icon-shoucang2" id="like">&nbsp;{{ item.collect_num }}&nbsp;&nbsp;</span>
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
import { ref,onMounted } from 'vue'
import $http from '../api'
import moment from 'moment';
import Data from '../globalResult/global'
import base from '../api/base';
type EssayInfo = {
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
  userName: null
  about: null
  essay_num: number
  column_num: number
  fans_num: number
  topicName: null
  likeNum: number
  comment_num: number
  collect_num: number
  columnName: null
  navName: null
  collectionList: null
  islike: number
}[]
const essayList = ref<EssayInfo>([])
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)

/**
 *
 * @param userId 获取我的收藏
 */
const getMyCollection = async (userId: number) => {
  let { data: res } = await $http.getMyCollectionEssays<Data<EssayInfo>>({ userId })
  if (res.code === 4001) {
    loading.value = false
    essayList.value = res.data.map(ele=> {
      ele.updatetime = moment(ele.updatetime).format("YYYY-MM-DD")
      return ele
    })
  }
  empty.value = essayList.value.length == 0 ? true : false
}

const getIMG = (img: string): string => {
  return `/api${base.imgUrl}?name=${img}`
}

onMounted(()=> {
  getMyCollection(JSON.parse(localStorage.getItem('user')!).userInfo.id)
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
        padding-right: 20px;
        // border-radius: 2px;
      }
    }
    #like {
      color: #ff9000;
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
