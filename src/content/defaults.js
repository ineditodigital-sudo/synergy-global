/**
 * Factory content for the Synergy Global website (content schema v3).
 *
 * Everything here is editable from the CMS. This file is only the starting
 * point and the safety net: whenever a saved value is missing or has the
 * wrong type, the site falls back to the value defined here.
 *
 * Plain JS on purpose: it is also imported by Node build scripts.
 */
import library from './media-library.js';

const MEDIA = Object.fromEntries(library.map((item) => [item.id, item.url]));
const M = (id) => MEDIA[id] || '';

export const SCHEMA_VERSION = 3;

const unsplash = (id, w = 2000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

export const DEFAULT_CONTENT = {
  _meta: { schema: SCHEMA_VERSION, version: 0, updatedAt: '' },

  /* ------------------------------------------------------------------ */
  settings: {
    siteName: 'Synergy Global',
    legalName: 'Synergy Global Development & Investments, Inc.',
    siteUrl: 'https://synergy.inedito.digital',
    allowIndexing: false,
    titleSuffix: 'Synergy Global',
    defaultDescription:
      'San Francisco real estate development and investment firm offering luxury homes for sale, investor representation, and cross-border advisory.',
    shareImage: M('properties/176-randall-street-1'),
    email: 'info@SynergyGlobalDevelopment.com',
    phone: '',
    streetAddress: '',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '',
    country: 'United States',
    areaServed: 'San Francisco Bay Area',
    licenseNumber: '',
    showEqualHousing: true,
    social: { linkedin: '', instagram: '', facebook: '', youtube: '', x: '' },
    analyticsId: '',
  },

  /* ------------------------------------------------------------------ */
  style: {
    colors: { accent: '#C6B7A0', primary: '#2C3E35', background: '#FBF9F6', dark: '#1A1A1A' },
    fonts: { heading: 'Alata', body: 'Montserrat' },
    logo: M('brand/logo-condensed-jade'),
    logoOnDark: M('brand/logo-condensed-white'),
    footerLogo: M('brand/logo-horizontal-white'),
    logoHeight: 49,
    navTextSize: 9.5,
    missionTextSize: 18,
    manifestoTextSize: 24,
    adminLogo: M('brand/logo-condensed-jade'),
  },

  /* ------------------------------------------------------------------ */
  navigation: {
    topBar: { visible: true, text: 'San Francisco, CA — Headquarters', linkLabel: 'Contact Us', linkPath: '/contact' },
    mainMenu: [
      { id: 'home', label: 'Home', path: '/', visible: true },
      { id: 'properties', label: 'Properties', path: '/portfolio', visible: true },
      { id: 'mission', label: 'Mission and Vision', path: '/mission', visible: true },
      { id: 'about', label: 'About Us', path: '/about', visible: true },
      { id: 'services', label: 'Our Services', path: '/services', visible: true },
      { id: 'leadership', label: 'Leadership', path: '/team', visible: true },
      { id: 'partnerships', label: 'Key Partnerships and Collaboration', path: '/partnerships', visible: true },
      { id: 'legal', label: 'Legal Services', path: '/legal', visible: true },
      { id: 'contact', label: 'Contact Us', path: '/contact', visible: true },
    ],
    showCta: true,
    ctaLabel: 'Get in Touch',
    ctaPath: '/contact',
  },

  /* ------------------------------------------------------------------ */
  footer: {
    tagline:
      'Shaping the future of San Francisco real estate through transformative development and strategic global investment.',
    columns: [
      {
        id: 'navigation',
        title: 'Navigation',
        links: [
          { id: 'f1', label: 'Properties for Sale', path: '/portfolio' },
          { id: 'f2', label: 'Our Leadership', path: '/about' },
          { id: 'f3', label: 'Expertise & Services', path: '/services' },
          { id: 'f4', label: 'Mission & Vision', path: '/mission' },
        ],
      },
      {
        id: 'strategic',
        title: 'Strategic',
        links: [
          { id: 'f5', label: 'Global Alliances', path: '/partnerships' },
          { id: 'f6', label: 'Advisory Request', path: '/contact' },
          { id: 'f7', label: 'Legal Services', path: '/legal' },
        ],
      },
    ],
    officeTitle: 'Headquarters',
    officeLine1: 'San Francisco, CA',
    officeLine2: 'United States',
    presenceText: 'Worldwide Presence',
    bottomLinks: [
      { id: 'b1', label: 'Privacy Policy', path: '/legal#privacy' },
      { id: 'b2', label: 'Terms of Service', path: '/legal#terms' },
    ],
    copyright: 'Synergy Global Development & Investments, Inc. All rights reserved.',
  },

  /* ------------------------------------------------------------------ */
  home: {
    seo: {
      title: 'San Francisco Luxury Homes & Real Estate',
      description:
        'Luxury homes and new-construction townhomes for sale in San Francisco. Synergy Global develops, sells, and invests in Bay Area real estate.',
      image: '',
    },
    hero: {
      badge: 'San Francisco Luxury Real Estate & Development',
      title: 'Global Legacy',
      subtitle: 'Engineered.',
      backgroundImage: M('hero/hero-poster'),
      backgroundVideo: M('hero/hero-video'),
      primaryCta: 'View Homes for Sale',
      primaryLink: '/portfolio',
      secondaryCta: 'Meet the Team',
      secondaryLink: '/about',
      desktopAlign: 'center',
      mobileAlign: 'center',
    },
    metrics: {
      visible: true,
      items: [
        { id: 'm1', prefix: '', value: '3', suffix: '', label: 'Continents' },
        { id: 'm2', prefix: '', value: '3', suffix: '', label: 'Active Projects' },
        { id: 'm3', prefix: '', value: '20', suffix: '+', label: 'Years of Combined Experience' },
      ],
    },
    featured: { visible: true, buttonLabel: 'View Property' },
    manifesto: {
      visible: true,
      title: 'Our Purpose',
      subtitle:
        'Synergy Global Development’s mission is to create enduring value through strategic development, disciplined investment, and collaborative partnerships. We are committed to delivering transformative projects that strengthen communities, generate long-term returns, and reflect the highest standards of integrity, innovation, and execution.',
    },
    gallery: { visible: true, title: 'Gallery' },
    team: { visible: true, linkLabel: 'Meet the Team', linkPath: '/about' },
  },

  /* ------------------------------------------------------------------ */
  mission: {
    seo: {
      title: 'Our Mission & Vision',
      description:
        'Synergy Global creates enduring value in San Francisco real estate through strategic development, disciplined investment, and collaborative partnerships.',
    },
    header: { badge: 'Our Ethos', title: 'Building Legacies Across Borders.', highlight: 'Legacies' },
    missionCard: {
      badge: 'Our Mission',
      text:
        'Synergy Global Development’s mission is to create enduring value through strategic development, disciplined investment, and collaborative partnerships. We are committed to delivering transformative projects that strengthen communities, generate long-term returns, and reflect the highest standards of integrity, innovation, and execution.',
      image: unsplash('photo-1486406146926-c627a92ad1ab', 1200),
    },
    visionCard: {
      badge: 'Our Vision',
      text:
        'Our goal is to empower business ventures to reach their full potential by providing specialized knowledge, innovative solutions, and partnerships.',
      image: unsplash('photo-1497366216548-37526070297c', 1200),
    },
    pillars: [
      {
        id: 'p1',
        icon: 'globe',
        title: 'Cross-Border Reach',
        desc: 'Navigating complex regulatory and economic landscapes in the U.S. and Mexico with absolute precision.',
      },
      {
        id: 'p2',
        icon: 'zap',
        title: 'Institutional Impact',
        desc: 'Targeting real estate, supply chain, and manufacturing opportunities for high-yield, long-term growth.',
      },
      {
        id: 'p3',
        icon: 'shield-check',
        title: 'Unwavering Integrity',
        desc: 'Discretion and ethical excellence are the bedrock of our advisory and development processes.',
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  about: {
    seo: {
      title: 'About Us & Leadership',
      description:
        'Meet the leadership team behind Synergy Global, a San Francisco real estate development and investment firm with decades of combined experience.',
    },
    header: {
      badge: 'Leadership',
      title: 'Decades of experience in San Francisco and cross-border real estate.',
      highlight: 'experience',
      subtitle: 'Our principals bring a unique dual-market perspective to every partnership.',
    },
    narrative: {
      title: 'Our Story',
      text1:
        'Headquartered in San Francisco and founded on the principles of discretion and institutional excellence, Synergy Global develops, acquires, and markets residential and commercial real estate across the Bay Area and beyond.',
      text2:
        'We specialize in identifying undervalued properties and transforming them into exceptional homes and investment-grade developments.',
    },
    teamSection: { visible: true, badge: 'Our Leadership', title: 'The Minds Behind the Vision.' },
    gallery: { visible: true, title: 'Press & Media' },
    valueStatement: { text: '“Excellence is not an act, but a habit of transformative growth.”' },
    team: [
      {
        id: '1',
        slug: 'victor-m-marquez',
        visible: true,
        name: 'Victor M. Marquez',
        role: 'CEO',
        image: M('team/victor-marquez'),
        email: 'vmarquez@synergyglobaldevelopment.com',
        phone: '(415) 314-7831',
        showPhone: false,
        linkedin: '',
        bio:
          'Victor M. Marquez is a highly skilled business and real estate attorney with over 30 years of experience across the U.S., Mexico, and Europe. As a partner at Intelink Law Group, he specializes in real estate transactions, land use, commercial litigation, and cross-border trade. His practice bridges the public and private sectors, with deep ties to the California Hispanic Chambers of Commerce and a focus on regulatory strategy, economic development, and international business.',
        specialties: ['Real Estate Law', 'Land Use', 'Commercial Litigation', 'Cross-Border Trade'],
        locations: ['San Francisco, CA'],
      },
      {
        id: '2',
        slug: 'keith-ismael',
        visible: true,
        name: 'Keith Ismael',
        role: 'President',
        image: M('team/keith-ismael'),
        email: 'kismael@synergyglobaldevelopment.com',
        phone: '(510) 283-3211',
        showPhone: false,
        linkedin: '',
        bio:
          'Keith Ismael is a former NFL athlete, entrepreneur, and investor with a disciplined approach to leadership, strategic growth, and value creation. His experience competing at the highest level of professional sports shaped the principles that guide his work today: resilience, accountability, adaptability, and a commitment to excellence.\n\nFollowing his NFL career, Keith transitioned into entrepreneurship and private investment, focusing on opportunities across real estate development, hospitality, wellness, technology, and emerging markets. As a founder and operator, he is passionate about identifying high-potential opportunities, building strategic partnerships, and developing businesses that create long-term economic value while delivering exceptional customer experiences.\n\nAt Synergy Global Development, Keith brings a forward-thinking perspective centered on innovation, execution, and sustainable growth. His work is driven by a commitment to developing transformative projects, fostering meaningful relationships, and creating lasting impact for investors, partners, and the communities the company serves.',
        specialties: ['Strategic Development', 'Real Estate Innovation', 'Business Leadership'],
        locations: ['San Francisco, CA'],
      },
      {
        id: '3',
        slug: 'ron-torres',
        visible: true,
        name: 'Ron Torres',
        role: 'COO',
        image: M('team/ron-torres'),
        email: 'rtorres@synergyglobaldevelopment.com',
        phone: '(650) 296-3013',
        showPhone: false,
        linkedin: '',
        bio:
          'Ron Torres is a dynamic, cross-disciplinary leader with 20+ years of experience driving innovation across technology, fitness and wellness, and business. From enterprise IT rollouts to award-winning wellness programs at Electronic Arts and Stanford, Ron blends operational strategy with human-centered leadership. Now expanding into real estate development and wealth-building, he brings a rare ability to bridge systems, scale ideas, and create lasting impact.',
        specialties: ['Operational Strategy', 'Innovation', 'Cross-Disciplinary Leadership'],
        locations: ['San Francisco, CA'],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  portfolio: {
    seo: {
      title: 'San Francisco Homes & Properties for Sale',
      description:
        'Browse San Francisco homes, townhomes, and condos for sale from Synergy Global, including new-construction townhomes with private elevators and bay views.',
    },
    header: {
      badge: 'Properties',
      title: 'San Francisco homes and investment properties.',
      subtitle: '',
    },
    cta: {
      title: 'Can’t find what you’re looking for?',
      highlight: 'looking for?',
      text:
        'Many of our most exclusive properties are offered privately and never reach the open market. Contact our team for a confidential consultation.',
      buttonLabel: 'Inquire Privately',
      buttonLink: '/contact',
    },
    detail: {
      inquireLabel: 'Schedule a Private Showing',
      inquireLink: '/contact',
      boxTitle: 'Private Showings',
      boxText:
        'Floor plans, disclosures, and private showing schedules are available upon request. Contact our team to arrange a visit.',
      boxButtonLabel: 'Request Information',
      boxButtonLink: '/contact',
    },
    items: [
      {
        id: '1',
        slug: '176-randall-street',
        visible: true,
        featured: true,
        title: '176 Randall Street',
        neighborhood: '',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '',
        status: 'For Sale',
        type: 'Townhome',
        price: 'Price Upon Request',
        beds: '',
        baths: '',
        sqft: '4,600',
        lotSize: '',
        yearBuilt: '',
        parking: '',
        summary: '2 luxury townhome condominiums · Private elevator · 4,600 sq. ft.',
        description:
          'Private garden access, a private elevator, and panoramic views of the bay and downtown San Francisco.',
        features: ['Private garden access', 'Private elevator', 'Panoramic bay and downtown views'],
        images: [
          { id: 'i1', src: M('properties/176-randall-street-1'), alt: '176 Randall Street, San Francisco – street view' },
          { id: 'i2', src: M('properties/176-randall-street-2'), alt: '176 Randall Street, San Francisco – rear terraces' },
          { id: 'i3', src: M('properties/176-randall-street-3'), alt: '176 Randall Street, San Francisco – facade' },
        ],
        seo: { title: '', description: '' },
      },
      // The four listings below were shown on the previous site with photos of
      // 176 Randall Street as placeholders. They are kept hidden until real
      // photos and details are added in the CMS.
      {
        id: '2',
        slug: 'the-pacific-heights-residence',
        visible: false,
        featured: true,
        title: 'The Pacific Heights Residence',
        neighborhood: 'Pacific Heights',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '',
        status: 'Sold',
        type: 'Single-Family Home',
        price: '',
        beds: '5',
        baths: '6',
        sqft: '6,800',
        lotSize: '',
        yearBuilt: '',
        parking: '',
        summary: '5 BD · 6 BA · 6,800 sq. ft.',
        description: '',
        features: [],
        images: [],
        seo: { title: '', description: '' },
      },
      {
        id: '3',
        slug: 'twin-peaks-penthouse',
        visible: false,
        featured: true,
        title: 'Twin Peaks Penthouse',
        neighborhood: 'Twin Peaks',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '',
        status: 'Pending',
        type: 'Condominium',
        price: '',
        beds: '3',
        baths: '4',
        sqft: '3,200',
        lotSize: '',
        yearBuilt: '',
        parking: '',
        summary: '3 BD · 4 BA · 3,200 sq. ft.',
        description: '',
        features: [],
        images: [],
        seo: { title: '', description: '' },
      },
      {
        id: '4',
        slug: 'the-glass-house',
        visible: false,
        featured: false,
        title: 'The Glass House',
        neighborhood: '',
        city: 'Paradise Valley',
        state: 'AZ',
        postalCode: '',
        status: 'For Sale',
        type: 'Single-Family Home',
        price: '$12,500,000',
        beds: '6',
        baths: '8',
        sqft: '',
        lotSize: '',
        yearBuilt: '',
        parking: '',
        summary: '6 BD · 8 BA',
        description: '',
        features: [],
        images: [],
        seo: { title: '', description: '' },
      },
      {
        id: '5',
        slug: 'global-logistics-hub',
        visible: false,
        featured: false,
        title: 'Global Logistics Hub',
        neighborhood: '',
        city: 'Mexico City',
        state: 'MX',
        postalCode: '',
        status: 'For Sale',
        type: 'Commercial',
        price: 'Price Upon Request',
        beds: '',
        baths: '',
        sqft: '150,000',
        lotSize: '',
        yearBuilt: '',
        parking: '',
        summary: 'Industrial · 150,000 sq. ft.',
        description: '',
        features: [],
        images: [],
        seo: { title: '', description: '' },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  services: {
    seo: {
      title: 'Real Estate & Cross-Border Services',
      description:
        'Real estate investor representation, corporate formation, trade and investment promotion, supply chain, business advocacy, and legal services.',
    },
    header: {
      badge: 'Expertise',
      title: 'Our Services',
      subtitle: 'The services, advice, and counsel we provide to our clients include:',
    },
    cardButtonLabel: 'Learn More',
    items: [
      {
        id: '1',
        slug: 'supply-chain',
        visible: true,
        title: 'Supply Chain & Distribution',
        summary: 'Sourcing, production, and distribution of goods throughout the Americas’ supply chain.',
        icon: 'globe',
        image: M('services/global-network'),
        hasPage: true,
        link: '',
        detail: {
          heroTag: 'Global Logistics',
          heroTitle: 'Supply',
          heroTitleAccent: 'Chain.',
          heroQuote: 'Engineering cross-border intelligence through specialized distribution and strategic operational excellence.',
          heroImage: M('services/supply-chain-port'),
          introBadge: 'The Strategy',
          introTitle: 'Seamlessly connecting production to consumption.',
          introHighlight: 'production',
          introText:
            'Synergy Global provides a comprehensive framework for manufacturing and distribution. We don’t just move goods; we engineer ecosystems that allow businesses to scale with confidence across international borders.',
          highlights: ['Customs & Regulatory Alignment', 'Just-in-Time Distribution', 'Asset Optimization'],
          sideImage: '',
          sectionBadge: 'Capabilities',
          sectionTitle: 'Operational Excellence.',
          sectionHighlight: 'Excellence.',
          capabilities: [
            { id: 'c1', icon: 'package', title: 'Strategic Sourcing', desc: 'Identifying and vetting top-tier manufacturers and suppliers across the global corridor.' },
            { id: 'c2', icon: 'truck', title: 'Cross-Border Logistics', desc: 'Seamless distribution networks that keep goods moving efficiently across international borders.' },
            { id: 'c3', icon: 'bar-chart', title: 'Market Intelligence', desc: 'Data-driven insights into supply chain trends and manufacturing opportunities.' },
            { id: 'c4', icon: 'globe', title: 'Global Distribution', desc: 'End-to-end management of specialized supply chain markets for institutional clients.' },
          ],
          ctaTitle: 'Ready to optimize your global operations?',
          ctaLabel: 'Request a Consultation',
          ctaLink: '/contact',
          seo: {
            title: 'Supply Chain & Distribution Services',
            description:
              'Sourcing, production, and cross-border distribution services across the Americas from Synergy Global, headquartered in San Francisco.',
          },
        },
      },
      {
        id: '2',
        slug: 'trade-investment',
        visible: true,
        title: 'Trade & Investment Promotion',
        summary: 'Trade and investment promotion connecting U.S. and international capital with high-potential opportunities.',
        icon: 'trending-up',
        image: M('services/tower-blueprint'),
        hasPage: true,
        link: '',
        detail: {
          heroTag: 'Strategic Expansion',
          heroTitle: 'Trade &',
          heroTitleAccent: 'Investment.',
          heroQuote: 'Fostering robust economic ties and facilitating seamless capital deployment across borders.',
          heroImage: unsplash('photo-1554224155-8d04cb21cd6c'),
          introBadge: 'The Strategy',
          introTitle: 'Navigating global markets with precision.',
          introHighlight: 'markets',
          introText:
            'We empower our clients to break into new markets by providing actionable intelligence, reliable partnerships, and robust investment frameworks that minimize risk and maximize returns.',
          highlights: ['Cross-Border M&A', 'Foreign Direct Investment', 'Joint Venture Structuring'],
          sideImage: '',
          sectionBadge: 'Capabilities',
          sectionTitle: 'Growth Catalyst.',
          sectionHighlight: 'Catalyst.',
          capabilities: [
            { id: 'c1', icon: 'globe', title: 'Global Market Entry', desc: 'Comprehensive strategies for expanding your operations into emerging and established international markets.' },
            { id: 'c2', icon: 'trending-up', title: 'Capital Strategy', desc: 'Connecting vetted capital with high-impact ventures to support sustainable business growth.' },
            { id: 'c3', icon: 'target', title: 'Targeted Sourcing', desc: 'Identifying and securing lucrative trade opportunities across the Americas.' },
            { id: 'c4', icon: 'briefcase', title: 'Investment Structuring', desc: 'Designing secure, compliant investment vehicles for cross-border capital.' },
          ],
          ctaTitle: 'Ready to expand your global footprint?',
          ctaLabel: 'Request a Consultation',
          ctaLink: '/contact',
          seo: {
            title: 'Trade & Investment Promotion',
            description:
              'Trade and investment promotion, cross-border M&A, and joint venture structuring connecting U.S. and international capital with opportunity.',
          },
        },
      },
      {
        id: '3',
        slug: 'investor-representation',
        visible: true,
        title: 'Real Estate Investor Representation',
        summary:
          'Representation of residential, commercial, and industrial real estate investors in San Francisco, the Bay Area, and beyond.',
        icon: 'building',
        image: M('services/executive-office'),
        hasPage: true,
        link: '',
        detail: {
          heroTag: 'Real Estate Investment',
          heroTitle: 'Investor',
          heroTitleAccent: 'Representation.',
          heroQuote: 'Guiding investors through San Francisco and Bay Area real estate with precision, discretion, and deep market knowledge.',
          heroImage: M('services/office-campus'),
          introBadge: 'The Philosophy',
          introTitle: 'Transforming terrain into institutional excellence.',
          introHighlight: 'institutional excellence.',
          introText:
            'Our approach to real estate is rooted in precision. We represent private and institutional investors—from San Francisco residential and multifamily properties to industrial parks and commercial spaces—with a focus on durability, performance, and long-term value.',
          highlights: ['Residential & Multifamily', 'Commercial Properties', 'Industrial Parks', 'Development Land'],
          sideImage: unsplash('photo-1486406146926-c627a92ad1ab', 1000),
          sectionBadge: 'Strategic Pillars',
          sectionTitle: 'Institutional Development.',
          sectionHighlight: 'Development.',
          capabilities: [
            { id: 'c1', icon: 'building', title: 'Industrial Development', desc: 'Creating high-efficiency manufacturing and warehouse space for industry leaders.' },
            { id: 'c2', icon: 'trending-up', title: 'Strategic Matchmaking', desc: 'Connecting investors with on- and off-market opportunities in San Francisco and beyond.' },
            { id: 'c3', icon: 'map', title: 'Asset Management', desc: 'Optimizing property performance and long-term value through specialized oversight.' },
            { id: 'c4', icon: 'layout', title: 'Transformative Design', desc: 'Architecture and planning that redefine the landscape and set new standards.' },
          ],
          ctaTitle: 'View our current properties.',
          ctaLabel: 'Browse Properties',
          ctaLink: '/portfolio',
          seo: {
            title: 'Investor Representation in San Francisco',
            description:
              'Representation for private and institutional real estate investors in San Francisco and the Bay Area, from residential and multifamily to industrial.',
          },
        },
      },
      {
        id: '4',
        slug: 'corporate-formation',
        visible: true,
        title: 'Corporate Formation',
        summary: 'Formation of corporate entities in the United States, Canada, and Mexico.',
        icon: 'layers',
        image: M('services/global-network'),
        hasPage: true,
        link: '',
        detail: {
          heroTag: 'Corporate Structuring',
          heroTitle: 'Corporate',
          heroTitleAccent: 'Formation.',
          heroQuote: 'Establishing robust, compliant, and strategic corporate frameworks across North America.',
          heroImage: unsplash('photo-1497366216548-37526070297c'),
          introBadge: 'The Strategy',
          introTitle: 'Building your foundation across borders.',
          introHighlight: 'across borders.',
          introText:
            'Whether you are expanding into the United States, Canada, or Mexico, we provide end-to-end entity formation services that protect your assets, optimize your tax position, and support seamless cross-border operations.',
          highlights: ['U.S. LLCs & Corporations', 'Canadian Subsidiaries', 'Mexican S.A. de C.V. Entities'],
          sideImage: '',
          sectionBadge: 'Capabilities',
          sectionTitle: 'Structural Integrity.',
          sectionHighlight: 'Integrity.',
          capabilities: [
            { id: 'c1', icon: 'layers', title: 'Cross-Border Structuring', desc: 'Establishing optimized corporate entities across the United States, Canada, and Mexico.' },
            { id: 'c2', icon: 'shield-check', title: 'Regulatory Compliance', desc: 'Navigating complex multi-jurisdictional legal frameworks to ensure operational continuity.' },
            { id: 'c3', icon: 'briefcase', title: 'Entity Management', desc: 'Ongoing governance and administrative oversight for international subsidiaries.' },
            { id: 'c4', icon: 'target', title: 'Strategic Integration', desc: 'Aligning corporate structure with your overarching tax and business strategy.' },
          ],
          ctaTitle: 'Ready to establish your entity?',
          ctaLabel: 'Request a Consultation',
          ctaLink: '/contact',
          seo: {
            title: 'Corporate Formation in the U.S., Canada & Mexico',
            description:
              'Formation of LLCs, corporations, and subsidiaries in the United States, Canada, and Mexico, with ongoing compliance and entity management.',
          },
        },
      },
      {
        id: '5',
        slug: 'business-advocacy',
        visible: true,
        title: 'Business Advocacy',
        summary: 'Advocacy for businesses and real estate companies in the U.S. and Mexico.',
        icon: 'landmark',
        image: M('services/tower-blueprint'),
        hasPage: true,
        link: '',
        detail: {
          heroTag: 'Strategic Counsel',
          heroTitle: 'Business',
          heroTitleAccent: 'Advocacy.',
          heroQuote: 'Defending interests and advancing initiatives for enterprises in the U.S. and Mexico.',
          heroImage: M('services/boardroom'),
          introBadge: 'The Strategy',
          introTitle: 'Securing outcomes through strategic advocacy.',
          introHighlight: 'strategic advocacy.',
          introText:
            'We leverage deep relationships and regulatory expertise to advocate for commercial and real estate enterprises, ensuring that public policy and municipal decisions align with our clients’ strategic goals.',
          highlights: ['Government Relations', 'Policy Shaping', 'Real Estate Entitlements'],
          sideImage: '',
          sectionBadge: 'Capabilities',
          sectionTitle: 'Influence Engineered.',
          sectionHighlight: 'Engineered.',
          capabilities: [
            { id: 'c1', icon: 'landmark', title: 'Public Affairs Strategy', desc: 'Navigating legislative and regulatory environments to protect and advance client interests.' },
            { id: 'c2', icon: 'users', title: 'Stakeholder Engagement', desc: 'Building critical alliances with government entities and private-sector leaders.' },
            { id: 'c3', icon: 'home', title: 'Real Estate Representation', desc: 'Advocating for commercial and industrial real estate developments across borders.' },
            { id: 'c4', icon: 'message', title: 'Crisis Communications', desc: 'Managing high-stakes corporate communication and reputational risk.' },
          ],
          ctaTitle: 'Need strategic representation?',
          ctaLabel: 'Request a Consultation',
          ctaLink: '/contact',
          seo: {
            title: 'Business Advocacy for Real Estate Companies',
            description:
              'Government relations, policy, and real estate entitlement advocacy for businesses and real estate companies in the U.S. and Mexico.',
          },
        },
      },
      {
        id: '6',
        slug: 'legal-services',
        visible: true,
        title: 'Legal Services',
        summary: 'Legal services in Mexico and abroad.',
        icon: 'scale',
        image: M('services/executive-office'),
        hasPage: false,
        link: '/legal',
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
          ctaLabel: '',
          ctaLink: '/contact',
          seo: { title: '', description: '' },
        },
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  partnerships: {
    seo: {
      title: 'Key Partnerships & Collaboration',
      description:
        'Synergy Global partners with vetted firms and professional associations, including Intelink Law Group and the California Hispanic Chambers of Commerce.',
    },
    header: {
      title: 'Key Partnerships & Collaboration',
      intro:
        'Synergy Global proudly partners and collaborates with key companies and professional associations to broaden the range of services available to our clients through a holistic approach. If our team is not able to address your immediate or long-term business or personal needs, we will refer you to our extensive network of service providers at no cost to you.',
      callout:
        'Our strategic alliances are thoroughly vetted to ensure that our clients are in a safe space and served with the highest level of expertise, professionalism, and ethical standards.',
      listIntro: 'The following are highlights of some of our strategic partners:',
    },
    cardLabel: 'Strategic Ally',
    items: [
      { id: '1', name: 'Intelink Law Group, PC', logo: M('partners/intelink-law-group'), url: '', visible: true },
      { id: '2', name: 'DOOTS International', logo: M('partners/doots-international'), url: '', visible: true },
      { id: '3', name: 'VEM2', logo: '', url: '', visible: true },
      { id: '4', name: 'California Hispanic Chambers of Commerce', logo: M('partners/california-hispanic-chambers'), url: '', visible: true },
      { id: '5', name: 'Canada U.S. Mexico Chamber of International Trade (“CUSMEX”)', logo: M('partners/cusmex'), url: '', visible: true },
      { id: '6', name: 'ABM Consulting', logo: '', url: '', visible: true },
      { id: '7', name: 'Javier Madera Consulting', logo: '', url: '', visible: true },
      { id: '8', name: 'Our Billion Ventures', logo: M('partners/our-billion-ventures'), url: '', visible: true },
    ],
  },

  /* ------------------------------------------------------------------ */
  legal: {
    seo: {
      title: 'Legal Services, Privacy Policy & Terms',
      description:
        'Cross-border legal counsel for real estate and business transactions between the U.S., Canada, and Mexico, plus our privacy policy and terms of service.',
    },
    hero: {
      tag: 'Institutional Strategy',
      title: 'Legal',
      titleAccent: 'Integrity.',
      quote: 'Upholding excellence through specialized cross-border counsel and unwavering ethical governance.',
      image: M('services/legal-meeting'),
    },
    areasBadge: 'Legal Expertise',
    areasTitle: 'Strategic Counsel.',
    areasHighlight: 'Counsel.',
    areas: [
      { id: 'a1', icon: 'scale', title: 'Cross-Border Transactions', desc: 'Specialized legal oversight for real estate and industrial acquisitions between the U.S., Canada, and Mexico.' },
      { id: 'a2', icon: 'shield', title: 'Corporate Formation', desc: 'Comprehensive entity structuring and registration across North American jurisdictions.' },
      { id: 'a3', icon: 'gavel', title: 'Commercial Litigation', desc: 'Robust advocacy and dispute resolution for real estate and business-related companies.' },
      { id: 'a4', icon: 'file-text', title: 'Regulatory Strategy', desc: 'Navigating the complexities of international trade law and economic development policy.' },
    ],
    policiesTitle: 'Terms & Privacy',
    policies: [
      {
        id: 'privacy',
        title: 'Privacy Policy',
        text:
          'Synergy Global Development & Investments, Inc. is committed to protecting your privacy. We collect and process personal information only to provide our advisory services and maintain our client relationships. All information you share with us through this website is handled with strict confidentiality.',
      },
      {
        id: 'terms',
        title: 'Terms of Service',
        text:
          'The information provided on this website is for informational purposes only and does not constitute legal, tax, or financial advice. Property details are deemed reliable but are not guaranteed and are subject to change. Access to private listings and certain advisory services may require further qualification and verification.',
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  contact: {
    seo: {
      title: 'Contact Us',
      description:
        'Contact Synergy Global in San Francisco, CA about buying, selling, or investing in Bay Area real estate, development partnerships, and cross-border advisory.',
    },
    header: {
      badge: 'Get in Touch',
      title: 'Begin your transformation.',
      subtitle: 'Whether you are buying, selling, or investing in San Francisco real estate, our advisors are ready to help.',
    },
    info: {
      emailsTitle: 'Direct Email',
      emails: ['info@SynergyGlobalDevelopment.com'],
      phone: '',
      officeTitle: 'Headquarters',
      office: 'San Francisco',
      officeRegion: 'California, United States',
      officeText: 'Our principal office, serving buyers, sellers, and investors across the San Francisco Bay Area and around the world.',
      showMap: true,
      mapQuery: 'San Francisco, CA',
    },
    form: {
      title: 'Send a Message',
      inquiryTypes: [
        'Buying a Home',
        'Selling a Property',
        'Real Estate Investment',
        'Development Partnership',
        'Cross-Border & Corporate Services',
        'Other',
      ],
      submitLabel: 'Submit Inquiry',
      successTitle: 'Message Sent',
      successText: 'Thank you for reaching out. An advisor will review your inquiry and respond within 24 hours.',
    },
  },

  /* ------------------------------------------------------------------ */
  gallery: {
    // Same order the live site used (the first two were swapped in the CMS).
    images: [2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((n) => {
      const key = String(n).padStart(2, '0');
      return { id: `g${key}`, src: M(`gallery/gallery-${key}`), caption: '', visible: true };
    }),
  },
};
