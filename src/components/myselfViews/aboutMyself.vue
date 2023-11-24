<template>
  <div class="box">
    <div class="t">
      <h3>个人资料</h3>
      <el-divider class="el-d" />
      <el-form :model="form" label-width="120px" class="el-f">
        <el-form-item label="用户名" class="el-user">
          <el-input v-model="form.username" maxlength="10" placeholder="填写用户名" show-word-limit type="text" class="tex"/>
        </el-form-item>
        <div class="el-se">
          <el-form-item label="省">
      <el-select v-model="form.province" placeholder="请选择省" @change="provinceChange">
        <el-option :label="item.name" :value="item.name" v-for="item in cityData.pList" :key="item.code"/>
      </el-select>
    </el-form-item>
    <el-form-item label="市" class="its">
      <el-select v-model="form.city" placeholder="请选择市" @change="selectCity">
        <el-option :label="ele.name" :value="ele.name" v-for="ele in cityData.cityList" :key="ele.code"/>
      </el-select>
    </el-form-item>
        </div>
        <el-form-item label="性别" style="margin-top: 15px;">
        <el-radio-group v-model="form.sex" class="ml-4" style="margin-top: -5px;">
      <el-radio label="1" size="large">男</el-radio>
      <el-radio label="0" size="large">女</el-radio>
    </el-radio-group>
    </el-form-item>
        <el-form-item label="个性签名" class="el-user">
          <el-input v-model="form.sign" maxlength="50" placeholder="请填写个性签名" show-word-limit type="text"  class="tex"/>
        </el-form-item>
        <el-form-item label="我的职业" class="el-user">
          <el-input v-model="form.occupation" maxlength="20" placeholder="请填写我的职业" show-word-limit type="text"  class="tex"/>
        </el-form-item>
        <el-button type="primary" class="sub" @click="saveUpdate">保存修改</el-button>
      </el-form>
    </div>
    <div class="upload">
      <Upload @passIMGname="getIMGname" :imgName="form.advator == null ? '1' : form.advator" :url="form.advator == null ? '1' : form.advator"></Upload>
      <div class="spo">
      <span>我的头像(点击可更换)</span>
    </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted} from 'vue'
import Upload from './uploadImg.vue'
import Data from '../../globalResult/global'
import type { addressLists } from '../../resultType/address'
import type userBack from '../../resultType/UserInfo.ts'
import { updateInfos } from '../../utils/updateInfo.ts'
import userStore from '../../store/modules/user.ts'
import $http from '../../api/index.ts'
const cityData = reactive({
  pList: [],
  cityList: []
})
const store = userStore()
const form = reactive({
  id: 0,
  username: '',
  sex: '1',
  status: 1,
  occupation: '',
  sign: '',
  advator: '',
  about: '',
  province: '',
  city: ''
})

/**
 * 根据选中的省进行城市改变
 */
const getCity = (province: string) => {
  cityData.pList.forEach(element => {
    if(element.name == province){
      cityData.cityList = element.children
      if(form.city==''){
      form.city = element.children[0].name
    }
    }
  });
}

const selectCity = ():void => {
  console.log(form.city)
}

/**
 * 选择地区变化之后的事件
 */
const provinceChange = () => {
  form.city = ''
  getCity(form.province)
}

/**
 * 发送获取地区的请求
 */

const getAddress = async () => {
  let { data: res } = await $http.getAddressList<Data<addressLists>>()
  cityData.pList = res.data.address.map((item)=>{
    return item
  })
  console.log(res)
}

/**
 * 
 * @param val 接收上传头像组件传过来的文件名
 */

const getIMGname = (val: string):void => {
  form.advator = val
}


/**
 * 
 * @param id 获取个人信息接口
 */
const getInfo = async (id: number) => {
  let { data : res } = await $http.mineGetInfo<Data<userBack>>({ id })
  console.log(res)
  await getAddress()
  form.username = res.data[0].username
  form.sign = res.data[0].sign
  form.sex = String(res.data[0].sex)
  form.occupation = res.data[0].occupation
  form.province = res.data[0].province
  form.city = res.data[0].city
  form.advator = res.data[0].advator
  form.id = JSON.parse(localStorage.getItem('user')!).userInfo.id
  getCity(res.data[0].province)
}

/**
 * 调取个人信息接口
 */

 const getUser = () :void => {
  const userInfo = JSON.parse(localStorage.getItem('user')!)
  getInfo(userInfo.userInfo.id)
 }

 /**
  * 保存修改
  */
 const saveUpdate = async () => {
  await updateInfos(form)
  const info = JSON.parse(localStorage.getItem('user')!).userInfo
  info.username = form.username
  info.advator = form.advator
  store.saveInfo(info)
  getUser()
 }
onMounted(()=>{
  getUser()
})
</script>

<style lang="less" scoped>
.box {
  .t {
    padding-top: 20px;
    padding-left: 20px;
    .el-d {
      width: 600px;
    }
    .el-f {
      margin-left: -60px;
      line-height: 50px;
      .sub{
        margin-top: 50px;
        margin-left: 400px;
      }
      .el-se {
        display: flex;
        margin-top: 35px;
        .its{
          margin-left: -10px;
        }
      }
      .el-user{
        margin-top: 40px;
      }
    }
    .tex{
      width: 550px;
    }
  }
  .upload{
    margin-left: 700px;
    margin-top: -400px;
    .spo{
      font-size: 14px;
      margin-left: 20px;
      color: darkgrey;
    }
  }
}
</style>
