
import { useQuery } from '@vue/apollo-composable';
import CaseGQL from "../../graphql/Cases";
import EmpGQL from "../../graphql/Employee";


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
  caseCalTypeList: [],
})

const getters = {}

const actions = {
  getStatusList ({ commit, state }, products) {
    refgetCaseStatus().then(result=>{
      let tempMU = result.data.getCaseStatus.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeStatusList', tempMU);
  })},

  getCalTypeList ({ commit, state }, products) {
    refgetCaseCalType().then(result=>{
      let tempMU = result.data.getCaseCalType.map(x => {
        return { text: x.name, value: parseInt(x.id) }
      }); 
      tempMU.unshift({ text: "", value: "" });
      commit('writeCalTypeList', tempMU);
  })},

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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}