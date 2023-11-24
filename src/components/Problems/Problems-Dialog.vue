<template>
  <div>
    <el-dialog :model-value="props.lookRoot" title="举报" width="30%" center @close="cancel" class="box">
      <div class="title">
        <span style="color: red; font-weight: 600; font-size: 18px">*&nbsp;</span>
        <span style="font-size: 17px; font-weight: 600; color: black">请选择举报类型</span>
      </div>
      <div class="items">
        <div class="butt" v-for="ele in forItem" :key="ele.id">
          <el-button @click="getInfo(ele.name, ele.id)" :type="ele.id === hightId ? 'primary' : ''">{{ ele.name }}</el-button>
        </div>
      </div>
      <div class="afBox" v-show="isClick">
        <div class="trea">
          <el-input v-model="textarea" maxlength="150" placeholder="请输入描述" show-word-limit type="textarea" />
        </div>
        <div class="uploa">
          <div class="text">
            <span style="color: red; font-weight: 600; font-size: 18px">*</span>
            <span style="font-size: 17px; font-weight: 600; color: black">请上传相关照片或者截图</span>
          </div>
          <Upload class="upload" @sendImgData="sendImgData"></Upload>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="sureReport"> 确认举报 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';
import { ref } from 'vue';
import $http from '../../api/index.ts';
import Data from '../../globalResult/global';
import Upload from '../JB-Upload/index.vue';
type props = {
  lookRoot: boolean
  jbId: number,
  jbType: string,
  ruserid: number
}
let hightId = ref<number>(13)
let textarea = ref<string>('')
let imageData = ref<string>('')
let reportType = ref<string>('')
let isClick = ref<boolean>(false)
interface refs {
  id: number
  name: string
}
interface reportRequstData {
  userid: number
  ruserid: number
  rid: number
  ritem: string
  rcontent: string
  img: string
  rtype: number
}
const forItem = ref<refs[]>([
  {
    id: 1,
    name: '涉政有害'
  },
  {
    id: 2,
    name: '不友善'
  },
  {
    id: 3,
    name: '垃圾广告'
  },
  {
    id: 4,
    name: '违法违规'
  },
  {
    id: 5,
    name: '色情低俗'
  },
  {
    id: 6,
    name: '涉嫌侵权'
  },
  {
    id: 7,
    name: '网络暴力'
  },
  {
    id: 8,
    name: '涉未成年'
  },
  {
    id: 9,
    name: '自杀自残'
  },
  {
    id: 10,
    name: '不实信息'
  },
  {
    id: 11,
    name: '抄袭我的内容'
  },
  {
    id: 12,
    name: '扰乱社区秩序'
  }
])

const props = withDefaults(defineProps<props>(), {
  lookRoot: false,
  jbId: 0,
  jbType: '',
  ruserid: 0
})

/**
 *
 * @param name 获取举报类型
 */
const getInfo = (name: string, id: number): void => {
  reportType.value = name
  hightId.value = id
  isClick.value = true
}

const emit = defineEmits<{ (e: 'changeVisiable', lookRoot: boolean): void }>()


/**
 *
 * @param val 举报接口
 */
const reportInterface = async (requestData: reportRequstData) => {
  let { data : res } = await $http.reportEssayOrProblem<Data<null>>(requestData)
    if(res.code === 1001){
      emit('changeVisiable', false)
      ElNotification({
        title: '成功提示',
        message: '举报成功',
        type: 'success'
      })
    }
}

const sendImgData = (val: string):void => {
  imageData.value = val
}

/**
 * 确认举报
 */

const sureReport = (): void => {
  const requestData: reportRequstData = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    ruserid: props.ruserid,
    rid: props.jbId,
    ritem: reportType.value,
    rcontent: textarea.value,
    img: imageData.value,
    rtype: props.jbType == '文章' ? 1 : 0
  }
  console.log(requestData.rcontent)
  reportInterface(requestData)
  isClick.value = false
}

const cancel = (): void => {
  emit('changeVisiable', false)
  isClick.value = false
  hightId.value = 13
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  display: flex;
  justify-content: space-around;
  .items {
    width: 100%;
    // background: red;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    line-height: 20px;
    .butt {
      margin-top: 15px;
      margin-left: 10px;
    }
  }
  .trea {
    margin-top: 20px;
    margin-left: 12px;
  }
  .uploa {
    margin-left: 14px;
    margin-top: 20px;
    .text {
      padding-bottom: 20px;
    }
    .upload {
      margin-left: 10px;
    }
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
