<template>
  <div class="iconf">
    <div class="dis">
      <div class="we">
      <span class="iconfont icon-weixin"></span>
    </div>
    </div>
    <div class="dis">
      <div class="qq">
      <span class="iconfont icon-QQ"></span>
    </div>
    </div>
    <div class="dis">
      <div class="wei">
      <span class="iconfont icon-xinlangweibo"></span>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
.iconf{
  width: 100%;
  display: flex;
  justify-content: space-around;
  .dis{
    width: 100%;
  }
  .we{
    span{
      font-size: 25px;
      color: #07C160;
      cursor: pointer;
    }
  }
  .qq{
    span{
      font-size: 25px;
      color: #50C8FD;
      cursor: pointer;
    }
  }
  .wei{
    span{
      font-size: 25px;
      color: #FB6622;
      cursor: pointer;
    }
  }
}
</style>