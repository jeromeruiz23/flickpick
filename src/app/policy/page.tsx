
import type { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - FlickPick',
  description: 'Learn about how FlickPick handles your data and privacy.',
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 prose prose-invert">
      <div className="flex items-center justify-center mb-10">
        <FileText className="h-12 w-12 text-primary mr-3" />
        <h1 className="text-4xl font-bold text-foreground !mb-0">Privacy Policy</h1>
      </div>

      <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>
        Welcome to FlickPick! This Privacy Policy explains how we collect, use, and disclose
        information about you when you use our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We may collect information you provide directly to us. For example, if you use our
        AI-powered recommendation feature, you might provide information about your viewing
        history and preferences. This information is used solely to generate recommendations
        for you during your current session and is not stored permanently.
      </p>
      <p>
        Comments made on movie or TV show pages are anonymous and stored only in your browser's
        local session. They are not transmitted to our servers or stored permanently.
      </p>

      <h2>2. How We Use Information</h2>
      <p>
        The information you provide for recommendations is processed by our AI model (via Genkit)
        to generate personalized suggestions. This data is not used for any other purpose.
      </p>

      <h2>3. Information Sharing</h2>
      <p>
        We do not share your personal information with third parties, except as necessary to
        provide our services (e.g., with the AI model provider for generating recommendations,
        but this data is not tied to your identity beyond the current request).
      </p>
      <p>
        FlickPick uses The Movie Database (TMDB) API to display movie and TV show information.
        Your interactions with TMDB data are subject to TMDB's own privacy policy.
      </p>
      <p>
        When you click "Watch" buttons, you are redirected to third-party streaming services.
        These services have their own privacy policies, and we are not responsible for their
        practices.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        As mentioned, information provided for recommendations and comments are not stored
        permanently by FlickPick. They are session-based.
      </p>

      <h2>5. Your Choices</h2>
      <p>
        You can choose not to use features that require data input, such as the personalized
        recommendations or commenting system.
      </p>

      <h2>6. Cookies and Tracking Technologies</h2>
      <p>
        FlickPick itself does not use cookies for tracking users. We may use local storage for
        essential site functionality, but not for tracking personal information across sessions
        or sites. Third-party services we link to (like TMDB or streaming providers) may use
        their own cookies and tracking technologies.
      </p>

      <h2>7. Security</h2>
      <p>
        We take reasonable measures to help protect information about you from loss, theft,
        misuse, and unauthorized access, disclosure, alteration, and destruction. However,
        no internet transmission is ever completely secure or error-free.
      </p>
      
      <h2>8. Children's Privacy</h2>
      <p>
        FlickPick is not intended for children under the age of 13. We do not knowingly
        collect personal information from children under 13.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. If we make changes, we will
        notify you by revising the date at the top of the policy and, in some cases, we may
        provide you with additional notice (such as adding a statement to our homepage).
      </p>

      <h2>10. Contact Us</h2>
      <p>
        FlickPick is a demonstration application. For inquiries, please understand this is
        a project and not a commercial service with dedicated support channels.
      </p>
    </div>
  );
}
