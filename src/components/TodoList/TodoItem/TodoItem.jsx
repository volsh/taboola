import styles from "./styles.module.scss";

const TodoItem = ({
  userId,
  id,
  index, // I used the array position and not id for performance (o(1) instead of searching the todo by id when updating/deleting)
  title,
  completed,
  toggleComplete,
  deleteTodo,
}) => {
  const handleClick = (event) => {
    if (event.ctrlKey || event.metaKey) {
      deleteTodo(index);
    } else {
      toggleComplete(index);
    }
  };
  return (
    <div
      className={`${styles.container} ${completed ? styles.completed : ""}`}
      onClick={handleClick}
      role="button"
      aria-checked={completed}
      aria-label={title}
    >
      {title}
    </div>
  );
};

export default TodoItem;
