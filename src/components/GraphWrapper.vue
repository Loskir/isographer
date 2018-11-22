<template>
<div class="graph-wrapper">
    <graph type="pv"/>
    <graph type="vt"/>
    <graph type="pt"/>
</div>
</template>

<script>
  import Graph from './Graph.vue'
  export default {
    name: 'graph-wrapper',
    components: {
      Graph
    }
  }
</script>

<style scoped lang="less">
    .graph-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        padding: 0 1rem;
        box-sizing: border-box;
    }
</style>