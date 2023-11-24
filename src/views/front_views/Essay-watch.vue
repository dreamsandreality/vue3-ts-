<template>
  <div class="index">
    <div class="left">
      <div class="list">
        <div class="listitem1">
          <el-badge :value="likeNums" class="item" type="info">
            <div class="abc">
              <span class="iconfont icon-dianzan" :style="likecolor" @click="toLike"></span>
            </div>
          </el-badge>
        </div>
        <div class="listitem1">
          <el-badge :value="12" class="item" type="info">
            <div>
              <span class="iconfont icon-pinglun1"></span>
            </div>
          </el-badge>
        </div>
        <div class="listitem1">
          <el-badge :value="collection" class="item" type="info">
            <div>
              <span class="iconfont icon-shoucang2" @click="openFolderDialog" :style="isColletion ? 'color: #E6A23C' : ''"></span>
            </div>
          </el-badge>
        </div>
        <div class="listitem1">
          <div>
            <span class="iconfont icon-xinfangjubao" @click="toReport"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="center" :style="{ height: percentHight }">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div>
        <el-scrollbar :height="heights">
          <h2>{{ essayContent[0].title }}</h2>
          <div class="allInfo">
            <span
              >作者：<a>{{ essayContent[0].userName }}</a></span
            >
            <span>{{ essayContent[0].updatetime }}</span>
            <span class="iconfont icon-yanjing">
              <a>{{ essayContent[0].views }}</a>
            </span>
          </div>
          <v-md-editor :model-value="essayContent[0].mdcontent" mode="preview" @copy-code-success="handleCopyCodeSuccess" class="mds"></v-md-editor>
        </el-scrollbar>
      </div>
    </div>
    <div class="right">
      <div>
        <div class="ad">
          <img src="/src/image/默认头像.jpg" alt="" />
        </div>
        <div class="infos">
          <span>{{ essayContent[0].userName }}</span>
          <span>{{ essayContent[0].about == '' ? '暂无个性签名' : essayContent[0].about }}</span>
        </div>
      </div>
      <div class="intro">
        <div class="one">
          <span>粉丝</span>
          <div class="s">
            <span>{{ essayContent[0].fans_num }}</span>
          </div>
        </div>
        <div class="one">
          <span>文章</span>
          <div class="s">
            <span>{{ essayContent[0].essay_num }}</span>
          </div>
        </div>
        <div class="one">
          <span>专栏</span>
          <div class="s">
            <span>{{ essayContent[0].column_num }}</span>
          </div>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" style="width: 150px" @click="cancernOrMine(ids === currentUserId)">{{ ids === currentUserId ? '我的主页' : '关注他' }}</el-button>
      </div>
      <div class="geduan"></div>
      <div class="rightCenter">
        <div class="titles">
          <span>相关推荐</span>
        </div>
        <el-divider class="driver" />
        <div class="essayList">
          <div class="essayItem" v-for="item in myEssays" :key="item.id">
            <el-tooltip :content="item.title" placement="bottom">
              <el-col :span="12">
                <el-text truncated class="trt" @click="toThisEssay(item.id,item.userid)">{{ item.title }}</el-text>
              </el-col>
            </el-tooltip>
            <div class="boto">
              <span>{{item.views}}阅读&nbsp;&nbsp;·&nbsp;&nbsp;{{item.likeNum}}点赞</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog :dialogTableVisible="dialogTableVisible"
     @changeDialogViews="changeDialogViews"
      @closeDialogAndRouterPush="closeDialogAndRouterPush"
       :currentId="currentEssayId"
        @changeCollectionColor="changeCollectionColor"
         @refreshCountOfCollection="refreshCountOfCollection"> 
         </Dialog>
         <Report :lookRoot="visiable" @changeVisiable="changeVisiable" :jbId="currentEssayId" :jbType="'文章'" :ruserid="currentUserId"></Report>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import useUserStore from '../../store/modules/user.ts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import $http from '../../api/index.ts'
import Dialog from '../../components/FolderDialog/index.vue'
import Data from '../../globalResult/global'
import Report from '../../components/Problems/Problems-Dialog.vue'
import router from '../../router'
type Essay = {
  id: number
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
  islike: number
  collectionList: number[]
}[]
type FolderInfo = {
  id: number
  foldername: string
  userid: number
}[]
let heights = ref<string>('0px')
const userStore = useUserStore()
let ids = userStore.userInfo.id
const route = useRoute()
let currentEssayId = ref<number>(0)
let currentUserId = ref<number>(0)
let folderList = ref<FolderInfo>([])
let isColletion = ref<boolean>(false)
let dialogTableVisible = ref<boolean>(false)
let percentHight = ref<string>('30%')
let loading = ref<boolean>(true)
let collection = ref<number>(0)
let likecolor = ref<string>('')
let likeNums = ref<number>(0)
let visiable = ref<boolean>(false)
const myEssays = ref<Essays>([])
const essayContent = ref<Essay>([
  {
    id: 0,
    userid: 0,
    updatetime: '',
    topicid: 0,
    hcontent: '',
    mdcontent: '',
    status: 0,
    cover: '',
    views: 0,
    columnid: 0,
    nav_id: 0,
    top: 0,
    content: '',
    title: '',
    userName: '',
    about: '',
    essay_num: 0,
    column_num: 0,
    fans_num: 0,
    islike: 0,
    collectionList: []
  }
])
type Datas = {
  data: null
}

