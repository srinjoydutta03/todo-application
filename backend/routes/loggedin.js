const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middleware/login');
const { User, Todo } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.use(loginMiddleware);

router.get('/todos', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username}).populate('todo_list');
        res.json(user.todo_list);
    }
    catch(error){
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

router.post('/todos', async (req, res) => {
    try{
        const {title, description} = req.body;
        const user = await User.findOne({username: req.user.username});
        const todo = await Todo.create({
            title,
            description,
            user: user._id
        });

        user.todo_list.push(todo._id);

        await user.save();
        res.status(201).json(todo);
    }
    catch(error){
        res.status(500).json({
            message: "Internal Error: Could not create todo"
        })
    }
});

router.patch('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.completed = true;
        await todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
});

router.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (title) todo.title = title;
        if (description) todo.description = description;

        await todo.save();

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error editing todo' });
    }
});

router.delete('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found or unauthorized' });
        }

        await todo.deleteOne();

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Token missing from Authorization header' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if(!decoded || !decoded.username) {
            return res.status(403).json({ message: 'Invalid username' });
        }

        const user = await User.findOne({ username: decoded.username });
        user.todo_list = user.todo_list.filter(todoId => todoId.toString() !== req.params.id);
        await user.save();

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' , error_msg: error.message});
    }
});

module.exports = router;
