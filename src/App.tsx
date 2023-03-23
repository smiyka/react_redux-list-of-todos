/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { getTodos } from './api';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Todo } from './types/Todo';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Status>('all');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setLoader(true);

    getTodos()
      .then((loadedTodos) => {
        setTodos(loadedTodos);
        setLoader(false);
      })
      .catch(() => {
        setErrorMessage('Can\'t load todos');
        setLoader(false);
      });
  }, []);

  let visibleTodos = [...todos];

  if (query) {
    visibleTodos = todos.filter(todo => {
      const todoTitle = todo.title.toLowerCase();
      const queried = query.toLowerCase().trim();

      return todoTitle.includes(queried);
    });
  }

  visibleTodos = useMemo(() => visibleTodos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  }), [filter, visibleTodos, query]);

  const condition: boolean = !loader && (errorMessage.length === 0);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            {condition && (
              <h1 className="title">
                Todos:
              </h1>
            )}

            <div className="block">
              {condition
                && (
                  <TodoFilter
                    query={query}
                    setQuery={setQuery}
                    filter={filter}
                    setFilter={setFilter}
                  />
                )}
            </div>

            <div className="block">
              {loader && <Loader />}
              {!loader && !condition && (
                <h1 className="title">
                  {errorMessage}
                </h1>
              )}
              {condition && (
                <TodoList
                  todos={visibleTodos}
                  selectedTodo={selectedTodo}
                  setSelectedTodo={setSelectedTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {!loader && selectedTodo && (
        <TodoModal
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
        />
      )}
    </>
  );
};
