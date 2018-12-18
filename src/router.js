import Vue from 'vue'
import Router from 'vue-router'
import Tasks from './views/Task.vue'
import Home from './views/Home.vue'
import Table from './views/table.vue'
import Lists from './views/ShoppingList.vue'
import Items from './views/ListItem.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks
    },
    {
      path: '/items/:list_id',
      name: 'item_lists',
      component: Items
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/table',
      name: 'table',
      component: Table
    },
    {
      path: '/lists',
      name: 'lists',
      component: Lists
    }

  ]
})
