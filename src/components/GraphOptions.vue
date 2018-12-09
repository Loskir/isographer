<template>
    <v-menu
            transition="slide-x-transition"
            bottom
            left>
        <v-btn
                slot="activator"
                flat
                icon
                dark>
            <v-icon>settings</v-icon>
        </v-btn>

        <v-list pa-2>
            <v-list-tile @click.prevent.stop="chaining = !chaining">
                <v-list-tile-action>
                    <v-checkbox
                            class="mt-0"
                            v-model="chaining"
                            color="primary"
                            @click.prevent
                            :hide-details="true"/>
                </v-list-tile-action>
                <v-list-tile-content>Chaining</v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click.prevent.stop="toggleGlow">
                <v-list-tile-action>
                    <v-checkbox
                            class="mt-0"
                            v-model="glow"
                            color="primary"
                            @click.prevent
                            :hide-details="true"/>
                </v-list-tile-action>
                <v-list-tile-content>Glow</v-list-tile-content>
            </v-list-tile>
            <v-btn flat @click.stop="updateCycle">update cycle</v-btn>
        </v-list>
    </v-menu>
</template>

<script>
  import { mapFields } from 'vuex-map-fields';
  import VListTileAction from "vuetify/lib/components/VList/VListTileAction";
  export default {
    components: {VListTileAction},
    name: 'GraphOptions',
    computed: {
      ...mapFields(['chaining', 'glow'])
    },
    methods: {
      updateCycle() {
        this.$store.dispatch('updateCycle')
      },
      toggleGlow() {
        this.glow = !this.glow
      }
    },
  }
</script>

<style scoped lang="less">

</style>