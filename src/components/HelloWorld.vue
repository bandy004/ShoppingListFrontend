<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
      <v-flex xs12>
        <v-img
          :src="require('../assets/shoppinglist.png')"
          class="my-3"
          contain
          height="200"
        ></v-img>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Shopping List App
        </h1>
      </v-flex>
    </v-layout>
    <ShoppingLists/>
  </v-container>

</template>

<script>
  import ShoppingLists from '../views/ShoppingList.vue'
  export default {
    data: () => ({

    }),
    components:{
      ShoppingLists
    }
  }
</script>

<style>

</style>
