import Link from 'next/link';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                        Upgrade Your Business with <span className="text-primary italic">Precision</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-foreground/60 max-w-2xl mx-auto">
                        Explore our curated selection of high-performance hardware, industry-leading software solutions, and world-class educational programs.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/category/hardware"
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200"
                        >
                            Shop Hardware
                        </Link>
                        <Link href="/category/software" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
                            Explore Software <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-1" />
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-1" />
        </div>
    );
}
