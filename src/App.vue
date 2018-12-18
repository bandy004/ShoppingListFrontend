<template>
  <v-app>
    <v-toolbar dark color="primary">
      <!--<v-toolbar-side-icon></v-toolbar-side-icon>-->
      <v-btn icon to="/">
        <v-icon>home</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text">{{name}}</v-toolbar-title>
      <!--
      <v-btn icon to="/lists">
        <v-icon>list</v-icon>
      </v-btn>
    -->
      <v-spacer></v-spacer>



      <v-btn icon to="/about">
        <v-icon>info</v-icon>
      </v-btn>
      <v-btn icon to="/lists">
        <v-icon>list</v-icon>
      </v-btn>
      <!--
      <v-btn icon to="/table">
        <v-icon>list_alt</v-icon>
      </v-btn>

      <v-btn icon to="/tasks">
        <v-icon>list</v-icon>
      </v-btn>
    -->
    </v-toolbar>


    <v-content>
      <div id="nav">
          <!--
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      -->
      </div>
        <router-view/>
    </v-content>

    <v-footer
        height="auto"
        color="primary lighten-1"
      >
        <v-layout
          justify-center
          row
          wrap
        >
          <v-flex
            primary
            lighten-2
            py-3
            text-xs-center
            white--text
            xs12
          >
            &copy;2018 — <strong>Vuetify</strong>
          </v-flex>
        </v-layout>
      </v-footer>


  </v-app>

</template>

<script>
import Tasks from './views/Task.vue'

export default {
  name: 'App',
  components: {
    Tasks
  },
  data () {
    return {
      name: "Shopping List"
    }
  }
}
</script>
