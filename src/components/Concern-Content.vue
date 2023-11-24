<template>
  <div>
    <div class="content">
      <div class="mys">
        <span class="my" v-for="item in concernArr" :key="item.id" @click="toAbout(item.router,item.id)" :class="item.id == heiId?'active' : ''">{{ item.name }}</span>
      </div>
      <Content class="cons"></Content>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref,watch } from 'vue'
import { useRouter } from 'vue-router'
import Content from '../components/ConcernContent.vue'
const router = useRouter()
type concern = {
  id: number
  name: string
  router: string
}[]
let heiId = ref<number>(24)

let concernArr = ref<concern>([
  {
    id: 24,
    name: '我关注的人',
    router: '/myconcern'
  },
  {
    id: 21,
    name: '关注我的人',
    router: '/concernme'
  },
  {
    id: 22,
    name: '我关注的专栏',
    router: '/concernlmun'
  }
])

const toAbout = (routers: string,id: number) => {
  router.push(routers)
  heiId.value = id
}
watch(()=>router.currentRoute.value,()=>{
  if(router.currentRoute.value.meta.count as number > 0){
    heiId.value = router.currentRoute.value.meta.count as number
  }else{
    heiId.value = 24
  }
},{
  immediate: true
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
  .mys {
    display: flex;
    width: 580px;
    .my {
      color: #5c5c5c;
      margin-right: 25px;
      cursor: pointer;
    }
  }
  .cons{
    margin-top: 15px;
    padding-right: 10px;
    line-height: 30px;
  }
}
.active {
  font-weight: 600;
  margin-right: 25px;
  cursor: pointer;
}
</style>
