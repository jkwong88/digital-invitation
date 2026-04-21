import FadeInSection from './FadeInSection';

const poem = [
  '以前觉得婚礼是一则官方公告',
  '现在才明白这是一场人生为数不多的相聚',
  '是千里之外的奔赴',
  '是不计得失的支持',
  '感谢一路相伴的家人朋友',
  '许久未见 甚是想念',
];

export default function InvitationLetter() {
  return (
    <section className="bg-white py-16 px-6">
      {/* Poem */}
      <FadeInSection>
        <div className="text-center space-y-3">
          {poem.map((line, i) => (
            <p key={i} className="font-noto text-sm text-gray-700 leading-7">
              {line}
            </p>
          ))}
        </div>
      </FadeInSection>

      {/* Date */}
      <FadeInSection className="mt-10 text-center" delay="100ms">
        <p className="tracking-[0.3em] text-gray-800 text-sm">2026.11.14</p>
      </FadeInSection>

      {/* Closing */}
      <FadeInSection className="mt-4 text-center" delay="200ms">
        <p className="font-noto text-2xl text-gray-900">我们，婚礼见~</p>
      </FadeInSection>

      {/* Bottom bar */}
      <div className="mt-12 flex justify-between items-center text-[10px] tracking-[0.25em] text-gray-800 border-t pt-4">
        <span>WEDDING</span>
        <span>INVITATION</span>
        <span>2026</span>
      </div>
    </section>
  );
}
