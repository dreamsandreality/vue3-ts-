<template>
 <div>
<el-dialog :model-value="props.centerDialogVisible" title="新建专栏" width="30%" @close="cancel" center>
  <el-form
    ref="ruleFormRef"
    :model="formLabelAlign"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
    :label-position="labelPosition"
  >
    <el-form-item label="专栏名字" prop="name">
      <el-input
    v-model="formLabelAlign.name"
    maxlength="30"
    placeholder="输入您的专栏名字"
    show-word-limit
    type="text"
  />
    </el-form-item>
    <el-form-item label="专栏简介" prop="introduce">
      <el-input
    v-model="formLabelAlign.introduce"
    maxlength="150"
    placeholder="输入您的专栏简介"
    show-word-limit
    type="textarea"
  />
    </el-form-item>
  </el-form>
  <template #footer>
    <span>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="sureAdd(ruleFormRef)">创建专栏</el-button>
    </span>
  </template>
</el-dialog>
 </div>
</template>
<script lang="ts" setup>
import { ref,reactive } from 'vue'
import { useRouter } from 'vue-router';
import Data from '../globalResult/global';
import $http from '../api/index.ts'
import { ElNotification,ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
type Props = {
  centerDialogVisible: boolean
}
type data = {
  data: null
}
interface RuleForm{
  textarea: string,
  text: string
}
type Column = {
  name: string
  status: number
  introduce: string
  createuser: number
}

const router = useRouter()
const labelPosition = ref('top')
const formLabelAlign = reactive({
  name: '',
  introduce: ''
})
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入专栏名字', trigger: 'blur' },
    { min: 3, max: 30, message: '长度最大限制为30个字', trigger: 'blur' },
  ],
  introduce: [
    { required: true, message: '请输入专栏简介', trigger: 'blur' },
    { min: 3, max: 150, message: '长度最大限制为150个字', trigger: 'blur' },
  ],
})
const props = withDefaults(defineProps<Props>(), {
  centerDialogVisible: false
})

const emit = defineEmits<
{
  (e: 'changeOpen', centerDialogVisible: boolean):void
}
>()
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
/**
 * 取消对话框
 */
const cancel = () => {
  emit('changeOpen', false)
  resetForm(ruleFormRef.value)
}

/**
 * 确认创建专栏
 */
 const sureAdd = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const column: Column = {
        name: formLabelAlign.name,
        status: 0,
        introduce: formLabelAlign.introduce,
        createuser: JSON.parse(localStorage.getItem('user')!).userInfo.id
      }
      addColumn(column)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const addColumn = async (colum: Column) => {
  let { data : res } = await $http.addColumns<Data<data>>(colum)
  if(res.code == 1001){
    ElNotification({
    title: 'Success',
    message: '创建专栏成功',
    type: 'success',
  })
  emit('changeOpen', false)
  return
  }
  ElMessage.error(res.msg)
}

</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
