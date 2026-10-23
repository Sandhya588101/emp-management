
import { MongoClient, Db, Collection, ObjectId } from "mongodb";

let db: Db;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri || !dbName) {
    throw new Error("MongoDB environment variables are missing.");
  }

  const client = new MongoClient(uri);

  await client.connect();
  db = client.db(dbName);

  await db.collection("users").createIndex(
    { email: 1 },
    { unique: true }
  );

  await db.collection("employees").createIndex(
    { email: 1 },
    { unique: true }
  );

  console.log(`Connected to MongoDB database: ${dbName}`);
}

export function getDB(): Db {
  if (!db) {
    throw new Error("Database is not connected.");
  }

  return db;
}

export function getUsersCollection() {
  return getDB().collection<UserDocument>("users");
}

export function getEmployeesCollection() {
  return getDB().collection<EmployeeDocument>("employees");
}

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "employee";
  createdAt: Date;
}

export interface EmployeeDocument {
  _id?: ObjectId;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  status: "Active" | "Inactive" | "On Leave";
  createdAt: Date;
  updatedAt: Date;
}
