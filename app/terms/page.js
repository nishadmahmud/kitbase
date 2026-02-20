export const metadata = {
    title: "Terms of Service | Kitbase",
    description: "The rules and guidelines for using Kitbase tools and services.",
};

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Terms of Service</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        By accessing and using Kitbase, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. Use of Services</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Kitbase provides a collection of free online utilities. You may use these tools for personal or commercial purposes. However, you agree not to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 leading-relaxed mt-4 space-y-2">
                        <li>Use the tools for any illegal or unauthorized purpose.</li>
                        <li>Attempt to disrupt or interfere with the security or performance of the website.</li>
                        <li>Use automated systems (bots, scrapers) to access the tools without permission.</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">3. No Warranty</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Kitbase is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not guarantee that the tools will always be available, error-free, or meet your specific requirements.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. Limitation of Liability</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        In no event shall Kitbase or its creator be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the tools on Kitbase.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">5. Intellectual Property</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        The Kitbase name, logo, and custom designs are the property of their respective owners. Many aspects of the site are open-source and subject to their own respective licenses.
                    </p>
                </section>

                <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Last updated: February 20, 2026
                    </p>
                </section>
            </div>
        </div>
    );
}
