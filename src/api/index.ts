import axios from '../utils/request';
import base from "./base";
type phoneNum = {
  phone: string
}
type login_data_typeByphone = {
  code: string,
  phone: string
  // email: string,
  // password: string
}
type login_data_typeBypassword = {
  emailOrPhoneOraccount: string
  password: string,
}

type updates = {
  id: number,
  username: string,
  password: string,
  phone: string,
  sex: number,
  email: string,
  status: number,
  image: string,
  occupation: string,
  sign: string,
  advator: string,
  about: string,
  province: string,
  city: string,
  account: string
}

type updateUsername = {
  id: number,
  username: string
}

type updatePwd = {
  id: number,
  oldPassword: string,
  password: string
}

type updateEmails = {
  id: number,
  email: string,
  emailCode: string
}

type Img = {
  image: string,
  id: number
}

type Essay = {
  id: number,
  topicName: string,
  userid: number,
  updatetime: string,
  topicid: number,
  hcontent: string,
  mdcontent: string,
  status: number,
  cover: string,
  views?: number,
  columnid: number,
  nav_id: number,
  top: number,
  title: string,
  userName: string,
  about: string,
  essay_num: number,
  column_num: number,
  fans_num: number,
  likeNum: number
}

type Column = {
  name: string,
  status: number,
  introduce: string
  createuser: number
}

type EssayAndColumn = {
  id: number,
  essayid: string
}
type homeEssayById = {
  pages: number,
  pageSize: number,
  userid: number,
  id?: number,
}

type draftEssay = {
  userId: number,
  pageNum: number,
  pageSize: number
}
type getMyEssay = {
  userId: number,
  pageNum: number,
  pageSize: number,
  status?: number
}
type ids = {
  id: number
}
type idss = {
  id: number,
  userid: number
}

type TopParam = {
  id: number
}

type changeEssayOfDraftStatus = {
  id: number
}
type columnOfDraft = {
  page: number,
  pageSize: number,
  id: number,
  status?: number
}
type columns = {
  id: number,
  page: number,
  pageSize: number
}
type Info = {
  id: number,
  introduce: string
}

type ColumnInfo = {
  id: number
}
interface addProblems {
  create_user: number
  content: string
  status: number
  topic: string
}
interface getProblems {
  page: number,
  pageSize: number,
  userId?:number,
  status?: number
}

interface changeProblemsTop {
  id: number
}

interface ChangeOrderInfo {
  userid: number
  columnid: number
}

