import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-2xl font-bold tracking-tight text-primary">TechFlow</Link>
                        <p className="mt-4 max-w-xs text-sm text-foreground/60 leading-relaxed">
                            Premium digital solutions for the modern enterprise. Hardware, software, and education tailored to your needs.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Offerings</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/category/hardware" className="text-sm text-foreground/60 hover:text-primary">Hardware</Link></li>
                            <li><Link href="/category/software" className="text-sm text-foreground/60 hover:text-primary">Software</Link></li>
                            <li><Link href="/category/education" className="text-sm text-foreground/60 hover:text-primary">Education</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link href="/about" className="text-sm text-foreground/60 hover:text-primary">About Us</Link></li>
                            <li><Link href="/contact" className="text-sm text-foreground/60 hover:text-primary">Contact</Link></li>
                            <li><Link href="/terms" className="text-sm text-foreground/60 hover:text-primary">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border pt-8 text-center">
                    <p className="text-xs text-foreground/40">
                        &copy; {new Date().getFullYear()} TechFlow Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
