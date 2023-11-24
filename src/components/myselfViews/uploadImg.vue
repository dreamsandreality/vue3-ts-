<template>
  <div>
    <el-upload
    class="avatar-uploader"
    :action="URLS"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><User /></el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { onMounted, ref,watch } from 'vue'
import base from '../../api/base'
type Prop = {
  imgName: string,
  url: string
}
let URLS = ref<string>('')
let imageUrl = ref<string>('')
const prop = withDefaults(defineProps<Prop>(),{
  imgName: '',
  url: ''
})
const emit = defineEmits<{
  (e: 'passIMGname', name: string): void
}>()

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  emit('passIMGname', response.data)
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

const getURLS = () => {
  URLS.value = `/api${base.Upload}`
}

watch(()=>prop.url,(newval)=>{
  if(newval == '1') {
    imageUrl.value = '/src/image/默认头像.jpg'
    return
  }
  imageUrl.value = '/api'+base.imgUrl+'?name='+newval 
})

onMounted(() => {
  getURLS()
})
</script>

<style lang="less" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  border-radius: 50%;
}
</style>
<style>

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 48px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
