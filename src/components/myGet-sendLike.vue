<template>
  <div class="box">
    <div class="alls" v-for="(item, index) in arr" :key="index">
      <div class="tops">
        <img src="../image/默认头像.jpg" alt="" class="img_adv" />&nbsp;
        <span class="user">username&nbsp;&nbsp;</span>
        <span>点赞了你的文章</span>
      </div>
      <div class="centers">
        <span>2023-12-22</span>
      </div>
      <div class="hbox">
        <div class="rtop">
          <span class="title">分享vue前端经验</span>
          <el-tag class="eo" effect="dark" :type="index % 2 === 0? 'success' : ''">文章</el-tag>
        </div>
        <div class="essayC">
          <div class="left">
            <span class="text">
              拥有14年丰富的教学经验，平湖市新埭中学科学教师，中学一级教师。2005年毕业于浙江师范大学生物科学专业，2005.8-2016.8，任教于平湖市城关中学，2016.8至今，任教于平湖市新埭中学。曾荣获“市优质课一等奖”、“ 省基础教育微课二等奖”、“ 平湖市教坛新秀”、“平湖市课题研究成果一等奖”、“
              平湖市青年教师业务水平测试一等奖” 等。在教书育人的道路上，她一直践行着“用智慧去启迪智慧，用人格去塑造人格”。
              拥有14年丰富的教学经验，平湖市新埭中学科学教师，中学一级教师。2005年毕业于浙江师范大学生物科学专业，2005.8-2016.8，任教于平湖市城关中学，2016.8至今，任教于平湖市新埭中学。曾荣获“市优质课一等奖”、“ 省基础教育微课二等奖”、“ 平湖市教坛新秀”、“平湖市课题研究成果一等奖”、“
              平湖市青年教师业务水平测试一等奖” 等。在教书育人的道路上，她一直践行着“用智慧去启迪智慧，用人格去塑造人格”
            </span>
          </div>
          <div class="right">
            <img src="../image/默认头像.jpg" alt="" class="img" />
          </div>
        </div>
      </div>
      <div class="divs">
        <span class="iconfont icon-dianzan" :style="{ color: '#056de8' }"></span>
        <span :style="{ color: '#8590a6' }">&nbsp;20,123&nbsp;&nbsp;&nbsp;</span>
        <span class="iconfont icon-yanjing" :style="{ color: '#8590a6' }">&nbsp;</span>
        <span :style="{ color: '#8590a6' }">1,456&nbsp;&nbsp;&nbsp;</span>
        <span class="iconfont icon-shoucang" :style="{ color: '#8590a6' }">&nbsp;</span>
        <span :style="{ color: '#8590a6' }">1,456</span>
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
  .alls {
    display: flex;
    flex-direction: column;
    .divs {
      margin-left: 34px;
      margin-top: -10px;
      font-size: 13px;
      display: flex;
      .icon-dianzan {
        cursor: pointer;
      }
    }
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
    }
    .centers {
      display: flex;
      span {
        margin-left: 35px;
        margin-top: -10px;
        font-size: 13px;
        color: #8590a6;
      }
    }
    .hbox {
      display: flex;
      flex-direction: column;
      margin-left: 33px;
      margin-top: -5px;
      .rtop {
        display: flex;
        .title {
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
        }
        .eo {
          margin-left: 20px;
          margin-top: 3px;
        }
      }
      .title:hover {
        color: #175199;
      }
      .essayC {
        color: #8590a6;
        font-size: 14px;
        display: flex;
        .left {
          width: 70%;
          height: 80px;
          .text {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
        .right {
          margin-left: 20px;
          margin-top: 8px;
          .img {
            width: 120px;
            height: 80px;
          }
        }
      }
    }
  }
}
</style>
