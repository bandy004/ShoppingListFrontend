<template>
  <div>
    <v-layout justify-center>
      <v-dialog v-model="dialog" max-width="30%">
        <v-btn slot="activator" color="primary" dark class="mb-2"> Add List</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="edit_list.Name" label="Name"></v-text-field>
                </v-flex>
                <!--
                <v-flex xs12>
                  <v-text-field v-model="edited_task.Cost" label="Cost"></v-text-field>
                </v-flex>
              -->
              </v-layout>
            </v-container>
          </v-card-text>
          <v-layout justify-center xs12>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="saveList(edit_list)">Save</v-btn>
            <v-btn @click="close()">Cancel</v-btn>
          </v-card-actions>
        </v-layout>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout justify-center>
   <!-- <v-card width="80%"> -->
    <v-data-table
      :headers="headers"
      :items="lists"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{props.item.id}}</td>
        <td>{{props.item.Name}}</td>
        <td>{{props.item.TotalCost}}</td>
        <td>{{props.item.CompletionPercentage}}</td>
        <td>{{props.item.CompletedItems}}</td>
        <td>{{props.item.PendingItems}}</td>
        <td>
          <!-- <v-btn :to="getPath(props.item)">Show items for {{props.item.id}} </v-btn> -->
          <v-btn icon :to="getPath(props.item)">
            <v-icon> toc</v-icon>
          </v-btn>
        </td>
        <td>
          <v-icon @click="editList(props.item)">edit</v-icon>
          <v-icon @click="deleteList(props.item)">delete</v-icon>
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


  <router-view/>
  </div>

</template>

<script>
const API ="http://localhost:3000/api/ShoppingLists"
//const API = "https://shop-back.herokuapp.com/api/ShoppingLists"
export default{
  data () {
    return {
      dialog: false,
      headers: [
        {text:"ID", value:"id"},
        {text:"Name", value:"Name"},
        {text:"Cost", value:"TotalCost"},
        {text:"Completion", value:"CompletionPercentage"},
        {text:"Finished", value:"CompletedItems"},
        {text:"Pending", value:"PendingItems"},
        {text:"Items", value:"list-items"},
        {text:"Actions", value:"actions"}

      ],
      lists:[],
      edit_list:{
        id: -1,
        Name: ""
      },
      new_list:{
        Name: ""
      }
    }
  },
  computed: {
    formTitle () {
      return this.edit_list.Name === "" ? "New List" : "Edit List"
    }
  },

    /*
    totalCost() {
      let cost = 0.0;

      for( let t in this.tasks) {
        cost = cost + Number(this.tasks[t].Cost)
      }

      return*/

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created (){
    this.getLists();
  },

  methods:{
    getLists(){
      fetch(API)
      .then(res =>res.json())
      .then(res => this.lists = res)

      //console.log(this.tasks);
    },

    getPath(item) {
      return "/items/"+item.id;
    },
    ///edit tasks
    editList(list) {
      this.edit_list.Name = list.Name;
      this.edit_list.id = list.id;
      this.dialog = true;

    },

    deleteList(list){
      let ans = confirm('Are you sure you want to delete this list?')
      if( ans)
      {
        fetch(API+"/"+list.id, {
          headers:{
            'Content-Type':'application/json'
          },
          method:'DELETE'
        })
        .then(res=> {
          console.log(res.status);
          this.getLists();
        })
    }
  },

    close() {
      this.dialog = false;
      this.new_list.Name = "";
      this.edit_list.Name ="";
      this.edit_list.id = -1;
    },

    saveList(list) {
      //console.log("Cost ", task.Cost, " Name ", task.Name, JSON.stringify(this.default_task));
      this.edit_list.Name = list.Name;
      this.edit_list.id = list.id;
      //console.log("Cost ", task.Cost, " Name ", task.Name, JSON.stringify(this.default_task));
      if( list.id > -1 ) {
        //console.log("Inside");
        fetch(API+"/"+list.id, {
          headers:{
            'Content-Type':'application/json'
          },
          method:'PATCH',
          body:JSON.stringify(this.edit_list)
        })
        .then(res=> {
          console.log("Status", res.status)
          this.getLists()
        }).catch(err => {
          console.log("Error ", err);
        })
    }
    else{
      this.createList();
    }
    this.close();
    },

    createList () {
      this.new_list.Name = this.edit_list.Name;
      fetch(API, {
        headers:{
          'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify(this.new_list)
      })
      .then(res=>res.json())
      .then(res=> {
        this.getLists()
      })
      this.new_list.Name = "";
      //console.log(this.edited_task)

      //confirm("Do you want to create?")
    }
  }
}
</script>
