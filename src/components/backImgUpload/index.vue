<template>
    <el-upload
    class="avatar-uploader"
    :action="uploadURL"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
  <el-button type="info" plain class="avatar">更换背景图</el-button>
  </el-upload>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import Data from '/src/globalResult/global.ts'
import base from '../../api/base'
import $http from '/src/api/index.ts'
type Img = {
  image: string,
  id: number
}
type responseData = {
  data: null
}
let id = ref<number>(0)
const emit = defineEmits<
{ (e:'sendInfo',name: string):void }
>()
const imageUrl = ref('')
let uploadURL = ref<string>('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  emit('sendInfo',response.data)
  updateImgOfDataBase(response.data,id.value)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

/**
 * 获取上传图片路径
 */
const getUploaURl = ():void => {
  uploadURL.value = `/api${base.Upload}`
  const user = JSON.parse(localStorage.getItem('user')!).userInfo
  id.value = user.id
}
/**
 * 更改数据库的背景图信息
 * @param image 
 * @param id 
 */
const updateImgOfDataBase = async (image: string,id: number) => {
  let data: Img = {
    image: image,
    id: id
  }
  let { data : res } = await $http.updateImg<Data<responseData>>(data)
  console.log(res)
}

onMounted(()=>{
  getUploaURl()
})

</script>

<style>
.avatar-uploader .el-upload {
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
</style>