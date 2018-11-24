<template>
<div class="process-root">
    {{process.type}};
    T:
    <template v-if="typeof process.t === 'object'">
        <input type="number" :value="process.t.start" @input="input('t_start', $event)" :min="min" :max="max"/>
        <input type="number" :value="process.t.end" @input="input('t_end', $event)" :min="min" :max="max"/>
    </template>
    <input v-else type="number" :value="process.t" @input="input('t', $event)" :min="min" :max="max">
    P:
    <template v-if="typeof process.p === 'object'">
        <input type="number" :value="process.p.start" @input="input('p_start', $event)" :min="min" :max="max"/>
        <input type="number" :value="process.p.end" @input="input('p_end', $event)" :min="min" :max="max"/>
    </template>
    <input v-else type="number" :value="process.p" @input="input('p', $event)" :min="min" :max="max">
    V:
    <template v-if="typeof process.v === 'object'">
        <input type="number" :value="process.v.start" @input="input('v_start', $event)" :min="min" :max="max"/>
        <input type="number" :value="process.v.end" @input="input('v_end', $event)" :min="min" :max="max"/>
    </template>
    <input v-else type="number" :value="process.v" @input="input('v', $event)" :min="min" :max="max">
    <label><input type="checkbox" :checked="process.isoline" @input="toggleIsoline">isoline</label>
</div>
</template>

<script>
  export default {
    name: 'graph-controls-process',
    props: {
      process: Object,
      i: Number
    },
    data() {
      return {
        min: 200,
        max: 1000
      }
    },
    methods: {
      handleProcessEdit(t, v) {
        this.$store.commit('editProcess', [this.i, [t, v]])
      },
      input(type, e) {
        let v = e.target.value;
        v = parseInt(v);
        if (isNaN(v)) return;
        if (v === 0) return;
        console.log(v);
        this.handleProcessEdit(type, v)
      },
      toggleIsoline(e) {
        let v = e.target.checked;
        this.$store.commit('setProcessIsoline', [this.i, v])
      }
    }
  }
</script>

<style scoped lang="less">
    .process-root {
        font-family: 'Ubuntu Mono', monospace;
    }
    input[type='number'] {
        font-family: inherit;
    }
</style>