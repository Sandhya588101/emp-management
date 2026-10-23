
import api from "../api/api";

export const getEmployees = () =>
  api.get("/employees");

export const getEmployeeById = (id: string) =>
  api.get(`/employees/${id}`);

export const createEmployee = (data: any) =>
  api.post("/employees", data);

export const updateEmployee = (id: string, data: any) =>
  api.put(`/employees/${id}`, data);

export const deleteEmployee = (id: string) =>
  api.delete(`/employees/${id}`);
