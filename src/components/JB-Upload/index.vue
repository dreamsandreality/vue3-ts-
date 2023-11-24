<template>
  <div>
    <el-upload
    v-model:file-list="fileList"
    :action="url"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="success"
    :limit="4"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import base from '../../api/base'
let url = ref<string>('')
const fileList = ref<UploadUserFile[]>([
  
])
interface upResult {
  code: number,
  data: string,
  msg: string
}
const listArr = ref<string[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
let updata = ref<string>('')
const emit = defineEmits<
{ (e: 'sendImgData',param: string):void }
>()
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const success = (result: upResult) => {
  console.log(result)
  listArr.value.push(result.data)
  updata.value = listArr.value.join(',')
  emit('sendImgData',updata.value)
}

onMounted(()=>{
  url.value = `/api${base.Upload}`
})
</script>

<style lang="less" scoped>

</style>