<template>
  <div>
    <el-dialog :model-value="prop.centerDialogVisible" title="修改密码" width="30%" align-center @close="cancelDialog">
      <div class="up">
        <span v-show="havePwd"><a class="ao">*</a>&nbsp;原密码</span>
        <el-input v-show="havePwd" v-model="pwd1" type="password" placeholder="请输入原密码" show-password />
        <span><a class="ao">*</a>&nbsp;新密码</span>
        <el-input v-model="pwd2" type="password" placeholder="请输入新密码" show-password />
        <span><a class="ao">*</a>&nbsp;确认密码</span>
        <el-input v-model="pwd3" type="password" placeholder="请确认新密码" show-password />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Data from '../../globalResult/global'
import $http from '/src/api/index.ts'
import userStore from '/src/store/modules/user.ts'

type Prop = {
  id: number
  centerDialogVisible: boolean
  passwordExsit: string
}
type passwordData = {
  data: null
}
type updatePwd = {
  id: number
  oldPassword: string
  password: string
}
const user = userStore()
const router = useRouter()
let havePwd = ref<boolean>(true)
let pwd1 = ref<string>('')
let pwd2 = ref<string>('')
let pwd3 = ref<string>('')

const prop = withDefaults(defineProps<Prop>(), {
  id: 0,
  centerDialogVisible: false,
  passwordExsit: ''
})

const emit = defineEmits<{ (e: 'changeDialog', centerDialogVisible: boolean): void }>()

const cancelDialog = () => {
  emit('changeDialog', false)
}

const confirmSet = () => {
  if (havePwd.value) {
    if (pwd1.value.trim() == '' || pwd2.value.trim() == '' || pwd3.value.trim() == '') {
      ElMessage.warning('请完成相应的验证!')
      return
    }
    if (pwd2.value.trim() !== pwd3.value.trim()) {
      ElMessage.warning('两次输入密码不相同,验证失败!')
      return
    }
  }
  if (pwd2.value.trim() !== pwd3.value.trim()) {
    ElMessage.warning('两次输入密码不相同,验证失败!')
    return
  }
  const obj: updatePwd = {
    id: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    oldPassword: pwd1.value,
    password: pwd2.value
  }
  updatePwds(obj)
}

/**
 *
 * @param params 修改密码接口
 */

const updatePwds = async (params: updatePwd) => {
  let { data: res } = await $http.updatePwd<Data<passwordData>>(params)
  if (res.code === 3001) {
    const pwd = JSON.parse(localStorage.getItem('passwordExsit')!)
    if (pwd) {
      localStorage.removeItem('passwordExsit')
      ElMessage.success(res.msg)
      ElMessageBox.confirm('账号登录过期,请重新登录', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          router.replace('/front/login')
          user.clearData()
        })
        .catch(() => {
          router.replace('/front/login')
          user.clearData()
        })
        return
    }
    cancelDialog()
    ElMessage.success('修改成功')
    router.go(0)
    return
  }
  ElMessage.error(res.msg)
}

watch(
  () => prop.passwordExsit,
  () => {
    if (prop.passwordExsit) {
      havePwd.value = true
      return
    }
    havePwd.value = false
  },
  {
    immediate: true
  }
)
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
