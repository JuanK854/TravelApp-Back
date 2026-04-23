const express= require('express');

//intanciar la aplicacion
const app = express();
//middelware para parsear el body de las peticiones
app.use(express.json());

//configurar el puerto (por conviccion es el 3000)
const PORT = 3014;

//definir las rutas
//req = request (lo que viene del cliente)
//res = response (lo que se envía al cliente)

app.get('/', (req,res)=> {
    res.send('Hola mundo desde back');
});

let users =[{id:1, nombre:'Cris'}]

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users',(req,res)=>{
    const {nombre} = req.body;

    if(!nombre || nombre.trim() === ''){
        return res.status(400).json({
            error:"El nombre es obligatorio"
        })
    } 

    const nuevo ={id:users.length+1, ... req.body};
    users.push(nuevo);
    res.status(201).json(nuevo)
})

app.delete('/users/:id',(req,res)=>{
    const idDelete = parseInt(req,params.id)
    const index = users.findIndex(u=>u.id==idDelete)

    if (index === -1){
        return res.status(404).json({
            error:"Usuario no encontrado",
            message:`No existe un usuario con el id ${idDelete}`
        })
    }

    const userEliminated = users.splice(index,1);

    res.json({
        message:"Usuario eliminado",
        user:userEliminated[0]
    })
})

app.put('/users/:id',(req,res)=>{

})

app.get('users/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const user = users.find(u=>u.id===id)
    
    if (!user){
        return res.status(404).json({
            error:"Usuario no encontrado",
        });
    }
    res.json(user)
})

app.put('/users/:id',(req,res)=>{
    const id = parseInt(req.params.id)
    const index = users.findIndex(u=>u.id===id)

    if (index === -1){
        return res.status(404).json({
            error:"Usuario no encontrado"
        })
    }
    users[index]={ ... users[index], ...req.body }
    res.json({
        message:"Usuario actualizado",
        user:users[index]
    })
})



app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})