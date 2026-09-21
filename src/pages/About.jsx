import { useContent } from '../content/context.js';
import Highlight from '../components/ui/Highlight.jsx';
import SafeSection from '../components/ui/SafeSection.jsx';
import TeamCarousel from '../components/TeamCarousel.jsx';
import ImageGalleryCarousel from '../components/ImageGalleryCarousel.jsx';

export default function About() {
  const content = useContent();
  const { about } = content;
  const key = content._meta.updatedAt + content._meta.version;
  return (
    <div className="pt-40 bg-bone min-h-screen">
      <section className="px-6 md:px-16 mb-32">
        <div className="max-w-7xl mx-auto">
          {about.header.badge && <p className="font-sans font-light tracking-[0.4em] text-xs uppercase text-sand mb-8">{about.header.badge}</p>}
          <h1 className="font-heading text-4xl md:text-5xl text-sage mb-12 leading-tight max-w-4xl">
            <Highlight text={about.header.title} highlight={about.header.highlight} />
          </h1>
          {about.header.subtitle && <p className="font-sans font-light text-lg text-sand mb-12 max-w-3xl">{about.header.subtitle}</p>}
          {about.narrative.title && <h2 className="sr-only">{about.narrative.title}</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {about.narrative.text1 && <p className="font-sans font-light text-xl text-sage/80 leading-relaxed">{about.narrative.text1}</p>}
            {about.narrative.text2 && <p className="font-sans font-light text-xl text-sage/80 leading-relaxed">{about.narrative.text2}</p>}
          </div>
        </div>
      </section>

      {about.teamSection.visible && (
        <SafeSection name="about-team" resetKey={key}>
          <div id="leadership">
            <TeamCarousel />
          </div>
        </SafeSection>
      )}

      {about.gallery.visible && (
        <SafeSection name="about-gallery" resetKey={key}>
          <ImageGalleryCarousel title={about.gallery.title} />
        </SafeSection>
      )}

      {about.valueStatement.text && (
        <section className="py-32 px-6 md:px-16 text-center">
          <div className="max-w-3xl mx-auto">
            <blockquote className="font-body italic text-3xl md:text-4xl text-sage mb-8">{about.valueStatement.text}</blockquote>
            <div className="w-12 h-px bg-sand mx-auto" />
          </div>
        </section>
      )}
    </div>
  );
}
