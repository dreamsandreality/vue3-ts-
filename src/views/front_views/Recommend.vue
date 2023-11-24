<template>
  <div class="rroot">
    <div class="zw">
      <div class="order">
        <div class="dis" v-for="item in orderByList" :key="item.id" @click="changeHight(item.id)" :class="orderId === item.id ? 'active' : 'dis'">
          <span>{{ item.name }}</span>
          <el-divider direction="vertical" v-if="item.id === orderByList.length ? false : true" />
        </div>
        <el-button type="primary" :icon="Edit" class="elb" plain @click="addColumn">创作专栏</el-button>
      </div>
      <el-divider class="edri" />
      <div class="column">
        <div class="sk" v-show="loading">
          <el-skeleton :rows="6" animated :loading="loading" />
        </div>
        <div class="xq" v-for="item in columnList" :key="item.id">
          <div class="tts">
            <el-tag class="tags">专栏</el-tag>
            <h3>{{ item.name }}</h3>
          </div>
          <el-col :span="18">
            <el-text truncated>{{ item.introduce }}</el-text>
          </el-col>
          <div class="info">
            <img :src="getAdvator(item.userAdvator)" alt="" class="imgh" />
            <span class="username">{{ item.username }} ·&nbsp;</span>
            <span class="essay">{{ item.essayNum }}篇文章 ·&nbsp;</span>
            <span class="D">{{ item.ordering }}订阅</span>
          </div>
          <el-button class="Y" :type="getDos(item.id) == '取消专栏' ? 'danger' : 'warning'" plain @click="isOrder(getDos(item.id),item.id)">{{ getDos(item.id) }}</el-button>
        </div>
      </div>
    </div>
    <el-backtop :right="100" :bottom="100" />
    <Dialog :centerDialogVisible="openDialog" @changeOpen="changeOpen"></Dialog>
  </div>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox,ElNotification } from 'element-plus'
import moment from 'moment'
import { onMounted, ref } from 'vue'
import $http from '../../api'
import base from '../../api/base'
import Dialog from '../../components/addColumnDialog.vue'
import Data from '../../globalResult/global'
type orderBy = {
  id: number
  name: string
}
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
  ordering: number
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

type OrderingInfo = {
  userid: number
  columnid: number
}[]

interface ChangeOrderInfo {
  userid: number
  columnid: number
}
type datas = {
  data: null
}

let orderingList = ref<OrderingInfo>([])
let columnList = ref<records[]>([])
let loading = ref<boolean>(true)
const orderByList = ref<orderBy[]>([
  {
    id: 1,
    name: '我的关注'
  },
  {
    id: 2,
    name: '时间排序'
  },
  {
    id: 3,
    name: '最热排序'
  }
])
let orderId = ref<number>(2)
let openDialog = ref<boolean>(false)
let page = ref<number>(1)
let pageSize = ref<number>(8)

/**
 *
 * @param id 改变高亮
 */

const changeHight = (id: number): void => {
  orderId.value = id
}
/**
 * 创作专栏
 */
const addColumn = (): void => {
  openDialog.value = true
}

/**
 *
 * @param page 查询所有专栏
 * @param pageSize
 * @param id
 */

const getColumn = async (id: number, page: number, pageSize: number) => {
  let { data: res } = await $http.getColumns<Data<getColumnResponse>>({ id, page, pageSize })
  if (res.code === 4001) {
    loading.value = false
    columnList.value = res.data.records.map(item => {
      item.createtime = moment(item.createtime).format('YYYY-MM-DD')
      item.essayNum = item.essayid == null ? 0 : item.essayid.split(',').length - 1
      return item
    })
  }
}
/**
 *
 * @param id 判断按钮状态
 */
const getDos = (id: number): string => {
  let str = ''
  orderingList.value.some(ele => {
    if (ele.columnid == id) {
      str = '取消订阅'
      return ele
    }
    str = '订阅专栏'
  })
  return str
}
/**
 *
 * @param param 根据按钮的不同状态判断是订阅还是取消订阅
 */
const isOrder = (param: string,id: number) => {
  const orderInfo:ChangeOrderInfo = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    columnid: id
  }
  if (param == '取消订阅') {
    ElMessageBox.confirm('确认取消对该专栏的订阅吗?', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
       updateOrderInfo(orderInfo)
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作'
        })
      })
  }else{
    updateOrderInfo(orderInfo)
  }
}

/**
 *
 * @param id 查询自己的订阅
 */

const searchOrdering = async (id: number) => {
  let { data: res } = await $http.getSearchOrdering<Data<OrderingInfo>>({ id })
  if (res.code === 4001) {
    orderingList.value = res.data
    console.log(res.data)
  }
}

const getAdvator = (img: string): string => {
  return `${base.host}${base.imgUrl}?name=${img}`
}
/**
 * 
 * @param param 修改订阅状态
 */
const updateOrderInfo = async (param: ChangeOrderInfo) => {
  let { data : res } = await $http.updateOrderInfo<Data<datas>>(param)
  if (res.code === 1024) {
    getColumn(JSON.parse(localStorage.getItem('user')!).userInfo.id, page.value, pageSize.value)
    searchOrdering(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    ElNotification({
      title: '成功提示',
      message: '操作成功',
      type: 'success'
    })
  }
}

/**
 * 取消对话框
 */
const changeOpen = (val: boolean): void => {
  openDialog.value = val
}

onMounted(() => {
  getColumn(JSON.parse(localStorage.getItem('user')!).userInfo.id, page.value, pageSize.value)
  searchOrdering(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.rroot {
  display: flex;
  .zw {
    background-color: #ffffff;
    width: 60%;
    padding-top: 15px;
    padding-right: 20px;
    padding-left: 20px;
    line-height: 30px;
    margin-left: 145px;
    height: 100%;
    .edri {
      margin-top: 0px;
    }
  }
  .order {
    width: 950px;
    display: flex;
    padding-bottom: 10px;
    .elb {
      margin-left: 440px;
    }
    .dis {
      color: #8590a6;
      font-size: 14px;
      span {
        cursor: pointer;
        width: 20%;
      }
      span:hover {
        color: #1e80ff;
      }
    }
    .active {
      color: #1e80ff;
      font-size: 14px;
      span {
        cursor: pointer;
        width: 20%;
      }
    }
  }
  .column {
    margin-top: -17px;
    line-height: 30px;
    .xq {
      margin-top: -7px;
      .tts {
        display: flex;
        .tags {
          margin-top: 5px;
        }
        h3 {
          margin-left: 8px;
        }
      }
      .Y {
        margin-left: 730px;
        margin-top: -120px;
      }
      .tro {
      }
      .info {
        display: flex;
        .imgh {
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }
        .username {
          margin-left: 10px;
          margin-top: -3px;
          font-size: 14px;
          cursor: pointer;
        }
        .username:hover {
          color: #1e80ff;
        }
        .essay {
          font-size: 14px;
          margin-top: -3px;
          color: #8590a6;
        }
        .D {
          font-size: 14px;
          margin-top: -3px;
          color: #8590a6;
        }
        .time {
          font-size: 14px;
          margin-top: -3px;
          color: #8590a6;
        }
      }
    }
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
