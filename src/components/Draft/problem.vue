<template>
  <div class="allBox">
    <Ipo class="ico" @sendId="changeId" :allNum="allNums" :auditing="auditings" :haveLaunch="haveLaunchs" :through="numbers"></Ipo>
    <div class="problems">
      <el-scrollbar :height="heights">
        <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="empty" v-show="empty">
          <el-empty description="没有任何内容哦~" />
        </div>
        <div class="problemItem" v-for="item in pronlemsArr" :key="item.id">
          <div class="top">
            <span class="title">{{ item.content }}</span>
            <span v-show="statusT">
              <el-tag class="ml-2" type="success" v-show="item.status === 1">已发布</el-tag>
              <el-tag class="ml-2" type="warning" v-show="item.status === 0">审核中</el-tag>
              <el-tag class="ml-2" type="danger" v-show="item.status === 2">已屏蔽</el-tag>
            </span>
            <el-tag class="ml-2" style="margin-left: 15px; margin-top: 4px" effect="dark" v-show="item.top == 1">置顶</el-tag>
          </div>
          <div class="bottom">
            <!-- <span id="username">爱学前端的小熊</span>
            <el-divider direction="vertical" style="margin-top: 8px" /> -->
            <span style="font-size: 13px; color: #8590a6">{{ item.time }}</span>
            <span style="font-size: 13px; color: #8590a6">&nbsp;· {{ item.answer }} 个回答</span>
            <el-dropdown class="drop">
              <span>&nbsp;&nbsp;···</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="changeTop(item.id)">{{ item.top === 1 ? '取消置顶' : '置顶问题' }}</el-dropdown-item>
                  <el-dropdown-item @click="deletEssay(item.id)">删除问题</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElNotification,ElMessageBox,ElMessage } from 'element-plus'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import $http from '../../api'
import Ipo from '../../components/Draft/top.vue'
import Data from '../../globalResult/global'
const pronlemsArr = ref<records>([])
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
  top: number
  userCollectList: []
  userLikeList: []
}[]
interface changeProblemsTop {
  id: number
}
type Datas = {
  data: null
}
let page = ref<number>(1)
let pageSize = ref<number>(8)
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
let statusT = ref<boolean>(false)
let heights = ref<string>('100%')
let allNums = ref<number>(0)
let haveLaunchs = ref<number>(0)
let auditings = ref<number>(0)
let numbers = ref<number>(0)
let deep = ref<boolean>(false)
let nav = ref<number>(0)
let deletEssay = (id: number) => {
  deep.value = false
  ElMessageBox.confirm('此操作将会删除您的问题,确认继续吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      auditings.value = 0
      haveLaunchs.value = 0
      numbers.value = 0
      deleteProblem(id)
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
 * @param page 获取问题接口
 * @param pageSize
 * @param userId
 */
const getProblemsOfMine = async (page: number, pageSize: number, userId: number, status?: number) => {
  let { data: res } = await $http.getAllProblemsByPage<Data<problemsData>>({ page, pageSize, userId, status })
  if (res.code === 4001) {
    loading.value = false
    pronlemsArr.value = res.data.records.map(item => {
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
      item.time = moment(item.time).format('YYYY-MM-DD')
      return item
    })
  }
  empty.value = pronlemsArr.value.length == 0 ? true : false
}

const changeTop = (val: number): void => {
  const param: changeProblemsTop = {
    id: val
  }
  changeProblemsTopse(param)
}
/**
 * 
 * @param params 置顶接口
 */
const changeProblemsTopse = async (params: changeProblemsTop) => {
  deep.value = true
  let { data: res } = await $http.changeProblemsTops<Data<Datas>>(params)
  if (res.code === 3001) {
    ElNotification({
      title: '提示',
      message: '操作成功',
      type: 'success'
    })
    if (nav.value == 0) {
      getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
      return
    }
    getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, nav.value)
  }
}
/**
 * 
 * @param id 删除问题接口
 */
const deleteProblem = async (id: number) => {
  let { data : res } = await $http.deleteProblems<Data<Datas>>({id})
    if(res.code == 2001){
      ElNotification({
        title: '提示',
        message: '删除成功',
        type: 'success'
      })
    }
    if (nav.value == 0) {
      getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
      return
    }
    getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, nav.value)
}

const changeId = (val: number) => {
  deep.value = true
  empty.value = false
  if (val == 0) {
    statusT.value = true
    getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
  } else {
    statusT.value = false
    switch (val) {
      case 1:
        nav.value = 1
        getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, 1)
        break
      case 2:
        nav.value = 0
        getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, 0)
        break
      case 3:
        nav.value = 2
        getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, 2)
        break
    }
  }
}
onMounted(() => {
  statusT.value = true
  getProblemsOfMine(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.allBox {
  display: flex;
  flex-direction: column;
  .ico {
  }
  .problems {
    display: flex;
    flex-direction: column;
    // margin-top: 20px;
    margin-left: 20px;
    .problemItem {
      display: flex;
      flex-direction: column;
      width: 700px;
      line-height: 30px;
      margin-top: 20px;
      .top {
        display: flex;
        .title {
          font-size: 17px;
          font-weight: 600;
        }
        .title:hover{
          cursor: pointer;
          color: #175199;
        }
      }
      .bottom {
        display: flex;
        #username {
          font-size: 13px;
          color: #8590a6;
        }
        .drop {
          margin-top: 8px;
          cursor: pointer;
        }
        .drop:deep(.el-tooltip__trigger:focus-visible) {
          outline: unset;
        }
        #username:hover {
          cursor: pointer;
          // color: #175199;
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
