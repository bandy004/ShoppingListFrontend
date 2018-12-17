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
      <v-toolbar-title> Completion </v-toolbar-title>
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
      <v-toolbar-title> Completed Tasks </v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <h1>
         {{ completedTasks }}
      </h1>
      <v-spacer/>
      <v-toolbar-title> Pending Tasks </v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <h1> {{pendingTasks}}</h1>
      <v-spacer/>

      <v-dialog v-model="dialog" max-width="30%">
        <!--<v-btn v-if=false slot="activator" color="primary" dark class="mb-2"> Add Task</v-btn>-->
        <v-card>
          <v-card-title>
            <span class="headline">{{formTitle}}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="edited_task.Name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="edited_task.Cost" label="Cost"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-layout justify-center xs12>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="close()">Cancel</v-btn>
            <v-btn @click="saveTask(edited_task)">Save</v-btn>
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
      <v-text-field v-model="newTaskName" @keydown.enter="createTask" label="Add Task">
         <v-fade-transition slot="append">
          <v-icon
            v-if='newTaskName !=""'
            @click="createTask"
          >
            add_circle
          </v-icon>
        </v-fade-transition>
      </v-text-field>
      <v-spacer/>
      </v-toolbar>
    <v-layout justify-center>
   <!-- <v-card width="80%"> -->
    <v-data-table
      :headers="headers"
      :items="tasks"
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
          <v-icon @click="editTask(props.item)">edit</v-icon>
          <v-icon @click="deleteTask(props.item)">delete</v-icon>
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
const API ="http://localhost:3000/api/Items"
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
          width: "50%"
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
          width: "25%"
        },
      ],
      tasklist_id: -1,
      newTaskName: "",
      tasks: [],
      selected_task_id: -1,
      edited_task: {
        Name: "NA",
        Cost: 0.0,
        id:-1,
        listId:-1,
      },
      default_task:{
        Name: "NA",
        Cost: 0.0,
        id:-1,
        listId:-1
      }

    }
  },

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

  created (){
    this.getTasks();
  },

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
        fetch(API+"/"+task.id, {
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
      Object.assign(this.default_task, task);
      //this.default_task.Name = task.Name;
      //this.default_task.Cost = Number(task.Cost);
      console.log("Cost ", task.Cost, " Name ", task.Name, JSON.stringify(this.default_task));
      fetch(API+"/"+task.id, {
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
      this.default_task.listId = 2;

      this.TaskAPI('POST')
      this.newTaskName="";
      //console.log(this.edited_task)

      //confirm("Do you want to create?")
    },

    TaskAPI (method_x){
      let ff =Object.assign({}, this.default_task);
      delete ff.id
      fetch(API, {
        headers:{
          'Content-Type':'application/json'
        },
        method:method_x,
        body:JSON.stringify(ff)
      })
      .then(res=>res.json())
      .then(res=> {
        this.getTasks()
      })
    }
  }
}
</script>
