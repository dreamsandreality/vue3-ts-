<template>
  <div class="layout">
      <div class="m">
      <Menu/>
    </div>
     <div class="context">
      <Context/>
    </div>
  </div>
</template>

<script setup>
import Menu from '../components/Front-Menu.vue'
import Context from '../components/Front-Context.vue'
</script>

<style lang="less" scoped>
.layout{
  display: flex;
  flex-direction: column;
  background-color: #F2F3F5;
  .m{
    flex: 30%;
  }
  .context{
    margin-top: 90px;
    flex: 1;
  }
}
</style>