<template>
  <div>
    <div class="content">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="您关注的专栏为空哦~" />
      </div>
      <div class="adou" v-for="ele in columnIf" :key="ele.id">
        <h3>{{ ele.name }}</h3>
        <span class="tro">{{ ele.introduce }}</span>
        <span class="bot">{{ ele.essayNum }} 篇内容 · {{ ele.ordering }} 关注</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import Data from '../globalResult/global';
import $http from '../api';
type ColumnInfo = {
  id: number
  name: string
  introduce: string
  createuser: number
  createtime: string
  status: number
  essayid: string
  cover: string
  top: number
  ordering: number
  username: string
  userAdvator: string
  essayNum: number
}[]
const columnIf = ref<ColumnInfo>([])
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)

/**
 * 
 * @param userId 获取关注的专栏列表
 */
const getMyConcernColumn = async (userId: number) => {
  let { data : res } = await $http.getMyConcernColumn<Data<ColumnInfo>>({ userId })
    if(res.code === 4001){
      loading.value = false
      columnIf.value = res.data
    }
    empty.value = columnIf.value.length == 0 ? true : false
}
onMounted(()=> {
  getMyConcernColumn(JSON.parse(localStorage.getItem('user')!).userInfo.id)
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
    .tro {
      color: #828282;
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
