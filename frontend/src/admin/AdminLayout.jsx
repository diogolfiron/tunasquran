import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Users,
  GraduationCap,
  Briefcase, // ✅ TAMBAHKAN INI
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Hero & Profil", icon: Image, path: "/admin/hero" },
  { name: "Inspirasi", icon: BookOpen, path: "/admin/inspirasi" },
  { name: "PMB", icon: GraduationCap, path: "/admin/pmb" },
  { name: "Pengajar", icon: Users, path: "/admin/pengajar" },
  { name: "Gallery", icon: Image, path: "/admin/gallery" },
  { name: "Visi & Misi", icon: BookOpen, path: "/admin/visi-misi" },
  { name: "Kurikulum", icon: GraduationCap, path: "/admin/kurikulum" },
  { name: "Form Link", icon: Link, path: "/admin/form-link" },

  // ✅ TUNAS USAHA
  { name: "Tunas Usaha", icon: Briefcase, path: "/admin/usaha" },
  { name: "struktur", icon: Users, path: "/admin/struktur" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#80916f] text-white p-6 flex flex-col">
        {/* HEADER */}
        <h2 className="text-xl font-bold mb-6">Admin Tunas Qur’an</h2>

        {/* MENU */}
        <nav className="space-y-2 flex-1">
          {menu.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#6f7f60]"
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 font-semibold"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
