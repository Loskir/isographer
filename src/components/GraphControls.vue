<template>
<div class="graph-controls-root">
    <div class="processes">
        <graph-controls-process
                v-for="(process, i) in $store.state.processes"
                :process="process"
                :i="i"
                :key="i"/>
    </div>
    <!--разумный диапазон - 250:500 -->
    <div class="controls">
        <!--<label>T<input type="radio" name="a" value="isothermal"/></label>-->
        <!--<label>P<input type="radio" name="a" value="isobaric"/></label>-->
        <!--<label>V<input type="radio" name="a" value="isochoric"/></label>-->
        <!--<br>-->
        <button @click="add('isothermal')">+T</button>
        <button @click="add('isobaric')">+P</button>
        <button @click="add('isochoric')">+V</button>
        <br>
        <label><input type="checkbox" v-model="chaining">Enable chaining</label>
        <br>
        <label><input type="checkbox" v-model="glow">Enable glow</label>
        <br>
        <button @click="updateCycle">update cycle</button>
    </div>
</div>
</template>

<script>
  import { mapFields } from 'vuex-map-fields';
  import GraphControlsProcess from './GraphControlsProcess.vue'
  export default {
    name: 'graph-controls',
    components: {
      GraphControlsProcess
    },
    data() {
      return {
        processType: 'isothermal',
        constant: 250,
        start: 250,
        end: 500
      }
    },
    methods: {
      add(type) {
        this.$store.dispatch('addProcess', {
          type,
          constant: this.constant,
          variable: {
            start: this.start,
            end: this.end
          }
        })
      },
      updateCycle() {
        this.$store.dispatch('updateCycle')
      }
    },
    computed: {
      ...mapFields(['chaining', 'glow'])
    }
  }
</script>

<style scoped lang="less">
    .graph-controls-root {
        font-family: 'Ubuntu Mono', monospace;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
</style>