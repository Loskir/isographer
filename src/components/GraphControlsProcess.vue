<template>
    <v-expansion-panel-content
            class="process-root"
            @mouseenter.native="handleMouseenter"
            @mouseleave.native="handleMouseleave"
            :class="process.type">
        <div slot="header">{{process.type}}</div>
        <div class="col">
            <div
                    class="row"
                    v-for="val in ['t', 'p', 'v']">
                <!--<span>{{}}:</span>-->
                <div v-if="process[val].start">
                    <v-range-slider
                            :label="val.toUpperCase()+':'"
                            class="slider mt-0"
                            :value="[Math.min(process[val].start, process[val].end), Math.max(process[val].start, process[val].end)]"
                            thumb-label
                            :hide-details="true"
                            :always-dirty="true"
                            :max="max" :min="min" @input="input(val, $event, true)"
                    />
                </div>
                <v-slider
                        :label="val.toUpperCase()+':'"
                        class="slider mt-0"
                        v-else
                        :value="process[val]"
                        thumb-label
                        :hide-details="true"
                        :always-dirty="true"
                        :max="max" :min="min" @input="input(val, $event)"
                />
            </div>
        </div>
        <div class="row">
            <v-switch
                    class="mt-0"
                    v-model="isoline"
                    label="isoline"
                    color="primary"
                    :hide-details="true"/>
            <!--<label><input type="checkbox" :checked="process.isoline" @input="toggleIsoline">isoline</label>-->
            <v-btn
                    class="my-0 mx-1"
                    @click="$store.dispatch('swapProcess', i)"
                    icon>
                <v-icon>swap_horiz</v-icon>
            </v-btn>
            <v-btn
                    class="my-0 mx-1"
                    @click="$store.dispatch('deleteProcess', i)"
                    icon>
                <v-icon>delete</v-icon>
            </v-btn>
        </div>
    </v-expansion-panel-content>
</template>

<script>
  import VInput from "vuetify/lib/components/VInput/VInput";

  export default {
    components: {VInput},
    name: 'graph-controls-process',
    props: {
      process: Object,
      i: Number
    },
    data() {
      return {
        min: 10,
        max: 2000
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
      input(type, e, double=false) {
        console.log(type, e);
        if (e === 0) return;
        if (double) {
          let r = this.reversed[type];
          console.log(r);
          let a=false,b=false;
          if (this.process[type][r ? 'start' : 'end'] !== e[0]) a = true;
          if (this.process[type][r ? 'end' : 'start'] !== e[1]) b = true;
          console.log(a,b);
          if (a) this.handleProcessEdit(type+(r ? '_start' : '_end'), e[0]);
          if (b) this.handleProcessEdit(type+(r ? '_end' : '_start'), e[1]);
        }
        else this.handleProcessEdit(type, e)
      }
    },
    computed: {
      reversed() {
        return {
          't': this.process.t.start < this.process.t.end,
          'p': this.process.p.start < this.process.p.end,
          'v': this.process.v.start < this.process.v.end,
        }
      },
      isoline: {
        get: function () {
          return this.process.isoline
        },
        set: function (e) {
          console.log(e)
          this.$store.commit('setProcessIsoline', [this.i, e])
        }
      }
    }
  }
</script>

<style scoped lang="less">
    @import "../assets/vars.less";
    .process-root {
        font-family: inherit;

        padding: 10px 20px;

        &.isothermal {
            background-color: fade(@isothermal, 20%);
        }
        &.isobaric {
            background-color: fade(@isobaric, 20%);
        }
        &.isochoric {
            background-color: fade(@isochoric, 20%);
        }
    }
    input[type='number'] {
        font-family: inherit;
    }
    .col {
        display: flex;
        flex-direction: column;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .fg {
        flex-grow: 1;
        justify-content: flex-start;
    }
    .slider {
        /*width: 100px;*/
    }
</style>