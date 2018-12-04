<template>
<div
        class="process-root"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        :class="process.type">
    <span>{{process.type}}</span>
    <div class="col">
        <div class="col">
            <div class="row">
                <span>T:</span>
                <div v-if="typeof process.t === 'object'">
                    <input type="range" style="width: 100px" :value="process.t.start" @input="input('t_start', $event)" :min="min" :max="max"/>
                    <input type="range" style="width: 100px" :value="process.t.end" @input="input('t_end', $event)" :min="min" :max="max"/>
                </div>
                <input v-else type="range" style="width: 200px" :value="process.t" @input="input('t', $event)" :min="min" :max="max">
            </div>
            <div class="row">
                <span>P:</span>
                <div v-if="typeof process.p === 'object'">
                    <input type="range" style="width: 100px" :value="process.p.start" @input="input('p_start', $event)" :min="min" :max="max"/>
                    <input type="range" style="width: 100px" :value="process.p.end" @input="input('p_end', $event)" :min="min" :max="max"/>
                </div>
                <input v-else type="range" style="width: 200px" :value="process.p" @input="input('p', $event)" :min="min" :max="max">
            </div>
            <div class="row">
                <span>V:</span>
                <div v-if="typeof process.v === 'object'">
                    <input type="range" style="width: 100px" :value="process.v.start" @input="input('v_start', $event)" :min="min" :max="max"/>
                    <input type="range" style="width: 100px" :value="process.v.end" @input="input('v_end', $event)" :min="min" :max="max"/>
                </div>
                <input v-else type="range" style="width: 200px" :value="process.v" @input="input('v', $event)" :min="min" :max="max">
            </div>
        </div>
    </div>
    <!--<template v-if="typeof process.t === 'object'">
        <input type="range" :value="process.t.start" @input="input('t_start', $event)" :min="min" :max="max"/>
        <input type="range" :value="process.t.end" @input="input('t_end', $event)" :min="min" :max="max"/>
    </template>
    <input v-else type="range" :value="process.t" @input="input('t', $event)" :min="min" :max="max">
    P:
    <template v-if="typeof process.p === 'object'">
        <input type="range" :value="process.p.start" @input="input('p_start', $event)" :min="min" :max="max"/>
        <input type="range" :value="process.p.end" @input="input('p_end', $event)" :min="min" :max="max"/>
    </template>
    <input v-else type="range" :value="process.p" @input="input('p', $event)" :min="min" :max="max">
    V:
    <template v-if="typeof process.v === 'object'">
        <input type="range" :value="process.v.start" @input="input('v_start', $event)" :min="min" :max="max"/>
        <input type="range" :value="process.v.end" @input="input('v_end', $event)" :min="min" :max="max"/>
    </template>
    <input v-else type="range" :value="process.v" @input="input('v', $event)" :min="min" :max="max">-->
    <label><input type="checkbox" :checked="process.isoline" @input="toggleIsoline">isoline</label>
    <button @click="$store.dispatch('deleteProcess', i)">x</button>
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
      handleMouseenter() {
        this.$store.commit('setProcessGlow', [this.i, true])
      },
      handleMouseleave() {
        this.$store.commit('setProcessGlow', [this.i, false])
      },
      handleProcessEdit(t, v) {
        this.$store.dispatch('editProcess', [this.i, [t, v]])
      },
      input(type, e) {
        let v = e.target.value;
        v = parseInt(v);
        if (isNaN(v)) return;
        if (v === 0) return;
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
        font-family: inherit;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;

        /*&.isothermal {*/
            /*background-color: fade(lightgreen, 30%);*/
        /*}*/
        /*&.isobaric {*/
            /*background-color: fade(lightcoral, 30%);*/
        /*}*/
        /*&.isochoric {*/
            /*background-color: fade(lightblue, 30%);*/
        /*}*/
    }
    input[type='number'] {
        font-family: inherit;
    }
    .col {
        display: flex;
        flex-direction: column;
    }
    .row {
        flex-grow: 1;
        justify-content: flex-start;
        display: flex;
        flex-direction: row;
    }
</style>