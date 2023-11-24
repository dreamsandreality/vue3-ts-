<template>
  <div class="problem_box">
    <div class="left">
      <div class="items">
        <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="item" v-for="item in proplemList" :key="item.id">
          <span class="title">{{ item.content }}</span>
          <text class="txts">
            <a>用户1: &nbsp;</a>
            拥有14年丰富的教学经验，平湖市新埭中学科学教师，中学一级教师。2005年毕业于浙江师范大学生物科学专业，2005.8-2016.8，任教于平湖市城关中学，2016.8至今，任教于平湖市新埭中学。曾荣获“市优质课一等奖”、“ 省基础教育微课二等奖”、“ 平湖市教坛新秀”、“平湖市课题研究成果一等奖”、“
            平湖市青年教师业务水平测试一等奖” 等。在教书育人的道路上，她一直践行着“用智慧去启迪智慧，用人格去塑造人格”。
            拥有14年丰富的教学经验，平湖市新埭中学科学教师，中学一级教师。2005年毕业于浙江师范大学生物科学专业，2005.8-2016.8，任教于平湖市城关中学，2016.8至今，任教于平湖市新埭中学。曾荣获“市优质课一等奖”、“ 省基础教育微课二等奖”、“ 平湖市教坛新秀”、“平湖市课题研究成果一等奖”、“
            平湖市青年教师业务水平测试一等奖” 等。在教书育人的道路上，她一直践行着“用智慧去启迪智慧，用人格去塑造人格”
          </text>
          <div class="bottom">
            <el-button type="primary" plain :icon="CaretTop">赞同</el-button>
            <el-button type="primary" plain :icon="CaretBottom" />&nbsp;&nbsp;&nbsp;
            <div class="fr">
              <div class="p">
                <span class="iconfont icon-pinglun1">&nbsp;</span>
                <span class="s">{{ item.answer }}条回答</span>&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div class="l">
                <span class="iconfont icon-shoucang2">&nbsp;</span>
                <span class="s">收藏</span>&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div class="lo">
                <span class="iconfont icon-xiai">&nbsp;</span>
                <span class="s">喜欢</span>&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div class="dot">
                <span class="iconfont icon-xinfangjubao">&nbsp;</span>
                <span class="s" @click="toReport(1)">举报</span>
              </div>
            </div>
          </div>
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
          <button @click="toAskQustion">我要提问 ></button>
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
    <Dialog :lookRoot="visiable" @changeVisiable="changeVisiable" :jbId="1" :jbType="''"></Dialog>
    <createDialog :centerDialogVisible="dialogStatus" @changeDialogStatus="changeDialogStatus"></createDialog>
  </div>
</template>

<script setup lang="ts">
import { CaretBottom, CaretTop } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import $http from '../../api'
import createDialog from '../../components/Problems/CreateProblems-Dialog.vue'
import Dialog from '../../components/Problems/Problems-Dialog.vue'
import Data from '../../globalResult/global'
type problemsData = {
  records: records
  total: number
  size: number
  current: number
  orders: []
  optimizeCountSql: boolean
  searchCount: boolean
  maxLimit: null
  countId: null
  pages: number
}
type records = {
  id: number
  create_user: number
  content: string
  time: string
  status: number
  topic: string
  answer: number
  userCollectList: []
  userLikeList: []
}[]
let loading = ref<boolean>(true)
const router = useRouter()
const proplemList = ref<records>([])
let page = ref<number>(1)
let pageSize = ref<number>(8)
let dialogStatus = ref<boolean>(false)
let visiable = ref<boolean>(false)
/**
 * 举报
 */
const toReport = (id: number): void => {
  console.log(id)
  visiable.value = true
}
/**
 * 获取所有文章
 * @param page
 * @param pageSize
 */
const getAllProblems = async (page: number, pageSize: number, status: number) => {
  let { data: res } = await $http.getAllProblemsByPage<Data<problemsData>>({ page, pageSize, status })
  if (res.code === 4001) {
    loading.value = false
    proplemList.value = res.data.records
  }
}

const changeVisiable = (val: boolean): void => {
  visiable.value = val
}
const toDraft = (): void => {
  router.push('/draft')
}

const toAskQustion = (): void => {
  dialogStatus.value = true
}

const changeDialogStatus = (val: boolean): void => {
  dialogStatus.value = val
}

onMounted(() => {
  getAllProblems(page.value, pageSize.value, 1)
})
</script>

<style lang="less" scoped>
.problem_box {
  display: flex;
  .left {
    width: 800px;
    background-color: #ffffff;
    padding-left: 25px;
    padding-right: 15px;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .items {
      display: flex;
      flex-direction: column;
      margin-top: -12px;
      .item {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .title {
          font-size: 20px;
          font-weight: 600;
        }
        .title:hover {
          cursor: pointer;
          color: #175199;
        }
        .txts {
          font-size: 14px;
          margin-top: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .bottom {
          margin-top: 10px;
          display: flex;
          .fr {
            margin-top: 5px;
            display: flex;
            color: #8590a6;
            .p {
              .s {
                cursor: pointer;
              }
            }
            .l {
              .s {
                cursor: pointer;
              }
            }
            .lo {
              .s {
                cursor: pointer;
              }
            }
            .dot {
              .s {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
  .right {
    // margin-left: 30px;
    background-color: #ffffff;
    padding: 10px 10px;
    width: 250px;
    height: 500px;
    position: fixed;
    margin-left: 860px;
    .tui {
      margin-top: 20px;
    }

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
      margin-top: 10px;
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
    .abouts {
      width: 100%;
      margin-top: 20px;
      .tops {
        display: flex;

        .imgs {
          width: 80%;
          height: 50px;
          margin-top: -10px;
          margin-left: -10px;
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
  .sk {
    // width: 100%;
    height: 100%;
    background-color: #ffffff;
    margin-top: 15px;
    padding: 20px 20px;
  }
}
</style>
