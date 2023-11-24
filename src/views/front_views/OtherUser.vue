<template>
  <div class="box">
    <div class="right">
      <div class="top">
        <div>
          <img :src="userInfo.advator == '' ? '/src/image/默认头像.jpg' : getIMG(userInfo.advator)" alt="" class="imgs" />
        </div>
        <div class="lefts">
          <span style="font-size: 25px; font-weight: 600">{{ userInfo.username }}</span>
          <div class="profession">
            <span class="iconfont icon-zhiye" style="color: #72777b"></span>
            <span style="margin-left: 10px; color: #72777b">{{ userInfo.occupation == null ? '暂无' : userInfo.occupation }}</span>
          </div>
          <div class="sign">
            <span class="iconfont icon-shenfenzheng" style="color: #72777b"></span>
            <span style="margin-left: 10px; color: #72777b">{{ userInfo.sign == null ? '暂无' : userInfo.sign }}</span>
            <el-button :type="userFansList.indexOf(myid) == -1 ? 'primary' : 'danger'" style="margin-left: 20px" @click="concernOrCancelConcern(userInfo.id)">{{ userFansList.indexOf(myid) == -1 ? '关注ta' : '取消关注' }}</el-button>
            <el-button type="primary" plain style="margin-left: 20px" :icon="Promotion" @click="scocetUser">私信ta</el-button>
            <el-dropdown class="drop" id="three" style="margin-left: 20px; color: #72777b; margin-top: 5px">
              <span>...</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>举报此人</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-divider style="width: 700px; margin-left: -140px" />
          <div class="time">
            <span class="iconfont icon-huizhang" style="color: #ff8c18"></span>
            <span style="margin-left: 10px">加入Rookies {{ getTime(moment(userInfo.registertime).format('YYYY-MM-DD')) }} 天</span>
          </div>
        </div>
      </div>
      <div class="center" style="height: 15px; background: #f2f3f5; margin-left: -20px"></div>
      <div class="bottom">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">文章</el-menu-item>
          <el-menu-item index="2">专栏</el-menu-item>
          <el-menu-item index="3">收藏集</el-menu-item>
          <el-menu-item index="4">关注</el-menu-item>
        </el-menu>
        <Other></Other>
      </div>
    </div>
    <div class="left">
      <div class="lefttop">
        <span style="padding-left: 10px">个人成就</span>
        <el-divider style="margin-top: 10px" />
        <div class="reward">
          <div class="s1">
            <span class="iconfont icon-huizhang" style="color: #7bb9ff"></span>
            <span style="margin-left: 10px">优秀创作者</span>
          </div>
          <div class="s1">
            <span class="iconfont icon-dianzan_kuai" style="color: #7bb9ff"></span>
            <span style="margin-left: 10px">文章被点赞{{ likeNum }}</span>
          </div>
          <div class="s1">
            <span class="iconfont icon-yanjing" style="color: #7bb9ff"></span>
            <span style="margin-left: 10px">文章被阅读{{ essayView }}</span>
          </div>
        </div>
      </div>
      <div class="leftbottom">
        <div class="lef">
          <span style="font-weight: 600">关注</span>
          <span style="color: #5a697c">{{ concernNum }}</span>
        </div>
        <div class="righ">
          <span style="font-weight: 600">粉丝</span>
          <span style="color: #5a697c">{{ fansNum }}</span>
        </div>
      </div>
      <div class="leftbo">
        <div class="one">
          <span>收藏集</span>
          <span>{{ collectionNum }}</span>
        </div>
        <el-divider />
        <div class="one">
          <span>加入于</span>
          <div class="text" style="text-align: right">
            <span>{{ moment(userInfo.registertime).format('YYYY-MM-DD') }}</span>
          </div>
        </div>
        <el-divider />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Promotion } from '@element-plus/icons-vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import moment from 'moment'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import $http from '../../api'
import base from '../../api/base'
import Other from '../../components/otherPages/otherPageContent.vue'
import Data from '../../globalResult/global'
type userInfos = {
  id: number
  username: string
  password: string
  phone: string
  sex: number
  image: string
  occupation: string
  sign: string
  advator: string
  about: string
  province: string
  city: string
  account: string
  registertime: string
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
}[]

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

interface concernUser {
  userid: number
  concernid: number
}

const activeIndex = ref('1')
let currentTime = ref<string>('')
let essayView = ref<number>(0)
let concernNum = ref<number>(0)
let fansNum = ref<number>(0)
let collectionNum = ref<number>(0)
let likeNum = ref<number>(0)
const userInfo = ref<userInfos>({
  id: 0,
  username: '',
  password: '',
  phone: '',
  sex: 0,
  image: '',
  occupation: '',
  sign: '',
  advator: '',
  about: '',
  province: '',
  city: '',
  account: '',
  registertime: ''
})
let currentUserid = ref<number>(0)
const router = useRouter()
let myid = ref<number>(0)
const userFansList = ref<number[]>([])
const handleSelect = (key: string) => {
  switch (key) {
    case '1':
      router.push('/other/essay')
      break
    case '2':
      router.push('/other/column')
      break
    case '3':
      router.push('/other/collection')
      break
    case '4':
      router.push('/other/concern')
      break
    default:
      break
  }
}

