import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import { getField, updateField } from 'vuex-map-fields';

let T = (p, v) => Math.round(p*v/store.state.nur);
let P = (t, v) => Math.round(store.state.nur*t/v);
let V = (p, t) => Math.round(store.state.nur*t/p);

const store = new Vuex.Store({
  state: {
    processes: [],
    svgSize: 1000,
    nur: 500,
    chaining: true,
    glow: true
  },
  mutations: {
    addProcess(state, obj) {
      state.processes.push(Object.assign({isoline: true, glow: false}, obj));
    },
    /*addProcessAlt(state, {type, constant, variable: {start, end}}) {
      let obj = {
        type,
        isoline: true,
        glow: false
      };
      if (type === 'isothermal') {
        Object.assign(obj, {
          t: constant,
          v: {start, end},
          p: {start: P(constant, start), end: P(constant, end)}
        })
      }
      else if (type === 'isobaric') {
        Object.assign(obj, {
          p: constant,
          v: {start, end},
          t: {start: T(constant, start), end: T(constant, end)}
        })
      }
      else if (type === 'isochoric') {
        Object.assign(obj, {
          v: constant,
          t: {start, end},
          p: {start: P(start, constant), end: P(end, constant)}
        })
      }
      state.processes.push(obj);
    },*/
    setByPrev(state, i) {
      // console.log('sbp', i);
      let prev = state.processes[(i-1+state.processes.length)%state.processes.length];
      let process = state.processes[i];
      let type = process.type;
      if (type === 'isothermal') {
        let t = prev.t.end || prev.t;
        let v_start = prev.v.end || prev.v;
        let v_end = process.v.end;
        process.t = t;
        process.v.start = v_start;
        process.v.end = v_end;
        process.p.start = P(t, v_start);
        process.p.end = P(t, v_end)
      }
      else if (type === 'isobaric') {
        let p = prev.p.end || prev.p;
        let v_start = prev.v.end || prev.v;
        let v_end = process.v.end;
        process.p = p;
        process.v.start = v_start;
        process.v.end = v_end;
        process.t.start = T(p, v_start);
        process.t.end = T(p, v_end)
      }
      else if (type === 'isochoric') {
        let v = prev.v.end || prev.v;
        let t_start = prev.t.end || prev.t;
        let t_end = process.t.end;
        process.v = v;
        process.t.start = t_start;
        process.t.end = t_end;
        process.p.start = P(t_start, v);
        process.p.end = P(t_end, v)
      }
    },
    setByNext(state, i) {
      // console.log('sbn', i);
      let next = state.processes[(i+1+state.processes.length)%state.processes.length];
      let process = state.processes[i];
      let type = process.type;
      if (type === 'isothermal') {
        let t = next.t.start || next.t;
        let v_end = next.v.start || next.v;
        let v_start = process.v.start;
        process.t = t;
        process.v.end = v_end;
        process.v.start = v_start;
        process.p.end = P(t, v_end);
        process.p.start = P(t, v_start)
      }
      else if (type === 'isobaric') {
        let p = next.p.start || next.p;
        let v_end = next.v.start || next.v;
        let v_start = process.v.start;
        process.p = p;
        process.v.end = v_end;
        process.v.start = v_start;
        process.t.end = T(p, v_end);
        process.t.start = T(p, v_start)
      }
      else if (type === 'isochoric') {
        let v = next.v.start || next.v;
        let t_end = next.t.start || next.t;
        let t_start = process.t.start;
        process.v = v;
        process.t.end = t_end;
        process.t.start = t_start;
        process.p.end = P(t_end, v);
        process.p.start = P(t_start, v)
      }
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
        else if (diff[0] === 'p_start') {
          process.p.start = diff[1];
          process.v.start = V(process.p.start, process.t)
        }
        else if (diff[0] === 'p_end') {
          process.p.end = diff[1];
          process.v.end = V(process.p.end, process.t)
        }
        else if (diff[0] === 'v_start') {
          process.v.start = diff[1];
          process.p.start = P(process.t, process.v.start)
        }
        else if (diff[0] === 'v_end') {
          process.v.end = diff[1];
          process.p.end = P(process.t, process.v.end)
        }
      }
      else if (process.type === 'isobaric') {
        if (diff[0] === 't_start') {
          process.t.start = diff[1];
          process.v.start = V(process.p, process.t.start)
        }
        else if (diff[0] === 't_end') {
          process.t.end = diff[1];
          process.v.end = V(process.p, process.t.end)
        }
        else if (diff[0] === 'p') {
          process.p = diff[1];
          process.t.start = T(process.p, process.v.start);
          process.t.end = T(process.p, process.v.end)
        }
        else if (diff[0] === 'v_start') {
          process.v.start = diff[1];
          process.t.start = T(process.p, process.v.start)
        }
        else if (diff[0] === 'v_end') {
          process.v.end = diff[1];
          process.t.end = T(process.p, process.v.end)
        }
      }
      else if (process.type === 'isochoric') {
        if (diff[0] === 't_start') {
          process.t.start = diff[1];
          process.p.start = P(process.t.start, process.v)
        }
        else if (diff[0] === 't_end') {
          process.t.end = diff[1];
          process.p.end = P(process.t.end, process.v)
        }
        else if (diff[0] === 'p_start') {
          process.p.start = diff[1];
          process.t.start = T(process.p.start, process.v)
        }
        else if (diff[0] === 'p_end') {
          process.p.end = diff[1];
          process.t.end = T(process.p.end, process.v)
        }
        else if (diff[0] === 'v') {
          process.v = diff[1];
          process.t.start = T(process.p.start, process.v);
          process.t.end = T(process.p.end, process.v)
        }
      }
    },
    setProcessIsoline(state, [i, v]) {
      state.processes[i].isoline = v;
    },
    deleteProcess(state, i) {
      state.processes.splice(i, 1)
    },
    setProcessGlow(state, [i, v]) {
      state.processes[i].glow = v
    },
    swapProcess(state, i) {
      let process = state.processes[i];
      let swap = prop => {
        let tmp = process[prop].start;
        process[prop].start = process[prop].end;
        process[prop].end = tmp;
      };
      if (process.type === 'isothermal') ['p', 'v'].forEach(swap);
      if (process.type === 'isobaric') ['t', 'v'].forEach(swap);
      if (process.type === 'isochoric') ['p', 't'].forEach(swap)
    },
    updateField
  },
  getters: {
    getField
  },
  actions: {
    addProcess(store, [type, subType]) {
      console.log('addProcess', [type, subType]);
      let last = {
        t: Math.random()*200+200,
        p: Math.random()*100+200,
        v: Math.random()*100+200
      };

      if (store.state.processes.length > 0)
        last = store.state.processes[store.state.processes.length-1];

      if (type === 'isothermal') {
        let t = last.t.end || last.t;
        let start = (last.v.end || last.v);
        let end = start+100*(subType === 'up' ? 1 : -1);
        return store.commit('addProcess', {
          type, t,
          v: {start, end},
          p: {start: P(t, start), end: P(t, end)}
        })
      }
      if (type === 'isobaric') {
        let p = last.p.end || last.p;
        let start = (last.v.end || last.v);
        let end = start+100*(subType === 'up' ? 1 : -1);
        return store.commit('addProcess', {
          type, p,
          v: {start, end},
          t: {start: T(p, start), end: T(p, end)}
        })
      }
      if (type === 'isochoric') {
        let v = last.v.end || last.v;
        let start = (last.t.end || last.t);
        let end = start+100*(subType === 'up' ? 1 : -1);
        return store.commit('addProcess', {
          type, v,
          t: {start, end},
          p: {start: P(start, v), end: P(end, v)}
        })
      }
    },
    /*addProcessAlt(store, payload) {
      let state = store.state;
      let chaining = state.chaining;
      let shouldChain = state.processes.length > 0 && chaining;
      store.commit('addProcess', payload);
      if (shouldChain) store.commit('setByPrev', state.processes.length-1)
    },*/
    editProcess(store, [i, diff]) {
      let state = store.state;
      let l = state.processes.length;
      let next_i = (i+1+l)%l;
      let prev_i = (i-1+l)%l;
      let shouldSetPrev = i > 0;
      let shouldSetNext = i < l-1;
      console.log('editing', i, JSON.parse(JSON.stringify(diff)), shouldSetPrev, shouldSetNext);
      store.commit('editProcess', [i, diff]);
      if (state.chaining) {
        let history = [i];
        if (shouldSetNext) store.dispatch('chainProcess', [next_i, 1, history]);
        if (shouldSetPrev) store.dispatch('chainProcess', [prev_i, -1, history]);
      }
    },
    chainProcess(store, [i, direction=0, history=[]]) {
      history.push(i);
      let state = store.state;
      if (!state.chaining) return;

      let l = state.processes.length;
      let next_i = (i+1+l)%l;
      let prev_i = (i-1+l)%l;

      // let [key, val] = diff;
      // let key_isstart = !!key.match(/^[tpv]_start$/);
      // let key_isend = !!key.match(/^[tpv]_end$/);

      let shouldSetPrev = (direction !== 1) && i > 0;
      let shouldSetNext = (direction !== -1) && i < l-1;
      // console.log('пришли в', i, 'direction', direction, shouldSetPrev, shouldSetNext, history);


      if (direction === 1) store.commit('setByPrev', i);
      else if (direction === -1) store.commit('setByNext', i);

      if (shouldSetNext && !history.includes(next_i)) store.dispatch('chainProcess', [next_i, 1, history]);
      if (shouldSetPrev && !history.includes(prev_i)) store.dispatch('chainProcess', [prev_i, -1, history]);
      // console.log('end', i)
    },
    deleteProcess(store, i) {
      store.commit('deleteProcess', i);
      if (i > 0) store.dispatch('chainProcess', [i-1, 1])
    },
    swapProcess(store, i) {
      store.commit('swapProcess', i);
      store.dispatch('chainProcess', [i]);
    },
    updateCycle(store) {
      let state = store.state;
      if (state.processes.length < 3) return;
      let last = state.processes[state.processes.length-1];
      let last_i = state.processes.length-1;
      let first = state.processes[0];
      if (first.type === 'isothermal') {
        if (last.type === 'isothermal') {
          store.dispatch('editProcess', [last_i, ['t', first.t]]);
          store.dispatch('editProcess', [last_i, ['p_end', first.p.start]]);
        }
        else if (last.type === 'isobaric') {
          store.dispatch('editProcess', [last_i, ['p', first.p.start]]);
          store.dispatch('editProcess', [last_i, ['t_end', first.t]]);
        }
        else if (last.type === 'isochoric') {
          store.dispatch('editProcess', [last_i, ['v', first.v.start]]);
          store.dispatch('editProcess', [last_i, ['t_end', first.t]]);
        }
      }
      else if (first.type === 'isobaric') {
        if (last.type === 'isothermal') {
          store.dispatch('editProcess', [last_i, ['t', first.t.start]]);
          store.dispatch('editProcess', [last_i, ['p_end', first.p]]);
        }
        else if (last.type === 'isobaric') {
          store.dispatch('editProcess', [last_i, ['p', first.p]]);
          store.dispatch('editProcess', [last_i, ['t_end', first.t.start]]);
        }
        else if (last.type === 'isochoric') {
          store.dispatch('editProcess', [last_i, ['v', first.v.start]]);
          store.dispatch('editProcess', [last_i, ['t_end', first.t.start]]);
        }
      }
      else if (first.type === 'isochoric') {
        if (last.type === 'isothermal') {
          store.dispatch('editProcess', [last_i, ['t', first.t.start]]);
          store.dispatch('editProcess', [last_i, ['p_end', first.p.start]]);
        }
        else if (last.type === 'isobaric') {
          store.dispatch('editProcess', [last_i, ['p', first.p.start]]);
          store.dispatch('editProcess', [last_i, ['t_end', first.t.start]]);
        }
        else if (last.type === 'isochoric') {
          store.dispatch('editProcess', [last_i, ['v', first.v]]);
          store.dispatch('editProcess', [last_i, ['t_end', first.t.start]]);
        }
      }
    }
  }
});

export default store