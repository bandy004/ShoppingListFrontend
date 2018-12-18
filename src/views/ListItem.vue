<template>
  <div>
    <v-toolbar flat color="white" align="center">
      <v-toolbar-title> Total Cost </v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <h1> {{totalCost}}</h1>
      <v-spacer/>
      <v-toolbar-title> Completion {{this.list_id}}</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-progress-circular
        :value="completion"
        class="mx-2"
      ></v-progress-circular>
      <v-spacer/>
      <v-toolbar-title> Completed Items </v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <h1>
         {{ completedItems }}
      </h1>
      <v-spacer/>
      <v-toolbar-title> Pending Items </v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <h1> {{pendingItems}}</h1>
      <v-spacer/>

      <v-dialog v-model="dialog" max-width="30%">
        <!--<v-btn v-if=false slot="activator" color="primary" dark class="mb-2"> Add Item</v-btn>-->
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="edited_item.Name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="edited_item.Cost" label="Cost"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-layout justify-center xs12>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="close()">Cancel</v-btn>
            <v-btn @click="saveItem(edited_item)">Save</v-btn>
          </v-card-actions>
        </v-layout>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-divider
      class="mx-2"
      horizontal
    ></v-divider>

    <v-toolbar flat color="white" align="center">
      <v-spacer/>
      <v-text-field v-model="newItemName" @keydown.enter="createItem" label="Add Item">
         <v-fade-transition slot="append">
          <v-icon
            v-if='newItemName !=""'
            @click="createItem"
          >
            add_circle
          </v-icon>
        </v-fade-transition>
      </v-text-field>
      <v-spacer/>
      </v-toolbar>
      <v-divider
        class="mx-2"
        horizontal
      ></v-divider>
    <v-layout justify-center>
   <!-- <v-card width="80%"> -->
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-icon v-if="isCompleted(props.item)" color="success">check_circle</v-icon>
        </td>
        <td>{{props.item.listId}}</td>
        <td>{{props.item.Name}}</td>
        <td>{{props.item.Cost}}</td>
        <td>
          <v-icon @click="editItem(props.item)">edit</v-icon>
          <v-icon @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
      <!--
      <template slot="no-data">
        <v-btn @click="initialize()">Reset</v-btn>
      </template>
     -->
    </v-data-table>
    <!--</v-card> -->
  </v-layout>
  </div>
</template>

<script>
//const API ="http://localhost:3000/api/Items"
const nAPI = "http://localhost:3000/api/ShoppingLists/";//+{{this.list_id}}+"/items"
//const API ="https://shop-back.herokuapp.com/api/ShoppingLists/"
export default{
  data () {
    return {
      dialog: false,
      headers:[
        {
          text: "Status",
          value: "status",
          sortable: false,
          width: "5%"
        },
        {
          text: "List ID",
          align: "left",
          sortable: true,
          value: "listId",
          width: "5%"
        },
        {
          text: "Items",
          align: "left",
          sortable: true,
          value: "Name",
          width: "50%"
        },
        {
          text: "Cost",
          align: "left",
          value: "Cost",
          sortable: true,
          width:'20%'
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          width: "20%"
        },
      ],
      list_id: this.$route.params.list_id,
      API: nAPI+this.$route.params.list_id+"/items",
      newItemName: "",
      items: [],
      selected_item_id: -1,
      edited_item: {
        Name: "NA",
        Cost: 0.0,
        id:-1,
        listId:this.list_id,
      },
      default_item:{
        Name: "NA",
        Cost: 0.0,
        id:-1,
        listId:this.list_id
      },
      list:{
        TotalCost: 0,
        CompletionPercentage: 0,
        CompletedItems: 0,
        PendingItems: 0
      }

    }
  },

  computed: {
    formTitle () {
      return this.selected_item_id === -1 ? "New Item" : "Edit Item"
    },

    completedItems(){
      return this.items.filter(item => this.isCompleted(item)).length
    },
    pendingItems(){
      return this.items.filter(item => !this.isCompleted(item)).length
    },
    completion() {
      return 100*(this.completedItems/this.items.length)
    },
    totalCost() {
      let cost = 0.0;

      for( let t in this.items) {
        cost = cost + Number(this.items[t].Cost)
      }

      return cost
    }


  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created (){
    this.getItems();
    //this.updateList();
  },

  updated: function() {
    this.updateList();
  },

  methods:{
    getItems(){
      console.log(this.API);
      fetch(this.API)
      .then(res =>res.json())
      .then(res => this.items = res)

      console.log(this.items);
      //this.updateList();
    },
    isCompleted (item) {
      return item.Cost > 0.0 ? true : false;
    },
    ///edit items
    editItem(item) {
      this.selected_item_id = item.id;
      this.edited_item = Object.assign({}, item)
      this.dialog = true

    },

    deleteItem(item){
      let ans = confirm('Are you sure you want to delete this item?')
      if( ans)
      {
        fetch(this.API+"/"+item.id, {
          headers:{
            'Content-Type':'application/json'
          },
          method:'DELETE'
        })
        .then(res=> {
          console.log(res.status);
          this.getItems()
        })
      }
    },

    close() {
      this.dialog = false;
      this.edited_item = Object.assign({}, this.default_item);
      this.selected_item_id = -1;
    },

    saveItem(item) {
      //console.log("Cost ", item.Cost, " Name ", item.Name, JSON.stringify(this.default_item));
      Object.assign(this.default_item, item);
      //this.default_item.Name = item.Name;
      //this.default_item.Cost = Number(item.Cost);
      //console.log("Cost ", item.Cost, " Name ", item.Name, JSON.stringify(this.default_item));
      fetch(this.API+"/"+item.id, {
        headers:{
          'Content-Type':'application/json'
        },
        method:'PUT',
        body:JSON.stringify(this.default_item)
      })
      .then(res=> {
        console.log("Status", res.status)
        this.getItems();
      }).catch(err => {
        console.log("Error ", err);
      })
      this.close();
    },

    createItem () {
      this.default_item.Name = this.newItemName;
      this.default_item.Cost = 0.0;
      //this.default_item.listId = 2;

      this.ItemAPI('POST')
      this.newItemName="";
      //console.log(this.edited_item)

      //confirm("Do you want to create?")
    },

    ItemAPI (method_x){
      let ff =Object.assign({}, this.default_item);
      delete ff.id
      fetch(this.API, {
        headers:{
          'Content-Type':'application/json'
        },
        method:method_x,
        body:JSON.stringify(ff)
      })
      .then(res=>res.json())
      .then(res=> {
        this.getItems()
      })
    },

    updateList(){
      this.list.TotalCost = this.totalCost;
      this.list.CompletedItems = this.completedItems;
      this.list.CompletionPercentage = this.completion;
      this.list.PendingItems = this.pendingItems;
      console.log(JSON.stringify(this.list));
      fetch(nAPI+this.list_id, {
        headers:{
          'Content-Type':'application/json'
        },
        method:'PATCH',
        body:JSON.stringify(this.list)
      })
      .then(res=>res.json())
    }
  }
}
</script>