type records = {
  countId: null
  current: number
  maxLimit: null
  optimizeCountSql: boolean
  orders: []
  pages: number
  records: Essays
  searchCount: boolean
  size: number
  total: number
}
type Essays = {
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

interface LikeEssayRequestData {
  userid: number
  essayid: number
  belikeuserid: number
}

/**
 *
 * @param id 获取文章接口
 */
const getEssayER = async (id: number, userid: number) => {
  let { data : res } = await $http.getEssays<Data<Essay>>({ id, userid })
  if (res.code === 4001) {
    isColletion.value = false
    console.log(res.data)
    res.data[0].updatetime = moment(res.data[0].updatetime).format('YYYY-MM-DD')
    essayContent.value[0] = res.data[0]
    currentUserId.value = res.data[0].userid
    loading.value = false
    heights.value = '670px'
    percentHight.value = '100%'
    if (res.data[0].collectionList.indexOf(res.data[0].id) != -1) {
      isColletion.value = true
    }
    likecolor.value = res.data[0].islike === 1 ? 'color: #1e80ff' : ''
    getEssayOfDraft(res.data[0].userid, 1,5,1)
  }
}

/**
 * 代码块复制
 */

const handleCopyCodeSuccess = (): void => {
  ElMessage.success('复制成功')
}
/**
 * 打开收藏夹对话框
 */

const openFolderDialog = (): void => {
  if (isColletion.value) {
    ElMessageBox.confirm('确认取消对该文章的收藏吗?此操作将会取消您不同收藏夹里的该文章', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteCollection(JSON.parse(localStorage.getItem('user')!).userInfo.id, currentEssayId.value)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作'
        })
      })
    return
  }
  dialogTableVisible.value = true
}


/**
 *
 * @param userId 请求文章接口
 * @param pageNum
 * @param pageSize
 */
 const getEssayOfDraft = async (userId: number, pageNum: number, pageSize: number, status?: number) => {
  let { data : res } = await $http.getMyDraftEssays<Data<records>>({ userId, pageNum, pageSize, status })
  if (res.code === 4001) {
    console.log(res.data.records)
    loading.value = false
    myEssays.value = res.data.records.map(item => {
      return item
    })
  }
}

const changeVisiable = (val: boolean): void => {
  visiable.value = val
}

const toReport = () => {
  visiable.value = true
}

/**
 *
 * @param essayid 统计该文章被收藏的数量
 */
const countCollectionNum = async (essayid: number) => {
  let { data: res } = await $http.getCollectionNum<Data<number>>({ essayid })
  console.log(res.data)
  if (res.code === 4001) {
    collection.value = res.data
  }
}

/**
 * 更新收藏数量
 */
const refreshCountOfCollection = () => {
  countCollectionNum(currentEssayId.value)
}

/**
 * 取消对文章点赞的接口
 * @param userid 
 * @param essayid 
 */
const cancelLike = async (userid: number,essayid: number) => {
  let { data : res } = await $http.cancelLikeDos<Data<null>>({ userid, essayid })
    if(res.code === 2001){
      likecolor.value = ''
      likeNums.value-=1
    }
}

/**
 *
 * @param val 改变对话框状态
 */
const changeDialogViews = async (val: boolean) => {
  dialogTableVisible.value = val
  getFoldersOfUser(JSON.parse(localStorage.getItem('user')!).userInfo.id)
}
/**
 *
 * @param userid 查询自己的收藏夹
 */

const getFoldersOfUser = async (userid: number) => {
  let { data: res } = await $http.getFolders<Data<FolderInfo>>({ userid })
  if (res.code === 4001) {
    folderList.value = res.data
  }
}

const cancernOrMine = (val: boolean) => {
  if(val){
    router.push('/mine')
  }else{
    console.log(123)
  }
}

/**
 *
 * @param id 从收藏夹跳转到详情页
 * @param views
 */
const closeDialogAndRouterPush = (id: number, views: boolean): void => {
  dialogTableVisible.value = views
  getEssayER(id, JSON.parse(localStorage.getItem('user')!).userInfo.id)
}

/**
 *
 * @param userid 取消对文章的收藏
 * @param essayid
 */
