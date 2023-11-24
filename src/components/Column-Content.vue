<template>
  <div>
    <div class="content">
      <span class="my">我的专栏</span>
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有任何专栏哦~" />
      </div>
      <div class="texts" v-for="item in columnArray" :key="item.id">
        <h3>{{ item.name }}</h3>
        <div class="bottom">
          <span class="troduce">{{ item.introduce }}</span>
          <span class="of">{{ item.essayNum }}篇内容 · {{ item.ordering }}订阅</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import $http from '../api'
import Data from '../globalResult/global'
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
const getColumn = async (page: number, pageSize: number, id: number, status?: number) => {
  let { data: res } = await $http.getDraftColumnById<Data<getColumnResponse>>({ page, pageSize, id, status })
  if (res.code === 4001) {
    loading.value = false
    columnArray.value = res.data.records
  }
  empty.value = columnArray.value.length == 0 ? true : false
}
onMounted(()=> {
  getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.content {
  width: 580px;
  padding-left: 20px;
  background-color: #ffffff;
  height: 100%;
  padding-top: 15px;
  padding-bottom: 15px;

  .my {
    font-weight: 600;
  }
  .texts {
    padding-right: 10px;
    line-height: 28px;
    margin-top: 10px;
    cursor: pointer;
    .bottom {
      height: 100%;
      display: flex;
      flex-direction: column;
      .troduce {
        color: #8590a6;
      }
      .of {
        color: #8590a6;
        font-size: 14px;
        padding-top: -10px;
      }
    }
  }
  .texts:hover {
    color: #175199;
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
