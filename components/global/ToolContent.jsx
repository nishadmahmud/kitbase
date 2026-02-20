export default function ToolContent({ title, steps, features, faq }) {
    return (
        <section className="py-16 sm:py-24 border-t border-gray-100 dark:border-gray-800/60">
            <div className="max-w-4xl mx-auto px-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">

                    {/* How to use */}
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                        How to use {title}
                    </h2>
                    <div className="grid gap-6 mb-16">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">{step}</p>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {faq.map((item, index) => (
                            <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    {item.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                        Why use Kitbase {title}?
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-8 mb-16">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
