import { useContent } from '../content/context.js';
import PageHero from '../components/PageHero.jsx';
import Highlight from '../components/ui/Highlight.jsx';
import Icon from '../components/ui/Icon.jsx';
import Paragraphs from '../components/ui/Paragraphs.jsx';

export default function Legal() {
  const { legal } = useContent();
  const areas = legal.areas.filter((a) => a.title || a.desc);
  const policies = legal.policies.filter((p) => p.title || p.text);

  return (
    <div className="bg-bone min-h-screen text-sage">
      <PageHero tag={legal.hero.tag} title={legal.hero.title} accent={legal.hero.titleAccent} quote={legal.hero.quote} image={legal.hero.image} />

      {areas.length > 0 && (
        <section className="px-6 md:px-16 bg-bone py-32 border-y border-sand/20">
          <div className="max-w-7xl mx-auto mb-20">
            {legal.areasBadge && (
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-sand mb-6 text-center md:text-left">{legal.areasBadge}</p>
            )}
            {legal.areasTitle && (
              <h2 className="font-heading text-4xl md:text-5xl text-sage text-center md:text-left">
                <Highlight text={legal.areasTitle} highlight={legal.areasHighlight} />
              </h2>
            )}
          </div>
          <ul className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            {areas.map((a) => (
              <li key={a.id} className="flex gap-8 group">
                <div className="w-16 h-16 shrink-0 bg-white border border-sand/30 flex items-center justify-center text-sand group-hover:bg-sage group-hover:text-bone transition-all duration-500">
                  <Icon name={a.icon} size={24} />
                </div>
                <div>
                  <h3 className="font-body text-2xl text-sage mb-4">{a.title}</h3>
                  <p className="font-sans font-light text-sage/60 leading-relaxed">{a.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {policies.length > 0 && (
        <section className="px-6 md:px-16 py-32">
          <div className="max-w-3xl mx-auto">
            {legal.policiesTitle && (
              <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-sand mb-8 text-center font-bold">{legal.policiesTitle}</h2>
            )}
            <div className="space-y-12">
              {policies.map((p) => (
                <article key={p.id} id={p.id} className="border-t border-sand/20 pt-8 scroll-mt-32">
                  <h3 className="font-body text-xl text-sage mb-4">{p.title}</h3>
                  <Paragraphs text={p.text} className="font-sans font-light text-sm text-sage/60 leading-loose mb-4" />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
