<template>
  <div class="box">
    <div class="list">
      <span>信息列表</span>
    </div>
    <div class="chat-content">
      <div class="username">
        <span>用户名</span>
      </div>
      <!-- recordContent 聊天记录数组-->
      <div v-for="(itemc, indexc) in recordContent" :key="indexc" class="cons">
        <!-- 对方 -->
        <div class="word" v-if="!itemc.mineMsg">
          <img src="/src/image/默认头像.jpg" />
          <div class="info">
            <p class="time">{{ itemc.nickName }} {{ itemc.timestamp }}</p>
            <div class="info-content">
              <span>{{ itemc.contactText.trim() }}</span>
            </div>
          </div>
        </div>
        <!-- 我的 -->
        <div class="word-my" v-else>
          <div class="info">
            <p class="time">{{ itemc.nickName }} {{ itemc.timestamp }}</p>
            <div class="info-content">
              <span>{{ itemc.contactText.trim() }}</span>
            </div>
          </div>
          <img src="/src/image/默认头像.jpg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const recordContent = ref([
  {
    mineMsg: '你好',
    headUrl: '',
    nickName: 'curry',
    timestamp: '2023-11-23',
    contactText: '你好你好,mimdasd;as;da;lc;amcasckac;ascmaca;'
  },
  {
    mineMsg: '',
    headUrl: '',
    nickName: 'curry',
    timestamp: '2023-11-23',
    contactText: '你好,mimdasd;as;da;lc;amcasckac;ascmaca;'
  },
  {
    mineMsg: '1',
    headUrl: '',
    nickName: 'curry',
    timestamp: '2023-11-23',
    contactText: '你好'
  }
])
</script>

<style scoped lang="less">
.box {
  margin-left: 300px;
  display: flex;
  border-radius: 10px;
  .list{
    height: 590px;
    background: #ffffff;
    margin-left: -200px;
    border-radius: 10px;
    width: 300px;
    border-right: 1px solid #e2e2e2;
    // margin-right: 200px;
  }
  .chat-content {
    height: 550px;
    width: 60%;
    border-radius: 10px;
    padding: 20px;
    // padding-top: 80px;
    background: #ffffff;
    .username {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      margin-top: -8px;
      span {
        font-weight: 600;
      }
    }
    .word {
      display: flex;
      margin-bottom: 60px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: -480px;
      }
      .info {
        margin-left: 10px;
        .time {
          font-size: 12px;
          color: rgba(51, 51, 51, 0.8);
          margin: 0;
          height: 20px;
          line-height: 20px;
          margin-top: -490px;
        }
        .info-content {
          padding: 10px;
          font-size: 14px;
          background: #e2e2e2;
          position: relative;
          margin-top: 8px;
          border-radius: 10px;
          display: flex;
          white-space: normal;
          width: 100%;
          display: flex;
          width: fit-content;
        }
        //小三角形
        .info-content::before {
          position: absolute;
          left: -8px;
          top: 8px;
          content: '';
          border-right: 10px solid #e2e2e2;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
        }
      }
    }

    .word-my {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 60px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: -480px;
      }
      .info {
        width: 90%;
        margin-left: 10px;
        text-align: right;
        .time {
          font-size: 12px;
          color: rgba(51, 51, 51, 0.8);
          margin: 0;
          height: 20px;
          line-height: 20px;
          margin-top: -508px;
          margin-right: 10px;
        }
        .info-content {
          color: #ffffff;
          max-width: 70%;
          padding: 10px;
          font-size: 14px;
          float: right;
          margin-right: 10px;
          position: relative;
          margin-top: 8px;
          background: #1e9fff;
          text-align: left;
          border-radius: 10px;
        }
        //小三角形
        .info-content::after {
          position: absolute;
          right: -8px;
          top: 8px;
          content: '';
          border-left: 10px solid #1e9fff;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
        }
      }
    }
  }
}
</style>
