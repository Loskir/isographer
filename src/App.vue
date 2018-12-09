<template>
  <v-app class="app">
    <v-navigation-drawer
            fixed
            v-model="drawer"
            right
            clipped
            app>
      <graph-controls/>
    </v-navigation-drawer>
    <v-toolbar
            color="primary"
            dark
            fixed
            app
            clipped-right>
      <v-toolbar-title class="headline text-uppercase">
        <span>isographer</span>
      </v-toolbar-title>
      <sub><a class="loskir-link" href="http://loskir.ru" target="_blank">.loskir.ru</a></sub>
      <v-spacer/>
      <v-dialog v-model="infoDialog" max-width="400">
        <v-btn
                slot="activator"
                dark
                icon>
          <v-icon>info_outline</v-icon>
        </v-btn>
        <v-card>
          <v-card-title class="headline" primary-title>О программе</v-card-title>
          <v-card-text>
            <p>Isographer - веб-приложение, помогающее строить графики изопроцессов в различных осях (физика, 10 класс).</p>
            <p>Приложение создано в 2018 году Кириллом Лоскутовым, учеником 10 класса ЛНИП г. Королёва.</p>
            <p>Хочу отдельно поблагодарить Егора Ворончихина и Никиту Назарова за помощь в создании Isographer'а.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn href="http://loskir.ru" target="_blank" flat>Мой сайт</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <graph-options/>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    </v-toolbar>

    <v-content class="content">
      <v-container fluid fill-height>
        <graph-wrapper/>
        <!--<v-bottom-sheet v-model="addDialog">
          <v-btn
                  slot="activator"
                  color="pink"
                  dark
                  absolute
                  bottom
                  right
                  fab>
            <v-icon>add</v-icon>
          </v-btn>

          <v-list>
            <v-subheader>Add process</v-subheader>
            <v-layout row px-4>
              <v-radio-group v-model="radioGroup" color="red">
                <v-radio color="primary"
                        v-for="n in 3"
                        :key="n"
                        :label="`Radio ${n}`"
                        :value="n"
                ></v-radio>
              </v-radio-group>
              <v-list>
                <v-list-tile>Isothermal</v-list-tile>
                <v-list-tile>Isothermal</v-list-tile>
                <v-list-tile>Isothermal</v-list-tile>
              </v-list>
              <v-list>
                <v-list-tile><v-list-tile-title>Isothermal</v-list-tile-title></v-list-tile>
                <v-list-tile><v-list-tile-title>Isothermal</v-list-tile-title></v-list-tile>
              </v-list>
            </v-layout>
          </v-list>
        </v-bottom-sheet>-->
        <v-dialog v-model="addDialog" max-width="400">
          <v-btn
                  slot="activator"
                  color="pink"
                  dark
                  absolute
                  bottom
                  right
                  fab>
            <v-icon>add</v-icon>
          </v-btn>
          <graph-add @close="addDialog = false"/>
        </v-dialog>
      </v-container>
    </v-content>

    <v-footer
            height="auto"
            color="primary" app>
      <v-layout
              justify-center
              row
              wrap>
        <v-flex
                py-3
                text-xs-center
                white--text
                xs12>
          &copy;2018 — <strong>Loskir</strong>
        </v-flex>
      </v-layout>
    </v-footer>

  </v-app>
</template>

<script>
  import GraphWrapper from './components/GraphWrapper.vue'
  import GraphControls from './components/GraphControls.vue'
  import GraphAdd from './components/GraphAdd.vue'
  import GraphOptions from './components/GraphOptions.vue'

  export default {
    name: 'App',
    components: {
      GraphWrapper,
      GraphControls,
      GraphAdd,
      GraphOptions
    },
    data() {
      return {
        drawer: false,
        addDialog: false,
        infoDialog: false
      }
    }
  }
</script>

<style lang="less">
  html {
    overflow: hidden;
  }
  body {
    margin: 0;
  }
  .container {
    box-sizing: border-box;
  }
  .app {
    /*font-family: 'Roboto Mono', monospace!important;*/
  }
  .loskir-link {
    color: white;
    text-decoration: none;
    transition: .2s;
    font-weight: 300;
    &:hover {
      opacity: .8;
    }
  }
  .speed-dial {
    bottom: -28px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .scale-enter-active, .scale-leave-active {
    transition-duration: .25s;
    transition-property: transform opacity;
  }
  .scale-enter, .scale-leave-to {
    transform: scale(0);
    opacity: .5;
  }

</style>
