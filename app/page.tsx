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
      <div className="snap-start"><Hero /></div>
      <div className="snap-start"><LoveStory /></div>
      <div className="snap-start"><InvitationLetter /></div>
      <div className="snap-start"><CalendarSection /></div>
      <div className="snap-start"><CountdownSection /></div>
      <div className="snap-start"><PhotoGallery /></div>
      <div className="snap-start"><RsvpSection /></div>
      <div className="snap-start"><Footer /></div>
    </main>
  );
}