const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
}


const scocetUser = () => {
  router.push('/socket')
}

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
    if(userFansList.value.indexOf(myid.value)!=-1){
     userFansList.value = userFansList.value.filter(item=>item != myid.value)
     fansNum.value--
    }else{
      userFansList.value.push(myid.value)
      fansNum.value++
    }
  }
}

const concernOrCancelConcern = (id: number) => {
  const userInfo: concernUser = {
    userid: myid.value,
    concernid: id
  }
  if (userFansList.value.indexOf(myid.value) != -1) {
    ElMessageBox.confirm('确认取消对该作者的关注吗', '提示', {
      confirmButtonText: '取消关注',
      cancelButtonText: '放弃操作',
      type: 'warning'
    })
      .then(() => {
        cancelOrConcernUsers(userInfo)
      })
      .catch(() => {})
  } else {
    cancelOrConcernUsers(userInfo)
  }
}

/**
 *
 * @param id 获取个人信息
 */

const getMyselfInfo = async (id: number) => {
  let { data: res } = await $http.mineGetInfo<Data<userInfos[]>>({ id })
  if (res.code === 4001) {
    console.log(res.data[0])
    userInfo.value = res.data[0]
  }
}

const statisticsLikeNum = async (userId: number) => {
  let { data: res } = await $http.statisticsLikeNums<Data<number>>({ userId })
  if (res.code === 4001) {
    likeNum.value = res.data
  }
}

/**
 *
 * @param userId 获取文章被阅读的数量接口
 */
const statisticsEssayView = async (userId: number) => {
  let { data: res } = await $http.statisticsEssayViews<Data<number>>({ userId })
  if (res.code === 4001) {
    essayView.value = res.data
  }
}

/**
 *
 * @param userId 查询该用户关注的人的接口
 */
const getMyConcernUsers = async (userId: number) => {
  let { data: res } = await $http.getMyConcernUser<Data<Info>>({ userId })
  if (res.code === 4001 && res.data != null) {
    concernNum.value = res.data.list.length
  } else {
    concernNum.value = 0
  }
}

/**
 *
 * @param userId 查询关注该用户的人的列表
 */
const getConcernMeUsers = async (userId: number) => {
  let { data: res } = await $http.getConcernMeUser<Data<Info>>({ userId })
  if (res.code === 4001) {
    fansNum.value = res.data.list.length
    res.data.list.forEach(item => {
      userFansList.value.push(item.id)
    })
  }
}

/**
 *
 * @param userId 获取该用户的收藏
 */
const getMyCollection = async (userId: number) => {
  let { data: res } = await $http.getMyCollectionEssays<Data<EssayInfo>>({ userId })
  if (res.code === 4001) {
    collectionNum.value = res.data.length
  }
}

/**
 *
 * @param date1 计算相差多少天
 */
const getTime = (date1: string) => {
  let time1 = Date.parse(String(new Date(date1)))
  let time2 = Date.parse(String(new Date(currentTime.value)))
  let nDays = Math.abs(parseInt(String((time2 - time1) / 1000 / 3600 / 24)))
  if (nDays == 0) {
    nDays = 1
  }
  return nDays
}

computed(() => {})

onMounted(() => {
  myid.value = JSON.parse(localStorage.getItem('user')!).userInfo.id
  currentUserid.value = JSON.parse(sessionStorage.getItem('users')!)
  currentTime.value = moment(new Date()).format('YYYY-MM-DD')
  getMyselfInfo(currentUserid.value)
  statisticsEssayView(currentUserid.value)
  statisticsLikeNum(currentUserid.value)
  getMyConcernUsers(currentUserid.value)
  getConcernMeUsers(currentUserid.value)
  getMyCollection(currentUserid.value)
})
</script>

<style scoped lang="less">
.box {
  margin-left: 5%;
  display: flex;
  .right {
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    width: 55%;
    padding-top: 20px;
    padding-bottom: 20px;
    .top {
      height: 100%;
      display: flex;
      .imgs {
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
      .lefts {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        margin-left: 20px;
        line-height: 40px;
        .profession {
          display: flex;
        }
        .sign {
          display: flex;
          #three {
            cursor: pointer;
          }
        }
        .time {
          display: flex;
          margin-top: -20px;
          text-align: left;
          margin-left: -140px;
        }
      }
    }
    .bottom {
      height: 100%;
    }
  }
  .left {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    height: 100%;
    width: 300px;
    .lefttop {
      padding-top: 15px;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      height: 100%;
      .reward {
        margin-top: -20px;
        padding-left: 10px;
      }
      .s1 {
        display: flex;
        line-height: 40px;
      }
    }
    .leftbottom {
      height: 100px;
      background: #ffffff;
      margin-top: 15px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .lef {
        display: flex;
        flex-direction: column;
        line-height: 30px;
        align-items: center;
      }
      .righ {
        display: flex;
        flex-direction: column;
        line-height: 30px;
        align-items: center;
      }
    }
    .leftbo {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      line-height: 5px;
      .one {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .drop:deep(.el-tooltip__trigger:focus-visible) {
    outline: unset;
  }
}
</style>
