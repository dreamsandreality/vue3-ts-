<template>
  <div>
    <div class="content">
      <span class="my"> 我的提问 </span>
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="您暂时没有任何提问哦~" />
      </div>
      <div class="texts" v-for="item in proplemList" :key="item.id">
        <h3>{{ item.content }}</h3>
        <span>{{ item.time }} · {{ item.answer }}个回答 · {{ item.userConcernList.length }}个关注</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { onMounted, ref } from 'vue'
import $http from '../api'
import Data from '../globalResult/global'
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
  userConcernList: []
}[]
let page = ref<number>(1)
let pageSize = ref<number>(8)
let loading = ref<boolean>(true)
const proplemList = ref<records>([])
let empty = ref<boolean>(false)
const emit = defineEmits<
 { ( e: 'sendNum',num: number ): void }
>()
/**
 * 获取所有文章
 * @param page
 * @param pageSize
 */
const getAllProblems = async (page: number, pageSize: number, userId: number, status: number) => {
  let { data: res } = await $http.getAllProblemsByPage<Data<problemsData>>({ page, pageSize, userId, status })
  if (res.code === 4001) {
    console.log(res.data.records)
    loading.value = false
    proplemList.value = res.data.records.map(s => {
      s.time = moment(s.time).format('YYYY-MM-DD')
      return s
    })
    empty.value = proplemList.value.length === 0 ? true : false
  }
}
onMounted(() => {
  getAllProblems(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, 1)
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
    margin-top: 20px;
  }
  .texts {
    margin-top: 15px;
    padding-right: 10px;
    line-height: 28px;
    h3 {
      cursor: pointer;
    }
    h3:hover {
      color: #175199;
    }
    span {
      color: #8590a6;
      font-size: 14px;
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
