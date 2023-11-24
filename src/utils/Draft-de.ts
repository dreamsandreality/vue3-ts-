import { ElMessage, ElMessageBox } from 'element-plus'
const deleteSome = (notice: string): void =>{
  ElMessageBox.confirm(`确认删除该${notice}吗?`, '警告', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消删除',
    type: 'warning'
  })
    .then(() => {
      
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
}
export default deleteSome