const deleteCollection = async (userid: number, essayid: number) => {
  let { data: res } = await $http.cancelCollection<Data<Datas>>({ userid, essayid })
  if (res.code === 2001) {
    isColletion.value = false
    countCollectionNum(Number(route.params.id))
  }
}

/**
 * 点赞点击事件
 */
const toLike = () => {
  if (likecolor.value != '') {
    cancelLike(JSON.parse(localStorage.getItem('user')!).userInfo.id,currentEssayId.value)
    return
  }
  const info: LikeEssayRequestData = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    essayid: currentEssayId.value,
    belikeuserid: currentUserId.value
  }
  likeEssay(info)
}

/**
 *
 * @param essayid 统计文章的点赞数量
 */
const countEssayLikeNum = async (essayid: number) => {
  let { data : res } = await $http.countLikeEssayNum<Data<number>>({ essayid })
  if (res.code === 4001) {
    likeNums.value = res.data
  }
}
/**
 * 点赞文章
 * @param data
 */
const likeEssay = async (data: LikeEssayRequestData) => {
  let { data: res } = await $http.doLikeEssay<Data<null>>(data)
  if (res.code === 1001) {
    countEssayLikeNum(Number(route.params.id))
    likecolor.value = 'color: #1e80ff'
  }
}

const toThisEssay = (id: number,userid: number) => {
  getEssayER(id, userid)
}

/**
 *
 * @param val 改变收藏图标的颜色
 */
const changeCollectionColor = (val: boolean) => {
  isColletion.value = val
}

onMounted(() => {
  getEssayER(Number(route.params.id), Number(route.params.userid))
  currentEssayId.value = Number(route.params.id)
  getFoldersOfUser(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  countCollectionNum(Number(route.params.id))
  countEssayLikeNum(Number(route.params.id))
})
</script>

<style lang="less" scoped>
.sk {
  // width: 100%;
  height: 100%;
  background-color: #ffffff;
  margin-top: -15px;
  padding: 20px 20px;
}
.index {
  width: 1200px;
  display: flex;
  overflow: hidden;
  .left {
    width: 10%;
    position: fixed;
    margin-left: -150px;
    .list {
      display: flex;
      flex-direction: column;
      align-items: center;
      .listitem1 {
        margin-top: 20px;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          background: #ffffff;
          border-radius: 50%;
          span {
            font-size: 23px;
            color: #8a919f;
            cursor: pointer;
          }
        }
      }
    }
  }
  .center {
    position: fixed;
    width: 62%;
    padding-top: 15px;
    margin-left: 20px;
    padding-bottom: 20px;
    background: #ffffff;
    h2 {
      margin-left: 40px;
      font-size: 30px;
    }
    .allInfo {
      display: flex;
      margin-left: 20px;
      margin-top: 20px;
      span {
        margin-left: 20px;
        color: #8a919f;
      }
      span:nth-child(1) {
        a:hover {
          cursor: pointer;
          color: #1e80ff;
        }
      }
      span:nth-child(3) {
        a {
          margin-left: 10px;
        }
      }
    }
    .scrollbar-demo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      margin: 10px;
      text-align: center;
      border-radius: 4px;
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }
  .right {
    flex: 1;
    margin-left: 990px;
    height: 100%;
    padding-bottom: 20px;
    background: #ffffff;
    .rightCenter {
      margin-left: 15px;
      padding-top: 15px;
      margin-right: 15px;
      .driver {
        margin-top: 15px;
      }
    }
    .essayList {
      display: flex;
      flex-direction: column;
      margin-top: -30px;
      .essayItem {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .trt {
          font-size: 16px;
          color: black;
        }
        .trt:hover {
          color: #1e80ff;
          cursor: pointer;
        }
        .boto {
          margin-top: 8px;
          font-size: 13px;
          color: #8a919f;
        }
      }
    }
    .geduan {
      width: 100%;
      height: 20px;
      background: #f2f3f5;
    }
    div:nth-child(1) {
      display: flex;
    }
    .ad {
      padding-top: 15px;
      width: 50px;
      height: 50px;
      margin-top: 10px;
      margin-left: 10px;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
    .infos {
      padding-top: 15px;
      margin-top: 10px;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      span:nth-child(1) {
        font-size: 15px;
      }
      span:nth-child(2) {
        margin-top: 5px;
        font-size: 15px;
        color: #8a919f;
      }
    }
    .btns {
      margin-top: 20px;
      margin-left: 30px;
      padding-bottom: 10px;
    }
    .intro {
      margin-left: 30px;
      margin-top: 10px;
      display: flex;
      .one {
        width: 20%;
        display: flex;
        line-height: 30px;
        flex-direction: column;
        align-items: center;
        span:nth-child(1) {
          margin-left: -75px;
          color: #8a919f;
          font-size: 13px;
        }
        .s {
          display: flex;
          justify-content: center;
          span {
            color: black;
          }
        }
      }
    }
  }
}
</style>
