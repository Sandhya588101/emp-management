
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "../ds/Auth";

interface SignInProps {
  login: () => void;
}

interface SignInForm {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function SignIn({ login }: SignInProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const successMessage = (
    location.state as { message?: string } | null
  )?.message;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await signIn(form);
      const result = response.data as SignInResponse;

      if (!result.token) {
        throw new Error("The server did not return an authentication token.");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("isLoggedIn", "true");

      login();

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const apiError = err as ApiError & { message?: string };

      setError(
        apiError.response?.data?.message ||
        apiError.message ||
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">
        <section className="hidden flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-800 p-12 text-center text-white md:flex">
          <Users size={56} />
          <h1 className="mt-5 text-3xl font-bold">Employee Hub</h1>
          <p className="mt-3 max-w-xs leading-7 text-blue-100">
            Manage your workforce, departments, and leave requests in one place.
          </p>
          <div className="mt-10 rounded-xl border border-white/20 bg-white/10 p-5 text-sm text-blue-50">
            A smarter way to organize your team.
          </div>
        </section>

        <section className="p-7 sm:p-12">
          <div className="mb-8 md:hidden">
            <Users className="text-blue-600" size={36} />
            <h1 className="mt-2 text-xl font-bold">Employee Hub</h1>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to your account to continue.
          </p>

          {successMessage && (
            <p className="mt-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputClass} pl-10 pr-12`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-3 text-slate-500"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
