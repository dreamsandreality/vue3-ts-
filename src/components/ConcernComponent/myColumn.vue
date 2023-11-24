<template>
  <div class="box">
    <div class="text">
      <div class="ti">
          <h3>我关注的专栏</h3>
        <el-input
      v-model="input2"
      class="w-50 m-2"
      placeholder="输入专栏名称"
      :suffix-icon="Search"
      @keyup.enter.native="toSearch"
    />
    <el-button type="primary" :icon="Search" class="searchBtn" @click="toSearch">搜索</el-button>
      </div>
      <el-divider class="driver"/>
      <div class="zwT">
        <div class="sk" v-show="loading">
        <el-skeleton :rows="6" animated :loading="loading" />
      </div>
      <div class="empty" v-show="empty">
        <el-empty description="您关注的专栏为空哦~" />
      </div>
        <div class="zw" v-for="ele in columnIf" :key="ele.id">
        <div class="left">
          <div class="tts">
          <el-tag class="tags">专栏</el-tag>
          <span style="font-size: 18px; font-weight: 600" id="title">{{ ele.name }}</span>
        </div>
          <div class="intro">
            <span>{{ ele.introduce }}</span>
          </div>
          <div class="lbottom">
            <img :src="ele.userAdvator == '' ? '/src/image/默认头像.jpg' : getIMG(ele.userAdvator)" alt="" style="width: 25px; height: 25px; border-radius: 50%; margin-top: 4px" />
            <span id="username">{{ ele.username }}</span>
            <span> · {{ ele.essayNum }}篇文章</span>
            <span> · {{ ele.ordering }}个关注</span>
          </div>
        </div>
        <div class="right">
          <el-button type="danger" plain class="btn" @click="cancelConcern(ele.id)">取消关注</el-button>
          </div>
      </div>
      </div>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'
import { ElMessageBox,ElNotification } from 'element-plus'
import $http from '../../api';
import Data from '../../globalResult/global';
import { Search } from '@element-plus/icons-vue'
import base from '../../api/base';
type ColumnInfo = {
  id: number
  name: string
  introduce: string
  createuser: number
  createtime: string
  status: number
  essayid: string
  cover: string
  top: number
  ordering: number
  username: string
  userAdvator: string
  essayNum: number
}[]

interface ChangeOrderInfo {
  userid: number
  columnid: number
}
type datas = {
  data: null
}

const columnIf = ref<ColumnInfo>([])
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
let input2 = ref<string>('')
const cancelConcern = (i: number) => {
  const info: ChangeOrderInfo = {
    userid: JSON.parse(localStorage.getItem('user')!).userInfo.id,
    columnid: i
  }
  ElMessageBox.confirm(
    '确认取消关注该专栏吗?',
    '提示',
    {
      confirmButtonText: '取消关注',
      cancelButtonText: '返回',
      type: 'warning',
    }
  )
    .then(() => {
      updateOrderInfo(info)
    })
    .catch(() => {
      
    })
}

/**
 * 
 * @param userId 获取关注的专栏列表
 */
 const getMyConcernColumn = async (userId: number) => {
  let { data : res } = await $http.getMyConcernColumn<Data<ColumnInfo>>({ userId })
    if(res.code === 4001){
      loading.value = false
      columnIf.value = res.data
      console.log(res.data)
    }
    empty.value = columnIf.value.length == 0 ? true : false
}



/**
 * 
 * @param param 修改订阅状态
 */
 const updateOrderInfo = async (param: ChangeOrderInfo) => {
  let { data : res } = await $http.updateOrderInfo<Data<datas>>(param)
  if (res.code === 1024) {
    ElNotification({
      title: '成功提示',
      message: '操作成功',
      type: 'success'
    })
    getMyConcernColumn(JSON.parse(localStorage.getItem('user')!).userInfo.id)
  }
}

const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
}


const toSearch = () => {
  columnIf.value = columnIf.value.filter(item=>{
      if(item.name.indexOf(input2.value)!=-1){
        return item
      }
  })
}

onMounted(() => {
  getMyConcernColumn(JSON.parse(localStorage.getItem('user')!).userInfo.id)
})
</script>

<style lang="less" scoped>
.box {
  .text {
    .ti{
      padding-top: 20px;
      display: flex;
      align-items: center;
      .w-50{
        width: 30%;
        margin-left: 250px;
      }
      .searchBtn{
        margin-left: 10px;
      }
    }
    .tts{
      .tags{

      }
    }
    .driver{
      margin-top: 10px;
    }
    .zwT{
      margin-top: -20px;
    }
    .zw {
      display: flex;
      line-height: 32px;
      margin-top: 10px;
      .left {
        width: 75%;
        display: flex;
        flex-direction: column;
        .lbottom {
          display: flex;
          span {
            font-size: 14px;
            color: #8590a6;
            margin-left: 10px;
          }
        }
        .intro {
          color: #8590a6;
          font-size: 14px;
        }
      }
      .right {
        margin-top: 30px;
        margin-left: 30px;
        .btn {
          width: 100px;
        }
      }
    }
  }
  #username:hover{
    color: #1e80ff;
    cursor: pointer;
  }
  #title{
    margin-left: 8px;
  }
  #title:hover{
    color: #1e80ff;
    cursor: pointer;
  }
}
</style>
