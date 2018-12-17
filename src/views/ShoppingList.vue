<template>
  <div>
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
          <v-icon @click="">edit</v-icon>
          <v-icon @click="">delete</v-icon>
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
const API ="http://localhost:3000/api/ShoppingLists"
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
        {text:"Actions", value:"actions"}
      ],
      lists:[]
    }
  },
  /*
  computed: {
    formTitle () {
      return this.selected_task_id === -1 ? "New Task" : "Edit Task"
    },

    completedTasks(){
      return this.tasks.filter(task => this.isCompleted(task)).length
    },
    pendingTasks(){
      return this.tasks.filter(task => !this.isCompleted(task)).length
    },
    completion() {
      return 100*(this.completedTasks/this.tasks.length)
    },
    totalCost() {
      let cost = 0.0;

      for( let t in this.tasks) {
        cost = cost + Number(this.tasks[t].Cost)
      }

      return cost
    }


  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  */
  created (){
    fetch(API)
    .then(res =>res.json())
    .then(res => this.lists = res)

    console.log(this.lists);
  },
 /*
  methods:{
    getTasks(){
      fetch(API+'?filter[limit]=1000')
      .then(res =>res.json())
      .then(res => this.tasks = res)

      console.log(this.tasks);
    },
    isCompleted (task) {
      return task.Cost > 0.0 ? true : false;
    },
    ///edit tasks
    editTask(task) {
      this.selected_task_id = task.id;
      this.edited_task = Object.assign({}, task)
      this.dialog = true

    },

    deleteTask(task){
      let ans = confirm('Are you sure you want to delete this item?')
      if( ans)
      {
        fetch(API+"/"+task.Name, {
          headers:{
            'Content-Type':'application/json'
          },
          method:'DELETE'
        })
        .then(res=> {
          console.log(res.status);
          this.getTasks()
        })
    }
  },

    close() {
      this.dialog = false;
      this.edited_task = Object.assign({}, this.default_task);
      this.selected_task_id = -1;
    },

    saveTask(task) {
      //console.log("Cost ", task.Cost, " Name ", task.Name, JSON.stringify(this.default_task));
      this.default_task.Name = task.Name;
      this.default_task.Cost = Number(task.Cost);
      console.log("Cost ", task.Cost, " Name ", task.Name, JSON.stringify(this.default_task));
      fetch(API+"/"+task.Name, {
        headers:{
          'Content-Type':'application/json'
        },
        method:'PATCH',
        body:JSON.stringify(this.default_task)
      })
      .then(res=> {
        console.log("Status", res.status)
        this.getTasks()
      }).catch(err => {
        console.log("Error ", err);
      })
      this.close();
    },

    createTask () {
      this.default_task.Name = this.newTaskName;
      this.default_task.Cost = 0.0;
      this.TaskAPI('POST')
      this.newTaskName="";
      //console.log(this.edited_task)

      //confirm("Do you want to create?")
    },

    TaskAPI (method_x){
      fetch(API, {
        headers:{
          'Content-Type':'application/json'
        },
        method:method_x,
        body:JSON.stringify(this.default_task)
      })
      .then(res=>res.json())
      .then(res=> {
        this.getTasks()
      })
    }
  }*/
}
</script>
