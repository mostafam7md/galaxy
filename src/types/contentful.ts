// Contentful Types for Galaxy Gaming Club

export interface ContentfulAsset {
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      details?: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: ContentfulAsset;
  secondaryCta?: string;
  secondaryCtaLink?: string;
}

export interface AboutContent {
  mission: string;
  missionDescription: string;
  community: string;
  communityDescription: string;
  vision: string;
  visionDescription: string;
  teamImage?: ContentfulAsset;
}

export interface GameItem {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: ContentfulAsset;
  featured?: boolean;
  platforms?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  image?: ContentfulAsset;
  eventImages?: ContentfulAsset[];
  category: string;
  capacity?: number;
  registeredCount?: number;
  registrationOpen?: boolean;
  isPast?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  sortOrder?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  coverImage: ContentfulAsset;
  photos: ContentfulAsset[];
  galleryImages?: ContentfulAsset[];
  category?: string;
  date?: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  createdAt: string;
  approved?: boolean;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    discord?: string;
    youtube?: string;
  };
  mapEmbed?: string;
  openingHours?: {
    day: string;
    hours: string;
  }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  discount?: number;
  validFrom: string;
  validUntil: string;
  backgroundColor?: string;
  image?: ContentfulAsset;
  code?: string;
  isActive?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role?: string;
  avatar?: ContentfulAsset;
  quote: string;
  rating: number;
}

export interface CommunityStats {
  members: number;
  events: number;
  games: number;
  hoursPlayed: number;
}

// Contentful Entry wrapper
export interface ContentfulEntry<T> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: T;
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  previewToken?: string;
  environment?: string;
}
