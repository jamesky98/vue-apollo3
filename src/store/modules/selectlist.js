import apolloClient from '../../apolloclient'
import { provideApolloClient } from "@vue/apollo-composable";
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";
import EmpGQL from "../../graphql/Employee";

provideApolloClient(apolloClient);

const { refetch: refgetCaseStatus } = useQuery(CaseGQL.GETCASESTATUS);
const { refetch: refgetCaseCalType } = useQuery(CaseGQL.GETCASECALTYPE);
const { refetch: refgetCaseAllOrg } = useQuery(CaseGQL.GETALLORG);

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
  caseCalTypeList: [],
  caseOrgList: [],

})

const getters = {
}

const actions = {
  async fetchStatusList ({ commit, state }, payload) {
    console.log('fetchStatusList')
    refgetCaseStatus().then(res=>{
      let tempMU = res.data.getCaseStatus.map(x => {
        return { text: x.status, value: parseInt(x.code) }
      }); 
      commit('writeStatusList', tempMU);
    });
  },
  async fetchCalTypeList ({ commit, state }, payload) {
    console.log('fetchCalTypeList')
    refgetCaseCalType().then(res=>{
      let tempMU = res.data.getCaseCalType.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeCalTypeList', tempMU);
    });
  },
  async fetchOrgList ({ commit, state }, payload) {
    console.log('fetchOrgList')
    refgetCaseAllOrg().then(res=>{
      let tempMU = res.data.getAllOrg.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeOrgList', tempMU);
    })
  }
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}