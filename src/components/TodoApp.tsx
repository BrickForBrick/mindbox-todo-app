import React, { useState, useCallback, useMemo } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = useCallback(() => {
    const trimmedText = newTodo.trim();
    if (trimmedText) {
      const newTodoItem: Todo = {
        id: Date.now(),
        text: trimmedText,
        completed: false
      };
      setTodos(prev => [...prev, newTodoItem]);
      setNewTodo('');
    }
  }, [newTodo]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(() => 
    todos.filter(todo => !todo.completed).length, 
    [todos]
  );

  const completedCount = useMemo(() => 
    todos.filter(todo => todo.completed).length, 
    [todos]
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.target as HTMLButtonElement).style.textDecoration = 'underline';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.target as HTMLButtonElement).style.textDecoration = 'none';
  };

  return (
    <div style={{
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: '14px',
      lineHeight: '1.4em',
      background: '#f5f5f5',
      color: '#111',
      minWidth: '230px',
      maxWidth: '550px',
      margin: '0 auto',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#fff',
        margin: '130px 0 40px 0',
        position: 'relative',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          position: 'absolute',
          top: '-155px',
          width: '100%',
          fontSize: '100px',
          fontWeight: 100,
          textAlign: 'center',
          color: 'rgba(175, 47, 47, 0.15)',
          margin: 0,
          fontFamily: 'inherit'
        }}>
          todos
        </h1>
        
        <div>
          <input
            type="text"
            style={{
              position: 'relative',
              margin: 0,
              width: '100%',
              fontSize: '24px',
              fontFamily: 'inherit',
              fontWeight: 'inherit',
              lineHeight: '1.4em',
              border: 0,
              color: 'inherit',
              padding: '16px 16px 16px 60px',
              background: 'rgba(0, 0, 0, 0.003)',
              boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="new-todo-input"
          />
        </div>

        {todos.length > 0 && (
          <>
            <div style={{
              position: 'relative',
              zIndex: 2,
              borderTop: '1px solid #e6e6e6'
            }}>
              <ul style={{
                margin: 0,
                padding: 0,
                listStyle: 'none'
              }} data-testid="todo-list">
                {filteredTodos.map(todo => (
                  <li 
                    key={todo.id} 
                    style={{
                      position: 'relative',
                      fontSize: '24px',
                      borderBottom: '1px solid #ededed'
                    }}
                    data-testid="todo-item"
                    className={todo.completed ? 'completed' : ''}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px 15px 15px 60px',
                      wordBreak: 'break-all'
                    }}>
                      <input
                        type="checkbox"
                        style={{
                          textAlign: 'center',
                          width: '40px',
                          height: 'auto',
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          margin: 'auto 0',
                          left: '8px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        data-testid={`todo-toggle-${todo.id}`}
                      />
                      <label style={{
                        wordBreak: 'break-all',
                        padding: '15px 15px 15px 0',
                        marginLeft: '10px',
                        display: 'block',
                        lineHeight: '1.2',
                        transition: 'color 0.4s',
                        cursor: 'pointer',
                        color: todo.completed ? '#d9d9d9' : 'inherit',
                        textDecoration: todo.completed ? 'line-through' : 'none'
                      }}>
                        {todo.text}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer style={{
              color: '#777',
              padding: '10px 15px',
              height: '20px',
              textAlign: 'center',
              borderTop: '1px solid #e6e6e6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                textAlign: 'left'
              }} data-testid="todo-count">
                {activeCount} {activeCount === 1 ? 'item' : 'items'} left
              </span>
              
              <div style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                position: 'absolute',
                right: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <button
                  style={{
                    color: 'inherit',
                    margin: '3px',
                    padding: '3px 7px',
                    textDecoration: 'none',
                    border: filter === 'all' ? '1px solid rgba(175, 47, 47, 0.2)' : '1px solid transparent',
                    borderRadius: '3px',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setFilter('all')}
                  data-testid="filter-all"
                  className={filter === 'all' ? 'selected' : ''}
                >
                  All
                </button>
                <button
                  style={{
                    color: 'inherit',
                    margin: '3px',
                    padding: '3px 7px',
                    textDecoration: 'none',
                    border: filter === 'active' ? '1px solid rgba(175, 47, 47, 0.2)' : '1px solid transparent',
                    borderRadius: '3px',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setFilter('active')}
                  data-testid="filter-active"
                  className={filter === 'active' ? 'selected' : ''}
                >
                  Active
                </button>
                <button
                  style={{
                    color: 'inherit',
                    margin: '3px',
                    padding: '3px 7px',
                    textDecoration: 'none',
                    border: filter === 'completed' ? '1px solid rgba(175, 47, 47, 0.2)' : '1px solid transparent',
                    borderRadius: '3px',
                    background: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setFilter('completed')}
                  data-testid="filter-completed"
                  className={filter === 'completed' ? 'selected' : ''}
                >
                  Completed
                </button>
              </div>
              
              {completedCount > 0 && (
                <button
                  style={{
                    position: 'relative',
                    lineHeight: '20px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    color: 'inherit'
                  }}
                  onClick={clearCompleted}
                  data-testid="clear-completed"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoApp;