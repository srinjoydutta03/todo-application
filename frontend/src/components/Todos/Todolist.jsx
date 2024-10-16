import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/private/todos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(response.data);
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todo-list">
      <h2>Your Todos</h2>
      <TodoForm fetchTodos={fetchTodos} />
      <ul>
        {todos.map(todo => (
          <TodoItem key={todo._id} todo={todo} fetchTodos={fetchTodos} />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
