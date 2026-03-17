/**
 * Nylas Scheduling Configuration
 * Team members and services for FirstHomeGuide booking system
 *
 * Team members synced from: /who-we-are/
 * Emails default to firstname@lendcity.ca — update if different
 */

import type { TeamMember, Service, AvailabilityRule } from './types';

// ============================================================================
// Default Availability (Mon-Fri 9am-5pm EST)
// ============================================================================

const DEFAULT_AVAILABILITY: AvailabilityRule[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' }, // Friday
];

const DEFAULT_CALENDAR = { primary: '' };
const DEFAULT_TZ = { timezone: 'America/Toronto', rules: DEFAULT_AVAILABILITY };

// ============================================================================
// Team Members Configuration
// ============================================================================

export const teamMembers: TeamMember[] = [
  // ---------- Management ----------
  {
    id: 'scott',
    name: 'Scott Dillingham',
    email: 'scott@lendcity.ca',
    slug: 'scott-dillingham',
    title: 'Founder & CEO',
    photo: '/images/team/scott-dillingham.webp',
    bio: 'Award-winning mortgage agent in Canada with 15+ years of active real estate investing.',
    services: ['strategy-call'],
    nylasGrants: [
      { grantId: 'df7ba1f7-5c51-4781-96dd-dab387d63261', provider: 'microsoft', email: 'scott@lendcity.ca', isPrimary: true },
    ],
    calendars: { primary: 'primary' },
    availability: DEFAULT_TZ,
  },
  {
    id: 'aya',
    name: 'Aya Chukr',
    email: 'aya@lendcity.ca',
    slug: 'aya-chukr',
    title: 'Chief Operating Officer',
    photo: '/images/team/aya-chukr.webp',
    bio: 'Led LendCity\'s expansion into Mexico and transformed operations with her analytical, evidence-based approach.',
    services: ['strategy-call', 'mexico-strategy-call'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },

  // ---------- Canadian Team ----------
  {
    id: 'christine',
    name: 'Christine Traynor',
    email: 'christine@lendcity.ca',
    slug: 'christine-traynor',
    title: 'Mortgage Agent & Appraiser',
    photo: '/images/team/christine-traynor.webp',
    bio: '20+ years as a real estate appraiser and now actively developing multi-family projects using CMHC financing.',
    services: ['strategy-call', 'cmhc-mli', 'development', 'owner-occupied', 'portfolio-review'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'david',
    name: 'David Cardozo',
    email: 'david@lendcity.ca',
    slug: 'david-cardozo',
    title: 'Real Estate & Mortgage Agent',
    photo: '/images/team/david-cardozo.webp',
    bio: 'Active investor developing, renovating, and trading both residential and commercial projects across Canada and the U.S.',
    services: ['strategy-call', 'owner-occupied', 'portfolio-review', 'usa-strategy-call'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'gillian',
    name: 'Gillian Irving',
    email: 'gillian@lendcity.ca',
    slug: 'gillian-irving',
    title: 'Mortgage Agent',
    photo: '/images/team/gillian-irving.webp',
    bio: 'Acquired 35 properties across Southern Ontario in 18 months using a data-driven investment methodology.',
    services: ['strategy-call', 'owner-occupied', 'portfolio-review', 'usa-strategy-call'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'jennifer',
    name: 'Jennifer Champion',
    email: 'jennifer@lendcity.ca',
    slug: 'jennifer-champion',
    title: 'Mortgage Agent & Developer',
    photo: '/images/team/jennifer-champion.webp',
    bio: 'Active developer currently building 66-unit and 165-unit multifamily apartment projects in Sooke, BC.',
    services: ['strategy-call', 'cmhc-mli', 'development', 'portfolio-review', 'owner-occupied'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'jeremy',
    name: 'Jeremy Kresky',
    email: 'jeremy@lendcity.ca',
    slug: 'jeremy-kresky',
    title: 'Agricultural & Commercial Specialist',
    photo: '/images/team/jeremy-kresky.webp',
    bio: 'Decade of experience in agricultural and commercial finance. Specializes in deals that don\'t fit conventional boxes.',
    services: ['strategy-call', 'agricultural', 'commercial', 'owner-occupied', 'portfolio-review'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'kirann',
    name: 'Kirann Sharma',
    email: 'kirann@lendcity.ca',
    slug: 'kirann-sharma',
    title: 'Mortgage Agent',
    photo: '/images/team/kirann-sharma.webp',
    bio: 'Specializes in creative financing solutions for complex properties. Known for finding solutions when others say no.',
    services: ['strategy-call', 'owner-occupied'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'matt',
    name: 'Matt Buschman',
    email: 'matt@lendcity.ca',
    slug: 'matt-buschman',
    title: 'Realtor & Mortgage Agent',
    photo: '/images/team/matt-buschman.webp',
    bio: 'Co-founder of Synergy Real Estate Group. Multi-million dollar producer since 2007 with extensive development experience.',
    services: ['strategy-call', 'development'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'nour',
    name: 'Nour Chukr',
    email: 'nour@lendcity.ca',
    slug: 'nour-chukr',
    title: 'Lead Coordinator',
    photo: '/images/team/nour-chukr.webp',
    bio: 'Contributed to the successful funding of over 80 deals in 2024. Ensures every client file moves efficiently from application to funding.',
    services: ['strategy-call'],
    personalOnly: true,
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },

  // ---------- US Team ----------
  {
    id: 'chris',
    name: 'Chris Micucci',
    email: 'chris@lendcity.ca',
    slug: 'chris-micucci',
    title: 'U.S. Loan Officer',
    photo: '/images/team/chris-micucci.webp',
    bio: 'College professor who brings an educator\'s approach to mortgage financing, ensuring clients understand every step.',
    services: ['usa-strategy-call'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'jimmy',
    name: 'Jimmy Rivera',
    email: 'jimmy@lendcity.ca',
    slug: 'jimmy-rivera',
    title: 'U.S. Loan Officer',
    photo: '/images/team/jimmy-rivera.webp',
    bio: '20+ years of real estate investing experience since purchasing his first property at 19.',
    services: ['strategy-call'],
    personalOnly: true,
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
  {
    id: 'josh',
    name: 'Josh Bauerle',
    email: 'josh@lendcity.ca',
    slug: 'josh-bauerle',
    title: 'U.S. Loan Officer',
    photo: '/images/team/josh-bauerle.webp',
    bio: 'Licensed CPA and best-selling author with a growing rental portfolio across the U.S.',
    services: ['usa-strategy-call'],
    calendars: DEFAULT_CALENDAR,
    availability: DEFAULT_TZ,
  },
];

// ============================================================================
// Services Configuration
// ============================================================================

export const services: Service[] = [
  // ============================================================================
  // Canada Services
  // ============================================================================
  // strategy-call is used ONLY for personal booking pages (ProfileScheduler).
  // It does NOT appear on the main booking page (no teamMembers assigned).
  {
    id: 'strategy-call',
    name: 'Free Strategy Call',
    description:
      'Discuss your homeownership or investment goals with one of our specialists. Get personalized advice on your next steps.',
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: [],
    roundRobin: false,
    icon: 'PhoneCall',
    category: 'residential',
    meetingTypes: ['phone', 'teams'],
    region: 'canada',
  },
  // ============================================================================
  // Main booking page services
  // teamMembers are auto-populated below from each team member's services array
  // ============================================================================
  {
    id: 'owner-occupied',
    name: 'Owner Occupied',
    description:
      'Buying a home to live in? Get expert guidance on mortgage options, pre-approval, and the buying process.',
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: [], // auto-populated
    roundRobin: true,
    icon: 'Home',
    category: 'residential',
    region: 'canada',
  },
  {
    id: 'cmhc-mli',
    name: 'CMHC Multi-Family Financing & Construction',
    description:
      'Deep dive into CMHC MLI financing for multi-family properties. Learn about qualification requirements, construction financing, and strategies.',
    duration: 45,
    bufferBefore: 5,
    bufferAfter: 10,
    teamMembers: [], // auto-populated
    roundRobin: true,
    icon: 'Building2',
    category: 'commercial',
    region: 'canada',
  },
  {
    id: 'development',
    name: 'Development Strategy Call',
    description:
      'Planning financing for your development project? Discuss construction loans, land acquisition, and project financing.',
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: [], // auto-populated
    roundRobin: true,
    icon: 'HardHat',
    category: 'development',
    region: 'canada',
  },
  {
    id: 'commercial',
    name: 'Commercial Strategy Call',
    description:
      'Explore financing options for commercial real estate investments including retail, office, and industrial properties.',
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: [], // auto-populated
    roundRobin: false,
    icon: 'Landmark',
    category: 'commercial',
    region: 'canada',
  },
  {
    id: 'agricultural',
    name: 'Agricultural Financing Strategy Call',
    description:
      'Explore financing options for farmland, agricultural operations, and rural commercial properties. Get expert advice on programs tailored to the unique needs of agricultural investments.',
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: [], // auto-populated
    roundRobin: true,
    icon: 'Wheat',
    category: 'commercial',
    region: 'canada',
  },
  {
    id: 'portfolio-review',
    name: 'Portfolio Review',
    description:
      'Comprehensive review of your existing real estate portfolio. Identify optimization opportunities and refinancing strategies.',
    duration: 60,
    bufferBefore: 10,
    bufferAfter: 10,
    teamMembers: [], // auto-populated
    roundRobin: true,
    icon: 'PieChart',
    category: 'investment',
    region: 'canada',
  },
  // ============================================================================
  // USA Services
  // ============================================================================
  {
    id: 'usa-strategy-call',
    name: 'US Investment Strategy Call',
    description:
      'Explore financing options for US real estate investments. We help Canadian investors navigate cross-border mortgages for properties in the United States.',
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: [], // auto-populated
    roundRobin: true,
    icon: 'Globe',
    category: 'investment',
    meetingTypes: ['phone', 'teams'],
    region: 'usa',
  },
  // ============================================================================
  // Mexico Services
  // ============================================================================
  {
    id: 'mexico-strategy-call',
    name: 'Mexico Investment Strategy Call',
    description:
      'Interested in Mexican real estate? Discuss financing strategies for vacation properties and investment opportunities in Mexico.',
    duration: 30,
    bufferBefore: 5,
    bufferAfter: 5,
    teamMembers: [], // auto-populated
    roundRobin: false,
    icon: 'Globe',
    category: 'investment',
    meetingTypes: ['phone', 'teams'],
    region: 'mexico',
  },
];

// ============================================================================
// Auto-populate service.teamMembers from team member services arrays
// Single source of truth: assign services on the team member, and the
// service's teamMembers list is derived automatically.
// Members with personalOnly: true only appear on their personal booking page.
// ============================================================================

for (const service of services) {
  // strategy-call is personal-only (ProfileScheduler) — never auto-populate
  if (service.id === 'strategy-call') continue;

  service.teamMembers = teamMembers
    .filter((m) => m.services.includes(service.id) && !m.personalOnly)
    .map((m) => m.id);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get a team member by their ID
 */
export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find((member) => member.id === id);
}

/**
 * Get a team member by their URL slug
 */
export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return teamMembers.find((member) => member.slug === slug);
}

/**
 * Get a team member by their email address (case-insensitive)
 */
export function getTeamMemberByEmail(email: string): TeamMember | undefined {
  const normalizedEmail = email.toLowerCase();
  return teamMembers.find((member) => member.email.toLowerCase() === normalizedEmail);
}

/**
 * Get a service by its ID
 */
export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

/**
 * Get all services offered by a specific team member
 */
export function getServicesByTeamMember(teamMemberId: string): Service[] {
  return services.filter((service) => service.teamMembers.includes(teamMemberId));
}

/**
 * Get all team members who offer a specific service
 */
export function getTeamMembersByService(serviceId: string): TeamMember[] {
  const service = getServiceById(serviceId);
  if (!service) return [];
  return teamMembers.filter((member) => service.teamMembers.includes(member.id));
}

/**
 * Get all services in a specific category
 */
export function getServicesByCategory(
  category: 'residential' | 'commercial' | 'investment' | 'development'
): Service[] {
  return services.filter((service) => service.category === category);
}

/**
 * Get all services for a specific region
 */
export function getServicesByRegion(
  region: 'canada' | 'usa' | 'mexico'
): Service[] {
  return services.filter((service) => service.region === region);
}

/**
 * Get team members who have completed OAuth and are active
 */
export function getActiveTeamMembers(): TeamMember[] {
  return teamMembers.filter(
    (member) => member.nylasGrantId || (member.nylasGrants && member.nylasGrants.length > 0)
  );
}

/**
 * Check if a team member is available for a specific service
 */
export function canTeamMemberOfferService(teamMemberId: string, serviceId: string): boolean {
  const service = getServiceById(serviceId);
  if (!service) return false;
  return service.teamMembers.includes(teamMemberId);
}

// ============================================================================
// Scheduling Configuration
// ============================================================================

export const schedulingConfig = {
  // Minimum notice period before a booking (in hours)
  minimumNotice: 3,

  // Maximum days in advance that can be booked
  maxAdvanceBooking: 60,

  // Default timezone
  defaultTimezone: 'America/Toronto',

  // Slot interval for availability (in minutes)
  slotInterval: 15,

  // Business hours for display (even if individual availability differs)
  businessHours: {
    start: '09:00',
    end: '17:00',
  },

  // Days to show in the calendar view
  daysToShow: 14,

  // Whether to auto-add video conferencing to meetings
  autoAddConferencing: true,

  // Default conferencing provider
  conferencingProvider: 'Microsoft Teams' as const,
};
