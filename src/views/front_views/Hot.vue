<template>
  <div class="hotroot">
    <div class="bg">
      <div class="imgs">
        <img src="/src/image/articles.4fc52d9.png" alt="" class="imga">
        <Menu class="menu" :active="str" @sendTitle="sendTitle"></Menu>
        <div class="bang">
          <span class="h6">{{ title }}</span>
          <span class="iconfont icon-wenhao"></span>
          <HotContent></HotContent>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from '/src/components/RecomondMenu.vue';
import HotContent from '../../components/HotContent.vue';
import { onMounted,ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
let str = ref<string>('')
let title = ref<string>('')

const sendTitle = (val: string):void => {
  title.value = val
}

onMounted(()=>{
  str.value = Number(route.params.info).toString()
})
</script>

<style lang="less" scoped>
.hotroot {
  .bg {
    width: 1520px;
    height: 90vh;
    background-color: #ffffff;
    margin-left: -150px;
    margin-top: -20px;
    .imgs{
      // margin-left: -380px;
      width: 100%;
      display: flex;
      height: 500px;
      background: linear-gradient(#DDECFF,#FFFFFF);
      position: fixed;
      .imga{
        width: 100%;
        height: 500px;
      }
      .menu{
        margin-left: 100px;
        width: 310px;
        background-color: #FFFFFF;
        margin-top: 110px;
        position: fixed;
        height: 400px;
      }
      .bang{
        width: 900px;
        height: 500px;
        background-color: #FFFFFF;
        margin-top: 110px;
        margin-left: -1080px;
        border-radius: 5px;
        padding-top: 15px;
        padding-left: 15px;
        .h6{
          font-size: 20px;
        }
        .rel{
          margin-top: 20px;
        }
      }
    }
  }
  .icon-wenhao{
    margin-left: 10px;
    position: relative;
    top: -1px;
    color: #D0D3D9;
  }
}
</style>
