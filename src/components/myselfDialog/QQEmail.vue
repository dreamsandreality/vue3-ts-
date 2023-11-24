<template>
  <div>
    <el-dialog :model-value="prop.centerDialogVisible" title="邮箱验证" width="30%" align-center @close="cancelDialog">
      <div class="up">
        <span><a class="ao">*</a>&nbsp;新邮箱账号</span>
        <el-input v-model="QQemail" placeholder="请输入邮箱账号">
          <template #append>
            <el-button type="primary" @click="sendQQEmail" :disabled="disEVE">{{ buttonText }}</el-button>
          </template>
        </el-input>
        <span><a class="ao">*</a>&nbsp;邮箱验证码</span>
        <el-input v-model="code" placeholder="请输入邮箱验证码"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirmSet"> 立即验证 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Data from '../../globalResult/global'
import $http from '/src/api/index.ts'
let QQemail = ref<string>('')
let code = ref<string>('')
let disEVE = ref<boolean>(false)
const router = useRouter()
type Prop = {
  id: number
  centerDialogVisible: boolean
}
type passwordData = {
  data: null
}

type updateEmails = {
  id: number
  email: string
  emailCode: string
}

const prop = withDefaults(defineProps<Prop>(), {
  id: 0,
  centerDialogVisible: false
})

let buttonText = ref<string>('点击发送邮箱验证码')

const emit = defineEmits<{ (e: 'closeDialog', centerDialogVisible: boolean): void }>()

const cancelDialog = (): void => {
  emit('closeDialog', false)
  buttonText.value = '点击发送邮箱验证码'
  QQemail.value = ''
  code.value = ''
  disEVE.value = false
}

const sendEmail = async (email: string) => {
  let { data: res } = await $http.QQEmail<Data<passwordData>>({ email })
  console.log(res)
  if (res.code == 3005) {
    ElMessage.error(res.msg)
    return
  }
  if (res.code == 4001) {
    buttonText.value = '已发送'
    disEVE.value = true
    ElMessage.success('发送验证码成功')
    return
  }
  ElMessage.error(res.msg)
}

/**
 * 发送邮箱
 */
const sendQQEmail = (): void => {
  if (QQemail.value == '') {
    ElMessage.warning('请完成邮箱的填写')
    return
  }
  sendEmail(QQemail.value)
}

const updateEmailOfQQ = async (data: updateEmails) => {
  let { data: res } = await $http.updateQQEmail<Data<passwordData>>(data)
  if (res.code === 3001) {
    ElNotification({
      title: 'Success',
      message: '更改邮箱成功',
      type: 'success'
    })
    const inter = setInterval(() => {
      router.go(0)
      clearInterval(inter)
    }, 800)
    cancelDialog()
    return
  }
  ElMessage.error(res.msg)
}

const confirmSet = (): void => {
  if (QQemail.value.trim() != '' && code.value.trim() != '') {
    const data: updateEmails = {
      id: JSON.parse(localStorage.getItem('user')!).userInfo.id,
      email: QQemail.value,
      emailCode: code.value
    }
    updateEmailOfQQ(data)
    return
  }
  ElMessage.warning('请填写完整信息!')
}
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
