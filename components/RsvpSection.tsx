import Image from 'next/image';
import FadeInSection from './FadeInSection';
import RsvpForm from './RsvpForm';

export default function RsvpSection() {
  return (
    <section>
      {/* Background photo */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src="/images/rsvp-bg.jpg"
          alt="RSVP background"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Form */}
      <div className="bg-white px-6 py-12">
        <FadeInSection>
          <h2 className="font-playfair text-3xl text-center tracking-[0.4em] text-deep-red mb-10">
            RSVP
          </h2>
          <RsvpForm />
        </FadeInSection>
      </div>
    </section>
  );
}
