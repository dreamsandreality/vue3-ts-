<template>
  <div class="lroot">
    <div class="title">
      <span v-for="i in logo" :key="i.id" :style="{ color: i.color }">{{ i.letter }}</span>
    </div>
    <div class="desk">
      <div class="login_method">
        <span v-for="item in loginMethod" :key="item.id" :class="item.id == mid ? 'active' : ''" @click="changeMethod(item.id)">{{ item.method }}</span>
      </div>
      <div v-show="usePhone">
        <div class="phone">
          <input type="text" placeholder="请输入手机号" v-model="loginByphone_Param.phone" />
        </div>
        <div class="phone">
          <input type="text" placeholder="请输入验证码" class="code" v-model="loginByphone_Param.code" />
          <label :style="{ color: isclick ? 'black' : '#999999' }" @click="sendCode">{{ codeNotice }}</label>
        </div>
        <el-button type="primary" class="loginBtn" @click="loginByPhone">立即登录</el-button>
      </div>
      <div v-show="!usePhone">
        <div class="password">
          <input type="text" placeholder="手机号/邮箱/账号" class="code" v-model="loginBypass_Param.emailOrPhoneOraccount" />
        </div>
        <div class="password">
          <input type="password" placeholder="请输入密码" class="code" v-model="loginBypass_Param.password" />
        </div>
        <el-button type="primary" class="loginBtn" @click="loginByPass">立即登录</el-button>
      </div>
      <div class="texts">
        <el-divider>
          <span>其他方式登录</span>
        </el-divider>
        <div class="thme">
          <OtherLogin></OtherLogin>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElNotification } from 'element-plus'
import { getCurrentInstance, ref } from 'vue'
import $http from '../../api'
import Data from '../../globalResult/global'
import OtherLogin from '../../components/OtherLogin.vue'
import type userBack from '../../resultType/UserInfo.ts'
import useUserStore from '../../store/modules/user.ts'
import router from '../../router'
const _message = getCurrentInstance()!.appContext.config.globalProperties.$message
let mid = ref<number>(1)
let usePhone = ref<boolean>(true)
const userStore = useUserStore()
let input = ref<string>('')
let codeNotice = ref<string>('获取验证码')
let isclick = ref<boolean>(true)
let telReg = /^1[35789]\d{9}$/
type logoType = {
  id: number
  letter: string
  color: string
}[]

type loginMethodType = {
  id: number
  method: string
}[]

interface codeJ {
  code: number
  msg: string
  data: string
}
type login_data_typeByphone = {
  phone: string
  code: string,
}
type login_data_typeBypassword = {
  emailOrPhoneOraccount: string
  password: string,
}

type Infomation = {
  id: number
  username: string,
  advator: string
}

const userInfomation = ref<Infomation>({
  id: 0,
  username: '',
  advator: ''
})
const loginByphone_Param = ref<login_data_typeByphone>({
  code: '',
  phone: '',
})

const loginBypass_Param = ref<login_data_typeBypassword>({
  emailOrPhoneOraccount: '',
  password: '',
})
let login_code = ref<string>('')
const loginMethod = ref<loginMethodType>([
  {
    id: 1,
    method: '手机号登录'
  },
  {
    id: 2,
    method: '密码登录'
  }
])
const logo = ref<logoType>([
  {
    id: 0,
    letter: 'R',
    color: '#3285FF'
  },
  {
    id: 1,
    letter: 'o',
    color: '#FB3624'
  },
  {
    id: 2,
    letter: 'o',
    color: '#FFBA02'
  },
  {
    id: 4,
    letter: 'k',
    color: '#3285FF'
  },
  {
    id: 5,
    letter: 'i',
    color: '#25B24E'
  },
  {
    id: 6,
    letter: 'e',
    color: '#FD3224'
  },
  {
    id: 7,
    letter: 's',
    color: '#FFBA02'
  }
])

/**
 * 发送验证码接口
 */
const getLcode = async (phone: string) => {
  let { data: res } = await $http.getCode<codeJ>({ phone })
  console.log(res)
  login_code.value = res.data
}
// 控制发送验证码倒计时
const sendCode = (): void => {
  if (loginByphone_Param.value.phone.trim() == '' || !telReg.test(loginByphone_Param.value.phone)) {
    ElMessage.error('请输入正确的手机号!')
    return
  }
  if (isclick.value) {
    isclick.value = false
    getLcode(loginByphone_Param.value.phone)
    ElNotification({
      title: '提示',
      message: '已经将验证码发送到您手机，请注意查收!',
      type: 'success'
    })
    let i = 60
    const timeContoller = setInterval(() => {
      if (i > 0) {
        codeNotice.value = i > 9 ? `${i}秒后重发` : `0${i}秒后重发`
        i--
      } else {
        isclick.value = true
        codeNotice.value = '获取验证码'
        clearInterval(timeContoller)
      }
    }, 1000)
  }
}

// 设置高亮

