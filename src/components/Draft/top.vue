<template>
  <div class="navBox">
    <div class="every" v-for="item in navBox" :key="item.id" :style="item.id == 1 ? 'margin-left: -15px' : ''" @click="change(item.id)">
      <span :class="item.id == heighId ? 'active' : 'normal'">{{ item.name }}</span>
      <span :class="item.id == heighId ? 'active' : 'normal'">({{ item.num }})</span>
      <span v-show="item.id != navBox.length" class="normal"><el-divider direction="vertical" style="margin-left: 23px" /></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';
type box = {
  id: number
  name: string
  num: number
}[]

interface Prop {
  allNum: number
  haveLaunch: number
  auditing: number
  through: number
}
const prop = withDefaults(defineProps<Prop>(),{
  allNum: 0,
  haveLaunch: 0,
  auditing: 0,
  through: 0
})
console.log(prop.allNum)
const emit = defineEmits<{
(e: 'sendId', id: number): void
}
>()
const navBox = ref<box>([
  {
    id: 0,
    name: '全部',
    num: 0
  },
  {
    id: 1,
    name: '已发布',
    num: 0
  },
  {
    id: 2,
    name: '审核中',
    num: 0
  },
  {
    id: 3,
    name: '未通过',
    num: 0
  }
])
let heighId = ref<number>(0)

const change = (id: number) => {
  heighId.value = id
  emit('sendId',id)
}
watch(()=>[prop.allNum,prop.auditing,prop.haveLaunch,prop.through],()=>{
  navBox.value[0].num = prop.allNum
  navBox.value[1].num = prop.haveLaunch
  navBox.value[2].num = prop.auditing
  navBox.value[3].num = prop.through
},
{
  immediate: true,
  deep: true
})
</script>

<style lang="less" scoped>
.navBox {
  display: flex;
  margin-top: 20px;
  margin-left: 20px;
  .every {
    width: 120px;
    .active {
      color: #1e80ff;
      cursor: pointer;
    }
    .normal {
      cursor: pointer;
    }
  }
}
</style>
