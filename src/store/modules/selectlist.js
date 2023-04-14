import apolloClient from '../../apolloclient'
import { provideApolloClient } from "@vue/apollo-composable";
import { useQuery, useLazyQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";
import EmpGQL from "../../graphql/Employee";
import GcpGQL from "../../graphql/Gcp";

provideApolloClient(apolloClient);

const { refetch: refgetCaseStatus } = useQuery(CaseGQL.GETCASESTATUS);
const { refetch: refgetCaseCalType } = useQuery(CaseGQL.GETCASECALTYPE);
const { refetch: refgetCaseAllOrg } = useQuery(CaseGQL.GETALLORG);
const { refetch: refgetChopList } = useQuery(CaseGQL.GETUNIITEMCHOP);
const { refetch: refgetModelList } = useQuery(CaseGQL.GETUNIITEMMODEL);
const { mutate: refgetGcpType } = useMutation(GcpGQL.GETGCPTYPE);
const { mutate: getGcpStyle } = useMutation(GcpGQL.GETALLGCPSTYLELIST);


const state = () => ({
  publicPath: import.meta.env.VITE_GRAPHQL_PUBLIC,
  ptStatusMU: [
    {text: "-未選取-", value: -1},
    {text: "正常", value: "正常"},
    {text: "遺失", value: "遺失"},
    {text: "損毀", value: "損毀"},
    {text: "不適用", value: "不適用"},
    {text: "停用", value: "停用"},
  ],
  gcpEnableMU: [
    {text: "-未選取-", value: -1},
    {text: "啟用", value: 1},
    {text: "未啟用", value: 0},
  ],
  gcpTypeList: [],
  gcpOwnerShipList: [
    {text: "-未選取-", value: "-1"},
    {text: "公有地", value: "公有地"},
    {text: "私有地", value: "私有地"},
  ],
  gcpPavementList: [
    {text: "-未選取-", value: "-1"},
    {text: "道路面", value: "道路面"},
    {text: "建物頂樓", value: "建物頂樓"},
    {text: "人行道", value: "人行道"},
    {text: "空地地面", value: "空地地面"},
    {text: "泥土面", value: "泥土面"},
    {text: "水泥面", value: "水泥面"},
  ],
  gcpStyleList: [],
  prjMethodList: [
    {text: "-未選取-", value: "-1"},
    {text: "量測", value: "量測"},
    {text: "巡查", value: "巡查"},
    {text: "中間查核", value: "中間查核"},
  ],
  caseStatusList: [],
  caseCalTypeList: [],
  caseOrgList: [],
  caseChopList: [],
  caseModelList: [],
})

const getters = {
}

const actions = {
  async fetchStatusList ({ commit, state }, payload) {
    // console.log('fetchStatusList')
    refgetCaseStatus().then(res=>{
      let tempMU = res.data.getCaseStatus.map(x => {
        return { text: x.status, value: parseInt(x.code) }
      }); 
      commit('writeStatusList', tempMU);
    });
  },
  async fetchCalTypeList ({ commit, state }, payload) {
    // console.log('fetchCalTypeList')
    refgetCaseCalType().then(res=>{
      let tempMU = res.data.getCaseCalType.map(x => {
        return { text: x.name, value: parseInt(x.id), code: x.code }
      }); 
      tempMU.unshift({ text: "", value: "", code: "" });
      commit('writeCalTypeList', tempMU);
    });
  },
  async fetchOrgList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetCaseAllOrg().then(res=>{
      let tempMU = res.data.getAllOrg.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeOrgList', tempMU);
    })
  },
  async fetchChopList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetChopList().then(res=>{
      let tempMU = res.data.getUniItemChop.map(x => {
        return { text: x, value: x }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeChopList', tempMU);
    })
  },
  async fetchModelList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetModelList().then(res=>{
      let tempMU = res.data.getUniItemModel.map(x => {
        return { text: x, value: x }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeModelList', tempMU);
    })
  },
  async fetchGcpTypeList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetGcpType().then(res=>{
      let tempMU = res.data.getGcpType.map(x => {
        return { text: x.type_name, value: parseInt(x.code) }
      }); 
      tempMU.unshift({ text: "-未選取-", value: -1 });
      commit('writeGcpTypeList', tempMU);
    })
  },
  async fetchGcpStyleList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    getGcpStyle().then(res=>{
      let tempMU = res.data.getAllGcpStyleList.map(x => {
        return { text: x, value: x }
      }); 
      tempMU.unshift({ text: "-未選取-", value: -1 });
      commit('writeGcpStyleList', tempMU);
    })
  },

}

const mutations = {
  // 案件狀態清單
  writeStatusList(state, statusList){
    state.caseStatusList = [...statusList];
  },
  // 校正項目清單
  writeCalTypeList(state, calTypeList){
    state.caseCalTypeList = [...calTypeList];
  },
  // 顧客機關清單
  writeOrgList(state, orgList){
    state.caseOrgList = [...orgList];
  },
  // 儀器廠牌
  writeChopList(state, ChopList){
    state.caseChopList = [...ChopList];
  },
  // 儀器型號
  writeModelList(state, ModelList){
    state.caseModelList = [...ModelList];
  },
  writeGcpTypeList(state, GcpTypeList){
    state.gcpTypeList = [...GcpTypeList];
  },
  writeGcpStyleList(state, GcpStyleList){
    state.gcpStyleList = [...GcpStyleList];
  },
  addGcpStyleList(state, newItem){
    state.gcpStyleList.push({text: newItem, value: newItem});
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}