<template>
  <div class="writer">
      <div class="yys">
        <div class="troduce" v-for="(item,index) in arr" :key="index">
      <span class="num">1</span>
      <div class="info">
        <img src="/src/image/默认头像.jpg" alt="" style="width: 45px; height: 45px; border-radius: 50%;margin-left: 20px">
        <div class="user">
          <span class="username">黑马前端</span>
          <div class="xx">
            <span>707篇优质文章</span>
            <span> · 12个专栏</span>
            <span> · 56个提问</span>
          </div>
        </div>
      </div>
      <div class="right">
        <span class="iconfont icon-jiarehuoyan"></span>
        <span style="margin-left:0px;margin-right:20px;margin-top:13px">1175粉丝</span>
        <el-divider direction="vertical" style="height: 30px;margin-top:12px"/>
        <el-button type="primary" plain style="margin-top: 12px; margin-left: 20px; width: 100px">关注作者</el-button>
      </div>
   </div>
      </div>
   <Paganation class="pa"></Paganation>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Paganation from '../Paganation/index.vue'
const arr = ref<number[]>([1,2,3,4,5,6])
</script>

<style lang="less" scoped>
.writer{
  .troduce{
    margin-top: 20px;
    display: flex;
    line-height: 25px;
    .num{
      font-weight: 600; 
      margin-left: 5px; 
      font-size: 18px; color: #f86464;
      margin-top: 10px;
    }
    .info{
      display: flex;
      .user{
        display: flex;
        flex-direction: column;
        .username{
        margin-left: 22px;
        font-weight: 600;
      }
      .username:hover{
        cursor: pointer;
        color: #1e80ff;
      }
      .xx{
        margin-left: 22px;
        span{
          color: #8590a6;
          font-size: 13px;
        }
      }
      }
      
    }
    .right{
      display: flex;
      .icon-jiarehuoyan{
        color: red;
        font-size: 22px;
        margin-left: 275px;
        margin-top: 13px;
      }
    }
  }
  .pa {
    margin-top: 30px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>