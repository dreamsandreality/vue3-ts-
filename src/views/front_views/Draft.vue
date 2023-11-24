<template>
  <div class="box">
    <div class="draft">
      <div class="nav">
        <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item :index="item.count" v-for="(item,index) in topNavArr" :key="item.count" @click="toPad(item.path)">{{ index+1==topNavArr.length?`${item.name}(${draftNum})` : item.name}}</el-menu-item>
  </el-menu>
      </div>
      <div class="all">
        <All></All>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,watch,onMounted } from 'vue'
import { useRouter } from 'vue-router'
import $http from '../../api/index.ts'
import Data from '../../globalResult/global.ts';
import All from '../../components/Draft/draft-index.vue'
const activeIndex = ref<string>('2023')
const router = useRouter()
interface topNav{
  count: string,
  name: string,
  path: string
}
type records= {
    id: number,
    title: string,
    userid: number,
    updatetime: string,
    topicid: number,
    hcontent: string,
    mdcontent: string
    status: number,
    cover: string,
    views: number,
    columnid: number,
    nav_id: number,
    top: number,
    content: null
}[]
type draft = {
    records:records[],
    total: number,
    size: number,
    current: number,
    orders: [],
    optimizeCountSql: boolean,
    searchCount: boolean,
    maxLimit: null,
    countId: null,
    pages: number
}

let page = ref<number>(1)

let draftNum = ref<number>(0)

const topNavArr = ref<topNav[]>([
  {
    count: '2023',
    name: '我的文章',
    path: '/draft-essay'
  },
  {
    count: '2024',
    name: '我的专栏',
    path: '/draft-column'
  },
  {
    count: '2026',
    name: '草稿箱',
    path: '/draft-total'
  }
])

const toPad = (path: string):void => {
  router.push(path)
}

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
/**
 * 
 * @param userId 获取草稿箱的文章接口
 * @param pageNum 
 * @param pageSize 
 */
 const getDraft = async (userId: number,pageNum: number,pageSize: number) => {
  let { data : res } = await $http.getDraftEssay<Data<draft>>({ userId,pageNum,pageSize })
  if(res.code === 4001){
    draftNum.value = res.data.total
    return
  }
}

onMounted(()=>{
  getDraft(JSON.parse(localStorage.getItem('user')!).userInfo.id,page.value,8)
})
watch(()=>router.currentRoute.value,()=>{
  if(router.currentRoute.value.meta.count){
    activeIndex.value = router.currentRoute.value.meta.count as string
  }
},{immediate: true})
</script>

<style lang="less" scoped>
.box{
  .draft{
    width: 950px;
    margin-left: 100px;
    background-color: #FFFFFF;
    // padding-left: 20px;
    padding: 20px 10px;
    height: 100%;
    .nav{
      margin-top: -20px;
     .all{
      display: flex;
      .nv{
        width: 5%;
        border-bottom: 1px solid red;
      }
     }
      .driver{
        width: 100%;
        margin-top: 13px;
      }
    }
  }
}
</style>