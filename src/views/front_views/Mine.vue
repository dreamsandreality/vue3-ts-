<template>
  <div class="mine">
    <div class="box">
      <div class="backBox">
        <img :src="backImg === '' ? '/src/image/4c1f1096_E730391_2d2cae5c.jpg' : getBackImg()" alt="" class="backImg" />
        <BackImgUpload class="backImgUpload" @sendInfo="sendInfo"></BackImgUpload>
      </div>
      <img :src="getImg()" alt="" class="advtar" />
      <div class="myInfo">
        <span class="username">{{ userInfomation.username }}</span>
        <span class="tro">{{ userInfomation.sign == null ? `未设置` : userInfomation.sign }}</span
        ><br />
        <div class="mySex">
          <span class="iconfont icon-touxiang"></span>
          <span class="sex">性别</span>
          <span class="manOr">{{ userInfomation.sex === 1 ? '男' : '女' }}</span>
        </div>
        <div class="address">
          <span class="iconfont icon-dizhi"></span>
          <span class="location">地区</span>
          <span class="ilocation">{{ userInfomation.province == null ? `未知` : userInfomation.province }} · {{ userInfomation.city == null ? `未知` : userInfomation.city }}</span>
        </div>
        <div class="fis">
          <span class="iconfont icon-gongwenbao"></span>
          <span class="infis">职业</span>
          <span class="ifis">{{ userInfomation.occupation == null ? `未设置` : userInfomation.occupation }}</span>
        </div>
        <div class="edit"><el-button type="primary" plain :icon="Edit" @click="editInfo">编辑个人资料</el-button></div>
      </div>
      <div class="about">
        <div class="duminac">
          <div class="rights">
            <div class="myNav">
              <ul>
                <li v-for="item in navList" :key="item.id" :class="heiId == item.id ? 'actives' : 'lis'" @click="changeActive(item.id, item.router)">{{ item.name }}&nbsp;</li>
              </ul>
            </div>
            <div class="content">
              <Content></Content>
            </div>
          </div>
          <div class="left">
            <div class="tops">
              <img src="/src/image/创作中心.jpg" alt="" class="center" />
              <span class="drafts" @click="toDraft"
                >草稿箱<a>({{ draftNumber }})</a></span
              >
            </div>
            <div class="centers">
              <div class="read">
                <div class="tread">
                  <span>今日阅读数<a class="iconfont icon-wenhao_huabanfuben"></a></span><br />
                </div>
                <div class="rnum">
                  <span>{{ todayRead }}</span
                  ><br />
                </div>
                <div class="yer">
                  <span>昨日数据</span>
                  <a>{{ yestodayRead }}</a>
                </div>
              </div>
              <div class="like">
                <div class="tlike">
                  <span>今日新赞同数<a class="iconfont icon-wenhao_huabanfuben"></a></span><br />
                </div>
                <div class="lnum">
                  <span>{{ todayLike }}</span
                  ><br />
                </div>
                <div class="ler">
                  <span>昨日数据</span>
                  <a>{{ yestodayLike }}</a>
                </div>
              </div>
            </div>
            <div class="bottoms">
              <button @click="toWrite">开始写文章></button>
            </div>
            <div class="concern">
              <div class="myc">
                <div class="num">
                  <span>关注</span><br />
                  <a>{{ concern }}</a>
                </div>
              </div>
              <div class="cme">
                <div class="num">
                  <span>粉丝</span><br />
                  <a>{{ fans }}</a>
                </div>
              </div>
            </div>
            <div class="list">
              <div>
                <span>回复我的</span>
                <a>{{ topic }}</a>
              </div>
              <div>
                <span>我的收藏夹</span>
                <a>{{ folder }}</a>
              </div>
              <div>
                <span @click="toHistory">浏览记录</span>
                <a>{{ history }}</a>
              </div>
            </div>
            <div class="bottomlist">
              <div>
                <i class="iconfont icon-wenhao_huabanfuben"></i>
                <span>帮助中心</span><br />
                <a>隐私保护指引</a><a>申请开通机构号</a><a>联系我们</a>
              </div>
              <div>
                <i class="iconfont icon-guanyuwomen"></i>
                <span>举报中心</span><br />
                <a>涉未成年举报</a><a>网络谣言举报</a><a>涉企虚假举报</a>
              </div>
              <div>
                <i class="iconfont icon-qizhi-"></i>
                <span>关于我们</span><br />
                <a>下载rookie</a><a>rookie招聘</a><a>rookie指南</a><a>rookie协议</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import moment from 'moment'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import $_api from '../../api'
