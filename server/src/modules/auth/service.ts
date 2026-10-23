
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUsersCollection } from "../../config/db.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }

  return secret;
}

export async function registerUser(input: RegisterInput) {
  const users = getUsersCollection();
  const email = input.email.trim().toLowerCase();

  const existingUser = await users.findOne({ email });

  if (existingUser) {
    throw Object.assign(new Error("Email is already registered."), {
      statusCode: 409,
    });
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = {
    name: input.name.trim(),
    email,
    password: hashedPassword,
    role: "employee" as const,
    createdAt: new Date(),
  };

  try {
    const result = await users.insertOne(user);

    return {
      id: result.insertedId.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw Object.assign(new Error("Email is already registered."), {
        statusCode: 409,
      });
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const users = getUsersCollection();
  const email = input.email.trim().toLowerCase();

  const user = await users.findOne({ email });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw Object.assign(new Error("Invalid email or password."), {
      statusCode: 401,
    });
  }

  const token = jwt.sign(
    {
      role: user.role,
    },
    getJwtSecret(),
    {
      subject: user._id!.toString(),
      expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"],
    }
  );

  return {
    token,
    user: {
      id: user._id!.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getUserById(id: string) {
  const { ObjectId } = await import("mongodb");
  const users = getUsersCollection();

  if (!ObjectId.isValid(id)) {
    throw Object.assign(new Error("Invalid user ID."), {
      statusCode: 400,
    });
  }

  const user = await users.findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );

  if (!user) {
    throw Object.assign(new Error("User not found."), {
      statusCode: 404,
    });
  }

  return {
    id: user._id!.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
