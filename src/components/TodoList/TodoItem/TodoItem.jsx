import styles from "./styles.module.scss";

const TodoItem = ({
  userId,
  id,
  index,
  title,
  completed,
  toggleComplete,
  deleteTodo,
}) => {
  return (
    <div
      className={`${styles.container} ${completed ? styles.completed : ""}`}
      onClick={(event) => {
        if (event.ctrlKey) {
          deleteTodo(index);
        } else {
          toggleComplete(index);
        }
      }}
      role="button"
      aria-checked={completed}
      aria-label={title}
    >
      {title}
    </div>
  );
};

export default TodoItem;