interface FolderParams {
  userid: number
}
interface AddFolder {
  foldername: string
  userid: number
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
interface CancelCollection {
  userid: number,
  essayid: number
}

interface CoutCollectionNum {
  essayid: number
}

interface LikeEssayRequestData {
  userid: number
  essayid: number
  belikeuserid: number
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

interface UserId {
  userId: number
}

interface concernUser {
  userid: number,
  concernid: number
}

interface HistoryInfo {
  userid: number
  browsed_user: number
  esaayid: number
}

interface getHistoryNum {
  userid: number
  today: string
  yestoday: string
}

interface deleteHistory {
  id: number
}

interface historyItem {
  essayname: string
  userId: number
}

interface ProblemId {
  problemid: number
  userid: number
}

interface getEssaysBySearch {
  title: string

}

const api = {
  getNavList<T>(){
    return axios.get<T>(base.navList)
  },
  getTopicList<T>(){
    return axios.get<T>(base.topic)
  },
  getDiffList<T>(){
    return axios.get<T>(base.diffList)
  },
  getHotNav<T>(){
    return axios.get<T>(base.hotNav)
  },
  getAddressList<T>(){
    return axios.get<T>(base.addressList)
  },
  getCode<T>(params:phoneNum){
    return axios.get<T>(base.getCode, { params })
  },
  UserLogin<T>(params:login_data_typeByphone){
    return axios.post<T>(base.login_in,params)
  },
  UserLoginByPassword<T>(params: login_data_typeBypassword){
    return axios.post<T>(base.login_in_password,params)
  },
  mineGetInfo<T>(params: ids){
    return axios.get<T>(base.aboutMyself,{ params })
  },
  updateOrSave<T>(params: updates){
    return axios.post<T>(base.updateInfo, params)
  },
  updateUsername<T>(params1: string, params2: number){
    const userInfo: updateUsername = {
      id: params2,
      username: params1
    }
    return axios.put<T>(base.updateUsername,userInfo)
  },
  applyAccount<T>(params: updateUsername){
    return axios.get<T>(base.applyAccount,{ params })
  },
  updatePwd<T>(params: updatePwd){
    return axios.put<T>(base.updatePwd, params)
  },
  outAccount<T>(params: ids){
    return axios.delete<T>(base.outAccount,{ params })
  },
  QQEmail<T>(params: string){
    return axios.get<T>(base.sendEmail,{params})
  },
  updateQQEmail<T>(params: updateEmails){
    return axios.put<T>(base.changeEmail,params)
  },
  updateImg<T>(params: Img){
    return axios.put<T>(base.updateImg,params)
  },
  addEssays<T>(params: Essay){
    return axios.post<T>(base.addEssay,params)
  },
  addColumns<T>(params: Column){
    return axios.post<T>(base.addColumn,params)
  },
  getColumnOfMine<T>(params: ids){
    return axios.get<T>(base.getMyColumn,{ params })
  },
  addEssaysToColumns<T>(params: EssayAndColumn){
    return axios.post<T>(base.addEssayToColumns,params)
  },
  
  getEssays<T>(params: idss){
    return axios.get<T>(base.getEssay,{ params })
  },
  getHomeEssayByNavId<T>(params: homeEssayById){
    return axios.get<T>(base.getHomeEssById,{params})
  },
  getDraftEssay<T>(params: draftEssay){
    return axios.get<T>(base.getDraftEssay,{params})
  },
  deleteEssayOfDraftById(params: ids){
    return axios.delete(base.deleteEssaysByid,{ params })
  },
  getMyDraftEssays<T>(params: getMyEssay){
    return axios.get<T>(base.getMyDraftEssay,{ params })
  },
  updateEssayTopStatus<T>(params: TopParam){
    return axios.put<T>(base.updateEssayTop,params)
  },
  editMyEssay<T>(params: ids){
    return axios.get<T>(base.EditeEssay,{ params })
  },
  changeEssayContents<T>(params: Essay){
    return axios.put<T>(base.changeEssayContent,params)
  },
  changeEssayStatusOfDraft<T>(params: changeEssayOfDraftStatus){
    return axios.put<T>(base.changeEssayStatus, params)
  },
  getDraftColumnById<T>(params: columnOfDraft){
    return axios.get<T>(base.getDraftColumn,{params})
  },
  getIntroduceOfColumn<T>(params: ids){
    return axios.get<T>(base.getColumnInfo,{params})
  },
  upIntroduceInfo<T>(params: Info){
    return axios.put<T>(base.updateColumnInfo,params)
  },
  changeTopStatusOfColumn<T>(params: ColumnInfo){
    return axios.put<T>(base.changeTopOfColumn,params)
  },
  deleteColumn<T>(params: ids){
    return axios.delete<T>(base.deleteColumn,{params})
  },
  addProblems<T>(params:addProblems){
    return axios.post<T>(base.addproblems,params)
  },
  getAllProblemsByPage<T>(params: getProblems){
    return axios.get<T>(base.getProblems,{params})
  },
  changeProblemsTops<T>(params: changeProblemsTop){
    return axios.put<T>(base.changeProblemsTop,params)
  },
  deleteProblems<T>(params: changeProblemsTop){
    return axios.delete<T>(base.deleteProblem,{params})
  },
  getColumns<T>(params: columns){
    return axios.get<T>(base.getColumns,{params})  
  },
  getSearchOrdering<T>(params: ColumnInfo){
    return axios.get<T>(base.searchOrdering,{params})
  },
  updateOrderInfo<T>(params: ChangeOrderInfo){
    return axios.post<T>(base.changeStatusOfOrder,params)
  },
  getFolders<T>(params: FolderParams){
    return axios.get<T>(base.getUserFolders,{params})
  },
  addFolder<T>(params: AddFolder){
    return axios.post<T>(base.addFolders,params)
  },
  deleteFolderBt<T>(params: FolderParam){
    return axios.post<T>(base.deleteFolderBt,params)
  },
  addMyCollectionEssay<T>(params: requestCollectionEssayData){
    return axios.post<T>(base.addCollections,params)
  },
  cancelCollection<T>(params: CancelCollection){
    return axios.delete<T>(base.deleteCollection,{ params })
  },
  getCollectionNum<T>(params: CoutCollectionNum){
    return axios.get<T>(base.countCollectionNum,{ params })
  },
  countLikeEssayNum<T>(params: CoutCollectionNum){
    return axios.get<T>(base.countLikeOfEssay,{ params })
  },
  doLikeEssay<T>(params: LikeEssayRequestData){
    return axios.post<T>(base.likeEssay, params)
  },
  cancelLikeDos<T>(params: CancelCollection){
    return axios.delete<T>(base.cancelLike,{ params })
  },
  reportEssayOrProblem<T>(params: reportRequstData){
    return axios.post<T>(base.addReport,params)
  },
  getMyCollectionEssays<T>(params: UserId){
    return axios.get<T>(base.getMyCollectionEssay,{params})
  },
  getMyConcernUser<T>(params: UserId){
    return axios.get<T>(base.getMyconcern,{ params })
  },
  getConcernMeUser<T>(params: UserId){
    return axios.get<T>(base.getConcernMe,{ params })
  },
  getMyConcernColumn<T>(params: UserId){
    return axios.get<T>(base.getMyConcernColumns,{ params })
  },
  getMyConcernProblem<T>(params: UserId){
    return axios.get<T>(base.getMyConcernProblems,{ params })
  },
  cancelOrConcernUser<T>(params: concernUser){
    return axios.post<T>(base.cancelOrConcern,params)
  },
  getCountOfDraftEssayNum<T>(params: UserId){
    return axios.get<T>(base.contDraftEssayNum,{ params })
  },
  addHistories<T>(params: HistoryInfo){
    return axios.post<T>(base.addHistory,params)
  },
  getHistoryNums<T>(params: getHistoryNum){
    return axios.get<T>(base.getHistoryNums,{ params })
  },
  getLikeNumsOfYandTs<T>(params: getHistoryNum){
    return axios.get<T>(base.getLikeNumsOfYandT,{ params })
  },
  searchHistoryAndNums<T>(params: UserId){
    return axios.get<T>(base.searchHistoryAndNums,{ params })
  },
  deleteMyHistoryItems<T>(params: deleteHistory){
    return axios.get<T>(base.deleteMyHistoryItem,{ params })
  },
  deleteAllHistory<T>(params: UserId){
    return axios.get<T>(base.deleteAllHistory,{ params })
  },
  searchHistoryItems<T>(params: historyItem){
    return axios.get<T>(base.searchHistoryItem,{ params })
  },
  deleteConcernProblem<T>(params: ProblemId){
    return axios.delete<T>(base.deleteConcernProblems,{ params })
  },
  getEssaysBySearch<T>(params: getEssaysBySearch){
    return axios.get<T>(base.getEssaysBySearch,{ params })
  },
  getNoReadConcern<T>(params: UserId){
    return axios.get<T>(base.getNoReadConcern, { params })
  },
  updateConcernStatus<T>(params: UserId){
    return axios.get<T>(base.updateConcernStatus, { params })
  },
  searchMyGetLike<T>(params: UserId){
    return axios.get<T>(base.searchLikeMyself,{ params })
  },
  updateLikeInfoStatus<T>(params: UserId){
    return axios.get<T>(base.updateLikeInfoStatus,{ params })
  },
  statisticsEssayViews<T>(params: UserId){
    return axios.get<T>(base.statisticsEssayViews, { params })
  },
  statisticsLikeNums<T>(params: UserId){
    return axios.get<T>(base.statisticsLikeNums,{ params })
  }
}
export default api