<template>
    <v-card>
        <v-card-title class="headline">Add process</v-card-title>
        <v-card-text>
            <v-layout wrap>
                <v-flex xs12 sm6>
                    <v-radio-group v-model="processType" color="primary">
                        <v-radio color="primary"
                                 label="Изотермальное"
                                 value="isothermal"/>
                        <v-radio color="primary"
                                 label="Изобарное"
                                 value="isobaric"/>
                        <v-radio color="primary"
                                 label="Изохорное"
                                 value="isochoric"/>
                    </v-radio-group>
                </v-flex>
                <v-flex xs12 sm6>
                    <v-radio-group v-model="processSubtype" color="primary">
                        <template v-if="processType === 'isochoric'">
                            <v-radio color="primary"
                                     label="нагревание"
                                     value="up"/>
                            <v-radio color="primary"
                                     label="охлаждение"
                                     value="down"/>
                        </template>
                        <template v-else>
                            <v-radio color="primary"
                                     label="расширение"
                                     value="up"/>
                            <v-radio color="primary"
                                     label="сжатие"
                                     value="down"/>
                        </template>
                    </v-radio-group>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary darken-1" flat @click="$emit('close')">Close</v-btn>
            <v-btn color="primary darken-1" flat @click="add()">Add</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  export default {
    name: 'GraphAdd',
    data() {
      return {
        processType: 'isothermal',
        processSubtype: 'up'
      }
    },
    methods: {
      add() {
        this.$store.dispatch('addProcess', [this.processType, this.processSubtype]);
        this.$emit('close')
      },
      updateCycle() {
        this.$store.dispatch('updateCycle')
      }
    },
  }
</script>

<style scoped lang="less">

</style>