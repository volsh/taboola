import axios from "axios";

export const API_HOST = "https://jsonplaceholder.typicode.com";

export async function getTodos() {
  const { data: todos } = await axios(`${API_HOST}/todos`);

  return todos;
}

export async function updateTodo({ todoId, update }) {
  const { data: todo } = await axios.patch(
    `${API_HOST}/todos/${todoId}`,
    update
  );

  return todo;
}

export async function deleteTodo({ todoId }) {
  return axios.delete(`${API_HOST}/todos/${todoId}`);
}
