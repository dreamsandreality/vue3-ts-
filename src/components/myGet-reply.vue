<template>
  <div class="box">
    <div class="allbox">
      <div class="alls" v-for="(item, index) in arr" :key="index">
        <div class="tops">
          <img src="../image/默认头像.jpg" alt="" class="img_adv" />&nbsp;
          <span class="user">username&nbsp;&nbsp;</span>
          <a class="rt">回复了你:&nbsp;&nbsp;</a>
        </div>
        <div class="content">
          <el-col :span="18">
            <el-text truncated>Squeezed,by,parent,element,Squeezed,by,parent,elementSqueezed,by,parent,element</el-text>
          </el-col>
        </div>
        <div class="time">
          <a class="dos">2023-12-28</a>
          <span class="iconfont icon-good dos"></span>
          <span>点赞</span>
          <span class="iconfont icon-pinglun dos"></span>
          <span id="look">回复Ta</span>
          <span class="dos" id="ls">查看</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const arr = ref<number[]>([1, 2, 3, 4, 5, 6, 7])
</script>

<style lang="less" scoped>
.box {
  background: #ffffff;
  width: 580px;
  padding-left: 20px;
  padding-bottom: 10px;
  .allbox {
    margin-top: -10px;
  }
  .alls {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    .tops {
      display: flex;
      .img_adv {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .user {
        color: black;
        font-weight: 600;
      }
      .user:hover {
        color: #175199;
        cursor: pointer;
      }
      .rt {
        color: #8590a6;
      }
    }
    .content{
      margin-left: 35px;
    }
    .time {
      display: flex;
      color: #8590a6;
      font-size: 13px;
      margin-left: 20px;
      margin-top: -10px;
      .dos {
        margin-left: 10px;
      }
      #look {
        margin-top: -0.5px;
      }
      #ls {
        margin-top: -0.5px;
      }
      #ls:hover {
        cursor: pointer;
        color: #0292ff;
        font-weight: 600;
      }
      span:hover {
        cursor: pointer;
        color: #0292ff;
        font-weight: 600;
      }
    }
  }
}
</style>
