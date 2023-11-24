<template>
  <div class="box">
    <div class="text">
      <div class="ti">
        <h3>我关注的问题</h3>
        <el-input
      v-model="input2"
      class="w-50 m-2"
      placeholder="输入问题"
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
        <el-empty description="没有您关注的人哦~" />
      </div>
        <div class="zw" v-for="ele in problemList" :key="ele.id">
        <div class="left">
          <div class="tts">
            <el-tag class="tags">问题</el-tag>
            <el-col :span="18">
            <el-text truncated>
              <el-tooltip class="box-item" effect="dark" :content="ele.content" placement="top">
                <span id="titles">{{ ele.content }}</span>
              </el-tooltip>
            </el-text>
          </el-col>
          </div>
          <div class="lbottom">
            <img :src="ele.advator == '' ? '/src/image/默认头像.jpg' : getIMG(ele.advator)" alt="" style="width: 25px; height: 25px; border-radius: 50%" />
            <span id="username">{{ ele.username }}</span>
            <span> · {{ ele.time }}</span>
            <span> · {{ ele.answer }}回答</span>
            <span> · {{ ele.concern }}关注</span>
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
import $http from '../../api';
import Data from '../../globalResult/global';
import { ElMessageBox,ElNotification } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import moment from 'moment';
import base from '../../api/base';
type problemInfo = {
  id: number
  create_user: number
  content: string
  time: string
  status: number
  topic: string
  top: number
  answer: number
  userCollectList: null
  userLikeList: null
  concern: number
  username: string
  advator: string
}[]
let input2 = ref<string>('')
let loading = ref<boolean>(true)
let empty = ref<boolean>(false)
const problemList =ref<problemInfo>([]) 
const cancelConcern = (id: number) => {
  ElMessageBox.confirm(
    '确认取消关注该问题吗?',
    '提示',
    {
      confirmButtonText: '取消关注',
      cancelButtonText: '放弃取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteConcernProblems(id,JSON.parse(localStorage.getItem('user')!).userInfo.id)
    })
    .catch(() => {
    })
}

const toSearch = () => {
  problemList.value = problemList.value.filter(item=> {
    if(item.content.indexOf(input2.value)!=-1){
      return item
    }
  })
}

/**
 * 
 * @param userId 获取我关注的问题列表
 */
 const getMyConcernProblems = async (userId: number) => {
  let { data: res } = await $http.getMyConcernProblem<Data<problemInfo>>({ userId })
    if(res.code === 4001){
      loading.value = false
      problemList.value = res.data.map(item=>{
        item.time = moment(item.time).format("YYYY-MM-DD")
        return item
      })
    }
    empty.value = problemList.value.length == 0 ? true : false
}

const deleteConcernProblems = async (problemid: number,userid: number) => {
  let { data : res } = await $http.deleteConcernProblem<Data<null>>({ problemid,userid })
    if(res.code === 3001){
      ElNotification({
        title: '提示',
        message: '操作成功',
        type: 'success'
      })
      getMyConcernProblems(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    }
}


const getIMG = (val: string) => {
  return `/api${base.imgUrl}?name=${val}`
}

onMounted(()=>{
  getMyConcernProblems(JSON.parse(localStorage.getItem('user')!).userInfo.id)
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
    .driver{
      margin-top: 10px;
    }
    .zwT{
      margin-top: -10px;
    }
    .zw {
      display: flex;
      line-height: 28px;
      margin-top: 25px;
      .left {
        .tts{
          display: flex;
        }
        #titles {
          color: black;
          font-weight: 600;
          font-size: 18px;
          margin-left: 8px;
          margin-top: -5px;
        }
        #titles:hover{
        color: #1e80ff;
        cursor: pointer;
      }
        .lbottom{
          display: flex;
        // margin-left: 35px;
        span {
          font-size: 14px;
          color: #8590a6;
          margin-left: 10px;
          margin-top: -3px;
        }
        #username:hover{
          cursor: pointer;
          color: #1e80ff;
        }
        }
      }
      .right{
        margin-top: 20px;
        text-align: right;
        flex: 1;
        .btn{
          width: 100px;
        }
      }
    }
  }
  .sk {
    height: 100%;
    background-color: #ffffff;
    margin-top: 15px;
    padding: 20px 20px;
  }
}
</style>
