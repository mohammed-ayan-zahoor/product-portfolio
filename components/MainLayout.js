import Navbar from './Navbar';
import Footer from './Footer';
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export default async function MainLayout({ children }) {
    await dbConnect();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar categories={JSON.parse(JSON.stringify(categories))} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
