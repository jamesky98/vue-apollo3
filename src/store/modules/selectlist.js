import apolloClient from '../../apolloclient'
import { provideApolloClient } from "@vue/apollo-composable";
import { useQuery, useMutation } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";
import EmpGQL from "../../graphql/Employee";
import GcpGQL from "../../graphql/Gcp";
import PrjGQL from "../../graphql/Prj";
import ItemGQL from "../../graphql/Item";

provideApolloClient(apolloClient);
// 案件狀態
const { mutate: refgetCaseStatus } = useMutation(CaseGQL.GETCASESTATUS);
// 校正項目
const { mutate: refgetCaseCalType } = useMutation(CaseGQL.GETCASECALTYPE);
// 顧客機關名稱
const { mutate: refgetCaseAllOrg } = useMutation(CaseGQL.GETALLORG);
// 校正件類型
const { mutate: refgetAllItemType } = useMutation(ItemGQL.GETALLITEMTYPE);
// 校正件廠牌
const { mutate: refgetChopList } = useMutation(CaseGQL.GETUNIITEMCHOP);
// 校正件型號
const { mutate: refgetModelList } = useMutation(CaseGQL.GETUNIITEMMODEL);
// 校正標類別
const { mutate: refgetGcpType } = useMutation(GcpGQL.GETGCPTYPE);
// 標心類型
const { mutate: getGcpStyle } = useMutation(GcpGQL.GETALLGCPSTYLELIST);
// 標準件類型
const { mutate: refgetEqptType } = useMutation(PrjGQL.GETEQPTTYPE);
// 標準件廠牌
const { mutate: getEqptChopList } = useMutation(PrjGQL.GETCHOPLIST);
// 標準件型號
const { mutate: getEqptModelList } = useMutation(PrjGQL.GETMODELLIST);
// 聯絡機關
const { mutate: refgetAllContact } = useMutation(GcpGQL.GETALLCONTACT);

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
  caseOrgDate: [],
  caseOrgList: [],
  caseItemTypeList: [],
  caseChopList: [],
  caseModelList: [],
  eqptChopList: [],
  eqptModelList: [],
  eqptTypeList: [],
  gcpContactList: [],
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
      let tempData = res.data.getAllOrg;
      let tempMU = res.data.getAllOrg.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeOrgData', tempData);
      commit('writeOrgList', tempMU);
    })
  },
  async fetchItemTypeList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetAllItemType().then(res=>{
      let tempMU = res.data.getAllItemType.map(x => {
        return { text: x.type, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "-未選擇-", value: -1 });
      commit('writeItemTypeList', tempMU);
    })
  },
  async fetchChopList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetChopList().then(res=>{
      let tempMU = res.data.getUniItemChop.map(x => {
        return { text: x, value: x }
      }); 
      tempMU.unshift({ text: "-未選擇-", value: -1 });
      commit('writeChopList', tempMU);
    })
  },
  async fetchModelList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetModelList().then(res=>{
      let tempMU = res.data.getUniItemModel.map(x => {
        return { text: x, value: x }
      }); 
      tempMU.unshift({ text: "-未選擇-", value: -1 });
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
  async fetchEqptTypeList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    refgetEqptType().then(res=>{
      let tempMU = res.data.getEqptType.map(x => {
        return { text: x.type, value: parseInt(x.eqpt_type_id) }
      }); 
      tempMU.unshift({ text: "-未選取-", value: -1 });
      commit('writeEqptTypeList', tempMU);
    })
  },
  async fetchEqptChopList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    getEqptChopList().then(res=>{
      let tempMU = res.data.getEqptChopList.map(x => {
        return { text: x, value: x }
      }); 
      tempMU.unshift({ text: "-未選取-", value: -1 });
      commit('writeEqptChopList', tempMU);
    })
  },
  async fetchEqptModelList ({ commit, state }, payload) {
    // console.log('fetchOrgList')
    getEqptModelList().then(res=>{
      let tempMU = res.data.getEqptModelList.map(x => {
        return { text: x, value: x }
      }); 
      tempMU.unshift({ text: "-未選取-", value: -1 });
      commit('writeEqptModelList', tempMU);
    })
  },
  async fetchGcpContactList ({ commit, state }, payload) {
    refgetAllContact().then(res=>{
      let tempMU = res.data.getAllContact.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "-未選取-", value: -1 });
      commit('writeGcpContactList', tempMU);
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
  writeOrgData(state, orgData){
    state.caseOrgDate = [...orgData];
  },
  writeOrgList(state, orgList){
    state.caseOrgList = [...orgList];
  },
  // 校正件類型
  writeItemTypeList(state, ItemTypeList){
    state.caseItemTypeList = [...ItemTypeList];
  },
  // 儀器廠牌
  writeChopList(state, ChopList){
    state.caseChopList = [...ChopList];
  },
  addChopList(state, newItem){
    state.caseChopList.push({text: newItem, value: newItem});
  },
  // 儀器型號
  writeModelList(state, ModelList){
    state.caseModelList = [...ModelList];
  },
  addModelList(state, newItem){
    state.caseModelList.push({text: newItem, value: newItem});
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
  writeEqptTypeList(state, EqptTypeList){
    state.eqptTypeList = [...EqptTypeList];
  },
  // 標準件廠牌
  writeEqptChopList(state, EqptChopList){
    state.eqptChopList = [...EqptChopList];
  },
  addEqptChopList(state, newItem){
    state.eqptChopList.push({text: newItem, value: newItem});
  },
  // 標準件型號
  writeEqptModelList(state, EqptModelList){
    state.eqptModelList = [...EqptModelList];
  },
  addEqptModelList(state, newItem){
    state.eqptModelList.push({text: newItem, value: newItem});
  },
  // 聯絡機關
  writeGcpContactList(state, GcpContactList){
    state.gcpContactList = [...GcpContactList];
  },
  addGcpContactList(state, newItem){
    state.gcpContactList.push({text: newItem.name, value: parseInt(newItem.id)});
  },
  delGcpContactList(state, delId){
    state.gcpContactList.splice(delId,1);;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}