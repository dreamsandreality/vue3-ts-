<template>
  <div class="box">
    <div class="t">
      <h3>账号设置</h3>
      <el-divider class="el-d" />
      <div class="accountSet">
        <div class="item" v-for="item in setArr" :key="item.notice">
          <div class="rt">
            <span>{{ item.notice }}</span>
            <span class="value">{{ item.notice == '我的手机' ? item.value.replace(/^(\d{3})\d*(\d{4})$/, '$1****$2') : item.value }}</span>
            <span style="color: #1e80ff" id="change" @click="setOver(item.notice)">{{ item.do }}</span>
          </div>
          <el-divider class="el-d" />
        </div>
      </div>
    </div>
    <updateUsername :centerDialogVisible="form.username" :id="form.id" @changeDialog="cancelUsername"></updateUsername>
    <updatePassword :centerDialogVisible="form.password" :id="form.id" @changeDialog="cancelPassword" :passwordExsit="password"></updatePassword>
    <QQEmial :centerDialogVisible="form.email" :id="form.id" @closeDialog="closeDialog"></QQEmial>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Data from '../../globalResult/global'
import $http from '../../api/index.ts'
import updatePassword from '../../components/myselfDialog/updatePassword.vue'
import updateUsername from '../../components/myselfDialog/updateUsername.vue'
import QQEmial from '../../components/myselfDialog/QQEmail.vue'
import type userBack from '../../resultType/UserInfo.ts'
// import type apply from '../../resultType/applyAccount.ts'
import userStore from '../../store/modules/user.ts'
interface setList {
  notice: string
  value: string
  do: string
}
const router = useRouter()
const user = userStore()
let password = ref<string>('')
let pwd = ref<string>('')

type passwordData = {
  data: null
}

const form = reactive({
  id: 0,
  username: false,
  password: false,
  phone: '',
  email: false,
  status: 1
})

const setArr = ref<setList[]>([
  {
    notice: '用户昵称',
    value: '',
    do: '重置'
  },
  {
    notice: '我的账号',
    value: '',
    do: '申请'
  },
  {
    notice: '我的手机',
    value: '',
    do: '换绑'
  },
  {
    notice: '我的邮箱',
    value: '',
    do: '换绑'
  },
  {
    notice: '账户密码',
    value: '',
    do: '重置'
  },
  {
    notice: '账户注销',
    value: '',
    do: '注销'
  }
])
/**
 *
 * @param id 获取个人信息接口
 */
const getInfo = async (id: number) => {
  let { data: res } = await $http.mineGetInfo<Data<userBack>>({ id })
  console.log(res)
  setArr.value[0].value = res.data[0].username
  setArr.value[1].value = res.data[0].account
  setArr.value[2].value = res.data[0].phone
  setArr.value[3].value = res.data[0].email
  if(res.data[0].password!=null){
    for (let i = 0; i < res.data[0].password.length; i++) {
    pwd.value += '*'
  }
  setArr.value[4].value = pwd.value
  password.value = res.data[0].password
  }
}

/**
 * 调取个人信息接口
 */

const getUser = (): void => {
  const userInfo = JSON.parse(localStorage.getItem('user')!)
  getInfo(userInfo.userInfo.id)
  form.id = userInfo.userInfo.id
}

// /**
//  *
//  * @param phone 申请账号接口
//  * @param id
//  */
// const applyMyAccount = async (phone: string, id: number) => {
//   let { data: res } = await $http.applyAccount<Data<apply>>({ phone, id })
//   if (res.code === 3001) {
//     setArr.value[1].value = res.data
//     ElMessage.success('修改成功')
//     const inter = setInterval(() => {
//       router.go(0)
//       clearInterval(inter)
//     }, 800)
//   }
//   if (res.code === 4001) {
//     ElMessage.warning(res.msg)
//     return
//   }
// }
/**
 *点击申请账号
 */

// const getMyAccount = (): void => {
//   applyMyAccount(setArr.value[2].value, form.id)
// }

const deleteAccount = async (id: number) => {
  let { data: res } = await $http.outAccount<Data<passwordData>>({ id })
  if (res.code === 2001) {
    ElMessage.success(res.msg)
    router.replace('/front/login')
    user.clearData()
    return
  }
  ElMessage.error(res.msg)
}

/**
 * 点击注销账号
 */
const logoutAccount = (): void => {
  ElMessageBox.confirm('确认注销账号吗?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteAccount(JSON.parse(localStorage.getItem('user')!).userInfo.id)
    })
    .catch(() => {})
}

/**
 * 打开换绑QQ邮箱的对话框
 */

const QQEmailDialog = ():void => {
  form.email = true
}

/**
 * 
 * @param val 关闭换绑QQ邮箱的对话框
 */

const closeDialog = (val: boolean):void => {
  form.email = val
}

/**
 *
 * @param name 打开对话框
 */

const setOver = (name: string): void => {
  switch (name) {
    case '用户昵称':
      setUsername()
      break
    case '我的账号':
      // getMyAccount()
      break
    case '账户密码':
      changePassword()
      break
    case '账户注销':
      logoutAccount()
      break
    case '我的邮箱':
      QQEmailDialog()
      break
    default:
      break
  }
}

/**
 * 打开重置用户名对话框
 */
const setUsername = (): void => {
  form.username = true
}

/**
 * 打开修改密码对话框
 */
const changePassword = (): void => {
  form.password = true
}

/**
 * 关闭重置用户名对话框
 */
const cancelUsername = (val: boolean): void => {
  form.username = val
}

/**
 * 关闭修改密码对话框
 */
const cancelPassword = (val: boolean) => {
  form.password = val
}

onMounted(() => {
  getUser()
})
</script>

<style lang="less" scoped>
.box {
  .t {
    padding-top: 20px;
    padding-left: 20px;
    .el-d {
      width: 97%;
    }
    .accountSet {
      display: flex;
      flex-direction: column;
      .item {
        // height: 80px;
        align-items: center;
        width: 100%;
        .rt {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          .value {
            width: 72%;
            margin-left: 60px;
            font-size: 16px;
            color: #8590a6;
          }
        }
        #change:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
