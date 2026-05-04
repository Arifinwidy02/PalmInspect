import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-border">404</h1>
        <p className="text-muted-foreground mt-4">Page not found</p>
        <Link
          href="/"
          className="inline-block mt-6 text-sm text-emerald-400 hover:text-emerald-300"
        >
          Back to Workspace
        </Link>
      </div>
    </div>
  );
}
