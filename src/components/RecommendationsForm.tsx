'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { personalizedRecommendations, type PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2 } from 'lucide-react';

const formSchema = z.object({
  viewingHistory: z.string().min(10, 'Please describe your viewing history in a bit more detail.'),
  preferences: z.string().min(10, 'Please describe your preferences in a bit more detail.'),
});

type FormData = z.infer<typeof formSchema>;

export default function RecommendationsForm() {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const result = await personalizedRecommendations(data);
      setRecommendations(result);
    } catch (e) {
      console.error(e);
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Tell Us Your Taste</CardTitle>
        <CardDescription>The more details you provide, the better the recommendations!</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="viewingHistory" className="text-lg font-medium">Viewing History</Label>
            <Textarea
              id="viewingHistory"
              {...register('viewingHistory')}
              placeholder="e.g., Loved Interstellar, The Office, Breaking Bad. Watched a lot of sci-fi and dark comedies..."
              className="mt-2 min-h-[100px] bg-input"
              rows={4}
            />
            {errors.viewingHistory && <p className="text-sm text-destructive mt-1">{errors.viewingHistory.message}</p>}
          </div>

          <div>
            <Label htmlFor="preferences" className="text-lg font-medium">Preferences</Label>
            <Textarea
              id="preferences"
              {...register('preferences')}
              placeholder="e.g., Looking for thought-provoking sci-fi movies, light-hearted comedies, or critically acclaimed dramas. Not a fan of horror."
              className="mt-2 min-h-[100px] bg-input"
              rows={4}
            />
            {errors.preferences && <p className="text-sm text-destructive mt-1">{errors.preferences.message}</p>}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            Get Recommendations
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recommendations && (
          <div className="mt-8 pt-6 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Here are your personalized recommendations:</h2>
            <div className="prose prose-invert max-w-none bg-muted/50 p-4 rounded-md shadow">
              {/* Assuming recommendations.recommendations is a string that might contain markdown-like list */}
              {recommendations.recommendations.split('\n').map((line, index) => {
                line = line.trim();
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return <p key={index} className="ml-4 my-1">{line.substring(2)}</p>;
                }
                if (line.length > 0 && /^\d+\.\s/.test(line)) { // Matches "1. Item"
                   return <p key={index} className="ml-4 my-1">{line.substring(line.indexOf(' ') + 1)}</p>;
                }
                return <p key={index} className="my-1">{line}</p>;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
