<template>
  <div class="column">
    <div class="troduce" v-for="(item,index) in arr" :key="index">
      <div class="left">
        <span style="font-size: 18px; font-weight: 600" id="title">系统学习GOLANG</span>
        <div class="intro">
          <span>知识需要成体系,要经得住考验,咱们一起学习GOLANG</span>
        </div>
        <div class="lbottom">
          <img src="/src/image/默认头像.jpg" alt="" style="width: 25px; height: 25px; border-radius: 50%" />
          <span id="username">前端黑马</span>
          <span> · 50篇文章</span>
          <span> · 6个关注</span>
        </div>
      </div>
      <el-button type="primary" plain class="btn">关注</el-button>
    </div>
    <Paganation class="pa"></Paganation>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Paganation from '../Paganation/index.vue'
const arr = ref<number[]>([1,2,3,4])
</script>

<style lang="less" scoped>
.column {
  .troduce {
    display: flex;
    margin-top: 18px;
    line-height: 32px;
    .left {
      width: 80%;
      .intro{
        color: #8590a6;
        font-size: 14px;
      }
      #title:hover{
        cursor: pointer;
        color: #1e80ff;
      }
      .lbottom {
        display: flex;
        span {
          font-size: 14px;
          color: #8590a6;
          margin-left: 10px;
        }
        #username:hover{
          cursor: pointer;
          color: #1e80ff;
        }
      }
    }
    .btn {
      width: 100px;
      margin-top: 30px;
    }
  }
  .pa{
  margin-top: 30px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
}
</style>
