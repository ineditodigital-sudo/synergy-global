/**
 * Shape information the defaults alone cannot express:
 *  - TEMPLATES: the shape of a new/incoming item for every list in the content.
 *  - RANGES: numeric limits so a slider typo can never break the layout.
 *  - Option lists shown as dropdowns in the CMS.
 * Plain JS (also used by Node build scripts).
 */

export const PROPERTY_TEMPLATE = {
  id: '',
  slug: '',
  visible: true,
  featured: false,
  title: '',
  neighborhood: '',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '',
  status: 'For Sale',
  type: 'Single-Family Home',
  price: '',
  beds: '',
  baths: '',
  sqft: '',
  lotSize: '',
  yearBuilt: '',
  parking: '',
  summary: '',
  description: '',
  features: [],
  images: [],
  seo: { title: '', description: '' },
};

export const SERVICE_TEMPLATE = {
  id: '',
  slug: '',
  visible: true,
  title: '',
  summary: '',
  icon: 'briefcase',
  image: '',
  hasPage: true,
  link: '',
  detail: {
    heroTag: '',
    heroTitle: '',
    heroTitleAccent: '',
    heroQuote: '',
    heroImage: '',
    introBadge: '',
    introTitle: '',
    introHighlight: '',
    introText: '',
    highlights: [],
    sideImage: '',
    sectionBadge: '',
    sectionTitle: '',
    sectionHighlight: '',
    capabilities: [],
    ctaTitle: '',
    ctaLabel: 'Request a Consultation',
    ctaLink: '/contact',
    seo: { title: '', description: '' },
  },
};

export const MEMBER_TEMPLATE = {
  id: '',
  slug: '',
  visible: true,
  name: '',
  role: '',
  image: '',
  email: '',
  phone: '',
  showPhone: false,
  linkedin: '',
  bio: '',
  specialties: [],
  locations: [],
};

const LINK = { id: '', label: '', path: '/' };
const ICON_CARD = { id: '', icon: 'briefcase', title: '', desc: '' };

// Keys are content paths with list indexes removed.
export const TEMPLATES = {
  'navigation.mainMenu': { id: '', label: '', path: '/', visible: true },
  'footer.columns': { id: '', title: '', links: [] },
  'footer.columns.links': LINK,
  'footer.bottomLinks': LINK,
  'home.metrics.items': { id: '', prefix: '', value: '', suffix: '', label: '' },
  'mission.pillars': ICON_CARD,
  'about.team': MEMBER_TEMPLATE,
  'about.team.specialties': '',
  'about.team.locations': '',
  'portfolio.items': PROPERTY_TEMPLATE,
  'portfolio.items.features': '',
  'portfolio.items.images': { id: '', src: '', alt: '' },
  'services.items': SERVICE_TEMPLATE,
  'services.items.detail.highlights': '',
  'services.items.detail.capabilities': ICON_CARD,
  'partnerships.items': { id: '', name: '', logo: '', url: '', visible: true },
  'legal.areas': ICON_CARD,
  'legal.policies': { id: '', title: '', text: '' },
  'contact.info.emails': '',
  'contact.form.inquiryTypes': '',
  'gallery.images': { id: '', src: '', caption: '', visible: true },
};

export const RANGES = {
  'style.logoHeight': [24, 120],
  'style.navTextSize': [8, 14],
  'style.missionTextSize': [14, 28],
  'style.manifestoTextSize': [16, 40],
};

export const PROPERTY_STATUSES = ['For Sale', 'Coming Soon', 'Pending', 'Sold', 'Off-Market', 'For Lease'];

export const PROPERTY_TYPES = [
  'Single-Family Home',
  'Townhome',
  'Condominium',
  'Multi-Family',
  'Commercial',
  'Mixed-Use',
  'Land',
  'Development',
];

export const FONT_CHOICES = ['Alata', 'Montserrat', 'Myriad Pro'];

export const BRAND_COLORS = { accent: '#C6B7A0', primary: '#2C3E35', background: '#FBF9F6', dark: '#1A1A1A' };

export const ALIGN_CHOICES = ['left', 'center', 'right'];
