<template>
<div>
    <graph-controls-process
            v-for="(process, i) in $store.state.processes"
            :process="process"
            :i="i"
            :key="i"/>
    <!--разумный диапазон - 250:500 -->
    <input type="number" v-model.number="constant"/>
    <input type="number" v-model.number="start"/>
    <input type="number" v-model.number="end"/>
    <br>
    <button @click="add('isothermal')">+T</button>
    <button @click="add('isobaric')">+P</button>
    <button @click="add('isochoric')">+V</button>
</div>
</template>

<script>
  import GraphControlsProcess from './GraphControlsProcess.vue'
  export default {
    name: 'graph-controls',
    components: {
      GraphControlsProcess
    },
    data() {
      return {
        constant: 250,
        start: 250,
        end: 500,
      }
    },
    methods: {
      add(type) {
        this.$store.commit('addProcess', {
          type,
          constant: this.constant,
          variable: {
            start: this.start,
            end: this.end
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">

</style>