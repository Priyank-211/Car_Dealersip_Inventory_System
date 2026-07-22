export default function Placeholder({ title }) {
    return (
        <section className="px-6 pt-32 pb-20 md:px-12 lg:px-20">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                {title}
            </h1>
            <p className="mt-3 text-muted-foreground">Coming soon.</p>
        </section>
    );
}
