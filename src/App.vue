<template>
  <div id="app">
    <graph-wrapper/>
    <graph-controls/>
  </div>
</template>

<script>
  import GraphWrapper from './components/GraphWrapper.vue'
  import GraphControls from './components/GraphControls.vue'
  export default {
    components: {
      GraphWrapper,
      GraphControls
    }
  }
</script>

<style lang="less">
  body {
    margin: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
