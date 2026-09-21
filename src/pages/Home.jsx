import { useContent } from '../content/context.js';
import SafeSection from '../components/ui/SafeSection.jsx';
import Hero from '../components/Hero.jsx';
import TrackRecord from '../components/TrackRecord.jsx';
import FeaturedProperties from '../components/FeaturedProperties.jsx';
import Manifesto from '../components/Manifesto.jsx';
import ImageGalleryCarousel from '../components/ImageGalleryCarousel.jsx';
import TeamCarousel from '../components/TeamCarousel.jsx';

export default function Home() {
  const content = useContent();
  const { home } = content;
  const key = content._meta.updatedAt + content._meta.version;
  return (
    <>
      <SafeSection name="hero" resetKey={JSON.stringify(home.hero)}>
        <Hero />
      </SafeSection>
      <SafeSection name="metrics" resetKey={key}>
        <TrackRecord />
      </SafeSection>
      <SafeSection name="featured" resetKey={key}>
        <FeaturedProperties />
      </SafeSection>
      <SafeSection name="manifesto" resetKey={key}>
        <Manifesto />
      </SafeSection>
      {home.gallery.visible && (
        <SafeSection name="gallery" resetKey={key}>
          <ImageGalleryCarousel title={home.gallery.title} />
        </SafeSection>
      )}
      {home.team.visible && (
        <SafeSection name="team" resetKey={key}>
          <TeamCarousel showLink />
        </SafeSection>
      )}
    </>
  );
}
