export default function App() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        Learn vocabulary, <span className="text-indigo-600">effortlessly.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-gray-600">
        Build your word bank with spaced repetition, quizzes, and games — all
        in your browser, no account needed.
      </p>
      <a
        href="/app"
        className="mt-10 inline-block rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors"
      >
        Start learning →
      </a>
    </section>
  );
}
