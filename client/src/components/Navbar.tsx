
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Building2,
    CalendarDays,
    Wallet,
    ChartNoAxesCombined,
    Settings,
    Search,
    Bell,
    MessageCircle,
    Clock,
    LogOut,
} from "lucide-react";
import type { ReactNode } from "react";
import { useUI } from "../context/UiContext";

interface NavbarProps {
    onLogout: () => void;
    children: ReactNode;
}


const navigation = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Employees", path: "/employees", icon: Users },
    { label: "Departments", path: "/departments", icon: Building2 },
    { label: "Attendance", path: "/attendance", icon: Clock },
    { label: "Leave Management", path: "/leave", icon: CalendarDays },
    { label: "Payroll", path: "/payroll", icon: Wallet },
    { label: "Performance", path: "/performance", icon: ChartNoAxesCombined },
    { label: "Settings", path: "/settings", icon: Settings },
];

export default function Navbar({ onLogout, children }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const activeItem = navigation.find(
        (item) =>
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)
    );


    const ui = useUI();

console.log("UI context value:", ui);

const { confirmAction } = ui;

    const handleLogout = async () => {
        const confirmed = await confirmAction({
            title: "Confirm Logout",
            message: "Are you sure you want to log out?",
            confirmText: "Yes, Logout",
            cancelText: "No",
        });
console.log("logout")
        if (confirmed) {
            onLogout();
            navigate("/", { replace: true });
        }
    };


    return (
        <div className="h-screen w-full overflow-hidden bg-[#f3f5fa] text-slate-800">
            {/* Fixed Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] flex-col border-r border-slate-100 bg-white px-3 py-6 md:flex">
                <div className="mb-10 flex items-center gap-2 px-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#087cff] text-lg font-bold text-white">
                        C
                    </span>
                    <span className="text-xl font-bold tracking-tight text-[#087cff]">
                        CLEARIO
                    </span>
                </div>

                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Menu
                </p>


                <nav className="flex flex-col gap-1.5">
                    {navigation.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-md px-3 py-3 text-left text-[13px] transition ${isActive
                                    ? "bg-[#087cff] font-medium text-white"
                                    : "text-slate-500 hover:bg-blue-50 hover:text-[#087cff]"
                                }`
                            }
                        >
                            <Icon size={17} />
                            {label}
                        </NavLink>
                    ))}
                </nav>


                <div className="mt-auto pt-10">
                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Account
                    </p>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-[13px] text-slate-500 hover:bg-blue-50 hover:text-red-600"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Right side */}
            <div className="h-screen min-w-0 md:ml-[240px]">
                {/* Fixed Header */}
                <header className="fixed left-0 right-0 top-0 z-20 flex h-[60px] items-center gap-4 border-b border-slate-100 bg-white px-4 sm:px-6 md:left-[240px]">
                    <div className="flex h-9 w-full max-w-[320px] items-center gap-2 rounded-md border border-slate-200 px-3">
                        <Search size={16} className="shrink-0 text-slate-400" />
                        <input
                            placeholder="Search employees..."
                            className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <button
                            aria-label="Messages"
                            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50"
                        >
                            <MessageCircle size={17} />
                        </button>

                        <button
                            aria-label="Notifications"
                            className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-100 text-slate-500 hover:bg-slate-50"
                        >
                            <Bell size={17} />
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border border-white bg-red-500" />
                        </button>

                        <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                            S
                        </div>
                    </div>
                </header>

                {/* Page title below header */}
                <div className="fixed left-0 right-0 top-[60px] z-10 border-b border-slate-100 bg-white px-6 py-3 md:left-[240px]">
                    <h2 className="text-sm font-semibold text-slate-700">
                        {activeItem?.label ?? "Employee Management"}
                    </h2>
                </div>

                {/* Scrollable page content */}
                <main className="mt-[108px] h-[calc(100vh-108px)] overflow-y-auto bg-[#f3f5fa] p-4 sm:p-6">
                    {children}
                </main>

                {/* Fixed Footer */}

            </div>
        </div>
    );

}
