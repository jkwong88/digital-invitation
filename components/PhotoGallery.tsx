import Image from 'next/image';
import FadeInSection from './FadeInSection';

const GALLERY_PHOTOS = [
  { src: '/images/gallery-1.jpg', alt: 'Gallery photo 1' },
  { src: '/images/gallery-2.jpg', alt: 'Gallery photo 2' },
  { src: '/images/gallery-3.jpg', alt: 'Gallery photo 3' },
  { src: '/images/gallery-4.jpg', alt: 'Gallery photo 4' },
];

export default function PhotoGallery() {
  return (
    <section className="bg-warm-white py-10 overflow-hidden">
      <FadeInSection>
        {/* Horizontal scroll strip */}
        <div className="flex gap-3 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
          {GALLERY_PHOTOS.map((photo, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-60 aspect-[3/4] snap-start"
            >
              <Image src={photo.src} alt={photo.alt} fill className="object-cover" />
            </div>
          ))}

          {/* FOREVER AND EVER vertical text beside last photo */}
          <div className="flex-shrink-0 flex items-center px-4">
            <div className="writing-vertical text-[10px] tracking-[0.4em] text-gray-400 space-y-6">
              <span>FOREVER</span>
              <span>AND</span>
              <span>EVER</span>
            </div>
          </div>
        </div>

        {/* Handwritten overlay text */}
        <div className="px-6 mt-4">
          <p
            className="font-cormorant italic text-3xl text-gray-700 leading-tight"
            style={{ transform: 'rotate(-3deg)', display: 'inline-block' }}
          >
            好久不见<br />婚礼见~
          </p>
        </div>
      </FadeInSection>
    </section>
  );
}
