import api from "./api";

export const getTasks = async () => {
  return await api.get("/tasks");
};

export const getTaskById = async (id: string | number) => {
  return await api.get(`/tasks/${id}`);
};

export const createTask = async (task: any) => {
  return await api.post("/tasks", task);
};

export const updateTask = async (id: number, updatedTask: any) => {
  return await api.put(`/tasks/${id}`, updatedTask);
};

export const deleteTask = async (id: number) => {
  return await api.delete(`/tasks/${id}`);
};
