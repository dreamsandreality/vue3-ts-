<template>
  <div>
    <el-col :span="24">
      <el-menu
        :default-active="activeStr"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        router
        background-color="#FFFFFF"
      >
      <el-scrollbar height="400px">
        <el-menu-item index="/hot-essay" @click="emit('sendTitle','精选文章榜')">
          <el-icon><Document/></el-icon>
          <span>精选文章榜</span>
        </el-menu-item>
        <el-menu-item index="/hot-column" @click="emit('sendTitle','精选专栏榜')">
          <el-icon><Promotion /></el-icon>
          <span>精选专栏榜</span>
        </el-menu-item>
        <el-menu-item index="/hot-problem" @click="emit('sendTitle','精选问题榜')">
          <el-icon><bell/></el-icon>
          <span>精选问题榜</span>
        </el-menu-item>
        <el-menu-item index="/hot-writer" @click="emit('sendTitle','优质作者榜')">
          <el-icon><user /></el-icon>
          <span>优质作者榜</span>
        </el-menu-item>
      </el-scrollbar>
      </el-menu>
    </el-col>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import Data from '../globalResult/global';
import $http from '../api/index'
import {
  Document,
  User,
  Bell,
  Promotion
} from '@element-plus/icons-vue'

type navInfo = {
  id: number,
  name: string,
  icon: string
}[]

interface Props {
  active: string
}

const props = withDefaults(defineProps<Props>(),{
  active: '1'
})

const route = useRoute()
const router = useRouter()

const emit = defineEmits<{
  (e: 'sendTitle',params: string):void
}>()

let activeStr = ref<string>('1-2')
const navList = ref<navInfo>([])
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
/**
 * 
 * @param name 改变标题文字
 */

const changeTitle = (name: string):void => {
  emit('sendTitle',`精选文章榜 · ${name}`)
}

/**
 * 获取导航栏信息
 */

 const getNavList = async () => {
  let {data:res} = await $http.getHotNav<Data<navInfo>>()
  navList.value = res.data
 }

 watch(()=>props.active,(newval1: string)=>{
  switch(newval1){
    default:
      activeStr.value = route.path
      emit('sendTitle',route.meta.title as string)
  }
 },
 {
  immediate: true
 })

onMounted(()=>{
  getNavList()
})
</script>

<style scoped lang="less">
.el-menu-vertical-demo{
  border: none;
}
/deep/ .is-active{
  background: #1e80ff !important;
  color: #fff !important;
}
</style>