const changeMethod = (id: number): void => {
  mid.value = id
  if (id == 1) {
    usePhone.value = true
  } else {
    usePhone.value = false
  }
}

// 手机号登录接口
const login_ByPhone = async (data: login_data_typeByphone) => {
  let { data : res } = await $http.UserLogin<Data<userBack>>(data)
    console.log(res)
  if (res.code === 4001){
      ElNotification({
      title: '提示',
      message: '登录成功!',
      type: 'success'
    })
    localStorage.setItem('login_method',JSON.stringify(0))
    userInfomation.value.username = res.data[0].username
    userInfomation.value.advator = res.data[0].advator
    userInfomation.value.id = res.data[0].id
    userStore.saveInfo(userInfomation.value)
    router.push('/')
    return
  }
  ElMessage.error(res.msg)
}

/**
 * 
 * @param data 密码登录接口
 */
const login_ByPassword = async (data : login_data_typeBypassword) => {
  let { data : res } = await $http.UserLoginByPassword<Data<userBack>>(data)
  if(res.code === 4001){
    ElNotification({
      title: '提示',
      message: '登录成功!',
      type: 'success'
    })
    localStorage.setItem('passwordExsit',JSON.stringify('exsit'))
    userInfomation.value.username = res.data[0].username
    userInfomation.value.advator = res.data[0].advator
    userInfomation.value.id = res.data[0].id
    userStore.saveInfo(userInfomation.value)
    router.push('/')
    return
  }
  ElMessage.error(res.msg)
}

// 手机号登录
const loginByPhone = (): void => {
  if (loginByphone_Param.value.phone.trim() == '' || !telReg.test(loginByphone_Param.value.phone)) {
    _message.error('请输入手机号')
    return
  }
  if (loginByphone_Param.value.code.trim() == '') {
    _message.error('请输入验证码')
    return
  }
  login_ByPhone(loginByphone_Param.value)
}
/**
 * 密码登录
 */
const loginByPass = (): void => {
  if (loginBypass_Param.value.emailOrPhoneOraccount.trim() == '') {
    _message.error('请输入基本验证信息')
    return
  }
  if (loginBypass_Param.value.password.trim() == '') {
    _message.error('请输入密码')
    return
  }
  login_ByPassword(loginBypass_Param.value)
  if(loginBypass_Param.value.emailOrPhoneOraccount.includes('.com')){
    localStorage.setItem('login_method',JSON.stringify(1))
    return
  }
  if(loginBypass_Param.value.emailOrPhoneOraccount.includes('@')){
    localStorage.setItem('login_method',JSON.stringify(2))
    return
  }
  localStorage.setItem('login_method',JSON.stringify(0))
}
</script>

<style lang="less" scoped>
.lroot {
  background-color: #b8e5f8;
  text-align: center;
  width: 100%;
  height: 100vh;
  background-image: url('/src/image/前台登录背景图.png');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  .title {
    font-size: 55px;
    margin-top: 90px;
  }
  .desk {
    width: 500px;
    height: 400px;
    background-color: #ffffff;
    position: absolute;
    left: 51%;
    margin-top: 50px;
    transform: translateX(-51%);
    .texts {
      span {
        color: #999999;
      }
      padding-top: 15px;
      .thme {
        width: 100%;
      }
    }
    .login_method {
      display: flex;
      justify-content: space-around;
      margin-left: -10px;
      // padding-left: 40px;
      width: 50%;
      span {
        width: 100%;
        padding-top: 20px;
        padding-bottom: 10px;
        margin-left: 20px;
        cursor: pointer;
      }
    }
    .phone {
      width: 80%;
      margin-top: 30px;
      border-bottom: 1px solid darkgray;
      margin-left: 45px;
      .code {
        width: 80%;
        height: 40px;
        border-radius: 0;
        margin-left: -60px;
        outline: none;
        -webkit-appearance: button;
        -webkit-appearance: none;
        border: none;
        margin-left: 10px;
        margin-left: -0.5px;
      }
      label {
        font-size: 14px;
        margin-left: -10px;
        cursor: pointer;
      }
      input {
        width: 80%;
        height: 40px;
        border-radius: 0;
        margin-left: -60px;
        outline: none;
        -webkit-appearance: button;
        -webkit-appearance: none;
        border: none;
      }
    }
    .loginBtn {
      margin-top: 60px;
      width: 80%;
    }
    .password {
      width: 80%;
      margin-top: 30px;
      border-bottom: 1px solid darkgray;
      margin-left: 45px;
      input {
        width: 80%;
        height: 40px;
        border-radius: 0;
        margin-left: -60px;
        outline: none;
        -webkit-appearance: button;
        -webkit-appearance: none;
        border: none;
      }
    }
  }
}
.active {
  width: 50%;
  padding-top: 20px;
  font-weight: 600;
  border-bottom: 3px solid #056de8;
  padding-bottom: 10px;
  margin-left: 20px;
  cursor: pointer;
}
</style>
