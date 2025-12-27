import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="pl-64">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}
