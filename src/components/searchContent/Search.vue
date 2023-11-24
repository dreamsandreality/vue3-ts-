<template>
  <div class="bov">
    <div class="every">
      <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="empty" v-show="empty">
          <el-empty description="没有任何文章哦~" />
        </div>
      <div class="everyItem" v-for="(ele,index) in essayList" :key="ele.id">
        <el-divider class="el1" v-show="index != 0" />
        <div class="center">
          <div class="centerTop">
            <el-tag>文章</el-tag>
            <span class="title" @click="toWatchEssay(ele.id,ele.userid)">{{ ele.title }}</span>
          </div>
          <div class="centerCenter">
            <el-col :span="20">
              <el-text truncated><span class="con">{{ ele.mdcontent }}</span></el-text>
            </el-col>
            <img src="/src/image/默认头像.jpg" alt="" class="cover" />
          </div>
          <div class="centerBottom">
            <span class="uername">{{ ele.userName }}</span>
            <el-divider direction="vertical" class="di" />
            <span class="info">{{ ele.updatetime }} · </span>
            <span class="info">&nbsp;{{ ele.views }}阅读 </span>
            <span class="info2"> · {{ ele.likeNum }}赞 </span>
            <span class="info2"> · {{ ele.comment_num }}评论</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted,watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import $api from '../../api'
import moment from 'moment'
import Data from '../../globalResult/global'
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
  userName: string
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
  islike: 0
}[]

interface HistoryInfo {
  userid: number
  browsed_user: number
  esaayid: number
}

let currentCondition = ref<string>('')
const route = useRoute()
const router = useRouter()
const essayList = ref<EssayInfo>([])
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)

/**
 * 
 * @param addInfo 添加历史记录
 */

 const addHistory = async (addInfo: HistoryInfo) => {
  let { data : res } = await $api.addHistories<Data<null>>(addInfo)
    if(res.code === 1001 || res.code === 3001){
      console.log('添加历史记录')
    }
}

/**
 * 
 * @param title 查询文章
 */
const getEssaysBySearchs = async (title: string) => {
  let { data: res } = await $api.getEssaysBySearch<Data<EssayInfo>>({ title })
    if(res.code === 4001){
      loading.value = false
      essayList.value = res.data.map(item=>{
        item.updatetime = moment(item.updatetime).format("YYYY-MM-DD")
        return item
      })
    }
    empty.value = essayList.value.length == 0 ? true : false
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

onMounted(()=> {
  currentCondition.value = route.query.condition as string
  getEssaysBySearchs(currentCondition.value)
})
watch(()=>router.currentRoute.value,()=>{
 getEssaysBySearchs(router.currentRoute.value.query.condition as string)
},{
  immediate: true
})
</script>

<style lang="less" scoped>
.bov {
  display: flex;
  flex-direction: column;
  width: 900px;
  height: 100%;
  padding: 10px 20px;
  background-color: #ffffff;
  margin-left: 120px;
  .every {
    margin-top: 20px;
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
  .sk {
      // width: 100%;
      height: 100%;
      background-color: #ffffff;
      margin-top: 15px;
      padding: 20px 20px;
    }
}
</style>
