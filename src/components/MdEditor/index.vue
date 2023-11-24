<template>
  <v-md-editor :placeholder="placeholder" :disabled-menus="[]" v-model="newValue" :height="height" @change="handleChange" @copy-code-success="handleCopyCodeSuccess" :model-value="fatherData"></v-md-editor>
</template>
<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue';
const $message = getCurrentInstance()?.appContext.config.globalProperties._message
interface Props {
  modelValue: string
  height?: string // 编辑器的高度
  placeholder?: string
  fatherData?: string
}
interface EmitEvent {
  (e: 'updateModelValue', params1: string): void
  (e: 'getData', params1: string, params2: string): void
}
const props = withDefaults(defineProps<Props>(), {
  height: '600px',
  placeholder: '正文',
})

const emit = defineEmits<EmitEvent>()
const newValue = computed({
  get() {
      return props.modelValue
  },
  set(value: string) {
      emit('updateModelValue', value)
  }
})
// 内容变化时触发的事件。text 为输入的内容，html 为解析之后的 html 字符串。
const handleChange = (text: string, html: string) => {
  emit('getData',text,html)
  // 如果有需要这些值，可以传回给父组件
}

const handleCopyCodeSuccess = (code:string) => {
  console.log(code)
  $message({
    message: '复制成功',
    type: 'success'
  })
}
</script>
<style lang="less" scoped></style>
