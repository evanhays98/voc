import { useNavigate } from "react-router-dom";
import { ALL_LESSONS } from "../lessons";
import { useProgress } from "../store/progressStoreInstance";
import { LessonCard } from "../components/LessonCard";

export function LessonsPage() {
  const navigate = useNavigate();
  const progress = useProgress();

  const handleSelect = (slug: string) => navigate(`/study/${slug}`);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <header className="mb-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Mes leçons</h1>
        <p className="mt-2 text-gray-500">Sélectionne une leçon pour commencer à apprendre.</p>
      </header>

      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {ALL_LESSONS.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progressByCard={progress.progressByCard}
            onSelect={() => handleSelect(lesson.slug)}
          />
        ))}
      </div>
    </div>
  );
}
