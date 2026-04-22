import Hero from '@/components/Hero';
import LoveStory from '@/components/LoveStory';
import CalendarSection from '@/components/CalendarSection';
import RsvpSection from '@/components/RsvpSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <div className="snap-start"><Hero /></div>
      <div className="snap-start"><LoveStory /></div>
      <div className="snap-start"><CalendarSection /></div>
      <div className="snap-start"><RsvpSection /></div>
      <div className="snap-start"><Footer /></div>
    </main>
  );
}
