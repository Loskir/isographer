import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let T = (p, v) => p*v/store.state.nur;
let P = (t, v) => store.state.nur*t/v;
let V = (p, t) => store.state.nur*t/p;

const store = new Vuex.Store({
  state: {
    processes: [],
    svgSize: 1000,
    nur: 500
  },
  mutations: {
    addProcess(state, {type, constant, variable: {start, end}}) {
      if (type === 'isothermal') {
        state.processes.push({
          type: 'isothermal',
          t: constant,
          v: {start, end},
          p: {start: P(constant, start), end: P(constant, end)}
        })
      }
      else if (type === 'isobaric') {
        state.processes.push({
          type: 'isobaric',
          p: constant,
          v: {start, end},
          t: {start: T(constant, start), end: T(constant, end)}
        })
      }
      else if (type === 'isochoric') {
        state.processes.push({
          type: 'isochoric',
          v: constant,
          t: {start, end},
          p: {start: P(start, constant), end: P(end, constant)}
        })
      }
    },
    setNur(state, v) {
      state.nur = v;
    },
    incNur(state, v) {
      state.nur += v;
    },
    editProcess(state, [i, diff]) {
      //diff: ['p', {start: 1, end: 2}]
      let process = state.processes[i];
      if (process.type === 'isothermal') {
        if (diff[0] === 't') {
          process.t = diff[1];
          process.p.start = P(process.t, process.v.start);
          process.p.end = P(process.t, process.v.end)
        }
        else if (diff[0] === 'p') {
          process.p = diff[1];
          process.v.start = V(process.p.start, process.t);
          process.v.end = V(process.p.end, process.t)
        }
        else if (diff[0] === 'v') {
          process.v = diff[1];
          process.p.start = P(process.t, process.v.start);
          process.p.end = P(process.t, process.v.end)
        }
      }
      else if (process.type === 'isobaric') {
        if (diff[0] === 't') {
          process.t = diff[1];
          process.v.start = V(process.p, process.t.start);
          process.v.end = V(process.p, process.t.end)
        }
        else if (diff[0] === 'p') {
          process.p = diff[1];
          process.t.start = T(process.p, process.v.start);
          process.t.end = T(process.p, process.v.end)
        }
        else if (diff[0] === 'v') {
          process.v = diff[1];
          process.t.start = T(process.p, process.v.start);
          process.t.end = T(process.p, process.v.end)
        }
      }
      else if (process.type === 'isochoric') {
        if (diff[0] === 't') {
          process.t = diff[1];
          process.p.start = P(process.t.start, process.v);
          process.p.end = P(process.t.end, process.v)
        }
        else if (diff[0] === 'p') {
          process.p = diff[1];
          process.t.start = T(process.p.start, process.v);
          process.t.end = V(process.p.end, process.v)
        }
        else if (diff[0] === 'v') {
          process.v = diff[1];
          process.t.start = T(process.p.start, process.v);
          process.t.end = T(process.p.end, process.v)
        }
      }
    }
  },
  getters: {
  },
  actions: {

  }
});

store.subscribe((mutation, state) => {
  console.log(mutation)
})

export default store