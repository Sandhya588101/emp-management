
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

import {
  listEmployees,
  getEmployee,
  createEmployee as createEmployeeService,
  updateEmployee as updateEmployeeService,
  removeEmployee,
} from "./service.js";

const employeeSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  department: z.string().trim().min(2).max(100),
  status: z.enum(["Active", "Inactive", "On Leave"]).optional(),
});

const updateEmployeeSchema = employeeSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "Provide at least one field to update.",
    }
  );

export async function getAll(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const employees = await listEmployees();

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const employee = await getEmployee(id);

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = employeeSchema.parse(req.body);
    const employee = await createEmployeeService(input);

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const input = updateEmployeeSchema.parse(req.body);

    const employee = await updateEmployeeService(id, input);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    await removeEmployee(id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
