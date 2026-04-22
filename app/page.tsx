import Hero from '@/components/Hero';
import LoveStoryC from '@/components/LoveStoryC';
import CalendarSection from '@/components/CalendarSection';
import PhotoGallery from '@/components/PhotoGallery';
import RsvpSection from '@/components/RsvpSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <div className="snap-start"><Hero /></div>
      <div className="snap-start"><LoveStoryC /></div>
      <div className="snap-start"><CalendarSection /></div>
      <div className="snap-start"><PhotoGallery /></div>
      <div className="snap-start"><RsvpSection /></div>
      <div className="snap-start"><Footer /></div>
    </main>
  );
}
