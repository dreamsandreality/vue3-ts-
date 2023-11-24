<template>
  <div class="essay">
    <div class="co" v-for="(item,index) in arr" :key="index">
      <span class="num">1</span>
      <span>
        <div style="margin-left: 20px; height: 100%">
          <el-col :span="15">
            <el-tooltip class="box-item" effect="dark" content="兄弟,不要试图在业务代码中炫技,兄弟,不要试图在业务代码中炫技" placement="top">
              <el-text truncated>
                <span style="font-weight: 600; font-size: 18px" id="titles">兄弟,不要试图在业务代码中炫技,兄弟,不要试图在业务代码中炫技</span>
              </el-text>
            </el-tooltip>
          </el-col>
          <div class="boc">
            <img src="/src/image/默认头像.jpg" alt="" style="width: 25px; height: 25px; border-radius: 50%; margin-top: 10px" />
            <span class="spo"> <a id="username">前端heim</a><span> · 1094浏览 · 57评论 · 2023-12-28</span></span>
          </div>
        </div>
      </span>
      <span class="iconfont icon-jiarehuoyan" style="color: red; margin-left: 40px; margin-top: 17px"></span>
      <span style="font-size: 20px; margin-top: 12px; margin-left: -0px">1178</span>
      <span style="color: #8590a6; margin-top: 15px; margin-left: 0px">&nbsp;收藏</span>
      <el-divider direction="vertical" style="height: 30px; margin-top: 10px; margin-left: 20px" />
      <el-button type="primary" plain style="margin-top: 10px; margin-left: 20px; width: 100px">收藏</el-button>
    </div>
    <Paganation class="pa"></Paganation>
  </div>
</template>

<script setup lang="ts">
import Paganation from '../Paganation/index.vue'
import { ref } from 'vue'
const arr = ref<number[]>([1,2,3,4,5,6])
</script>

<style lang="less" scoped>
.essay {
  width: 100%;
  .co {
    display: flex;
    margin-top: 18px;
    .num{
      font-weight: 600; 
      margin-left: 5px; 
      font-size: 18px; color: #f86464;
    }
    #titles {
      color: black;
    }
    #titles:hover {
      color: #1e80ff;
      cursor: pointer;
    }
  }
  .boc {
    height: 100%;
    display: flex;
    flex-direction: column;
    .spo {
      margin-top: -22px;
      font-size: 14px;
      color: #8590a6;
      margin-left: 30px;
      #username {
        color: black;
        margin-top: -5px;
      }
      #username:hover {
        color: #1e80ff;
        cursor: pointer;
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
