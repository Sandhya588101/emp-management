
import { useEffect, useState } from "react";
import {
  Users,
  CalendarDays,
  Plus,
  ChevronDown,
  MoreVertical,
  BriefcaseBusiness,
  UserRound,
} from "lucide-react";
import { getEmployees } from "../ds/Employee";

interface Employee {
  _id?: string;
  id?: string;
  employeeId?: string;
  name: string;
  email: string;
  department: string;
  status: "Active" | "Inactive" | "On Leave";
}

const chartBars = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 42 },
  { month: "Mar", value: 64 },
  { month: "Apr", value: 43 },
  { month: "May", value: 64 },
  { month: "Jun", value: 43 },
  { month: "Jul", value: 60 },
  { month: "Aug", value: 42 },
  { month: "Sep", value: 64 },
  { month: "Oct", value: 43 },
  { month: "Nov", value: 64 },
];

const stats = [
  {
    title: "Total Employees",
    value: "—",
    change: "Employee records",
    percentage: 75,
    color: "#087cff",
    icon: Users,
  },
  {
    title: "Active Employees",
    value: "—",
    change: "Currently active",
    percentage: 65,
    color: "#12a982",
    icon: UserRound,
  },
  {
    title: "On Leave",
    value: "—",
    change: "Currently on leave",
    percentage: 25,
    color: "#ff9b31",
    icon: CalendarDays,
  },
  {
    title: "Departments",
    value: "—",
    change: "Unique departments",
    percentage: 45,
    color: "#8047ff",
    icon: BriefcaseBusiness,
  },
];

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await getEmployees();
        const result = response.data;

        const list = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        setEmployees(list);
      } catch {
       
      } 
    }

    void loadEmployees();
  }, []);

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const leaveCount = employees.filter(
    (employee) => employee.status === "On Leave"
  ).length;

  const departmentCount = new Set(
    employees.map((employee) => employee.department)
  ).size;

  const statValues = [
    employees.length.toLocaleString(),
    activeCount.toLocaleString(),
    leaveCount.toLocaleString(),
    departmentCount.toLocaleString(),
  ];

  return (
    <div className="w-full text-slate-800 bg-[#f3f5fa]-500">
      <main className="min-w-0 flex-1 w-full">

        <div className="space-y-5">
          {/* Page heading */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Welcome back! Here is your employee overview.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/employees";
              }}
              className="flex items-center gap-2 rounded-md bg-[#087cff] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm shadow-slate-200/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        {stat.title}
                      </p>
                      <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-800">
                        {statValues[index]}
                      </p>
                    </div>

                    <div
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                      style={{
                        backgroundColor: `${stat.color}16`,
                        color: stat.color,
                      }}
                    >
                      <Icon size={19} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-2 text-[11px]">
                    <span style={{ color: stat.color }}>
                      {stat.change}
                    </span>
                    <span className="text-slate-400">Current total</span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.65fr_1fr]">
            <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/30">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Employee Overview
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Illustrative monthly trend
                  </p>
                </div>

                <button className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-[11px] text-slate-500">
                  This year <ChevronDown size={13} />
                </button>
              </div>

              <div className="flex h-[220px]">
                <div className="flex flex-col justify-between pb-7 pr-3 text-[10px] text-slate-400">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                <div className="relative flex min-w-0 flex-1 items-end justify-around border-b border-slate-100 pb-0">
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div
                        key={line}
                        className="border-t border-dashed border-slate-100"
                      />
                    ))}
                  </div>

                  {chartBars.map((bar) => (
                    <div
                      key={bar.month}
                      className="relative z-10 flex h-full flex-1 flex-col items-center justify-end gap-2 px-1"
                    >
                      <div
                        className="w-full max-w-[24px] rounded-t-full bg-[#82baff]"
                        style={{ height: `${bar.value}%` }}
                      />
                      <span className="absolute -bottom-5 text-[10px] text-slate-400">
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/30">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Employee Structure
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    By employment status
                  </p>
                </div>
                <button aria-label="More options" className="text-slate-400">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 py-3">
                <div
                  className="grid h-36 w-36 shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#087cff 0deg ${employees.length
                        ? (activeCount / employees.length) * 360
                        : 0
                      }deg, #13b8c6 ${employees.length
                        ? (activeCount / employees.length) * 360
                        : 0
                      }deg ${employees.length
                        ? ((activeCount + leaveCount) / employees.length) *
                        360
                        : 0
                      }deg, #e5edf7 0deg)`,
                  }}
                >
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-center">
                    <div>
                      <span className="block text-xl font-bold text-slate-700">
                        {employees.length}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Employees
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Active", color: "#087cff", value: activeCount },
                    { label: "On Leave", color: "#13b8c6", value: leaveCount },
                    {
                      label: "Other",
                      color: "#e5edf7",
                      value: employees.length - activeCount - leaveCount,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-slate-500">
                        {item.label}
                      </span>
                      <span className="ml-auto text-xs font-semibold text-slate-700">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-700">
                {departmentCount} departments represented in your employee
                records.
              </div>
            </div>
          </section>
        </div>
      </main>

    </div>
  );
}
