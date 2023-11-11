const express=require("express")
const app=express()
const cors=require('cors')
const pool=require("./db")


// middleware
app.use(cors());
app.use(express.json()) //allow us to access the req body


// create route

// getall item
 app.get("/todos",async(req,res)=>{
    try{
     const allTodos=await pool.query("SELECT * FROM todo");
     res.status(200).json(allTodos.rows)      
    }catch(error){
        console.log(error.message)
    }
 }) 

//  get single data
app.get("/todos/:id",async(req,res)=>{
   try{
     const {id}=req.params;
     const todo=await pool.query("select * from todo where todo_id=$1",[id])
     res.status(201).json(todo.rows[0])
   }catch(error){
    console.log(error.message)
   }
})


// create a todo
app.post("/todos",async(req,res)=>{
    try{
        const {description} =req.body
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
          );

     res.status(201).json(newTodo.rows[0])
    }catch(error){
          console.log(error.message)
    }
})

// update todo
app.put("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { description } = req.body;
      const updateTodo = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
      );
  
      res.json("Todo was updated!");
    } catch (err) {
      console.error(err.message);
    }
  });
 

// delete todo
app.delete("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
        id
      ]);
      res.json("Todo was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  });

app.listen(5000,()=>{
    console.log("server is start on port 5000..")
})