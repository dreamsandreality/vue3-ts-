<template>
  <div>
    <div class="content">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="没有您关注的关注的问题哦~" />
      </div>
      <div class="adou" v-for="ele in problemList" :key="ele.id">
        <h3>{{ ele.content }}</h3>
        <span class="bot">{{ ele.time }} · {{ ele.answer }} 个回答 · {{ ele.concern }} 个关注</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import $http from '../api'
import Data from '../globalResult/global'
import moment from 'moment';
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
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
const problemList = ref<problemInfo>([])

/**
 * 
 * @param userId 获取我关注的问题列表
 */
const getMyConcernProblems = async (userId: number) => {
  let { data: res } = await $http.getMyConcernProblem<Data<problemInfo>>({ userId })
    if(res.code === 4001){
      loading.value = false
      console.log(res.data)
      problemList.value = res.data.map(item=>{
        item.time = moment(item.time).format("YYYY-MM-DD")
        return item
      })
    }
    empty.value = problemList.value.length == 0 ? true : false
}

onMounted(()=>{
  getMyConcernProblems(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.content {
  .adou {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    h3:hover {
      color: #175199;
      cursor: pointer;
    }
    .bot {
      font-size: 14px;
      color: #8590a6;
    }
  }
  .sk {
    height: 100%;
    background-color: #ffffff;
    margin-top: 15px;
    padding: 20px 20px;
  }
}
</style>
