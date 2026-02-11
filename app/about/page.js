import { Shield, Zap, Lock, Code2 } from "lucide-react";

export default function AboutPage() {
    const principles = [
        { icon: Shield, title: "Privacy First", description: "All processing happens in your browser. Your files never leave your device — zero server uploads, zero tracking." },
        { icon: Zap, title: "Blazing Fast", description: "No waiting for server responses. Everything runs client-side with near-instant results." },
        { icon: Lock, title: "No Accounts Needed", description: "Jump right in. No sign-up, no login, no paywalls — just tools that work." },
        { icon: Code2, title: "Open Source", description: "Kitbase is built in the open. Inspect the code, contribute features, or fork it for your own use." },
    ];

    const techs = ["Next.js 16", "React 19", "Tailwind CSS v4", "pdf-lib", "Markdown-it", "Canvas API", "Lucide Icons"];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-100 m-0">
                    About <span className="text-gray-400">Kitbase</span>
                </h1>
                <p className="mt-4 mb-0 text-lg text-gray-400 leading-relaxed">
                    A free, privacy-first toolkit that runs entirely in your browser. No uploads, no servers, no BS.
                </p>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 mb-16">
                {principles.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <div
                            key={i}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-5">
                                <Icon className="w-6 h-6 text-gray-200" />
                            </div>
                            <h3 className="font-semibold text-gray-200 m-0 mb-2 text-base">{p.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed m-0">{p.description}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-9 text-center">
                <h2 className="text-xl font-bold text-gray-100 m-0 mb-6">Built With</h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {techs.map((tech) => (
                        <span
                            key={tech}
                            className="px-4 py-2 text-[13px] font-medium bg-gray-800 border border-gray-800 rounded-xl text-gray-400"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
