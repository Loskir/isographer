<template>
    <div class="svg-wrapper">
        <svg viewBox="-10 -10 1020 1020">
            <line x1="0" y1="0" x2="0" :y2="$store.state.svgSize" class="axis"/>
            <line x1="0" :y1="$store.state.svgSize" :x2="$store.state.svgSize" :y2="$store.state.svgSize" class="axis"/>
            <polyline
                    :points="arrowPointsX"
                    class="arrow"/>
            <polyline
                    :points="arrowPointsY"
                    class="arrow"/>
            <graph-process
                    v-for="(p, i) in this.$store.state.processes"
                    :key="i+1"
                    :process="p"
                    :graph-type="type"/>
            <text
                    class="axis-text"
                    :x="$store.state.svgSize-60"
                    :y="$store.state.svgSize-30"
                    v-text="type[1]"/>
            <text
                    class="axis-text"
                    :x="30"
                    :y="50"
                    v-text="type[0]"/>
        </svg>
    </div>
</template>

<script>
  import GraphProcess from "./GraphProcess.vue";

  export default {
    components: {GraphProcess},
    name: '',
    props: {
      type: String
    },
    data() {
      return {
        arrowLength: 40,
        arrowWidth: 8 // в каждую сторону
      }
    },
    computed: {
      arrowPointsX() {
        let ss = this.$store.state.svgSize;
        let l = this.arrowLength;
        let w = this.arrowWidth;
        return `${ss-l} ${ss-w} ${ss} ${ss} ${ss-l} ${ss+w}`
      },
      arrowPointsY() {
        let l = this.arrowLength;
        let w = this.arrowWidth;
        return `${-w} ${l} 0 0 ${w} ${l}`
      }
    }
  }
</script>

<style scoped lang="less">
    .svg-wrapper {
        flex-grow: 1;
    }
    svg {
        /*width: 200px;*/
        /*height: 200px;*/

        .axis, .arrow {
            stroke: black;
            stroke-width: 5;
            stroke-linecap: round;
        }
        .axis-text {
            font-size: 80px;
            font-family: "Ubuntu Mono", monospace;
        }
    }
</style>