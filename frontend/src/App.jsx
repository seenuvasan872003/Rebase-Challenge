import { useState, useEffect } from 'react';

const API_URL = 'https://rebase-todo.onrender.com/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async () => {
    // FIXED: Ensure we send title matching backend
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo })
    });

    // FIXED: Properly handle the response and update the state
    const data = await response.json();
    setTodos(prevTodos => [...prevTodos, data]);
    setNewTodo('');
  };

  const toggleTodo = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(prevTodos => prevTodos.map(todo => (todo._id === id ? updatedTodo : todo)));
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  return (
    <div style={{ padding: '40px', background: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
      <h1>Rebase Todo Challenge</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New Task"
          style={{ padding: '10px', background: '#1a1a1a', border: '1px solid #333', color: 'white' }}
        />
        <button onClick={addTodo} style={{ padding: '10px 20px', background: '#ec4899', color: 'white', border: 'none', marginLeft: '10px', cursor: 'pointer' }}>
          Add Task
        </button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px', background: '#1a1a1a', borderRadius: '5px' }}>
            <input 
              type="checkbox" 
              checked={todo.completed || false} 
              onChange={() => toggleTodo(todo._id, todo.completed)}
              style={{ marginRight: '15px', width: '20px', height: '20px', cursor: 'pointer', accentColor: '#ec4899' }}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : 'white', fontSize: '1.2rem' }}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
