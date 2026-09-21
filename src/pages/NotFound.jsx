import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="pt-48 pb-32 px-6 min-h-[70vh] bg-bone text-center flex flex-col items-center justify-center">
      <p className="font-sans tracking-[0.4em] text-[10px] uppercase text-sand mb-6">Error 404</p>
      <h1 className="font-heading text-4xl md:text-5xl text-sage mb-6">Page not found</h1>
      <p className="font-sans font-light text-sage/70 max-w-md mb-10">
        The page you are looking for may have moved or is no longer available.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="bg-sage text-bone px-8 py-4 font-sans text-[10px] tracking-[0.3em] uppercase hover:bg-charcoal transition-colors">
          Back to Home
        </Link>
        <Link to="/portfolio" className="border border-sage text-sage px-8 py-4 font-sans text-[10px] tracking-[0.3em] uppercase hover:bg-sage hover:text-bone transition-colors">
          View Properties
        </Link>
      </div>
    </div>
  );
}
