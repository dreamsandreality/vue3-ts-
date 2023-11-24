<template>
  <div>
    <div class="croot">
      <div class="box">
        <div class="leftvav">
          <div :class="ele.id === activeId ? 'active' : 'item'" v-for="ele in arr" :key="ele.id" @click="toPath(ele.path,ele.id)">
            <span :class="'iconfont ' + ele.icon"></span>
            <span class="name">{{ ele.name }}</span>
          </div>
        </div>
        <div class="con">
          <ConcerViews class="content"></ConcerViews>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import ConcerViews from '/src/components/ConcernComponent/ConcernViews.vue'
type navItem = {
  id: number
  name: string
  icon: string,
  path: string
}

const router = useRouter()
const route = useRoute()
const arr = ref<navItem[]>([
  {
    id: 1,
    name: '我关注的专栏',
    icon: 'icon-jihe',
    path: '/concern-column'
  },
  {
    id: 3,
    name: '我关注的作者',
    icon: 'icon-touxiang6',
    path: '/concern-writer'
  }
])
let activeId = ref<number>(1)

const toPath = (itemPath: string, id: number):void => {
  router.push(itemPath)
  activeId.value = id
}
watch(()=>router.currentRoute.value,()=>{
  if(router.currentRoute.value.meta.reload){
    activeId.value = router.currentRoute.value.meta.reload as number
  }
},{
  immediate: true
})
</script>

<style lang="less" scoped>
.croot {
  .box {
    display: flex;
    .leftvav {
      position: fixed;
      display: flex;
      width: 200px;
      // align-items: center;
      height: 500px;
      flex-direction: column;
      background-color: #ffffff;
      // padding-top: 20px;
      position: fixed;
      .item {
        display: flex;
        margin-top: 30px;
        color: #8590a6;
        .iconfont {
          margin-left: 20px;
        }
        .name {
          margin-left: 10px;
        }
      }
      .item:hover {
        color: #1e80ff;
        // font-weight: 600;
        cursor: pointer;
      }
    }
  }
  .active {
    display: flex;
    margin-top: 30px;
    color: #8590a6;
    color: #1e80ff;
    font-weight: 600;
    .iconfont {
      margin-left: 20px;
    }
    .name {
      margin-left: 10px;
    }
  }
  .active:hover{
    cursor: pointer;
  }
  .con{
    width: 800px;
    height: 100%;
    background-color: #ffffff;
    margin-left: 220px;
    .content{
      padding-bottom: 10px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
}
</style>
