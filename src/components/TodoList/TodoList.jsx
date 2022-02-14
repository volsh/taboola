import styles from "./styles.module.scss";
import TodoItem from "./TodoItem/TodoItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";

const CHUNK_SIZE = 50;

const TodoList = ({ todos, toggleComplete, deleteTodo }) => {
  const [currentLength, setCurrentLength] = useState(CHUNK_SIZE);
  const fetchMoreTodos = () => {
    setCurrentLength(
      (prev) =>
        prev +
        (todos.length - prev >= CHUNK_SIZE ? CHUNK_SIZE : todos.length - prev)
    );
  };
  return (
    <div className={styles.container} role="list">
      <InfiniteScroll
        dataLength={currentLength}
        next={fetchMoreTodos}
        hasMore={currentLength < todos.length}
        loader={<h4>Loading...</h4>}
      >
        {todos.slice(0, currentLength).map((todo, index) => (
          <TodoItem
            key={todo.id}
            index={index}
            {...todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default TodoList;
