const express = require('express')

let todos = require('../database/todos.js') 

const app = express()
app.use(express.json());

const PORT = 8080

app.listen(PORT, () => {
    console.log('Running')
})

// Hello World
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello World !'
    })
})

// Retorno todos os todos
app.get('/todos', (req, res) => {
    return res.status(200).json(todos)
})

// Retorno apenas o todo buscado
app.get('/todos/:id', (req, res) => {
    const { id } = req.params
    
    const todo = todos.find(todo => todo.id === Number(id))
    
    if(!todo){
        return res.status(401).json({
            message: `Todo ${id} não foi encontrado`
        })
    }
    
    return res.status(200).json(todo)
})

// Deleta o todo informado
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params
    
    const todo = todos.find(todo => todo.id === Number(id))
    
    if(!todo){
        return res.status(401).json({
            message: `Todo ${id} não foi encontrado`
        })
    }
    
    todos = todos.filter(todo => todo.id !== Number(id))
    
    return res.status(200).json(todo)
})

// Criar um todo
app.post('/todos', (req, res) => {

    const {title, description} = req.body

    if(!title || !description){
        return res.status(400).json({
            error: 'Seu body está incompleto',
            message: 'Deve conter title e description',
        })
    }

    const lastId = todos[todos.length -1].id

    const newTodo = {
        id: lastId + 1,
        title,
        description,
        status: 'pending'
    }

    todos.push(newTodo)
    
    return res.status(201).json(todos)
})

// Criar um todo
app.put('/todos/:id', (req, res) => {
    const { id } = req.params

    const body = req.body

    const {title, description, status } = body

    if(!title && !description && !status ){
        return res.status(400).json({
            error: 'Seu body está incompleto',
            message: 'Deve conter title ou description ou status',
        })
    }

    const todoToBeUpdated = todos.find(todo => todo.id === Number(id))

    const newTodo = {
        id: todoToBeUpdated.id,
        title: title || todoToBeUpdated.title,
        description: description || todoToBeUpdated.description,
        status: status || todoToBeUpdated.status
    }

    todos = todos.map(todo =>{
        if(todo.id === Number(id)){
            return newTodo
        }else{
            return todo
        }
    })
    
    return res.status(200).json(todos)
})