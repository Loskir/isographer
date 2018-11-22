import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    processes: [],
    nur: 500,
    svgSize: 1000
  },
  mutations: {
    addProcess(state, {type, constant, variable: {start, end}}) {
      if (type === 'isothermal') {
        state.processes.push({
          type: 'isothermal',
          t: constant,
          v: {start, end},
          p: {start: state.nur*constant/start, end: state.nur*constant/end}
        })
      }
      else if (type === 'isobaric') {
        state.processes.push({
          type: 'isobaric',
          p: constant,
          v: {start, end},
          t: {start: start*constant/state.nur, end: end*constant/state.nur}
        })
      }
      else if (type === 'isochoric') {
        state.processes.push({
          type: 'isochoric',
          v: constant,
          t: {start, end},
          p: {start: state.nur*start/constant, end: state.nur*end/constant}
        })
      }
    }
  },
  actions: {

  }
})
