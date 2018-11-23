<template>
<div class="process-root">
    {{process.type}};
    T:
    <template v-if="typeof t === 'object'">
        <input type="number" v-model.number="t.start" :min="min" :max="max"/>
        <input type="number" v-model.number="t.end" :min="min" :max="max"/>
    </template>
    <input v-else type="range" v-model.number="t" :min="min" :max="max">
    P:
    <template v-if="typeof p === 'object'">
        <input type="number" v-model.number="p.start" :min="min" :max="max"/>
        <input type="number" v-model.number="p.end" :min="min" :max="max"/>
    </template>
    <input v-else type="range" v-model.number="p" :min="min" :max="max">
    V:
    <template v-if="typeof v === 'object'">
        <input type="number" v-model.number="v.start" :min="min" :max="max"/>
        <input type="number" v-model.number="v.end" :min="min" :max="max"/>
    </template>
    <input v-else type="range" v-model.number="v" :min="min" :max="max">
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
        min: 1,
        max: 1000,
        ...JSON.parse(JSON.stringify(this.process))
      }
    },
    methods: {
      handleProcessEdit(t, v) {
        if (v === '') return;
        if (v === 0) v = 1;
        else {
          if (v.start === '') return;
          if (v.end === '') return;
          if (v.start === 0) v.start = 1;
          else if (v.end === 0) v.end = 1;
        }
        this.$store.commit('editProcess', [this.i, [t, v]])

      }
    },
    computed: {
      //_process: {...this.process}
    },
    created() {
      //this._process = {...this.process};
    },
    watch: {
      process: {
        deep: true,
        handler(n) {
          console.log('change');
          this.p = n.p;
          this.v = n.v;
          this.t = n.t;
        }
      },
      't': {
        deep: true,
        handler(n, o) {
          if (n === o) return;
          this.handleProcessEdit('t', n)
        }
      },
      'p': {
        deep: true,
        handler(n, o) {
          if (n === o) return;
          this.handleProcessEdit('p', n)
        }
      },
      'v': {
        deep: true,
        handler(n, o) {
          if (n === o) return;
          this.handleProcessEdit('v', n)
        }
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