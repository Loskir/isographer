<template>
    <v-layout column fill-height class="graph-controls-root">
        <div
                class="no-processes"
                v-if="$store.state.processes.length === 0">
            <span>Нет процессов</span>
            <span>Для добавления нажми на кнопку +</span>
        </div>
        <v-expansion-panel
                class="processes">
            <graph-controls-process
                    v-for="(process, i) in $store.state.processes"
                    :process="process"
                    :i="i"
                    :key="`${process.type}_${i}`"/>
        </v-expansion-panel>
        <!--разумный диапазон - 250:500 -->
        <!--<div class="controls">
            &lt;!&ndash;<label>T<input type="radio" name="a" value="isothermal"/></label>&ndash;&gt;
            &lt;!&ndash;<label>P<input type="radio" name="a" value="isobaric"/></label>&ndash;&gt;
            &lt;!&ndash;<label>V<input type="radio" name="a" value="isochoric"/></label>&ndash;&gt;
            &lt;!&ndash;<br>&ndash;&gt;
            <v-btn @click="add('isothermal')">+T</v-btn>
            <v-btn @click="add('isobaric')">+P</v-btn>
            <v-btn @click="add('isochoric')">+V</v-btn>
            <br>

            <v-switch
                    class="mt-0"
                    v-model="chaining"
                    label="Chaining"
                    color="primary"
                    :hide-details="true"/>
            <v-switch
                    class="mt-0"
                    v-model="glow"
                    label="Glow"
                    color="primary"
                    :hide-details="true"/>
            <v-btn @click="updateCycle">update cycle</v-btn>
        </div>-->
    </v-layout>
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
      /*add(type) {
        this.$store.dispatch('addProcess', {
          type,
          constant: this.constant,
          variable: {
            start: this.start,
            end: this.end
          }
        })
      },*/
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
        font-family: 'Roboto Mono', monospace;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        .no-processes {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 1rem;
            opacity: .8;
        }
    }
</style>