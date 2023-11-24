<template>
  <div>
    <el-dialog :model-value="prop.centerDialogVisible" title="提出问题" width="30%" center @close="cancel">
      <span>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" class="demo-ruleForm" :size="formSize" status-icon>
          <el-form-item label="" prop="textarea">
            <el-input v-model="ruleForm.textarea" maxlength="30" placeholder="请写下您的问题" show-word-limit type="text" />
          </el-form-item>
          <el-form-item prop="topic">
            <el-button type="primary" :icon="Edit" style="margin-top: 0px" @click="addTopic" v-show="addButtonStatus">添加话题</el-button>
            <el-input v-model="ruleForm.topic" placeholder="输入话题" style="margin-top: 0px; width: 250px" v-show="!addButtonStatus" />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitInfo(ruleFormRef)"> 提交 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import $http from '../../api/index.ts'
import Data from '../../globalResult/global'
import { reactive, ref } from 'vue'
interface Prop {
  centerDialogVisible: boolean
}
interface RuleForm {
  textarea: string
  topic: string
}
interface addProblems {
  create_user: number
  content: string
  status: number
  topic: string
}
type data = {
  data: null
}
type problemsData = {
  records: records
  total: number
  size: number
  current: number
  orders: []
  optimizeCountSql: boolean
  searchCount: boolean
  maxLimit: null
  countId: null
  pages: number
}
type records = {
  id: number
  create_user: number
  content: string
  time: string
  status: number
  topic: string
  answer: number
  userCollectList: []
  userLikeList: []
}[]
const emit = defineEmits<{ (e: 'changeDialogStatus', status: boolean): void }>()
const prop = withDefaults(defineProps<Prop>(), {
  centerDialogVisible: false
})
let page = ref<number>(1)
let pageSize = ref<number>(8)
let addButtonStatus = ref<boolean>(true)
const formSize = ref('default')
const proplemList = ref<records>([])
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  textarea: '',
  topic: ''
})
const rules = reactive<FormRules<RuleForm>>({
  textarea: [{ required: true, message: '请输入您的问题', trigger: 'blur' }],
  topic: [{ required: true, message: '请添加您的话题', trigger: 'blur' }]
})

const submitProblems = async (info: addProblems) => {
  let { data : res } = await $http.addProblems<Data<data>>(info)
    if(res.code === 1001){
      ElNotification({
        title: '提示',
        message: '操作成功',
        type: 'success'
      })
      getAllProblems(page.value,pageSize.value)
      addButtonStatus.value = true
      emit('changeDialogStatus', false)
    }
}

const submitInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const intos: addProblems = {
        create_user: JSON.parse(localStorage.getItem('user')!).userInfo.id,
        content: ruleForm.textarea,
        status: 0,
        topic: ruleForm.topic
      }
      submitProblems(intos)
      formEl.resetFields()
    } else {
      console.log('error submit!', fields)
    }
  })
}

/**
 * 获取所有文章
 * @param page
 * @param pageSize
 */
 const getAllProblems = async (page: number, pageSize: number) => {
  let { data: res } = await $http.getAllProblemsByPage<Data<problemsData>>({page,pageSize})
  if(res.code === 4001){
    proplemList.value = res.data.records
  }
}

const cancel = (formEl: FormInstance | undefined) => {
  addButtonStatus.value = true
  emit('changeDialogStatus', false)
  if (!formEl) return
  formEl.resetFields()
}
const addTopic = (): void => {
  addButtonStatus.value = false
}
</script>

<style scoped lang="less">
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
