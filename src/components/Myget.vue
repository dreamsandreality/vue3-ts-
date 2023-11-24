<template>
  <div class="box">
    <div class="navs">
      <span class="my" v-for="item in navArr" :key="item.id" :class="item.id === heiId ? 'myHight' : 'my'" @click="toPath(item.router)">{{ item.name }}</span>
    </div>
    <div class="views">
      <Views class="cons"></Views>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Views from '../components/myGet-views.vue'
const router = useRouter()
interface nav {
  id: number
  name: string
  router: string
}
const navArr = ref<nav[]>([
  {
    id: 222,
    name: '我收到的赞',
    router: '/like-myGet'
  },
  {
    id: 521,
    name: '我赞过的',
    router: '/like-mySend'
  },
  {
    id: 522,
    name: '回复我的',
    router: '/reply-me'
  }
])
let heiId = ref<number>(222)

const toPath = (path: string):void => {
  router.push(path)
}

watch(
  () => router.currentRoute.value,
  () => {
    if ((router.currentRoute.value.meta.count as number) >= 1) {
      heiId.value = router.currentRoute.value.meta.count as number
    } else {
      heiId.value = 222
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: column;
  .navs {
    display: flex;
    width: 580px;
    padding-left: 20px;
    background-color: #ffffff;
    height: 100%;
    padding-top: 15px;
    padding-bottom: 15px;
    .my {
      color: #5c5c5c;
      margin-right: 25px;
      cursor: pointer;
    }
    .myHight {
      margin-right: 25px;
      cursor: pointer;
      color: #1e80ff;
      font-weight: 600;
    }
  }
  .views {
    .cons {
      // margin-top: 15px;
      padding-right: 10px;
      line-height: 30px;
    }
  }
}
</style>
