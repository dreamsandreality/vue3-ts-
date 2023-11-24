<template>
  <div class="historyBox">
    <div class="historyText">
      <div class="top">
        <span style="font-size: 20px; font-weight: 600">浏览记录</span>
        <el-input v-model="searchItem" class="w-50 m-2" placeholder="查询历史记录" :suffix-icon="Search" @keyup.enter.native="toSearch"/>
        <el-button type="primary" :icon="Search" class="searchBtn" @click="toSearch">搜索</el-button>
        <el-button type="primary" class="iconfont icon-lajitong" text @click="clearHistory">清空历史记录</el-button>
      </div>
      <div class="every">
        <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="empty" v-show="empty">
          <el-empty description="暂时没有历史记录哦~" />
        </div>
        <div class="everyItem" v-for="ele in historyList" :key="ele.browse_time">
          <div class="top">
            <span class="iconfont icon-shizhongfill"></span>
            <span class="time">{{ moment(ele.browse_time).format("YYYY-MM-DD") }}</span>
          </div>
          <el-divider class="el1" />
          <div class="center">
            <div class="centerTop">
              <el-tag>文章</el-tag>
              <span class="title" @click="toWachEssay(ele.esaayid, ele.userid)">{{ ele.essay.title }}</span>
            </div>
            <div class="centerCenter">
              <el-col :span="20">
                <el-text truncated
                  ><span class="con">{{ ele.essay.mdcontent }}</span></el-text
                >
              </el-col>
              <img :src="getIMG(ele.essay.cover)" alt="" class="cover" />
            </div>
            <div class="centerBottom">
              <span class="uername">{{ ele.username }}</span>
              <el-divider direction="vertical" class="di" />
              <span class="info">{{ ele.essay.views }}阅读 </span>
              <span class="info2"> · {{ ele.likeNum }}赞 </span>
              <span class="info2"> · {{ ele.commentNum }}评论</span>
              <el-dropdown class="drop">
                <span>&nbsp;&nbsp;···</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="deleteHistory(ele.id)">删除此条记录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElMessageBox,ElNotification } from 'element-plus'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import $_api from '../../api'
import base from '../../api/base'
import Data from '../../globalResult/global'
import addHistory from '../../utils/addHistory.ts'

type HistoryResponseData = {
  id: number
  userid: number
  browsed_user: number
  esaayid: number
  browse_time: string
  status: number
  todayData: number
  yestodayData: number
  essay: HistoryEssayData
  likeNum: number
  commentNum: number
  username: string
}[]

type HistoryEssayData = {
  id: number
  title: string
  userid: number
  updatetime: string
  topicid: number
  hcontent: string
  status: number
  mdcontent: string
  cover: string
  views: number
  columnid: number
  nav_id: number
  top: number
  content: null
}

interface HistoryInfo {
  userid: number
  browsed_user: number
  esaayid: number
}
const router = useRouter()
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
let searchItem = ref<string>('')
const historyList = ref<HistoryResponseData>([])
/**
 * 查询我的历史记录
 */
const searchHistory = async (userId: number) => {
  let { data: res } = await $_api.searchHistoryAndNums<Data<HistoryResponseData>>({ userId })
  if (res.code === 4001) {
    loading.value = false
    historyList.value = res.data
  }
  empty.value = historyList.value.length == 0 ? true : false
}

/**
 * 清空历史记录
 */
const clearHistory = (): void => {
  ElMessageBox.confirm('确认清空您的历史记录吗?清空将无法恢复!', '提示', {
    confirmButtonText: '清空',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteAllHistorys(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    })
    .catch(() => {
    })
}

const toSearch = () => {
  searchHistoryItem(searchItem.value,JSON.parse(localStorage.getItem('user')!).userInfo.id)
}

/**
 * 
 * @param id 删除历史记录
 */
const deleteMyHistoryItems = async (id: number) => {
  let { data : res } = await $_api.deleteMyHistoryItems<Data<null>>({ id })
    if(res.code === 3001){
      ElNotification({
        title: '提示',
        message: '删除成功',
        type: 'success'
      })
      searchHistory(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    }
}

/**
 * 
 * @param essayname 搜索自己的历史记录
 * @param userId 
 */
const searchHistoryItem = async (essayname: string, userId: number) => {
  let { data : res } = await $_api.searchHistoryItems<Data<HistoryResponseData>>({ essayname,userId })
    if(res.code === 4001){
      loading.value = false
      historyList.value = res.data
    }
    empty.value = historyList.value.length == 0 ? true : false
}

const deleteHistory = (id: number) => {
  ElMessageBox.confirm('确认删除您的这条历史记录吗?删除将无法恢复!', '提示', {
    confirmButtonText: '仍要删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteMyHistoryItems(id)
    })
    .catch(() => {
    })
}

const getIMG = (val: string): string => {
  return `/api${base.imgUrl}?name=${val}`
}

const deleteAllHistorys = async (userId: number) => {
  let { data : res } = await $_api.deleteAllHistory<Data<null>>({ userId })
    if(res.code === 3001){
      ElNotification({
        title: '提示',
        message: '已为您清空所有的记录',
        type: 'success'
      })
      searchHistory(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    }
}

const toWachEssay = (essayId: number, userid: number) => {
  router.push({
    name: 'aboutEssay-index',
    params: {
      id: essayId,
      userid: userid
    }
  })
  const addHistoryInfo: HistoryInfo = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    browsed_user: userid,
    esaayid: essayId
  }
  addHistory(addHistoryInfo)
}

onMounted(() => {
  searchHistory(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.historyBox {
  display: flex;
  .historyText {
    display: flex;
    flex-direction: column;
    width: 900px;
    height: 100%;
    padding: 20px 20px;
    background-color: #ffffff;
    margin-left: 120px;
    .top {
      display: flex;
      span {
        width: 50%;
      }
      .w-50 {
        width: 40%;
      }
      .searchBtn {
        margin-left: 20px;
      }
      .icon-lajitong {
        color: #8590a6;
      }
    }
    .every {
      margin-top: 0px;
      .everyItem {
        line-height: 28px;
        .top {
          display: flex;
          margin-top: 10px;
          .icon-shizhongfill {
            width: 1.5%;
            font-size: 13px;
            color: #1e80ff;
          }
          .time {
            font-size: 14px;
            margin-left: 10px;
          }
        }
        .el1 {
          margin-top: 5px;
        }
        .center {
          display: flex;
          flex-direction: column;
          margin-top: -13px;
          .centerTop {
            display: flex;
            .title {
              font-weight: 600;
              color: #8590a6;
              margin-left: 8px;
              cursor: pointer;
              margin-top: -3px;
            }
          }
          .centerCenter {
            display: flex;
            .con {
              font-size: 13px;
              color: #8590a6;
            }
            .cover {
              width: 120px;
              height: 80px;
              margin-left: 20px;
              margin-top: -20px;
            }
          }
          .centerBottom {
            display: flex;
            margin-top: -30px;
            .uername {
              font-size: 13px;
            }
            .uername:hover {
              cursor: pointer;
              color: #1e80ff;
            }
            .info {
              font-size: 13px;
              color: #8590a6;
            }
            .di {
              margin-top: 7px;
            }
            .info2 {
              font-size: 13px;
              color: #8590a6;
              margin-left: 8px;
            }
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
  .drop {
    margin-top: 8px;
    cursor: pointer;
  }
  .drop:deep(.el-tooltip__trigger:focus-visible) {
    outline: unset;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
}
</style>
