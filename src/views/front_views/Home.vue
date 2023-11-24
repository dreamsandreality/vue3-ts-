<template>
  <div>
    <div class="hroot">
      <div class="nav">
        <Nav @changeOb="changeobs"></Nav>
      </div>
      <div class="textse">
        <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="empty" v-show="empty">
          <el-empty description="没有任何文章哦~" />
        </div>
        <div class="lchildren">
          <div class="child" v-for="item in allEssays" :key="item.id">
            <h3 @click="toWachEssay(item.id, item.userid)">{{ item.title }}</h3>
            <div class="con">
              <el-col :span="20">
                <el-text class="w-100px" truncated v-html="item.mdcontent"></el-text>
              </el-col>
              <img :src="getCover(item.cover)" alt="" />
            </div>
            <div class="bot">
              <div class="info">
                <span class="username" @click="toOtherUserPages(item.userid)">{{ item.userName }}</span>
                <el-divider direction="vertical" />
                <span class="iconfont icon-yanjing"></span>
                <span> {{ item.views }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span class="iconfont icon-dianzan_kuai" :style="item.islike === 1 ? 'color: #1e80ff' : ''" @click="likeOrCancelLike(item.islike, item.id, item.userid)"></span>
                <span class="likenum"> {{ item.likeNum }}</span>
                <div class="tags">
                  <el-tag class="ml-2" type="info" size="small">{{ item.topicName }}</el-tag>
                </div>
              </div>
            </div>
            <el-divider id="di"></el-divider>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="abouts">
          <div class="tops">
            <img src="/src/image/创作中心.jpg" alt="" class="imgs" />
            <span class="dt" @click="toDraft">草稿箱</span>
          </div>
          <div class="number">
            <button @click="toWrite">开始写文章 ></button>
          </div>
        </div>
      </div>
      <div class="tui">
        <span class="iconfont icon-tianjiayonghu"></span>
        <span class="tuijian">推荐关注</span>
        <div class="users">
          <div class="uleft">
            <img src="/src/image/默认头像.jpg" alt="" class="imgs" />
            <div class="usern">
              <el-col :span="19">
                <el-text truncated>黑马前端</el-text>
              </el-col>
            </div>
            <div class="can">你可能感兴趣</div>
          </div>
          <div class="g">
            <el-button type="primary" text>+&nbsp;关注</el-button>
          </div>
        </div>
        <div class="users">
          <div class="uleft">
            <img src="/src/image/默认头像.jpg" alt="" class="imgs" />
            <div class="usern">
              <el-col :span="19">
                <el-text truncated>黑马前端</el-text>
              </el-col>
            </div>
            <div class="can">你可能感兴趣</div>
          </div>
          <div class="g">
            <el-button type="primary" text>+&nbsp;关注</el-button>
          </div>
        </div>
        <div class="users">
          <div class="uleft">
            <img src="/src/image/默认头像.jpg" alt="" class="imgs" />
            <div class="usern">
              <el-col :span="19">
                <el-text truncated>黑马前端</el-text>
              </el-col>
            </div>
            <div class="can">你可能感兴趣</div>
          </div>
          <div class="g">
            <el-button type="primary" text>+&nbsp;关注</el-button>
          </div>
        </div>
        <div class="users">
          <div class="uleft">
            <img src="/src/image/默认头像.jpg" alt="" class="imgs" />
            <div class="usern">
              <el-col :span="19">
                <el-text truncated id="els">黑马前端</el-text>
              </el-col>
            </div>
            <div class="can">你可能感兴趣</div>
          </div>
          <div class="g">
            <el-button type="primary" text>+&nbsp;关注</el-button>
          </div>
        </div>
        <div class="paga">
          <el-pagination small layout="prev, pager, next" :total="30" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import base from '../../api/base'
import $http from '../../api/index.ts'
import Nav from '../../components/LeftNav.vue'
import Data from '../../globalResult/global.ts'
import addHistory from '../../utils/addHistory.ts'
import moment from 'moment'
let navId = ref<number>(2)
let loading = ref<boolean>(true)
let page = ref<number>(1)
let empty = ref<boolean>(false)
const router = useRouter()
type records = {
  countId: null
  current: number
  maxLimit: null
  optimizeCountSql: boolean
  orders: []
  pages: number
  records: Essay[]
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
  islike: number
}

interface LikeEssayRequestData {
  userid: number
  essayid: number
  belikeuserid: number
}

interface HistoryInfo {
  userid: number
  browsed_user: number
  esaayid: number
}


const allEssays = ref<Essay[]>([])
let draft = ref<boolean>(true)

const changeobs = (val: number): void => {
  loading.value = true
  allEssays.value = []
  page.value = 1
  navId.value = val
  empty.value = false
  if (val == 2) {
    console.log(2)
    getHomeEssaysByLeftNavId(page.value, 8, JSON.parse(localStorage.getItem('user')!).userInfo.id)
  } else {
    console.log('其他')
    getHomeEssaysByLeftNavId(page.value, 8, JSON.parse(localStorage.getItem('user')!).userInfo.id, navId.value)
  }
}
const toWrite = (): void => {
  router.push({
    name: 'writeEssay',
    params: {
      id: 0
    }
  })
}

const toOtherUserPages = (id: number) => {
  router.push('/others')
  sessionStorage.setItem('users',JSON.stringify(id))
}

/**
 *
 * @param id 根据左侧导航栏获取文章
 * @param pages
 * @param pageSize
 */

const getHomeEssaysByLeftNavId = async (pages: number, pageSize: number, userid: number, id?: number) => {
  let { data: res } = await $http.getHomeEssayByNavId<Data<records>>({ pages, pageSize, userid, id })
  if (res.code === 4001) {
    console.log(res.data.records)
    loading.value = false
    if (res.data.records.length > 0) {
      empty.value = false
      if (res.data.records.length < 8) {
        empty.value = false
        draft.value = false
      } else {
        window.addEventListener('scroll', scroll)
      }
      allEssays.value.push(...res.data.records)
      return
    }
    empty.value = allEssays.value.length == 0 ? true : false
    loading.value = false
  }
}
const getCover = (val: string): string => {
  return `/api${base.imgUrl}?name=${val}`
}
const scroll = () => {
  const scrollHeight = document.documentElement.scrollHeight // 可滚动区域的高
  const scrollTop = document.documentElement.scrollTop // 已经滚动区域的高
  const clientHeight = document.documentElement.clientHeight // 可视区高度
  // 以滚动高度 + 当前视口高度  >= 可滚动高度 = 触底
  if (clientHeight + scrollTop >= scrollHeight) {
    if (draft.value) {
      if (navId.value != 2) {
        page.value++
        getHomeEssaysByLeftNavId(page.value, 8, JSON.parse(localStorage.getItem('user')!).userInfo.id, navId.value)
        return
      }
      page.value++
      getHomeEssaysByLeftNavId(page.value, 8, JSON.parse(localStorage.getItem('user')!).userInfo.id)
      return
    }
  }
}

/**
 * 点赞文章
 * @param data
 */
const likeEssay = async (data: LikeEssayRequestData) => {
  let { data: res } = await $http.doLikeEssay<Data<null>>(data)
  if (res.code === 1001) {
  }
}

/**
 * 取消对文章点赞的接口
 * @param userid
 * @param essayid
 */
const cancelLike = async (userid: number, essayid: number) => {
  let { data: res } = await $http.cancelLikeDos<Data<null>>({ userid, essayid })
  if (res.code === 2001) {
  }
}

/**
 * 查看文章
 */
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

/**
 *
 * @param val 判断是点赞还是取消点赞
 */
const likeOrCancelLike = (val: number, id: number, userid: number) => {
  if (val === 1) {
    allEssays.value.some(s => {
      if (s.id === id) {
        s.islike = 0
        s.likeNum -= 1
        cancelLike(JSON.parse(localStorage.getItem('user')!).userInfo.id, id)
        return
      }
    })
  } else {
    allEssays.value.some(s => {
      if (s.id === id) {
        s.islike = 1
        s.likeNum += 1
        const info: LikeEssayRequestData = {
          userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
          essayid: id,
          belikeuserid: userid
        }
        likeEssay(info)
        return
      }
    })
  }
}

const toDraft = (): void => {
  router.push('/draft')
}

onMounted(() => {
  getHomeEssaysByLeftNavId(1, 8, JSON.parse(localStorage.getItem('user')!).userInfo.id)
  console.log(moment(new Date((new Date().getTime() - 24*60*60*1000))).format("YYYY-MM-DD"))
  console.log(moment(new Date()).format("YYYY-MM-DD"))
})
</script>

<style lang="less" scoped>
.hroot {
  display: flex;
  .nav {
    width: 20%;
  }
  .textse {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
    margin-left: -65px;
    margin-top: -10px;
    .hotRe {
      display: flex;
      background: #ffffff;
      height: 100%;
      // width: 100%;
      padding-right: 20px;
      padding-left: 20px;
      line-height: 30px;
      margin-top: -30px;
      padding-top: 10px;
      padding-bottom: 10px;
      .reEssay {
        width: 30%;
        border-right: 1px solid #f1f2f5;
        .top {
          .icon-wenzhang {
            // width: 70px;
            // height: 70px;
            background-color: #ff8e68;
            border-radius: 50%;
            color: #ffffff;
          }
          .recommond {
            margin-left: 10px;
          }
          .most {
            font-size: 13px;
            color: #8590a6;
            margin-left: 30px;
            cursor: pointer;
          }
        }
        .list {
          display: flex;
          flex-direction: column;
          .l {
            display: flex;
            line-height: 22px;
            .sp {
              margin-left: 12px;
              font-size: 13.5px;
            }
            .sp:hover {
              cursor: pointer;
              color: #1e80ff;
            }
            .num1 {
              color: #f85f5f;
              font-size: 14px;
              font-weight: 600;
              margin-left: 5px;
            }
            .num3 {
              color: #ffc451;
              font-size: 14px;
              margin-left: 5px;
              font-weight: 600;
            }
          }
        }
      }
      .reColumn {
        padding-left: 20px;
        width: 30%;
        border-right: 1px solid #f1f2f5;
        .top {
          .icon-jihe {
            color: #ffffff;
            border-radius: 50%;
            background-color: #ffbe55;
          }
          .recommond {
            margin-left: 10px;
          }
          .most {
            font-size: 13px;
            color: #8590a6;
            margin-left: 30px;
            cursor: pointer;
          }
        }
        .list {
          display: flex;
          flex-direction: column;
          .l {
            display: flex;
            line-height: 22px;
            .sp {
              margin-left: 12px;
              font-size: 13.5px;
            }
            .sp:hover {
              cursor: pointer;
              color: #1e80ff;
            }
            .num1 {
              color: #f85f5f;
              font-size: 14px;
              font-weight: 600;
              margin-left: 5px;
            }
            .num3 {
              color: #ffc451;
              font-size: 14px;
              margin-left: 5px;
              font-weight: 600;
            }
          }
        }
      }
      .reProblem {
        width: 30%;
        padding-left: 20px;
        .top {
          .icon-shoucang1 {
            color: #ffffff;
            border-radius: 50%;
            background-color: #76b1ff;
          }
          .recommond {
            margin-left: 10px;
          }
          .most {
            font-size: 13px;
            color: #8590a6;
            margin-left: 30px;
            cursor: pointer;
          }
        }
        .list {
          display: flex;
          flex-direction: column;
          .l {
            display: flex;
            line-height: 22px;
            .sp {
              margin-left: 12px;
              font-size: 13.5px;
            }
            .sp:hover {
              cursor: pointer;
              color: #1e80ff;
            }
            .num1 {
              color: #f85f5f;
              font-size: 14px;
              font-weight: 600;
              margin-left: 5px;
            }
            .num3 {
              color: #ffc451;
              font-size: 14px;
              margin-left: 5px;
              font-weight: 600;
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

    .lchildren {
      margin-top: 40px;
    }
    .child {
      background-color: #ffffff;
      // height: 100%;
      // padding-top: 15px;
      padding-right: 20px;
      padding-left: 20px;
      line-height: 30px;
      margin-top: -30px;
      padding-top: 10px;
      padding-bottom: 5px;
      h3:hover {
        cursor: pointer;
        color: #175199;
      }
      #di {
        margin-top: 5px;
      }
      .con {
        display: flex;
        img {
          width: 100px;
          height: 70px;
          margin-top: -25px;
          margin-left: 15px;
        }
      }
      .bot {
        display: flex;
        margin-top: -20px;
        width: 100%;
        padding-bottom: 5px;
        .info {
          width: 70%;
          span {
            color: #8590a6;
            font-size: 13px;
          }
          .username:hover {
            cursor: pointer;
            color: #1e80ff;
          }
          .icon-dianzan_kuai:hover {
            cursor: pointer;
            color: #1e80ff;
            font-weight: 600;
          }
        }
        .tags {
          flex: 1;
          margin-left: 270px;
          display: flex;
          padding-top: 8px;
          margin-top: -33px;
          .ml-2 {
            margin-left: 15px;
          }
          .ml-2:hover {
            cursor: pointer;
            color: #1e80ff;
          }
        }
      }
    }
  }
  .tui {
    width: 221px;
    margin-top: 140px;
    margin-left: 916px;
    background-color: #ffffff;
    padding: 10px 10px;
    position: fixed;
    .paga {
      width: 100%;
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
    .icon-tianjiayonghu {
      // color: #8590a6;
      color: #444444;
      margin-left: 10px;
    }
    .tuijian {
      font-size: 14px;
      // color: #8590a6;
      margin-left: 10px;
      color: #444444;
    }
    .users {
      display: flex;
      width: 100%;
      height: 100%;
      .uleft {
        width: 70%;
        .imgs {
          width: 40px;
          height: 40px;
          border-radius: 2px;
          margin-left: 10px;
          margin-top: 10px;
        }
        .usern {
          margin-left: 60px;
          margin-top: -43px;
          font-size: 14px;
        }
        .usern:hover {
          el-col {
            el-text {
              color: #175199;
            }
          }
          cursor: pointer;
        }
        .can {
          margin-left: 60px;
          width: 100%;
          font-size: 13px;
          color: #8590a6;
        }
      }
      .g {
        margin-top: 12px;
      }
    }
  }

  .right {
    width: 200px;
    background-color: #ffffff;
    margin-left: 916px;
    padding: 20px 20px;
    position: fixed;
    display: flex;
    flex-direction: column;
    .abouts {
      width: 100%;
      .tops {
        display: flex;

        .imgs {
          width: 80%;
          height: 50px;
          margin-top: -10px;
          margin-left: -20px;
        }
        .dt {
          font-size: 13.5px;
          margin-top: 10px;
          margin-left: 10px;
          color: #8590a6;
        }
        .dt:hover {
          cursor: pointer;
          color: #1e80ff;
        }
      }
      .number {
        margin-top: 20px;
        button {
          height: 30px;
          width: 100%;
          border: 1px solid #1e80ff;
          color: #1e80ff;
          background: #ffffff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
