<template>
  <div>
    <el-dialog
    :model-value="props.views"
    title="创建收藏夹"
    width="30%"
    @close="cancel"
  >
  <el-input v-model="input" placeholder="请填入收藏夹名字" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="sumbmitInfo">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import $http from '../../api';
import Data from '../../globalResult/global';
const input = ref<string>('')
interface Prop {
  views: boolean
}
type Datas = {
  data: null
}
type eData = {
  foldername: string,
  userid: number
}
const props = withDefaults(defineProps<Prop>(),{
  views: false
})

const emit = defineEmits<
{ ( e: 'changeViews',data: boolean ):void }
>()


const addFolders = async (param: eData) => {
  let { data : res } = await $http.addFolder<Data<Datas>>(param)
    if(res.code === 1001){
      ElNotification({
        title: '成功提示',
        message: '添加成功',
        type: 'success'
      })
      cancel()
    }
}

const cancel = () => {
  input.value = ''
  emit('changeViews',false)
}

const sumbmitInfo = () => {
  const info:eData = {
    foldername: input.value,
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id
  }
  addFolders(info)
}
</script>

<style scoped lang="less">

</style>