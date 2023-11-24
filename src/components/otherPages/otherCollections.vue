<template>
  <div class="box">
    <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有任何文章哦~" />
      </div>
    <div class="item" v-for="item in essayList" :key="item.id">
      <div class="right">
        <span style="font-weight: 600;" class="title">{{ item.title }}</span>
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
          <span class="iconfont icon-shoucang1" style="margin-left: 15px;"></span>
          <span style="margin-left: 5px;">{{ item.collect_num }}</span>
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
import $http from '../../api';
import moment from 'moment';
import Data from '../../globalResult/global';
import base from '../../api/base';
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
let currentUserid = ref<number>(0)
/**
 *
 * @param userId 获取我的收藏
 */
const getMyCollection = async (userId: number) => {
  console.log(userId)
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
  currentUserid.value = JSON.parse(sessionStorage.getItem('users')!)
  getMyCollection(currentUserid.value)
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
        .icon-shoucang1:hover{
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