import { useCallback, useEffect, useState } from "react";
import { getTodos, updateTodo, deleteTodo } from "./api";
import TodoList from "./components/TodoList/TodoList";
import Loader from "./components/Loader/Loader";
import styles from "./Home.module.scss";

export default function App() {
  const [todos, setTodos] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then((res) => {
        setTodos(res);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  }, []);
  const toggleComplete = useCallback(
    (index) => {
      const todo = todos[index];
      if (todo) {
        const { completed } = todo;
        setTodos((prev) => [
          ...prev.slice(0, index),
          { ...todo, completed: !completed },
          ...prev.slice(index + 1),
        ]);
        updateTodo({ todoId: todo.id, update: { completed: !completed } })
          .then((res) => {})
          .catch((err) => {
            setTodos([
              ...prev.slice(0, index),
              { ...todo, completed },
              ...prev.slice(index + 1),
            ]);
          });
      }
    },
    [todos]
  );

  const onDeleteTodo = useCallback(
    (index) => {
      const todo = todos[index];
      if (todo) {
        setTodos((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
        deleteTodo({ todoId: todo.id })
          .then((res) => {})
          .catch((err) => {
            setTodos((prev) => [
              ...prev.slice(0, index),
              todo,
              ...prev.slice(index + 1),
            ]);
          });
      }
    },
    [todos]
  );

  return (
    <div className={styles.container} role="main">
      <h1 aria-aria-label="my list">My List</h1>
      {loading && <Loader />}
      {todos && (
        <TodoList
          todos={todos}
          toggleComplete={toggleComplete}
          deleteTodo={onDeleteTodo}
        />
      )}
    </div>
  );
}
