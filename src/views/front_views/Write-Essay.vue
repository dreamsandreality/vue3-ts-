<template>
  <div class="all">
    <div class="ipt">
      <input type="text" placeholder="请输入标题" v-model="title" />
    </div>
    <div class="editor">
      <mdEditor v-model="content" @getData="updateModelValues" @upload-image="onUploadImg" :fatherData="mdDatas" />
    </div>
    <div class="essays">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" :size="formSize" status-icon>
        <el-form-item label="文章话题" prop="topic">
          <el-select v-model="ruleForm.topicId" placeholder="请选择话题">
            <el-option :label="item.name" :value="item.id" v-for="item in ruleForm.topicLists" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="添加封面" prop="img">
          <Upload @sendName="sendName" :imgName="imgName"></Upload>
        </el-form-item>
        <el-form-item label="选择专栏" prop="column">
          <el-select v-model="ruleForm.colum" placeholder="请选择专栏">
            <el-option :label="item.name" :value="item.id" v-for="item in columnList" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否置顶" required>
          <el-switch v-model="ruleForm.isTop" class="ml-2" style="--el-switch-on-color: #13ce66" />
        </el-form-item>
        <el-form-item label="选择分类" prop="diff">
          <el-select v-model="ruleForm.diff" placeholder="请选择分类">
            <el-option :label="ele.name" :value="ele.id" v-for="ele in ruleForm.diffList" :key="ele.id" @change="test(ele.id)" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> {{ edit ? '修改' : '发布' }} </el-button>
          <el-button @click="resetForm(ruleFormRef)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import base from '../../api/base'
import Data from '../../globalResult/global.ts'
import $http from '/src/api/index.ts'
import mdEditor from '/src/components/MdEditor/index.vue'
import Upload from '/src/components/Upload.vue'
import type { navList } from '/src/resultType/navList'
import type { topicList } from '/src/resultType/topicList'
let content = ref<string>('')
let htmlDatas = ref<string>('')
let mdDatas = ref<string>('')
let title = ref<string>('')
let id = ref<number>(0)
let editId = ref<number>(0)
const router = useRouter()
const route = useRoute()
const $message = getCurrentInstance()?.appContext.config.globalProperties._message
type topicItem = {
  id: number
  name: string
}[]

interface RuleForm {
  isTop: boolean
  colum: string
  diff: string
  topicLists: topicItem
  topicId: string
  diffList: navList
}
type data = {
  id: number
}
type Essay = {
  userid: number
  topicid: number
  hcontent: string
  mdcontent: string
  status: number
  cover: string
  views?: number
  columnid: number
  nav_id: number
  top: number
  title: string
  id?: number
}

type getColumn = {
  id: number
  name: string
  introduce: string
  createuser: number
  createtime: string
  status: number
  essayid: string
  cover: string
  top: number
}
type EssayAndColumn = {
  id: number
  essayid: string
}

type Edit = {
  id: number
  title: string
  userid: number
  updatetime: string
  topicid: number
  hcontent: string
  mdcontent: string
  status: number
  cover: string
  views: number
  columnid: number
  nav_id: number
  top: number
  content: null
  userName: null
  about: null
  essay_num: number
  column_num: number
  fans_num: number
  topicName: string
  likeNum: number
  comment_num: number
  collect_num: number
  columnName: string
  navName: string
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
let imgName = ref<string>('')
let columnList = ref<string[]>([])
let essayId = ref<number>(0)
let edit = ref<boolean>(false)
const ruleForm = reactive<RuleForm>({
  isTop: false,
  colum: '',
  diff: '',
  topicLists: [],
  topicId: '',
  diffList: []
})

const rules = reactive<FormRules<RuleForm>>({
  colum: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change'
    }
  ],
  diff: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'change'
    }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (edit.value) {
    const essay: Essay = {
      id: editId.value,
      userid: id.value,
      topicid: ruleForm.topicId == '' ? 0 : Number(ruleForm.topicId),
      hcontent: htmlDatas.value,
      mdcontent: mdDatas.value,
      status: 0,
      cover: imgName.value,
      columnid: Number(ruleForm.colum),
      nav_id: Number(ruleForm.diff),
      top: ruleForm.isTop == true ? 1 : 0,
      title: title.value
    }
    changeEssayContents(essay)
    return
  } else {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        if (title.value.trim() == '') {
          ElMessage.warning('请输入标题')
          return
        }
        const essay: Essay = {
          userid: id.value,
          topicid: ruleForm.topicId == '' ? 0 : Number(ruleForm.topicId),
          hcontent: htmlDatas.value,
          mdcontent: mdDatas.value,
          status: 0,
          cover: imgName.value,
          views: 0,
          columnid: Number(ruleForm.colum),
          nav_id: Number(ruleForm.diff),
          top: ruleForm.isTop == true ? 1 : 0,
          title: title.value
        }
        getID(essay)
      } else {
        console.log('error submit!', fields)
      }
    })
  }
}

