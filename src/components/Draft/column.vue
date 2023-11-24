<template>
  <div class="allBox">
    <Ipo class="ico" @sendId="changeId" :allNum="allNums" :auditing="auditings" :haveLaunch="haveLaunchs" :through="numbers"></Ipo>
    <div class="columns">
      <el-scrollbar :height="heights">
        <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="empty" v-show="empty">
          <el-empty description="没有任何专栏哦~" />
        </div>
        <div class="columnItem" v-for="item in columnArray" :key="item.id">
          <div class="left">
            <div class="ltop">
              <el-col :span="10">
                <el-text truncated class="title">{{ item.name }}</el-text>
                <span v-show="statusT">
                  <el-tag class="ml-2" type="success" v-show="item.status === 1">已发布</el-tag>
                  <el-tag class="ml-2" type="warning" v-show="item.status === 0">审核中</el-tag>
                  <el-tag class="ml-2" type="danger" v-show="item.status === 2">未通过</el-tag>
                </span>
                <el-tag class="TopTags" effect="dark" v-show="item.top == 1">置顶</el-tag>
              </el-col>
            </div>
            <div class="lcenter">
              <span>{{ item.introduce }}</span>
            </div>
            <div class="lbottom">
              <span style="font-size: 13px; color: #8590a6">{{ item.createtime }}</span>
              <span style="font-size: 13px; color: #8590a6">&nbsp;· {{ item.essayNum }}篇文章</span>
              <span style="font-size: 13px; color: #8590a6">&nbsp;· {{ item.ordering }}订阅</span>
              <el-dropdown class="drop">
                <span>&nbsp;&nbsp;···</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>管理内容</el-dropdown-item>
                    <el-dropdown-item @click="modifyIntroduce(item.name, item.introduce, item.id)">修改介绍</el-dropdown-item>
                    <el-dropdown-item @click="changeColumnTop(item.id)">{{ item.top === 1 ? '取消置顶' : '将其置顶' }}</el-dropdown-item>
                    <el-dropdown-item @click="deletEssay(item.id)">删除专栏</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <Dialog :centerDialogVisible="centerDialogVisibles" @changeOpen="changeOpen" :name="name" :introduce="introduce" :id="columnId" @requestAgain="requestAgain"></Dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import $http from '../../api'
import Dialog from '../../components/Draft/modifyColumnDialog.vue'
import Data from '../../globalResult/global'
import Ipo from '../Draft/top.vue'
const deletEssay = (id: number) => {
  deep.value = false
  ElMessageBox.confirm('确认删除这篇专栏吗?', '警告', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消删除',
    type: 'warning'
  })
    .then(() => {
      auditings.value = 0
      haveLaunchs.value = 0
      numbers.value = 0
      deleteColumnsById(id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
const centerDialogVisibles = ref<boolean>(false)
type records = {
  id: number
  name: string
  introduce: string
  createuser: number
  createtime: string
  status: number
  essayid: string
  cover: null
  top: number
  ordering: number,
  username: string
  userAdvator: string
  essayNum?: number
}

interface getColumnResponse {
  records: records[]
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

interface info {
  id: number
}
type datas = {
  data: null
}
const columnArray = ref<records[]>([])
let name = ref<string>('')
let columnId = ref<number>(0)
let introduce = ref<string>('')
let statusT = ref<boolean>(true)
let page = ref<number>(1)
let pageSize = ref<number>(8)
let columnStatus = ref<number>(521)
let heights = ref<string>('100%')
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
let allNums = ref<number>(0)
let haveLaunchs = ref<number>(0)
let auditings = ref<number>(0)
let numbers = ref<number>(0)
let deep = ref<boolean>(false)
let changeId = (val: number) => {
  deep.value = true
  if (val == 0) {
    statusT.value = true
    columnStatus.value = 521
    getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
    return
  }
  if (val == 2) {
    statusT.value = false
    columnStatus.value = 0
    getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, 0)
    return
  }
  if (val == 3) {
    statusT.value = false
    columnStatus.value = 2
    getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, 2)
    return
  } else {
    statusT.value = false
    columnStatus.value = val
    getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, val)
    return
  }
}
/**
 *
 * @param page 查询本人的所有专栏
 * @param pageSize
 * @param id
 */

const getColumn = async (page: number, pageSize: number, id: number, status?: number) => {
  columnArray.value = []
  let { data: res } = await $http.getDraftColumnById<Data<getColumnResponse>>({ page, pageSize, id, status })
  if (res.code === 4001) {
    loading.value = false
    columnArray.value = res.data.records.map(item => {
      if (!deep.value) {
        switch (item.status) {
          case 0:
            auditings.value++
            break
          case 1:
            haveLaunchs.value++
            break
          case 2:
            numbers.value++
            break
        }
        allNums.value = res.data.total
      }

      item.createtime = moment(item.createtime).format('YYYY-MM-DD')
      item.essayNum = item.essayid == null ? 0 : item.essayid.split(',').length - 1
      return item
    })
  }
  empty.value = columnArray.value.length == 0 ? true : false
}
/**
 *
 * @param id 根据id删除专栏接口
 */
const deleteColumnsById = async (id: number) => {
  let { data: res } = await $http.deleteColumn<Data<datas>>({ id })
  if (res.code === 2001) {
    ElNotification({
      title: '成功提示',
      message: '删除成功',
      type: 'success'
    })
    columnStatus.value == 521 ? getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id) : getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, columnStatus.value)
    return
  }
}

