
import { ObjectId } from "mongodb";
import { getEmployeesCollection } from "../../config/db.js";

interface EmployeeInput {
  name: string;
  email: string;
  department: string;
  status?: "Active" | "Inactive" | "On Leave";
}

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function listEmployees() {
  const employees = await getEmployeesCollection()
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return employees.map((employee) => ({
    ...employee,
    _id: employee._id!.toString(),
  }));
}

export async function getEmployee(id: string) {
  if (!ObjectId.isValid(id)) {
    throw httpError("Invalid employee ID.", 400);
  }

  const employee = await getEmployeesCollection().findOne({
    _id: new ObjectId(id),
  });

  if (!employee) {
    throw httpError("Employee not found.", 404);
  }

  return { ...employee, _id: employee._id!.toString() };
}

export async function createEmployee(input: EmployeeInput) {
  const employees = getEmployeesCollection();
  const email = normalizeEmail(input.email);

  const existing = await employees.findOne({ email });

  if (existing) {
    throw httpError("An employee with this email already exists.", 409);
  }

  const employee = {
    employeeId: `EMP-${new ObjectId().toHexString().slice(-6).toUpperCase()}`,
    name: input.name.trim(),
    email,
    department: input.department.trim(),
    status: input.status ?? "Active" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await employees.insertOne(employee);

    return {
      ...employee,
      _id: result.insertedId.toString(),
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw httpError("An employee with this email already exists.", 409);
    }

    throw error;
  }
}

export async function updateEmployee(
  id: string,
  input: Partial<EmployeeInput>
) {
  if (!ObjectId.isValid(id)) {
    throw httpError("Invalid employee ID.", 400);
  }

  const employees = getEmployeesCollection();
  const existing = await employees.findOne({ _id: new ObjectId(id) });

  if (!existing) {
    throw httpError("Employee not found.", 404);
  }

  const update: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) update.name = input.name.trim();
  if (input.email !== undefined) update.email = normalizeEmail(input.email);
  if (input.department !== undefined) update.department = input.department.trim();
  if (input.status !== undefined) update.status = input.status;

  try {
    await employees.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw httpError("An employee with this email already exists.", 409);
    }

    throw error;
  }

  return getEmployee(id);
}

export async function removeEmployee(id: string) {
  if (!ObjectId.isValid(id)) {
    throw httpError("Invalid employee ID.", 400);
  }

  const result = await getEmployeesCollection().deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    throw httpError("Employee not found.", 404);
  }
}
