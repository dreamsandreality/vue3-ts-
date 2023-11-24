<template>
  <div class="problem">
    <div class="troduce" v-for="(item,index) in arr" :key="index">
      <div class="left">
        <el-col :span="15">
      <el-text truncated style="font-size: 18px; font-weight: 600;color:black"><span id="condition">1</span>
        <el-tooltip
        class="box-item"
        effect="dark"
        content="你们认为互联网的寒冬来了么?最近的经济形式不好,你们能够通过身边的事情感受到么?"
        placement="top"
      >
      <span id="titles">你们认为互联网的寒冬来了么?最近的经济形式不好,你们能够通过身边的事情感受到么?</span>
      </el-tooltip>
      </el-text>
    </el-col>
      <div class="lbottom">
        <img src="/src/image/默认头像.jpg" alt="" style="width: 25px; height: 25px; border-radius: 50%">
        <span id="username">前端黑马</span>
        <span> · 2023-12-28</span>
        <span> · 28回答</span>
        <span> · 64关注</span>
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
const arr = ref<number[]>([1,2,3,4.5,6])
</script>

<style lang="less" scoped>
.problem{
  .troduce{
    display: flex;
    margin-top: 8px;
    line-height: 32px;
    .left{
      width: 80%;
      #titles{
        margin-left: 20px;
      }
      #titles:hover{
        color: #1e80ff;
        cursor: pointer;
      }
      .lbottom{
        display: flex;
        margin-left: 35px;
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
      #condition{
        font-size: 18px;
        font-weight: 600;
        margin-left: 5px;
        color:#F86464;
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