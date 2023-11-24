<template>
  <div>
    <el-dialog :model-value="prop.centerDialogVisible" title="修改用户昵称" width="30%" align-center @close="cancelDialog">
      <div class="up">
        <span><a class="ao">*</a>&nbsp;用户昵称</span>
        <el-input v-model="input" placeholder="请输入新的用户昵称" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirmSet"> 确认重置 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Data from '../../globalResult/global'
import $http from '/src/api/index.ts'
import userStore from '/src/store/modules/user.ts'
let input = ref('')
type props = {
  centerDialogVisible: boolean
  id: number
}
type UsernameData = {
  data: null
}
const prop = withDefaults(defineProps<props>(), {
  centerDialogVisible: false,
  id: 0
})

const user = userStore()
const router = useRouter()
const emit = defineEmits<{ (e: 'changeDialog', centerDialogVisible: boolean): void }>()

/**
 * 关闭对话框
 */
const cancelDialog = (): void => {
  emit('changeDialog', false)
}

/**
 * 重置用户名接口
 */
const updateUsername = async (param1: string, param2: number) => {
  let { data: res } = await $http.updateUsername<Data<UsernameData>>(param1, param2)
  if (res.code === 3001) {
    const userInfos = JSON.parse(localStorage.getItem('user')!).userInfo
    userInfos.username = param1
    user.saveInfo(userInfos)
    ElMessage.success('修改成功')
    const inter = setTimeout(() => {
      router.go(0)
      clearTimeout(inter)
    }, 800)
    emit('changeDialog', false)
    return
  }
  ElMessage.error(res.msg)
}

/**
 * 确认重置
 */
const confirmSet = (): void => {
  if (input.value.trim() == '') {
    cancelDialog()
    return
  }
  updateUsername(input.value, prop.id)
}

/**
 * 从本地取得用户名
 */
const getUsernameByLocal = (): void => {
  input.value = JSON.parse(localStorage.getItem('user')!).userInfo.username
}

onMounted(() => {
  getUsernameByLocal()
  console.log(JSON.parse(localStorage.getItem('user')!).userInfo.username)
})
</script>

<style lang="less" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.up {
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  line-height: 35px;
  .ao {
    color: red;
  }
}
</style>
