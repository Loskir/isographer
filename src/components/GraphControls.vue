<template>
<div>
    <div
            v-for="(process, i) in $store.state.processes"
            :key="i">
        {{process.type}}
    </div>
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
  export default {
    name: 'graph-controls',
    data() {
      return {
        constant: 0,
        start: 0,
        end: 0,
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