
import type { Metadata } from 'next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShieldQuestion } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - FlickPick',
  description: 'Find answers to common questions about FlickPick.',
};

const faqs = [
  {
    question: 'What is FlickPick?',
    answer: 'FlickPick is your ultimate guide to discovering movies and TV shows. You can browse popular content, search for specific titles, get personalized recommendations, and even watch trailers or find streaming sources.',
  },
  {
    question: 'How does the recommendation feature work?',
    answer: 'Our recommendation feature uses AI to analyze your viewing history and preferences. The more details you provide, the better our AI can suggest movies and TV shows tailored to your taste.',
  },
  {
    question: 'Is FlickPick free to use?',
    answer: 'Yes, FlickPick is completely free to use for browsing, searching, and getting recommendations. For watching content, we link to third-party services which may have their own subscription models.',
  },
  {
    question: 'Where does FlickPick get its data?',
    answer: 'Movie and TV show information, including posters, ratings, and overviews, is provided by The Movie Database (TMDB).',
  },
  {
    question: 'How do I watch movies or TV shows?',
    answer: 'On each movie or TV show detail page, you will find "Watch" buttons that link to third-party streaming services. FlickPick does not host any content directly.',
  },
  {
    question: 'Are the comments I make saved?',
    answer: 'Currently, comments are anonymous and stored only for your current browser session. They are not saved permanently and will be lost if you refresh the page or close your browser.',
  },
];

export default function FaqsPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-center mb-10">
        <ShieldQuestion className="h-12 w-12 text-primary mr-3" />
        <h1 className="text-4xl font-bold text-foreground">Frequently Asked Questions</h1>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg hover:text-primary text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Still have questions? While we don't offer direct support currently, we hope these FAQs help!
        </p>
      </div>
    </div>
  );
}
