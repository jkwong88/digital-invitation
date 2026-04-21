import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Wedding hero photo"
        fill
        className="object-cover object-top"
        priority
      />
      <div className="absolute inset-0 bg-black/25" />

      {/* Music button placeholder */}
      <button
        aria-label="Toggle music"
        className="absolute top-5 right-5 w-10 h-10 rounded-full border-2 border-white text-white flex items-center justify-center text-lg z-10"
      >
        ♪
      </button>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 z-10">
        <p className="text-sm tracking-[0.25em] mb-2 font-light">2026.11.14</p>
        <p className="text-xl tracking-wider">Ascott Gurney Penang</p>
        <p className="mt-10 text-base tracking-[0.3em] font-noto font-light">
          合情 | 合理 | 合法 | 和你
        </p>
        <p className="mt-5 text-xs italic opacity-75 leading-6 max-w-xs font-cormorant">
          To Our Family And Friends, Thank You For Celebrating Our Special Day,
          Supporting Us And Sharing Our Love.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 w-full flex justify-between items-center px-6 py-3 bg-white/90 text-[10px] tracking-[0.25em] text-gray-800 z-10">
        <span>WEDDING</span>
        <span>INVITATION</span>
        <span>2026</span>
      </div>
    </section>
  );
}
