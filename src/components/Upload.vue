<template>
  <div>
    <el-upload
    class="avatar-uploader"
    :action="imgURL"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';
import { ref,onMounted,watch } from 'vue';
import base from '../api/base';
import { ElMessage } from 'element-plus'
const imageUrl = ref('')
let imgURL = ref<string>('')
interface Prop {
  imgName: string
}

const prop = withDefaults(defineProps<Prop>(),{
  imgName: ''
})
const emit = defineEmits<
{ (e: 'sendName',name: string):void }
>()

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  emit('sendName',response.data)
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
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
 * 获取上传图片地址
 */
const getURL = () => {
  imgURL.value = `/api${base.Upload}`
}

watch(()=>prop.imgName,()=>{
  if(prop.imgName){
    imageUrl.value = `/api${base.imgUrl}?name=${prop.imgName}`
  }
},{
  immediate: true
})

onMounted(()=>{
  getURL()
})
</script>

<style lang="less" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>