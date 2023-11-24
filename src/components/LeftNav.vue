<template>
  <div>
    <div class="navs">
      <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div v-for="ele in navLists" :key="ele.id" :class="ele.id == ids ? 'active' : 'dis'" @click="changeActive(ele.id, ele.name)">
        <span :class="ele.icon"></span>
        <span class="spans">{{ ele.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import $http from '../api/index'
import Data from '../globalResult/global'
import { navList } from '../resultType/navList'
const emit = defineEmits<{
  (e: 'changeOb', id: number): void
}>()
const navLists = ref<navList>([])
let ids = ref<number>(2)
let loading = ref<boolean>(true)
const getNavList = async () => {
  let { data: res } = await $http.getNavList<Data<navList>>()
    if(res.code === 4001){
      loading.value = false
    }
  navLists.value = res.data
}

const changeActive = (id: number, name: string): void => {
  ids.value = id
  emit('changeOb', ids.value)
}

onMounted(() => {
  getNavList()
})
</script>

<style lang="less" scoped>
 .sk {
      // width: 100%;
      height: 100%;
      background-color: #ffffff;
      margin-top: -15px;
      padding: 20px 20px;
    }
.navs {
  display: flex;
  width: 200px;
  // align-items: center;
  height: 500px;
  flex-direction: column;
  background-color: #ffffff;
  padding-top: 20px;
  position: fixed;
  .dis {
    cursor: pointer;
    flex: 30%;
    text-align: left;
    color: #8a919f;
    span {
      margin-left: 50px;
      cursor: pointer;
    }
    .spans {
      margin-left: 20px;
    }
  }
  .active {
    flex: 30%;
    text-align: left;
    color: #1e80ff;
    font-weight: 600;
    span {
      margin-left: 50px;
      cursor: pointer;
    }
    .spans {
      margin-left: 20px;
    }
  }
}
</style>