const getID = async (info: Essay) => {
  await addEssay(info)
  if (ruleForm.colum != '') {
    const infos: EssayAndColumn = {
      id: info.columnid,
      essayid: String(essayId.value)
    }
    toAddEssayToColumns(infos)
  }
}

/**
 *
 * @param event 上传图片
 * @param insertImage
 * @param files
 */
const onUploadImg = (insertImage: any, files: string) => {
  console.log(files)
  const FormData1 = new FormData()
  FormData1.append('file', files[0])
  axios.post(`/api${base.Upload}`, FormData1, {}).then(response => {
    if (response.data.code === 200) {
      insertImage({
        url: `/api${base.imgUrl}?name=${response.data.data}`
      })
      return
    }
    ElMessage.error(response.data.msg)
    console.log(response.data)
  })
}

/**
 *
 * @param info 将文章添加到对应的专栏
 */

const toAddEssayToColumns = async (info: EssayAndColumn) => {
  let { data: res } = await $http.addEssaysToColumns(info)
  if (res.code != 3001) {
    ElMessage.error(res.msg)
  }
}

const test = (id: number) => {
  console.log(id)
  console.log(123)
}

/**
 * 发布文章接口
 */
const addEssay = async (essay: Essay) => {
  let { data: res } = await $http.addEssays<Data<data>>(essay)
  console.log(essay)
  if (res.code == 1001 && essay.status === 0) {
    ElNotification({
      title: '提示',
      message: '编辑成功,文章进入后台审核',
      type: 'success'
    })
  }
  if (res.code == 1001 && essay.status === 3) {
    ElNotification({
      title: '提示',
      message: '成功保存到草稿箱,可前往查看',
      type: 'success'
    })
  }
  essayId.value = res.data
  const setT = setTimeout(() => {
    router.push('/draft-essay')
    clearInterval(setT)
  }, 2000)
  if (res.code != 1001) {
    ElMessage.error(res.msg)
  }
}
/**
 *
 * @param id 获取专栏接口
 */
const getColumn = async (id: number) => {
  let { data: res } = await $http.getColumnOfMine<Data<getColumn>>({ id })
  if (res.code == 4001) {
    columnList.value = res.data
    return
  }
  ElMessage.error(res.msg)
}

/**
 *
 * @param val 接收上传组件传来的图片名字
 */

