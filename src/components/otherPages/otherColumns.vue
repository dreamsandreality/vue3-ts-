<template>
  <div class="box">
    <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有任何专栏哦~" />
      </div>
    <div class="item" v-for="item in columnArray" :key="item.id">
      <span style="font-weight: 600" class="title">{{ item.name }}</span>
      <el-row class="w-150px mb-2">
        <el-text truncated style="padding-right: 5px;">{{ item.introduce }}</el-text>
      </el-row>
      <div class="bo">
        <span>{{ item.createtime }}</span>
        <el-divider direction="vertical" style="margin-top: 10px" />
        <span>{{ item.essayNum }}篇内容</span>
        <span>&nbsp;&nbsp;·&nbsp;&nbsp;</span>
        <span>{{ item.ordering }}订阅</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import Data from '../../globalResult/global';
import $http from '../../api';
type records = {
  id: number
  name: string
  introduce: string
  createuser: number
  createtime: string
  status: number
  essayid: string
  cover: null
  top: number
  ordering: number
  username: string
  userAdvator: string
  essayNum?: number
}

interface getColumnResponse {
  records: records[]
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

let empty = ref<boolean>(false)
let loading = ref<boolean>(true)
const columnArray = ref<records[]>([])
let page = ref<number>(1)
let pageSize = ref<number>(8)
let currentUserid = ref<number>(0)

const getColumn = async (page: number, pageSize: number, id: number, status?: number) => {
  let { data: res } = await $http.getDraftColumnById<Data<getColumnResponse>>({ page, pageSize, id, status })
  if (res.code === 4001) {
    loading.value = false
    columnArray.value = res.data.records
  }
  empty.value = columnArray.value.length == 0 ? true : false
}

onMounted(()=>{
  currentUserid.value = JSON.parse(sessionStorage.getItem('users')!)
  getColumn(page.value, pageSize.value, currentUserid.value)
})
</script>

<style scoped lang="less">
.box {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    line-height: 28px;
    .title:hover {
      cursor: pointer;
      color: #1e80ff;
    }
    .bo {
      display: flex;
      color: #72777b;
      font-size: 13px;
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