import base from '../../api/base'
import Data from '../../globalResult/global'
import $http from '/src/api/index.ts'
import Content from '/src/components/Mine-Content.vue'
import BackImgUpload from '/src/components/backImgUpload/index.vue'
import type { userBack } from '/src/resultType/UserInfo.ts'
const router = useRouter()
type navItem = {
  id: number
  name: string
  router: string
}[]

type statisticHistoryResponseData = {
  userid: number
  browsed_user: number
  esaayid: number
  browse_time: null
  status: number
  todayData: number
  yestodayData: number
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

type Info = {
  userid: number
  concernid: number
  p_id: number
  list: list
}
type problemInfo = {
  id: number
  create_user: number
  content: string
  time: string
  status: number
  topic: string
  top: number
  answer: number
  userCollectList: null
  userLikeList: null
  concern: number
}[]

type FolderInfo = {
  id: number
  foldername: string
  userid: number
}[]

type HistoryResponseData = {
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
  
}[]

type HistoryEssayData = {
    id: number
    title: string
    userid: number
    updatetime: string
    topicid: number
    hcontent: string
    status: number
    cover: string
    views: number
    columnid: number
    nav_id: number
    top: number
    content: null
}

const userInfomation = ref<userBack>({
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
  account: ''
})
let backImg = ref<string>('')
let draftNumber = ref<number>(12)
let todayRead = ref<number>(0)
let yestodayRead = ref<number>(0)
let todayLike = ref<number>(1000)
let yestodayLike = ref<number>(0)
let concern = ref<number>(0)
let fans = ref<number>(0)
let topic = ref<number>(0)
let column = ref<number>(0)
let problem = ref<number>(0)
let folder = ref<number>(0)
let history = ref<number>(0)
let heiId = ref<number>(12)
const routerArr = new Set(['/myconcern', '/concernme', '/concernlmun', '/concernPro', '/like-mySend', '/reply-me', '/answer-me'])
let navList = ref<navItem>([
  {
    id: 12,
    name: '文章',
    router: '/mine/myEssay'
  },
  {
    id: 13,
    name: '专栏',
    router: '/mine/myColumn'
  },
  {
    id: 14,
    name: '收藏',
    router: '/mine/like'
  },
  {
    id: 24,
    name: '关注',
    router: '/mine/concern'
  },
  {
    id: 222,
    name: '我的',
    router: '/my-get'
  }
])

const toWrite = (): void => {
  router.push({
    name: 'writeEssay',
    params: {
      id: 0
    }
  })
}

const changeActive = (id: number, routers: string): void => {
  router.push(routers)
  heiId.value = id
}

/**
 *
 * @param userId 查询关注我的人的列表
 */
const getConcernMeUsers = async (userId: number) => {
  let { data: res } = await $_api.getConcernMeUser<Data<Info>>({ userId })
  if (res.code === 4001) {
    fans.value = res.data.list.length
  }
}

/**
 *
 * @param userId 查询我关注的人的接口
 */
const getMyConcernUsers = async (userId: number) => {
  let { data: res } = await $_api.getMyConcernUser<Data<Info>>({ userId })
  if (res.code === 4001) {
    concern.value = res.data.list.length
  }
}

/**
 *
 * @param userId 获取我关注的问题列表
 */
const getMyConcernProblems = async (userId: number) => {
  let { data: res } = await $_api.getMyConcernProblem<Data<problemInfo>>({ userId })
  if (res.code === 4001) {
    problem.value = res.data.length
  }
}

/**
 *
 * @param userid 查询自己的收藏夹
 */

const getFoldersOfUser = async (userid: number) => {
  let { data: res } = await $_api.getFolders<Data<FolderInfo>>({ userid })
  if (res.code === 4001) {
    folder.value = res.data.length
  }
}

/**
 *
 * @param userid 统计昨天和今天的浏览历史数量
 * @param today
 * @param yestoday
 */

const getHistoryNums = async (userid: number, today: string, yestoday: string) => {
  let { data: res } = await $_api.getHistoryNums<Data<statisticHistoryResponseData>>({ userid, today, yestoday })
  if (res.code === 4001) {
    todayRead.value = res.data.todayData
    yestodayRead.value = res.data.yestodayData
  }
}

/**
 *
 * @param userid 查询昨天和今天的点赞数量
 * @param today
 * @param yestoday
 */
const getLikeNumsOfYandT = async (userid: number, today: string, yestoday: string) => {
  let { data: res } = await $_api.getLikeNumsOfYandTs<Data<statisticHistoryResponseData>>({ userid, today, yestoday })
  if (res.code === 4001) {
    todayLike.value = res.data.todayData
    yestodayLike.value = res.data.yestodayData
  }
}

const editInfo = (): void => {
  router.push('/edit-myself')
}
const toHistory = (): void => {
  router.push('/history-s')
}

const toDraft = () => {
  router.push('/draft')
}

/**
 *
 * @param val 接收上传组件传来的图片信息
 */

const sendInfo = (val: string): void => {
  backImg.value = val
}

/**
 *
 * @param id 获取个人信息
 */

const getMyselfInfo = async (id: number) => {
  let { data: res } = await $http.mineGetInfo<Data<userBack>>({ id })
  userInfomation.value = res.data[0]
  backImg.value = res.data[0].image
  console.log(userInfomation.value)
}

/**
 *
 * @param userId 查询草稿箱的文章数量
 */
const getCountOfDraftEssayNums = async (userId: number) => {
  let { data: res } = await $_api.getCountOfDraftEssayNum<Data<number>>({ userId })
  if (res.code === 4001) {
    draftNumber.value = res.data
  }
}

/**
 * 查询我的历史记录
 */
const searchHistory = async (userId: number) => {
  let { data: res } = await $_api.searchHistoryAndNums<Data<HistoryResponseData>>({ userId })
    if(res.code === 4001){
      history.value = res.data.length
    }
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
 * 读取图片
 */
const getBackImg = () => {
  return `/api${base.imgUrl}?name=${backImg.value}`
}

onMounted(() => {
  getMyselfInfo(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  getCountOfDraftEssayNums(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  getHistoryNums(JSON.parse(localStorage.getItem('user')!).userInfo.id, moment(new Date()).format('YYYY-MM-DD'), moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'))
  getLikeNumsOfYandT(JSON.parse(localStorage.getItem('user')!).userInfo.id, moment(new Date()).format('YYYY-MM-DD'), moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'))
  getMyConcernUsers(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  getConcernMeUsers(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  getMyConcernProblems(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  getFoldersOfUser(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  searchHistory(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})

watch(
  () => router.currentRoute.value,
  () => {
    if ((router.currentRoute.value.meta.count as number) >= 0) {
      console.log(router.currentRoute.value.meta.count)
      if (routerArr.has(router.currentRoute.value.path)) {
        if (router.currentRoute.value.path == '/like-mySend' || router.currentRoute.value.path == '/reply-me' || router.currentRoute.value.path == '/answer-me') {
          heiId.value = 222
        } else {
          heiId.value = 24
        }
      } else {
        heiId.value = router.currentRoute.value.meta.count as number
        console.log(router.currentRoute.value.meta.count)
      }
    } else {
      heiId.value = 12
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="less">
.mine {
  display: flex;
  justify-content: space-around;
  .box {
    width: 70%;
    height: 75vh;
    background: #ffffff;
    margin-left: -200px;
    .backBox {
      height: 40%;
      .backImg {
        width: 100%;
        height: 400px;
        background-size: cover;
      }
      .backImgUpload {
        margin-top: -300px;
        margin-left: 800px;
      }
    }

    .advtar {
      width: 180px;
      height: 180px;
      border-radius: 5px;
      margin-top: 130px;
      margin-left: 50px;
    }
    .myInfo {
      margin-left: 260px;
      margin-top: -140px;
      text-align: left;
      .edit {
        margin-left: 500px;
        margin-top: -20px;
      }
      .icon-touxiang {
        color: #8590a6;
      }
      .icon-dizhi {
        color: #8590a6;
      }
      .icon-gongwenbao {
        color: #8590a6;
      }
      .username {
        font-size: 30px;
        font-weight: 600;
      }
      .tro {
        margin-left: 20px;
      }
      .mySex {
        text-align: left;
        margin-top: 18px;
        margin-left: 3px;
        .sex {
          // margin-left: 5px;
          font-weight: 600;
          color: #8590a6;
        }
        .manOr {
          margin-left: 55px;
        }
      }
      .address {
        margin-top: 18px;
        .location {
          font-weight: 600;
          color: #8590a6;
        }
        .ilocation {
          margin-left: 55px;
        }
      }
      .fis {
        margin-top: 18px;
        .infis {
          font-weight: 600;
          color: #8590a6;
        }
        .ifis {
          margin-left: 55px;
        }
      }
    }
    .about {
      width: 100%;
      // background: #FFFFFF;
      // height: 100%;
      margin-top: 30px;
      display: flex;
      flex-direction: row;
      .duminac {
        display: flex;
        .left {
          width: 340px;
          margin-left: 100px;
          height: 250px;
          background-color: #ffffff;
          // margin-top: -72px;
          .tops {
            display: flex;
            .center {
              height: 50px;
              width: 170px;
            }
            .drafts {
              padding-top: 20px;
              font-size: 13px;
              margin-left: 90px;
              color: #8590a6;
              cursor: pointer;
              a {
                color: black;
              }
            }
          }
          .centers {
            display: flex;
            margin-top: 30px;
            padding-left: 40px;
            .read {
              .tread {
                color: #8590a6;
                font-size: 14px;
                text-align: center;
                .icon-wenhao_huabanfuben {
                  font-size: 10px;
                }
              }
              .rnum {
                padding-top: 10px;
                text-align: center;
                font-weight: 600;
              }
              .yer {
                text-align: center;
                padding-top: 10px;
                font-size: 14px;
                span {
                  color: #6385a6;
                }
                a {
                  padding-left: 5px;
                  font-weight: 600;
                }
              }
            }
            .like {
              margin-left: 80px;
              .tlike {
                color: #8590a6;
                font-size: 14px;
                text-align: center;
                .icon-wenhao_huabanfuben {
                  font-size: 10px;
                }
              }
              .lnum {
                padding-top: 10px;
                text-align: center;
                font-weight: 600;
              }
              .ler {
                text-align: center;
                padding-top: 10px;
                font-size: 14px;
                span {
                  color: #6385a6;
                }
                a {
                  padding-left: 5px;
                  font-weight: 600;
                }
              }
            }
          }
          .bottoms {
            margin-top: 30px;
            padding-left: 40px;
            width: 270px;
            button {
              width: 100%;
              height: 40px;
              background: #ffffff;
              color: #0292ff;
              border: 1px solid #0292ff;
              text-align: center;
              font-size: 15px;
              cursor: pointer;
            }
          }
          .concern {
            display: flex;
            width: 100%;
            margin-top: 30px;
            background-color: #ffffff;
            padding-top: 10px;
            padding-bottom: 10px;
            .myc {
              width: 50%;
              border-right: 1px solid var(--el-border-color);
              // padding-left: 40px;
              .num {
                text-align: center;
                span {
                  color: #8590a6;
                  font-size: 14px;
                }
                a {
                  margin-top: 10px;
                  font-weight: 600;
                }
              }
            }
            .cme {
              width: 50%;
              .num {
                text-align: center;
                span {
                  font-size: 14px;
                  color: #175199;
                }
                a {
                  color: #175199;
                  font-weight: 600;
                }
              }
            }
          }
        }
        .rights {
          width: 50%;
          .content {
            // margin-top: 20px;
          }
          .dy {
            width: 600px;
            height: 100px;
            background-color: #ffffff;
          }
          .myNav {
            background-color: #ffffff;
            width: 600px;

            ul {
              display: flex;
              padding-left: 10px;
              .lis {
                list-style: none;
                width: 20%;
                justify-content: center;
                height: 40px;
                display: flex;
                align-items: center;
                // border-bottom: 2px solid #0292FF;
                margin-right: 20px;
                cursor: pointer;
              }
              .lis:hover {
                color: #0292ff;
              }
            }
            .actives {
              list-style: none;
              width: 20%;
              justify-content: center;
              height: 40px;
              display: flex;
              align-items: center;
              border-bottom: 2px solid #056de8;
              margin-right: 20px;
              font-weight: 600;
              cursor: pointer;
            }
            .actives:hover {
              color: #0292ff;
            }
          }
        }
      }

      .list {
        color: #898d98;
        margin-top: 5px;
        font-size: 15px;
        margin-left: 8px;
        div {
          display: flex;
          align-items: center;
          height: 40px;
          // width: 270px;
          border-bottom: 1px solid var(--el-border-color);
          span {
            text-align: left;
            width: 90%;
            cursor: pointer;
            margin-left: 10px;
          }
          span:hover {
            color: #0292ff;
          }
          a {
            text-align: right;
            flex: 1;
          }
        }
      }
      .bottomlist {
        margin-top: 10px;
        margin-left: 20px;
        div {
          height: 50px;
          color: #898d98;
          span {
            margin-left: 20px;
            font-size: 13px;
          }
          a {
            margin-right: 10px;
            font-size: 13px;
            cursor: pointer;
          }
          a:hover {
            color: #0292ff;
          }
        }
      }
    }
  }
}
</style>