const sendName = (val: string): void => {
  imgName.value = val
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (mdDatas.value.trim() != '') {
    if (title.value.trim() == '') {
      ElMessage.error('请填写标题')
      return
    } else {
      ElMessageBox.confirm('是否将编辑内容保存到草稿箱?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (edit.value) {
            const essay: Essay = {
              id: editId.value,
              userid: id.value,
              topicid: ruleForm.topicId == '' ? 0 : Number(ruleForm.topicId),
              hcontent: htmlDatas.value,
              mdcontent: mdDatas.value,
              status: 3,
              cover: imgName.value,
              views: 0,
              columnid: Number(ruleForm.colum),
              nav_id: Number(ruleForm.diff),
              top: ruleForm.isTop == true ? 1 : 0,
              title: title.value
            }
            changeEssayContents(essay)
          } else {
            const essay: Essay = {
              userid: id.value,
              topicid: ruleForm.topicId == '' ? 0 : Number(ruleForm.topicId),
              hcontent: htmlDatas.value,
              mdcontent: mdDatas.value,
              status: 3,
              cover: imgName.value,
              views: 0,
              columnid: Number(ruleForm.colum),
              nav_id: Number(ruleForm.diff),
              top: ruleForm.isTop == true ? 1 : 0,
              title: title.value
            }
            addEssay(essay)
          }
          formEl!.resetFields()
          router.go(-1)
        })
        .catch(() => {
          $message({
            type: 'info',
            message: '取消保存'
          })
          formEl!.resetFields()
          router.go(-1)
          return
        })
      return
    }
  }
  router.go(-1)
}

const updateModelValues = (mdData: string, htmlData: string) => {
  console.log(content.value)
  mdDatas.value = mdData
  htmlDatas.value = htmlData
}

// 请求话题列表
const getTopicListData = async () => {
  let { data: res } = await $http.getTopicList<RsponseData<topicList>>()
  if (res.code == 4001) {
    ruleForm.topicLists = res.data
  } else {
    $message({
      type: 'error',
      message: '请求出错'
    })
  }
}

// 请求分类列表
const diifLists = async () => {
  let { data: res } = await $http.getDiffList<RsponseData<navList>>()
  id.value = JSON.parse(localStorage.getItem('user')!).userInfo.id
  console.log(res.data)
  if (res.code == 4001) {
    ruleForm.diffList = res.data
  } else {
    $message({
      type: 'error',
      message: '请求出错'
    })
  }
}
/**
 *
 * @param id 获取文章内容
 */
const editMyEssay = async (id: number) => {
  let { data: res } = await $http.editMyEssay<Data<Edit>>({ id })
  if (res.code === 4001) {
    console.log(res)
    edit.value = true
    editId.value = res.data[0].id
    title.value = res.data[0].title
    ruleForm.topicId = res.data[0].topicid
    ruleForm.colum = res.data[0].columnid == 0 ? ruleForm.colum = '' : res.data[0].columnid
    ruleForm.isTop = res.data[0].top == 1 ? true : false
    ruleForm.diff = res.data[0].nav_id
    mdDatas.value = res.data[0].mdcontent
    imgName.value = res.data[0].cover
  }
}

/**
 * 
 * @param essay 修改文章
 */

const changeEssayContents = async (essay: Essay) => {
  let { data: res } = await $http.changeEssayContents<Data<data>>(essay)
  if (res.code === 3001) {
    ElNotification({
      title: '提示',
      message: '编辑成功,文章进入后台审核',
      type: 'success'
    })
  }
  const setT = setTimeout(() => {
    router.push('/draft-essay')
    clearInterval(setT)
  }, 2000)
}

onMounted(() => {
  if (Number(route.params.id) != 0) {
    editMyEssay(Number(route.params.id))
  }
  getTopicListData()
  diifLists()
  getColumn(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style scoped lang="less">
.all {
  display: flex;
  width: 1200px;
  flex-direction: column;
  .ipt {
    width: 1460px;
    height: 50px;
    outline: none;
    margin-left: 25px;
    margin-top: 20px;
    input {
      width: 100%;
      outline: none;
      -webkit-appearance: button;
      -webkit-appearance: none;
      box-sizing: content-box;
      height: 50px;
      padding-left: 20px;
      font-size: 25px;
      font-weight: 600;
      border: none;
    }
    input::placeholder {
      font-weight: 600;
      font-size: 25px;
    }
  }
  .editor {
    width: 1480px;
    margin-left: 25px;
    mdEditor {
      width: 100%;
    }
  }
  .essays {
    height: 100%;
    margin-top: 15px;
    width: 1460px;
    background-color: #ffffff;
    margin-left: 25px;
    padding-top: 20px;
    padding-left: 20px;
    el-form {
      width: 60%;
    }
  }
}
</style>
