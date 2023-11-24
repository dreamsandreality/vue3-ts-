<template>
  <div>
    <el-dialog :model-value="dialogTableVisible" title="我的文章收藏夹" @close="close" class="dia">
      <div id="solder1">
        <span :class="flag ? 'iconfont icon-xiajiantou' : 'iconfont icon-youjiantou'" @click="turnOrClose" id="my">我的收藏夹</span><br />
        <span class="iconfont icon-24gf-folderOpen" style="color: #fee082; margin-left: 10px"></span>
        <span :style="clickHighId == 0 ? 'color: #409eff' : ''" @click="defaultFolder(0)" class="default">默认收藏夹</span><br />
        <span class="manage" style="margin-left: 10px" @click="manageFolder">管理收藏夹</span>
        <div v-for="item in folderList" :key="item.id" class="folderItem" v-show="flag">
          <el-checkbox size="large" v-show="showBox" @change="cheked(item.id)" />
          <span :class="folderJ == true && item.id == clickHighId ? 'iconfont icon-xiajiantou' : 'iconfont icon-youjiantou'" @click="changeTheFolder(item.id)" v-show="item.children.length>0"></span>
          <span class="iconfont icon-24gf-folderOpen" style="color: #fee082; margin-left: 10px"></span>
          <span :style="item.id == clickHighId ? 'color: #409eff' : ''" @click="changeTheFolder(item.id)">{{ item.foldername }}</span>
          <el-row class="w-150px mb-2" v-for="items in item.children" :key="items.id" v-show="folderJ == true && item.id == clickHighId" style="margin-left: 20px">
            <el-text truncated v-html="items.mdcontent" class="elText" @click="toWatchEssay(items.id)"></el-text>
          </el-row>
        </div>
      </div>
      <div class="btns">
        <el-button type="primary" @click="addFolder">创建新的收藏夹</el-button>
        <el-button type="warning" :disabled="idList.length > 0 ? false : true" @click="deleteFolders">删除该收藏夹</el-button>
        <el-button type="success" :disabled="clickHighId == -1 ? true : false" @click="addCollections">选择该收藏夹</el-button>
      </div>
    </el-dialog>
    <Dialog :views="views" @changeViews="changeViews"></Dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { onMounted, ref } from 'vue'
import $http from '../../api'
import Dialog from '../../components/FolderDialog/index-item.vue'
import Data from '../../globalResult/global'
interface Prop {
  dialogTableVisible: boolean
  currentId: number
}

type FolderInfoChildren = {
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
}

type FolderInfo = {
  id: number
  foldername: string
  userid: number
  list: null
  children: FolderInfoChildren[]
}[]

type Datas = {
  data: null
}
type ids = {
  id: number
}
interface FolderParam {
  list: ids[]
  userid: number
}

interface requestCollectionEssayData {
  userid: number
  essayid: number
  folderid: number
}
type responsData = {
  data: null
}

const folderList = ref<FolderInfo>([])
const idList = ref<ids[]>([])
let flag = ref<boolean>(false)
let views = ref<boolean>(false)
let folderJ = ref<boolean>(false)
let showBox = ref<boolean>(false)
const prop = withDefaults(defineProps<Prop>(), {
  dialogTableVisible: false,
  currentId: 0
})

let clickHighId = ref<number>(-1)

const emit = defineEmits<
{ 
  (e: 'changeDialogViews', views: boolean): void,
  (e: 'closeDialogAndRouterPush', id: number,views: boolean): void
  (e: 'changeCollectionColor', isOk: boolean): void
  (e: 'refreshCountOfCollection'):void
}
>()
const close = (): void => {
  emit('changeDialogViews', false)
  flag.value = false
  clickHighId.value = -1
}

const changeViews = (val: boolean): void => {
  views.value = val
  getFoldersOfUser(JSON.parse(localStorage.getItem('user')!).userInfo.id)
}

const addFolder = (): void => {
  views.value = true
}

const turnOrClose = (): void => {
  flag.value = !flag.value
  showBox.value = false
}


/**
 *
 * @param userid 查询自己的收藏夹
 */

const getFoldersOfUser = async (userid: number) => {
  let { data: res } = await $http.getFolders<Data<FolderInfo>>({ userid })
  if (res.code === 4001) {
    folderList.value = res.data
    console.log(res.data)
  }
}
/**
 * 删除收藏夹
 */
const deleteFolders = () => {
  ElMessageBox.confirm('确认删除选中的收藏夹吗?删除过后您收藏的文章将移入默认收藏夹', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const lists: FolderParam = {
        list: idList.value,
        userid: JSON.parse(localStorage.getItem('user')!).userInfo.id
      }
      deleteFolderBts(lists)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
/**
 *
 * @param list 批量删除收藏夹
 */
const deleteFolderBts = async (info: FolderParam) => {
  let { data: res } = await $http.deleteFolderBt<Data<Datas>>(info)
  if (res.code === 2001) {
    ElNotification({
      title: '成功提示',
      message: '删除成功',
      type: 'success'
    })
    getFoldersOfUser(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  }
}

/**
 * 
 * @param collection 收藏文章
 */
const CollectionEssay = async (collection: requestCollectionEssayData) => {
  let { data : res } = await $http.addMyCollectionEssay<Data<responsData>>(collection)
    if(res.code === 1001){
      ElNotification({
        title: '成功提示',
        message: '收藏成功',
        type: 'success'
      })
      emit('changeDialogViews', false)
      emit('changeCollectionColor', true)
      emit('refreshCountOfCollection')
      getFoldersOfUser(JSON.parse(localStorage.getItem('user')!).userInfo.id)
      return
    }
    ElMessage.error(res.msg)
}


const addCollections = () => {
  const collectionInfo: requestCollectionEssayData = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    essayid: prop.currentId,
    folderid: clickHighId.value
  }
  CollectionEssay(collectionInfo)
}

/**
 *
 * @param id 选中收藏夹的操作
 */
const changeTheFolder = (id: number): void => {
  clickHighId.value = id
  folderJ.value = !folderJ.value
}

const defaultFolder = (num: number): void => {
  clickHighId.value = num
}

const manageFolder = (): void => {
  if (flag.value) {
    showBox.value = !showBox.value
  } else {
    flag.value = !flag.value
    showBox.value = !showBox.value
  }
}

/**
 * 
 * @param id 跳转到文章的详情
 */
const toWatchEssay = (id: number):void => {
  emit('closeDialogAndRouterPush',id,false)
}

/**
 *
 * @param id 复选框控制
 */
const cheked = (id: number) => {
  if (idList.value.indexOf(id) != -1) {
    let index = idList.value.indexOf(id)
    idList.value.splice(index, 1)
    console.log(idList.value)
    return
  }
  idList.value.push(id)
}

onMounted(() => {
  getFoldersOfUser(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style scoped lang="less">
.dia {
  height: 100%;
}
.btns {
  margin-top: 60px;
  margin-left: 150px;
}
#solder1 {
  margin-top: -20px;
}
#my:hover {
  cursor: pointer;
  color: #409eff;
}
.folderItem {
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
}
.folderItem:hover {
  color: #409eff;
}
.manage:hover {
  color: #409eff;
  cursor: pointer;
}
.default:hover {
  color: #409eff;
  cursor: pointer;
}
.elText:hover{
  color: #0B8235;
  cursor: pointer;
}
.elText{
  margin-top: 14px;
}
</style>
