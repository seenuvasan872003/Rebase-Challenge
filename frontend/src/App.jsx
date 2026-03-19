import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

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
          <li key={todo._id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
