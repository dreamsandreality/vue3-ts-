<template>
  <div>
    <el-dialog :model-value="props.centerDialogVisible" title="修改介绍" width="30%" @close="cancel" center>
      <el-form ref="ruleFormRef" :model="formLabelAlign" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize" status-icon :label-position="labelPosition">
        <el-form-item label="专栏名字" prop="name">
          <el-input v-model="formLabelAlign.name" maxlength="30" placeholder="输入您的专栏名字" show-word-limit disabled type="text" />
        </el-form-item>
        <el-form-item label="专栏简介" prop="introduce">
          <el-input v-model="formLabelAlign.introduce" maxlength="150" placeholder="输入您的专栏简介" show-word-limit type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="sureAdd(ruleFormRef)">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref,watch } from 'vue'
import $http from '../../api/index.ts'
import Data from '../../globalResult/global'
import { ElNotification } from 'element-plus'
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
type Props = {
  id: number,
  centerDialogVisible: boolean,
  name: string,
  introduce: string
}
interface RuleForm {
  textarea: string
  text: string,
  id: number
}
type Info = {
  id: number,
  introduce: string
}
type data = {
  data: null
}

const labelPosition = ref('top')
const formLabelAlign = reactive({
  id: 0,
  name: '',
  introduce: ''
})
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入专栏名字', trigger: 'blur' },
    { min: 3, max: 30, message: '长度最大限制为30个字', trigger: 'blur' }
  ],
  introduce: [
    { required: true, message: '请输入专栏简介', trigger: 'blur' },
    { min: 3, max: 150, message: '长度最大限制为150个字', trigger: 'blur' }
  ]
})
const props = withDefaults(defineProps<Props>(), {
  centerDialogVisible: false,
  name: '',
  introduce: '',
  id: 0
})

const emit = defineEmits<{
  (e: 'changeOpen', centerDialogVisible: boolean): void
  (e: 'requestAgain', getColumn: boolean):void
}>()
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
      const info: Info ={
        id: formLabelAlign.id,
        introduce: formLabelAlign.introduce
      } 
      updateIntroduce(info)
    } else {
      console.log('error submit!', fields)
    }
  })
}

const updateIntroduce = async (info: Info) => {
  let { data : res } = await $http.upIntroduceInfo<Data<data>>(info)
    if(res.code === 3001){
      ElNotification({
        title: '成功提示',
        message: res.msg,
        type: 'success'
      })
      emit('requestAgain',true)
    }
}

watch(()=>[props.name,props.introduce,props.id],()=>{
  formLabelAlign.name = props.name
  formLabelAlign.introduce = props.introduce
  formLabelAlign.id = props.id
},{
  immediate: true,
  deep: true
}

)


</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
