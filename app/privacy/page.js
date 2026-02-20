export const metadata = {
    title: "Privacy Policy | Kitbase",
    description: "Learn how Kitbase protects your privacy and handles your data. Spoiler: we don't collect anything.",
};

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 transition-colors duration-300">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Privacy Policy</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">1. The Core Principle</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        At Kitbase, we believe that your data belongs to you. Our tools are designed to work entirely within your web browser. This means that when you use our PDF tools, image editors, or developer utilities, your files and data are processed locally on your device and are never uploaded to our servers.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">2. Data Collection</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                        We do not collect any personal information, files, or data that you process through our tools.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                        We may use basic analytics (like Vercel Analytics) to understand general traffic patterns, such as which tools are most popular, but this data is anonymous and does not include any of your processed content.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">3. Cookies</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Kitbase uses local storage only to remember your preferences (like your theme choice: light or dark). No tracking cookies are used for advertising or profiling.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">4. Third-Party Services</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Our website is hosted on Vercel. Vercel may collect standard web logs required for the operation and security of the hosting environment. We may also use Google Fonts or Lucide Icons, which are served from their respective content delivery networks.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">5. Changes to This Policy</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
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