const modifyIntroduce = (names: string, introduces: string, id: number) => {
  centerDialogVisibles.value = true
  name.value = names
  introduce.value = introduces
  columnId.value = id
}
/**
 *
 * @param info 修改置顶状态接口
 */
const changeTopStatusOfColumn = async (info: info) => {
  deep.value = true
  let { data: res } = await $http.changeTopStatusOfColumn<Data<datas>>(info)
  if (res.code === 3001) {
    ElNotification({
      title: '成功提示',
      message: '操作成功',
      type: 'success'
    })
  }
  if (statusT.value) {
    getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
    return
  }
  getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, columnStatus.value)
}

/**
 *
 * @param id 修改是否置顶的点击事件
 */
const changeColumnTop = (id: number): void => {
  const column: info = {
    id: id
  }
  changeTopStatusOfColumn(column)
}

const requestAgain = (val: boolean): void => {
  if (val) {
    centerDialogVisibles.value = false
    getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id, columnStatus.value)
  }
}

const changeOpen = () => {
  centerDialogVisibles.value = false
}

onMounted(() => {
  getColumn(page.value, pageSize.value, JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.allBox {
  display: flex;
  flex-direction: column;
  .ico {
  }
  .columns {
    display: flex;
    flex-direction: column;
    // margin-top: 20px;
    margin-left: 20px;
    .columnItem {
      line-height: 30px;
      margin-top: 20px;
      .left {
        display: flex;
        flex-direction: column;
        line-height: 25px;
        .ltop {
          display: flex;
          .ml-2 {
            margin-top: 2px;
            margin-left: 20px;
            position: absolute;
          }
          .title {
            font-size: 15px;
            color: black;
            font-weight: 600;
          }
          .title:hover {
            color: #175199;
            cursor: pointer;
          }
        }
        .lbottom {
          display: flex;
          #username {
            font-size: 13px;
            color: #8590a6;
          }
          .drop {
            margin-top: 8px;
            cursor: pointer;
          }
          .drop:deep(.el-tooltip__trigger:focus-visible) {
            outline: unset;
          }
          #username:hover {
            cursor: pointer;
            // color: #175199;
          }
        }
        .lcenter {
          span {
            font-size: 14px;
          }
        }
      }
    }
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  .TopTags {
    margin-left: 100px;
    margin-top: -14px;
  }

  .sk {
    // width: 100%;
    height: 100%;
    background-color: #ffffff;
    margin-top: 15px;
    padding: 20px 20px;
  }
}
</style>
