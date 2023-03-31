import apolloClient from '../../apolloclient'
import { provideApolloClient } from "@vue/apollo-composable";
import { useQuery } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";
import EmpGQL from "../../graphql/Employee";

provideApolloClient(apolloClient);

const { refetch: refgetCaseStatus } = useQuery(CaseGQL.GETCASESTATUS);
const { refetch: refgetCaseCalType } = useQuery(CaseGQL.GETCASECALTYPE);

const state = () => ({
  publicPath: import.meta.env.VITE_GRAPHQL_PUBLIC,
  ptStatusMU: JSON.stringify([
    {text: "-未選取-", value: -1},
    {text: "正常", value: "正常"},
    {text: "遺失", value: "遺失"},
    {text: "損毀", value: "損毀"},
    {text: "不適用", value: "不適用"},
    {text: "停用", value: "停用"},
  ]),
  caseStatusList: [],
  updateCaseStatusListTimer: null,
  caseCalTypeList: [],
  updateCaseCalTypeListTimer: null,
})

const getters = {}

const actions = {
  getStatusList ({ commit, state }, payload) {
    console.log('getStatusList!!!')
    return refgetCaseStatus().then(result=>{
      let tempMU = result.data.getCaseStatus.map(x => {
        return { text: x.status, value: parseInt(x.code) }
      }); 
      commit('writeStatusList', tempMU);
      return tempMU;
  })},
  // 啟動定時更新
  startCaseStatusListTimer(context, payload){
    console.log('do startCaseStatusListTimer!!!')

    // let result = actions.getStatusList();
    console.log('context',context);
    let timeId = window.setInterval(this.getStatusList,5000);
    console.log('timeId',timeId)
    commit('writeStatusListTimer', timeId);
  },
  getCalTypeList ({ commit, state }, payload) {
    refgetCaseCalType().then(result=>{
      let tempMU = result.data.getCaseCalType.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "", value: "" });
      console.log('CalTypeList',tempMU);
      commit('writeCalTypeList', tempMU);
  })},
  // 啟動定時更新
  startCalTypeListTimer({ commit, state }, payload){
    let timeId = window.setInterval(this.getCalTypeList,5000);
    commit('writeCalTypeListTimer', timeId);
  },
}

const mutations = {
  // 案件狀態清單
  writeStatusList(state, statusList){
    state.caseStatusList = [...statusList];
  },
  writeStatusListTimer(state, timeId){
    state.updateCaseStatusListTimer = timeId;
  },
  // 校正項目清單
  writeCalTypeList(state, calTypeList){
    state.caseCalTypeList = [...calTypeList];
  },
  writeCalTypeListTimer(state, timeId){
    state.updateCaseCalTypeListTimer = timeId;
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}