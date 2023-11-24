<template>
  <div class="box">
    <div class="backT">
      <el-button text plain :icon="ArrowLeft" type="primary" @click="backMyself">返回我的主页</el-button>
    </div>
    <div class="bo">
      <div class="boLeft">
        <div class="btns">
          <button :class="item.id === height ? 'active iconfont ' + item.icon : 'buttons iconfont ' + item.icon" v-for="item in arr" :key="item.id" @click="changeHight(item.id, item.path)">{{ item.name }}</button>
        </div>
      </div>
      <div class="boRight">
        <Myself></Myself>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Myself from '/src/components/myselfViews/myselfContent.vue'
const router = useRouter()
type btn = {
  id: number
  name: string
  icon: string
  path: string
}
const arr = ref<btn[]>([
  {
    id: 1001,
    name: '个人资料',
    icon: 'icon-wenzhang',
    path: '/about-s'
  },
  {
    id: 2001,
    name: '账号设置',
    icon: 'icon-touxiang',
    path: '/account-s'
  }
])
let height = ref<number>(1001)

const changeHight = (id: number, path: string):void => {
  height.value = id
  router.push(path)
}

const backMyself = ():void => {
  router.push('/mine/myProblem')
}

watch(
  () => router.currentRoute.value,
  () => {
    if ((router.currentRoute.value.meta.count as number) >= 0) {
      height.value = router.currentRoute.value.meta.count as number
    }
  },
  { immediate: true }
)

onMounted(() => {
})
</script>

<style lang="less" scoped>
.box {
  .backT {
    display: flex;
    width: 1170px;
    height: 40px;
    background-color: #ffffff;
    padding-top: 10px;
  }
  .bo {
    display: flex;
    margin-top: 20px;
    .boLeft {
      width: 200px;
      height: 650px;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      .btns {
        width: 100%;
        display: flex;
        flex-direction: column;
        .buttons {
          height: 35px;
          width: 90%;
          margin-left: 10px;
          border: 1px solid #ffffff;
          border-radius: 10px;
          background: #ffffff;
          cursor: pointer;
          margin-top: 15px;
        }
        .bot {
          margin-top: 15px;
        }
      }
    }
    .boRight {
      width: 950px;
      height: 650px;
      background-color: #ffffff;
      margin-left: 20px;
    }
  }
  .active {
    height: 35px;
    width: 90%;
    margin-left: 10px;
    border-radius: 10px;
    border: 1px solid #ffffff;
    background: #eaf2ff;
    cursor: pointer;
    margin-top: 15px;
    color: #1e80ff;
  }
}
</style>
