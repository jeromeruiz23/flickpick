
'use client';

import type { HTMLAttributes } from 'react';
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  text: string;
  timestamp: Date;
}

interface CommentSectionProps extends HTMLAttributes<HTMLDivElement> {
  // itemId: string; // For future persistence
  // itemType: 'movie' | 'tv'; // For future persistence
}

export default function CommentSection({ className, ...props }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For potential future API calls

  // To avoid hydration mismatch for initial timestamp rendering in comments
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() === '') return;

    // Simulate loading for a better UX, even if client-side
    setIsLoading(true);

    const newComment: Comment = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 15), // More unique client-side ID
      text: newCommentText.trim(),
      timestamp: new Date(),
    };

    // Simulate a short delay for submitting
    setTimeout(() => {
      setComments((prevComments) => [newComment, ...prevComments]); // Add new comments to the top
      setNewCommentText('');
      setIsLoading(false);
    }, 300);
  };

  return (
    <Card className={cn("mt-12 shadow-lg", className)} {...props}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Comments</CardTitle>
        </div>
        <CardDescription>Share your thoughts. Comments are anonymous and for this session only (not saved permanently).</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8">
          <div>
            <Textarea
              placeholder="Write your comment here..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              rows={4}
              className="bg-input border-border focus:ring-primary text-base"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || newCommentText.trim() === ''} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Comment'
            )}
          </Button>
        </form>

        <div className="space-y-6">
          {comments.length === 0 && isClient && (
            <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to share your thoughts!</p>
          )}
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 p-4 bg-card border border-border/50 rounded-lg shadow-sm">
              <Avatar className="mt-1">
                <AvatarFallback className="bg-muted">
                  <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Anonymous User</p>
                  {isClient && (
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(comment.timestamp)}
                    </p>
                  )}
                </div>
                <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
