<template>
  <div class="root">
    <div class="top">
      <div class="spans">
        <span v-for="item in logo" :key="item.id" :style="{ color: item.color }">{{ item.letter }}</span>
      </div>
      <div class="lis">
        <ul>
          <li v-for="item in navList" :key="item.id" :class="item.id == status ? 'active' : 'lis'" @click="changeStatus(item.id, item.router)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="ipt">
        <el-input v-model="input4" class="w-50 m-2" placeholder="搜你感兴趣的" @keyup.enter.native="search_Content">
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="bt">
        <el-button type="primary" @click="search_Content">搜索</el-button>
      </div>
      <div class="notice_login">
        <a class="no" v-show="hasLogin">
          <span @click="toLogin">立即登录</span>
        </a>
        <a class="hasLogin" v-if="!hasLogin">
          <el-badge :value="alllikes" class="item">
            <el-dropdown class="drop">
              <img :src="getImg()" alt="" class="advtor" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="addFans">新增粉丝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-badge :value="fans" class="item"></el-badge></el-dropdown-item>
                  <el-dropdown-item @click="toMyLike">收到的赞&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-badge :value="mylike" class="item"></el-badge></el-dropdown-item>
                  <el-dropdown-item @click="reply_Me">回复我的&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-badge :value="replyme" class="item"></el-badge></el-dropdown-item>
                  <el-dropdown-item @click="toHistory">浏览历史&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-dropdown-item>
                  <el-dropdown-item @click="outLogin">退出登录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-badge>
          <span @click="toMine">{{ userName }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import base from '../api/base'
import $http from '../api'
import useUserStore from '../store/modules/user.ts'
import Data from '../globalResult/global'
const userStore = useUserStore()
const router = useRouter()
let hasLogin = ref<boolean>(true)
let userName = ref<string>('用户akfhaflanvlavn')
let fans = ref<number>(12)
let mylike = ref<number>(13)
let replyme = ref<number>(5)
type list = {
  id: number
  name: string
  router: string
}[]
const navList = ref<list>([
  {
    id: 1,
    name: '文章',
    router: '/'
  },
  {
    id: 2,
    name: '专栏',
    router: '/recommend'
  },
  {
    id: 4,
    name: '关注',
    router: '/concern'
  }
])
type logoType = {
  id: number
  letter: string
  color: string
}[]

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

/**
 * 
 * @param userId 查询关注我的未读信息
 */
const getNoReadConcern = async (userId: number) => {
  let { data : res } = await $http.getNoReadConcern<Data<number>>({ userId })
    if(res.code === 4001){
      fans.value = res.data
    }
}
const canNotRead = ref<ResponseData>([])
let status = ref<number>(1)
let input4 = ref<string>('')
const logo = ref<logoType>([
  {
    id: 0,
    letter: 'R',
    color: '#3285FF'
  },
  {
    id: 1,
    letter: 'o',
    color: '#FB3624'
  },
  {
    id: 2,
    letter: 'o',
    color: '#FFBA02'
  },
  {
    id: 4,
    letter: 'k',
    color: '#3285FF'
  },
  {
    id: 5,
    letter: 'i',
    color: '#25B24E'
  },
  {
    id: 6,
    letter: 'e',
    color: '#FD3224'
  },
  {
    id: 7,
    letter: 's',
    color: '#FFBA02'
  }
])
const alllikes = computed(() => {
  return fans.value+replyme.value+mylike.value
})

/**
 * 搜索内容
 */
const search_Content = (): void => {
  if (input4.value.trim() == '') {
    ElMessage.error('请输入内容!')
    return
  }
  router.push({
    path: '/search-S',
    query: {
      condition: input4.value
    }
  })
  input4.value = ''
}

/**
 * 跳转到我收到的赞页面
 */
const toMyLike = (): void => {
  router.push('/like-myGet')
  mylike.value = 0
}

/**
 * 跳转到新增粉丝页面
 */
const addFans = (): void => {
  router.push('/concernme')
  let se = setInterval(()=>{
    fans.value = 0
    clearInterval(se)
  },1000)
}

/**
 * 跳转到浏览历史页面
 */

const toHistory = (): void => {
  router.push('/history-s')
}

/**
 * 获取头像
 */
const getImg = (): string => {
  let names = JSON.parse(localStorage.getItem('user')!).userInfo.advator
  if (names == null) {
    return '/src/image/默认头像.jpg'
  }
  return '/api' + base.imgUrl + '?name=' + names
}

/**
 * 跳转到回答我的页面
 */
const to_Answer = (): void => {
  router.push('/answer-me')
}

/**
 * 跳转到回复我的页面
 */
const reply_Me = (): void => {
  router.push('/reply-me')
}

/**
 * 退出登录
 */
const outLogin = (): void => {
  ElMessageBox.confirm('确认退出登录吗?', '提示', {
    confirmButtonText: '退出登录',
    cancelButtonText: '取消操作',
    type: 'warning'
  }).then(() => {
    router.replace('/front/login')
    const pwd = JSON.parse(localStorage.getItem('passwordExsit')!)
    if (pwd) {
      localStorage.removeItem('passwordExsit')
    }
    userStore.clearData()
    localStorage.removeItem('user')
    ElNotification({
      title: '操作成功!',
      message: '退出登录成功!',
      type: 'success'
    })
  })
}

watch(
  () => router.currentRoute.value,
  () => {
    if ((router.currentRoute.value.meta.count as number) >= 0) {
      status.value = router.currentRoute.value.meta.count as number
    } else {
      status.value = 1
    }
  },
  {
    immediate: true
  }
)
const changeStatus = (id: number, routers: string): void => {
  status.value = id
  router.push(routers)
}

/**
 * 跳转到个人主页
 */
const toMine = (): void => {
  router.push('/mine/myEssay')
  status.value = 12
}

/**
 * 跳转到登录页
 */
const toLogin = (): void => {
  router.push('/front/login')
}
/**
 * 判断用户名
 */
const servayUsername = (): void => {
  const info = JSON.parse(localStorage.getItem('user')!)
  if (info.userInfo.username) {
    userName.value = info.userInfo.username
    hasLogin.value = false
    return
  }
  hasLogin.value = true
}

/**
 * 
 * @param userId 查询我收到的点赞的信息
 */
 const getLikeMeInfo = async (userId: number) => {
  let { data: res } = await $http.searchMyGetLike<Data<ResponseData>>({ userId })
    if(res.code === 4001){
      canNotRead.value = res.data.filter(item=>{
        return item.status == 0
      })
      mylike.value = canNotRead.value.length
    }
}

onMounted(() => {
  servayUsername()
  getNoReadConcern(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  getLikeMeInfo(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.root {
  .top {
    display: flex;
    background-color: #ffffff;
    align-items: center;
    height: 70px;
    position: fixed;
    width: 100%;
    box-shadow: 0 2px 6px 0 #ddd;
    .spans {
      font-size: 30px;
      margin-left: 108px;
    }
    .lis {
      ul {
        display: flex;
        list-style: none;
        .lis {
          margin-left: 35px;
          color: #898d98;
          cursor: pointer;
        }
        .lis:hover {
          color: #73757c;
        }
      }
    }
  }
  .ipt {
    width: 300px;
    margin-left: 150px;
  }
  .bt {
    margin-left: 20px;
  }
  .notice_login {
    margin-left: 70px;
    color: #898d98;
    span:hover {
      color: #1e80ff;
      cursor: pointer;
    }
    .hasLogin {
      background-color: #ffffff;
      span {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 10px;
      }
      .drop:deep(.el-tooltip__trigger:focus-visible) {
        outline: unset;
      }
      .advtor {
        width: 40px;
        height: 40px;
        margin-top: 5px;
        cursor: pointer;
        border: none;
      }
    }
  }
}
.active {
  margin-left: 35px;
  color: #1e80ff;
  cursor: pointer;
}
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
