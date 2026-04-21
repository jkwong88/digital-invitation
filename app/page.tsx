import Hero from '@/components/Hero';
import LoveStory from '@/components/LoveStory';
import InvitationLetter from '@/components/InvitationLetter';
import CalendarSection from '@/components/CalendarSection';
import CountdownSection from '@/components/CountdownSection';
import PhotoGallery from '@/components/PhotoGallery';
import RsvpSection from '@/components/RsvpSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <LoveStory />
      <InvitationLetter />
      <CalendarSection />
      <CountdownSection />
      <PhotoGallery />
      <RsvpSection />
      <Footer />
    </main>
  );
}
