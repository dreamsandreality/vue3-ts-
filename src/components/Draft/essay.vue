<template>
  <div class="allBox">
    <Ipo class="ico" @sendId="changeId" :allNum="allNums" :auditing="auditings" :haveLaunch="haveLaunchs" :through="numbers"></Ipo>
    <div class="essayBox">
      <el-scrollbar :height="heights">
        <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="empty" v-show="empty">
          <el-empty description="没有任何文章哦~" />
        </div>
        <div class="essayItem" v-for="item in myEssays" :key="item.id">
          <div class="left">
            <div class="tto">
              <span style="font-weight: 600" id="title" @click="toContent(item.id)">{{ item.title }}</span>
              <span class="tags" v-show="statusT">
                <el-tag class="ml-2" type="success" v-show="item.status === 1">已发布</el-tag>
                <el-tag class="ml-2" type="warning" v-show="item.status === 0">审核中</el-tag>
                <el-tag class="ml-2" type="danger" v-show="item.status === 2">被禁止</el-tag>
                <el-tag class="ml-2" type="info" v-show="item.status === 3">草稿箱</el-tag>
              </span>
              <el-tag class="ml-2" style="margin-left: 10px" effect="dark" v-show="item.top == 1">置顶</el-tag>
            </div>
            <div class="bottom">
              <span>{{ item.updatetime }}</span>
              <el-divider direction="vertical" class="v" />
              <span>{{ item.views }}阅读 </span>
              <span>&nbsp; · {{ item.likeNum }}点赞 </span>
              <span> &nbsp;· {{ item.comment_num }}评论 </span>
              <span> &nbsp;· {{ item.collect_num }}收藏 </span>
              <el-dropdown class="drop">
                <span>&nbsp;&nbsp;···</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="changeTopStatus(item.id)">{{ item.top === 0 ? '置顶文章' : '取消置顶' }}</el-dropdown-item>
                    <el-dropdown-item @click="toEditEssay(item.id)">编辑文章</el-dropdown-item>
                    <el-dropdown-item @click="deletEssay(item.id)">删除文章</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <el-divider style="margin-top: 15px" />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import $http from '../../api'
import Ipo from '../../components/Draft/top.vue'
import Data from '../../globalResult/global.ts'
type records = {
  countId: null
  current: number
  maxLimit: null
  optimizeCountSql: boolean
  orders: []
  pages: number
  records: Essay
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
  comment_num: number
  collect_num: number
  allNums: number
}[]

type updateData = {
  data: null
}
type TopParam = {
  id: number
}

const allNums = ref<number>(0)
const haveLaunchs = ref<number>(0)
const auditings = ref<number>(0)
const numbers = ref<number>(0)
let height = ref<number>(0)
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
const router = useRouter()
const myEssays = ref<Essay>([])
let heights = ref<string>('100%')
let statusT = ref<boolean>(true)
let deep = ref<boolean>(false)
const changeId = (val: number) => {
  deep.value = true
  switch (val) {
    case 0:
      height.value = -1
      statusT.value = true
      getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8)
      break
    case 1:
      height.value = 1
      getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8, 1)
      break
    case 2:
      height.value = 0
      getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8, 0)
      break
    case 3:
      height.value = 2
      getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8, 2)
      break
    default:
      break
  }
}
const deletEssay = (id: number) => {
  deep.value = false
  ElMessageBox.confirm('此操作将会删除您的文章,确认继续吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      auditings.value = 0
      haveLaunchs.value = 0
      numbers.value = 0
      deleteDraftEssay(id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
/**
 *
 * @param userId 请求文章接口
 * @param pageNum
 * @param pageSize
 */
const getEssayOfDraft = async (userId: number, pageNum: number, pageSize: number, status?: number) => {
  let { data: res } = await $http.getMyDraftEssays<Data<records>>({ userId, pageNum, pageSize, status })
  if (res.code === 4001) {
    loading.value = false
    myEssays.value = res.data.records.map(item => {
      if (!deep.value) {
        switch (item.status) {
          case 0:
            auditings.value++
            break
          case 1:
            haveLaunchs.value++
            break
          case 2:
            numbers.value++
            break
        }
        allNums.value = res.data.total
      }
      item.updatetime = moment(item.updatetime).format('YYYY-MM-DD')
      return item
    })
    heights.value = '600px'
    empty.value = myEssays.value.length > 0 ? false : true
  }
}

/**
 *
 * @param id 删除文章接口
 */
const deleteDraftEssay = async (id: number) => {
  let { data: res } = await $http.deleteEssayOfDraftById({ id })
  if (res.code === 2001) {
    getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8, height.value)
    ElNotification({
      title: '提示',
      message: '删除文章成功',
      type: 'success'
    })
    return
  }
  ElMessage.error(res.msg)
}

/**
 *
 * @param id 根据文章id修改置顶状态
 */
const updateEssayTopStatusById = async (essay: TopParam) => {
  deep.value = true
  let { data: res } = await $http.updateEssayTopStatus<Data<updateData>>(essay)
  if (res.code === 3001) {
    ElNotification({
      title: '提示',
      message: '操作成功',
      type: 'success'
    })
    if (height.value === -1) {
      getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8)
      return
    }
    getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8, height.value)
  }
}
/**
 *
 * @param id 点击修改文章指定状态
 */
const changeTopStatus = (id: number) => {
  const essay: TopParam = {
    id: id
  }
  updateEssayTopStatusById(essay)
}

const toEditEssay = (id: number): void => {
  router.push({
    name: 'writeEssay',
    params: {
      id: Number(id)
    }
  })
}

const toContent = (id: number): void => {
  router.push({
    name: 'aboutEssay-index',
    params: {
      id: id
    }
  })
}

onMounted(() => {
  getEssayOfDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8)
})
</script>

<style lang="less" scoped>
.allBox {
  display: flex;
  flex-direction: column;
  .ico {
  }
  .essayBox {
    position: fixed;
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    margin-left: -10px;
    width: 63%;
    padding-bottom: 20px;
    background: #ffffff;
    .essayItem {
      // display: flex;
      line-height: 30px;
      padding-left: 20px;
      .left {
        // width: 70%;
        display: flex;
        flex-direction: column;
        .v {
          margin-top: 7px;
        }
        .bottom {
          display: flex;
          span {
            font-size: 14px;
            color: #8590a6;
          }
        }
        .tto {
          #title:hover {
            cursor: pointer;
            color: #175199;
          }
          .tags {
            margin-left: 20px;
          }
        }
      }
      .drop {
        margin-top: 8px;
        cursor: pointer;
      }
      .drop:deep(.el-tooltip__trigger:focus-visible) {
        outline: unset;
      }
    }
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  .sk {
    height: 100%;
    background-color: #ffffff;
    margin-top: 15px;
    padding: 20px 20px;
  }
}
</style>
