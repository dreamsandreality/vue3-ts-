<template>
  <div class="draftBox">
    <div class="all">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="您的草稿箱空空如也~" />
      </div>
      <div class="essayItem" v-for="item in dataRecords" :key="item.id">
        <div class="left">
          <el-col :span="27">
            <el-text truncated class="title" v-html="item.title"></el-text>
          </el-col>
          <div class="center">
            <el-col :span="20">
              <el-text class="w-100px" truncated v-html="item.mdcontent"></el-text>
            </el-col>
          </div>
          <div class="lbottom">
            <span class="time">{{ item.updatetime }}</span>
            <el-dropdown class="drop">
              <span>&nbsp;&nbsp;···</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="launchEssay(item.id)">发布文章</el-dropdown-item>
                  <el-dropdown-item @click="deletEssay(item.id)">删除文章</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="right" v-show="item.cover">
          <img :src="item.cover == '' ? item.cover : getCover(item.cover)" alt="" class="img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import base from '../../api/base'
import $http from '../../api/index.ts'
import Data from '../../globalResult/global'
type records = {
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
  content: string
}[]
type draft = {
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
type changeEssayStatusOfDraftResponseType = {
  data: null
}

type changeStatusRequestType = {
  id: number
}

const dataRecords = ref<records>([])
let page = ref<number>(1)
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
/**
 *
 * @param id 提示框
 */
const deleteSome = (id: number): void => {
  ElMessageBox.confirm(`确认删除该文章吗?`, '警告', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消删除',
    type: 'warning'
  })
    .then(() => {
      deleteDraftEssay(id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}

const deletEssay = (id: number) => {
  deleteSome(id)
}

/**
 *
 * @param id 删除文章接口
 */
const deleteDraftEssay = async (id: number) => {
  let { data: res } = await $http.deleteEssayOfDraftById({ id })
  if (res.code === 2001) {
    getDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, 1, 8)
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
 * @param userId 获取草稿箱的文章接口
 * @param pageNum
 * @param pageSize
 */
const getDraft = async (userId: number, pageNum: number, pageSize: number) => {
  let { data : res } = await $http.getDraftEssay<Data<draft>>({ userId, pageNum, pageSize })
  console.log('records----------', res.data.records)
  if (res.code === 4001) {
    if (res.data.records.length === 0) {
      empty.value = true
      loading.value = false
    } else {
      loading.value = false
      dataRecords.value = res.data.records.map(item => {
        item.updatetime = moment(item.updatetime).format('YYYY-MM-DD')
        return item
      })
    }
  }
}

const launchEssay = (id: number): void => {
  const essayInfo: changeStatusRequestType = {
    id: id
  }
  changeEssayStatusInDraft(essayInfo)
}

/**
 *
 * @param param 修改文章状态接口
 */
const changeEssayStatusInDraft = async (param: changeStatusRequestType) => {
  let { data: res } = await $http.changeEssayStatusOfDraft<Data<changeEssayStatusOfDraftResponseType>>(param)
  if (res.code === 3001) {
    ElNotification({
      title: '提示',
      message: '发布成功,已进入后台审核',
      type: 'success'
    })
    let timeOut = setTimeout(() => {
      getDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, page.value, 8)
      location.reload()
      clearTimeout(timeOut)
    }, 1500)
    return
  }
}

const getCover = (img: string) => {
  return `/api${base.imgUrl}?name=${img}`
}

onMounted(() => {
  getDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id, page.value, 8)
})
</script>

<style lang="less" scoped>
.draftBox {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  .all {
    margin-top: -20px;
    margin-left: 20px;
  }
  .essayItem {
    display: flex;
    width: 100%;
    margin-top: 20px;
    line-height: 20px;
    // background: aqua;
    .left {
      display: flex;
      flex-direction: column;
      width: 75%;
      // background: aqua;
      .title {
        font-size: 16px;
        font-weight: 600;
        color: black;
        cursor: pointer;
      }
      .title:hover {
        color: #175199;
      }
      .lbottom {
        display: flex;
        // margin-top: 10px;
        .time {
          font-size: 13px;
          color: #8590a6;
        }
        .drop {
          margin-top: 4px;
          cursor: pointer;
          color: #8590a6;
        }
        .drop:deep(.el-tooltip__trigger:focus-visible) {
          outline: unset;
        }
      }
    }
    .right {
      .img {
        width: 110px;
        height: 70px;
        margin-left: 15px;
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
