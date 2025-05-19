import RecommendationsForm from '@/components/RecommendationsForm';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Personalized Recommendations - FlickPick',
  description: 'Get AI-powered movie and TV show recommendations based on your taste.',
};

export default function RecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <Sparkles className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Personalized Recommendations</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Tell us about your viewing habits, and our AI will suggest movies and TV shows you'll love!
        </p>
      </div>
      <RecommendationsForm />
    </div>
  );
}
