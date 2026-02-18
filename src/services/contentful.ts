import { createClient, Entry, Asset } from "contentful";
import type {
  HeroContent,
  AboutContent,
  GameItem,
  EventItem,
  PricingPlan,
  GalleryItem,
  ContactInfo,
  FAQItem,
  OfferItem,
  TestimonialItem,
  CommunityStats,
  ContentfulAsset,
  CacheEntry,
  FeedbackItem,
} from "../types/contentful";

// Contentful client configuration
const config = {
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || "",
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || "",
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || "master",
};

// Create Contentful client (Content Delivery API - for reading)
const client =
  config.space && config.accessToken
    ? createClient({
        space: config.space,
        accessToken: config.accessToken,
        environment: config.environment,
      })
    : null;

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<unknown>>();

// Helper to get cached data or fetch new
async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  cacheDuration: number = CACHE_DURATION
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const data = await fetchFn();
  cache.set(key, {
    data,
    timestamp: now,
    expiresAt: now + cacheDuration,
  });

  return data;
}

// Clear cache
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Helper to transform Contentful asset
function transformAsset(asset?: Asset): ContentfulAsset | undefined {
  if (!asset?.fields?.file) return undefined;
  return {
    fields: {
      title: asset.fields.title as string,
      description: asset.fields.description as string,
      file: {
        url: `https:${(asset.fields.file as { url: string }).url}`,
        fileName: (asset.fields.file as { fileName: string }).fileName,
        contentType: (asset.fields.file as { contentType: string }).contentType,
        details: (
          asset.fields.file as {
            details?: {
              size: number;
              image?: { width: number; height: number };
            };
          }
        ).details,
      },
    },
  };
}

// Fetch Hero Content
export async function fetchHeroContent(
  locale: string = "en-US"
): Promise<HeroContent | null> {
  if (!client) return getMockHeroContent();

  return getCachedOrFetch(`hero-${locale}`, async () => {
    const entries = await client.getEntries({
      content_type: "hero",
      locale,
      limit: 1,
    });

    if (entries.items.length === 0) return getMockHeroContent();

    const item = entries.items[0];
    return {
      title: item.fields.title as string,
      subtitle: item.fields.subtitle as string,
      ctaText: item.fields.ctaText as string,
      ctaLink: item.fields.ctaLink as string,
      backgroundImage: transformAsset(item.fields.backgroundImage as Asset),
      secondaryCta: item.fields.secondaryCta as string,
      secondaryCtaLink: item.fields.secondaryCtaLink as string,
    };
  });
}

// Fetch About Content
export async function fetchAboutContent(
  locale: string = "en-US"
): Promise<AboutContent | null> {
  if (!client) return getMockAboutContent();

  return getCachedOrFetch(`about-${locale}`, async () => {
    const entries = await client.getEntries({
      content_type: "about",
      locale,
      limit: 1,
    });

    if (entries.items.length === 0) return getMockAboutContent();

    const item = entries.items[0];
    return {
      mission: item.fields.mission as string,
      missionDescription: item.fields.missionDescription as string,
      community: item.fields.community as string,
      communityDescription: item.fields.communityDescription as string,
      vision: item.fields.vision as string,
      visionDescription: item.fields.visionDescription as string,
      teamImage: transformAsset(item.fields.teamImage as Asset),
    };
  });
}

// Fetch Games
export async function fetchGames(
  locale: string = "en-US"
): Promise<GameItem[]> {
  if (!client) return getMockGames();

  try {
    const entries = await client.getEntries({
      content_type: "game",
      locale,
    });

    if (!entries.items || entries.items.length === 0) {
      return getMockGames();
    }

    return entries.items.map((item: Entry) => ({
      id: item.sys.id,
      name: (item.fields.name as string) || "Unnamed Game",
      description: (item.fields.description as string) || "",
      category: (item.fields.category as string) || "Other",
      image: transformAsset(item.fields.image as Asset),
      featured: (item.fields.featured as boolean) || false,
      platforms: (item.fields.platforms as string[]) || [],
    }));
  } catch (error) {
    console.error("Error fetching games:", error);
    return getMockGames();
  }
}

// Fetch Events
export async function fetchEvents(
  locale: string = "en-US",
  includesPast: boolean = false
): Promise<EventItem[]> {
  if (!client) {
    console.log("No Contentful client - using mock data");
    return getMockEvents();
  }

  // Clear cache to always get fresh data during development
  const cacheKey = `events-${locale}-${includesPast}`;
  cache.delete(cacheKey);

  try {
    const query: Record<string, unknown> = {
      content_type: "event",
      locale,
      order: ["fields.date"],
      include: 2, // Include linked assets (for eventImages)
    };

    // Optionally filter by date
    if (!includesPast) {
      const now = new Date().toISOString();
      query["fields.date[gte]"] = now;
    }

    console.log("Fetching events with query:", query);
    const entries = await client.getEntries(query);
    console.log(
      "Contentful response - total items:",
      entries.total,
      "items:",
      entries.items.length
    );

    if (entries.items.length === 0) {
      console.log("No events found in Contentful, returning mock data");
      return getMockEvents();
    }

    return entries.items.map((item: Entry) => {
      console.log("Event item fields:", item.fields);

      // Transform eventImages array
      const eventImagesRaw = (item.fields.eventImages as Asset[]) || [];
      const eventImages = eventImagesRaw
        .map((img) => transformAsset(img))
        .filter((img): img is NonNullable<typeof img> => img !== undefined);

      return {
        id: item.sys.id,
        title: (item.fields.title as string) || "",
        description: (item.fields.description as string) || "",
        date: (item.fields.date as string) || "",
        endDate: (item.fields.endDate as string) || "",
        time: (item.fields.time as string) || "",
        location: (item.fields.location as string) || "",
        image: transformAsset(item.fields.image as Asset),
        eventImages,
        category: (item.fields.category as string) || "Gaming",
        capacity: (item.fields.capacity as number) || 0,
        registeredCount: (item.fields.registeredCount as number) || 0,
        registrationOpen: (item.fields.registrationOpen as boolean) ?? true,
        isPast: new Date(item.fields.date as string) < new Date(),
      };
    });
  } catch (error) {
    console.error("Error fetching events from Contentful:", error);
    return getMockEvents();
  }
}

// Fetch single event by ID
export async function fetchEventById(
  id: string,
  locale: string = "en-US"
): Promise<EventItem | null> {
  if (!client) {
    const mockEvents = getMockEvents();
    return mockEvents.find((e) => e.id === id) || null;
  }

  return getCachedOrFetch(`event-${id}-${locale}`, async () => {
    const entry = await client.getEntry(id, { locale, include: 2 });

    // Debug: Log raw eventImages from Contentful
    console.log("[Contentful Debug] Entry fields:", entry.fields);
    console.log(
      "[Contentful Debug] Raw eventImages:",
      entry.fields.eventImages
    );

    // Transform eventImages array
    const eventImagesRaw = (entry.fields.eventImages as Asset[]) || [];
    console.log(
      "[Contentful Debug] eventImagesRaw length:",
      eventImagesRaw.length
    );
    const eventImages = eventImagesRaw
      .map((img) => transformAsset(img))
      .filter((img): img is NonNullable<typeof img> => img !== undefined);
    console.log("[Contentful Debug] Transformed eventImages:", eventImages);

    return {
      id: entry.sys.id,
      title: (entry.fields.title as string) || "",
      description: (entry.fields.description as string) || "",
      date: (entry.fields.date as string) || "",
      endDate: (entry.fields.endDate as string) || "",
      time: (entry.fields.time as string) || "",
      location: (entry.fields.location as string) || "",
      image: transformAsset(entry.fields.image as Asset),
      eventImages,
      category: (entry.fields.category as string) || "Gaming",
      capacity: (entry.fields.capacity as number) || 0,
      registeredCount: (entry.fields.registeredCount as number) || 0,
      registrationOpen: (entry.fields.registrationOpen as boolean) ?? true,
      isPast: new Date(entry.fields.date as string) < new Date(),
    };
  });
}

// Fetch Pricing Plans
export async function fetchPricingPlans(
  locale: string = "en-US"
): Promise<PricingPlan[]> {
  if (!client) return getMockPricingPlans();

  try {
    const entries = await client.getEntries({
      content_type: "pricingPlan",
      locale,
    });

    if (!entries.items || entries.items.length === 0) {
      return getMockPricingPlans();
    }

    return entries.items.map((item: Entry) => ({
      id: item.sys.id,
      name: (item.fields.name as string) || "Unnamed Plan",
      price: (item.fields.price as number) || 0,
      duration:
        (item.fields.duration as string) ||
        (item.fields.period as string) ||
        "month",
      features: (item.fields.features as string[]) || [],
      popular:
        (item.fields.popular as boolean) ||
        (item.fields.isPopular as boolean) ||
        false,
      sortOrder: (item.fields.sortOrder as number) || 0,
    }));
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return getMockPricingPlans();
  }
}

// Fetch Gallery Items
export async function fetchGalleryItems(
  locale: string = "en-US"
): Promise<GalleryItem[]> {
  if (!client) return getMockGalleryItems();

  return getCachedOrFetch(`gallery-${locale}`, async () => {
    const entries = await client.getEntries({
      content_type: "galleryItem",
      locale,
      include: 2, // Include linked assets (for galleryImages)
    });

    if (!entries.items || entries.items.length === 0) {
      return getMockGalleryItems();
    }

    return entries.items.map((item: Entry) => {
      // Handle both 'image' and 'coverImage' field names
      const imageAsset = (item.fields.coverImage || item.fields.image) as Asset;
      const coverImage = transformAsset(imageAsset);

      // Transform galleryImages array
      const galleryImagesRaw = (item.fields.galleryImages as Asset[]) || [];
      const galleryImages = galleryImagesRaw
        .map((img) => transformAsset(img))
        .filter((img): img is NonNullable<typeof img> => img !== undefined);

      return {
        id: item.sys.id,
        title: (item.fields.title as string) || "Untitled",
        description: (item.fields.description as string) || "",
        coverImage: coverImage || {
          fields: {
            title: "Placeholder",
            file: {
              url: "https://via.placeholder.com/400x300?text=No+Image",
              fileName: "placeholder.jpg",
              contentType: "image/jpeg",
            },
          },
        },
        photos: [],
        galleryImages,
        category: (item.fields.category as string) || "Other",
        date: (item.fields.date as string) || "",
      };
    });
  });
}

// Fetch single gallery item by ID
export async function fetchGalleryItemById(
  id: string,
  locale: string = "en-US"
): Promise<GalleryItem | null> {
  if (!client) {
    const mockItems = getMockGalleryItems();
    return mockItems.find((g) => g.id === id) || null;
  }

  return getCachedOrFetch(`gallery-item-${id}-${locale}`, async () => {
    const entry = await client.getEntry(id, { locale, include: 2 });

    // Debug: Log raw galleryImages from Contentful
    console.log("[Contentful Debug] Gallery Entry fields:", entry.fields);
    console.log(
      "[Contentful Debug] Raw galleryImages:",
      entry.fields.galleryImages
    );

    // Handle both 'image' and 'coverImage' field names
    const imageAsset = (entry.fields.coverImage || entry.fields.image) as Asset;
    const coverImage = transformAsset(imageAsset);

    // Transform galleryImages array
    const galleryImagesRaw = (entry.fields.galleryImages as Asset[]) || [];
    console.log(
      "[Contentful Debug] galleryImagesRaw length:",
      galleryImagesRaw.length
    );
    const galleryImages = galleryImagesRaw
      .map((img) => transformAsset(img))
      .filter((img): img is NonNullable<typeof img> => img !== undefined);
    console.log("[Contentful Debug] Transformed galleryImages:", galleryImages);

    return {
      id: entry.sys.id,
      title: (entry.fields.title as string) || "Untitled",
      description: (entry.fields.description as string) || "",
      coverImage: coverImage || {
        fields: {
          title: "Placeholder",
          file: {
            url: "https://via.placeholder.com/400x300?text=No+Image",
            fileName: "placeholder.jpg",
            contentType: "image/jpeg",
          },
        },
      },
      photos: [],
      galleryImages,
      category: (entry.fields.category as string) || "Other",
      date: (entry.fields.date as string) || "",
    };
  });
}

// Fetch Contact Info
export async function fetchContactInfo(
  locale: string = "en-US"
): Promise<ContactInfo | null> {
  if (!client) return getMockContactInfo();

  return getCachedOrFetch(`contact-${locale}`, async () => {
    const entries = await client.getEntries({
      content_type: "contactInfo",
      locale,
      limit: 1,
    });

    if (entries.items.length === 0) return getMockContactInfo();

    const item = entries.items[0];
    return {
      address: item.fields.address as string,
      phone: item.fields.phone as string,
      email: item.fields.email as string,
      socialLinks: item.fields.socialLinks as ContactInfo["socialLinks"],
      mapEmbed: item.fields.mapEmbed as string,
      openingHours: item.fields.openingHours as ContactInfo["openingHours"],
    };
  });
}

// Fetch FAQs
export async function fetchFAQs(locale: string = "en-US"): Promise<FAQItem[]> {
  if (!client) return getMockFAQs();

  return getCachedOrFetch(`faqs-${locale}`, async () => {
    const entries = await client.getEntries({
      content_type: "faq",
      locale,
    });

    return entries.items.map((item: Entry) => ({
      id: item.sys.id,
      question: item.fields.question as string,
      answer: item.fields.answer as string,
      category: item.fields.category as string,
    }));
  });
}

// Fetch Active Offers
export async function fetchActiveOffers(
  locale: string = "en-US"
): Promise<OfferItem[]> {
  if (!client) return getMockOffers();

  return getCachedOrFetch(`offers-${locale}`, async () => {
    const now = new Date().toISOString();
    const entries = await client.getEntries({
      content_type: "offer",
      locale,
      "fields.validFrom[lte]": now,
      "fields.validUntil[gte]": now,
    });

    return entries.items.map((item: Entry) => ({
      id: item.sys.id,
      title: item.fields.title as string,
      description: item.fields.description as string,
      discount: item.fields.discount as number,
      validFrom: item.fields.validFrom as string,
      validUntil: item.fields.validUntil as string,
      backgroundColor: item.fields.backgroundColor as string,
      image: transformAsset(item.fields.image as Asset),
      code: item.fields.code as string,
      isActive: true,
    }));
  });
}

// Fetch Testimonials
export async function fetchTestimonials(
  locale: string = "en-US"
): Promise<TestimonialItem[]> {
  if (!client) return getMockTestimonials();

  return getCachedOrFetch(`testimonials-${locale}`, async () => {
    const entries = await client.getEntries({
      content_type: "testimonial",
      locale,
    });

    return entries.items.map((item: Entry) => ({
      id: item.sys.id,
      name: item.fields.name as string,
      role: item.fields.role as string,
      avatar: transformAsset(item.fields.avatar as Asset),
      quote: item.fields.quote as string,
      rating: item.fields.rating as number,
    }));
  });
}

// Fetch Community Stats
export async function fetchCommunityStats(): Promise<CommunityStats> {
  if (!client) return getMockCommunityStats();

  return getCachedOrFetch("community-stats", async () => {
    const entries = await client.getEntries({
      content_type: "communityStats",
      limit: 1,
    });

    if (entries.items.length === 0) return getMockCommunityStats();

    const item = entries.items[0];
    return {
      members: item.fields.members as number,
      events: item.fields.events as number,
      games: item.fields.games as number,
      hoursPlayed: item.fields.hoursPlayed as number,
    };
  });
}

// Mock data functions for development without Contentful
function getMockHeroContent(): HeroContent {
  return {
    title: "Welcome to Galaxy Gaming Club",
    subtitle:
      "Your Ultimate Gaming Destination - Join our community of passionate gamers",
    ctaText: "Join Now",
    ctaLink: "/pricing",
    secondaryCta: "Explore Events",
    secondaryCtaLink: "/events",
  };
}

function getMockAboutContent(): AboutContent {
  return {
    mission: "Our Mission",
    missionDescription:
      "To create an inclusive gaming community where players of all skill levels can connect, compete, and have fun together.",
    community: "Our Community",
    communityDescription:
      "We are a diverse group of gamers united by our passion for gaming. From casual players to competitive esports enthusiasts.",
    vision: "Our Vision",
    visionDescription:
      "To become the premier gaming destination that fosters friendship, healthy competition, and unforgettable gaming experiences.",
  };
}

function getMockGames(): GameItem[] {
  return [
    {
      id: "1",
      name: "PlayStation 5 Zone",
      description: "Experience next-gen gaming with the latest PS5 titles",
      category: "Console",
      featured: true,
      platforms: ["PS5"],
    },
    {
      id: "2",
      name: "PC Gaming Arena",
      description: "High-performance gaming PCs with RTX graphics",
      category: "PC",
      featured: true,
      platforms: ["PC"],
    },
    {
      id: "3",
      name: "VR Experience",
      description: "Immersive virtual reality gaming sessions",
      category: "VR",
      featured: true,
      platforms: ["VR"],
    },
    {
      id: "4",
      name: "Racing Simulators",
      description: "Professional racing simulators with motion seats",
      category: "Simulator",
      featured: false,
      platforms: ["PC", "Simulator"],
    },
    {
      id: "5",
      name: "Retro Arcade",
      description: "Classic arcade games from the 80s and 90s",
      category: "Arcade",
      featured: false,
      platforms: ["Arcade"],
    },
    {
      id: "6",
      name: "Board Games Corner",
      description: "Collection of modern board games and classics",
      category: "Board Games",
      featured: false,
      platforms: ["Tabletop"],
    },
  ];
}

function getMockEvents(): EventItem[] {
  const today = new Date();
  return [
    {
      id: "evt1",
      title: "Weekly FIFA Tournament",
      description:
        "Compete in our weekly FIFA tournament with prizes for top 3 players!",
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      time: "18:00",
      location: "Main Gaming Hall",
      category: "Tournament",
      capacity: 32,
      registeredCount: 24,
      registrationOpen: true,
    },
    {
      id: "evt2",
      title: "VR Gaming Night",
      description:
        "Experience the latest VR games in a special after-hours event.",
      date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      time: "20:00",
      location: "VR Zone",
      category: "Special Event",
      capacity: 20,
      registeredCount: 15,
      registrationOpen: true,
    },
    {
      id: "evt3",
      title: "Esports Championship Finals",
      description: "Watch the finals of our monthly esports championship live!",
      date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      time: "17:00",
      location: "Arena Stage",
      category: "Esports",
      capacity: 100,
      registeredCount: 78,
      registrationOpen: true,
    },
  ];
}

function getMockPricingPlans(): PricingPlan[] {
  return [
    {
      id: "plan1",
      name: "Hourly Pass",
      price: 10,
      duration: "hour",
      features: [
        "Access to all gaming areas",
        "Free WiFi",
        "Complimentary snacks",
      ],
      sortOrder: 1,
    },
    {
      id: "plan2",
      name: "Day Pass",
      price: 35,
      duration: "day",
      features: [
        "Unlimited gaming all day",
        "Priority seating",
        "Free snacks & drinks",
        "VR access included",
      ],
      popular: true,
      sortOrder: 2,
    },
    {
      id: "plan3",
      name: "Monthly Membership",
      price: 99,
      duration: "month",
      features: [
        "Unlimited access",
        "Member-only events",
        "Exclusive discounts",
        "Guest passes",
        "Locker storage",
      ],
      sortOrder: 3,
    },
    {
      id: "plan4",
      name: "Annual VIP",
      price: 899,
      duration: "year",
      features: [
        "All monthly benefits",
        "Private gaming room access",
        "Early event registration",
        "Merchandise bundle",
        "24/7 access",
      ],
      sortOrder: 4,
    },
  ];
}

function getMockGalleryItems(): GalleryItem[] {
  return [
    {
      id: "gal1",
      title: "Esports Championship 2024",
      description: "Highlights from our biggest tournament of the year",
      coverImage: {
        fields: {
          file: {
            url: "https://picsum.photos/seed/esports/800/600",
            fileName: "esports.jpg",
            contentType: "image/jpeg",
          },
        },
      },
      photos: [
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/esports1/800/600",
              fileName: "esports1.jpg",
              contentType: "image/jpeg",
            },
          },
        },
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/esports2/800/600",
              fileName: "esports2.jpg",
              contentType: "image/jpeg",
            },
          },
        },
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/esports3/800/600",
              fileName: "esports3.jpg",
              contentType: "image/jpeg",
            },
          },
        },
      ],
      category: "Tournament",
      date: "2024-03-15",
    },
    {
      id: "gal2",
      title: "VR Launch Party",
      description: "Celebrating our new VR gaming zone opening",
      coverImage: {
        fields: {
          file: {
            url: "https://picsum.photos/seed/vr/800/600",
            fileName: "vr.jpg",
            contentType: "image/jpeg",
          },
        },
      },
      photos: [
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/vr1/800/600",
              fileName: "vr1.jpg",
              contentType: "image/jpeg",
            },
          },
        },
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/vr2/800/600",
              fileName: "vr2.jpg",
              contentType: "image/jpeg",
            },
          },
        },
      ],
      category: "Event",
      date: "2024-02-20",
    },
    {
      id: "gal3",
      title: "Community Game Night",
      description: "Monthly community gathering and gaming session",
      coverImage: {
        fields: {
          file: {
            url: "https://picsum.photos/seed/community/800/600",
            fileName: "community.jpg",
            contentType: "image/jpeg",
          },
        },
      },
      photos: [
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/comm1/800/600",
              fileName: "comm1.jpg",
              contentType: "image/jpeg",
            },
          },
        },
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/comm2/800/600",
              fileName: "comm2.jpg",
              contentType: "image/jpeg",
            },
          },
        },
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/comm3/800/600",
              fileName: "comm3.jpg",
              contentType: "image/jpeg",
            },
          },
        },
        {
          fields: {
            file: {
              url: "https://picsum.photos/seed/comm4/800/600",
              fileName: "comm4.jpg",
              contentType: "image/jpeg",
            },
          },
        },
      ],
      category: "Community",
      date: "2024-01-28",
    },
  ];
}

function getMockContactInfo(): ContactInfo {
  return {
    address: " 50 Ali Amin Street, Mostafa El-Nahaas, Nasr City, Cairo, Egypt, 11765",
    phone: "+201553881537",
    email: "info@galaxygamingclub.com",
    socialLinks: {
      facebook: "https://www.facebook.com/GalaxyGamingHub",
      instagram: "https://www.instagram.com/galaxygamingcafe",
    },
    openingHours: [
      { day: "Saturday - Friday", hours: "24/7" },
    ],
  };
}

function getMockFAQs(): FAQItem[] {
  return [
    {
      id: "faq1",
      question: "What gaming equipment do you have?",
      answer:
        "We have PS5, Xbox Series X, high-end gaming PCs, VR headsets, racing simulators, and a retro arcade section.",
      category: "General",
    },
    {
      id: "faq2",
      question: "Do I need to make a reservation?",
      answer:
        "Walk-ins are welcome, but we recommend making a reservation during peak hours and for events.",
      category: "Booking",
    },
    {
      id: "faq3",
      question: "What is included in the membership?",
      answer:
        "Memberships include unlimited gaming access, member-only events, exclusive discounts, and priority seating.",
      category: "Membership",
    },
  ];
}

function getMockOffers(): OfferItem[] {
  const today = new Date();
  return [
    {
      id: "offer1",
      title: "New Member Discount",
      description: "Get 20% off your first month of membership!",
      discount: 20,
      validFrom: new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      validUntil: new Date(
        today.getTime() + 60 * 24 * 60 * 60 * 1000
      ).toISOString(),
      backgroundColor: "#B84CFF",
      code: "NEWGAMER20",
      isActive: true,
    },
    {
      id: "offer2",
      title: "Happy Hour Special",
      description: "Half-price gaming from 2-5 PM on weekdays",
      discount: 50,
      validFrom: new Date(
        today.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      validUntil: new Date(
        today.getTime() + 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      backgroundColor: "#FF77E9",
      isActive: true,
    },
  ];
}

function getMockTestimonials(): TestimonialItem[] {
  return [
    {
      id: "test1",
      name: "Alex Johnson",
      role: "Regular Member",
      quote:
        "Best gaming club in the city! Great equipment and amazing community.",
      rating: 5,
    },
    {
      id: "test2",
      name: "Sarah Chen",
      role: "Tournament Champion",
      quote:
        "The tournaments here are incredibly well organized. I love the competitive atmosphere!",
      rating: 5,
    },
    {
      id: "test3",
      name: "Mike Rodriguez",
      role: "Casual Gamer",
      quote:
        "Perfect place to hang out with friends. The VR section is mind-blowing!",
      rating: 4,
    },
  ];
}

function getMockCommunityStats(): CommunityStats {
  return {
    members: 2500,
    events: 150,
    games: 500,
    hoursPlayed: 100000,
  };
}

// Submit feedback interface
export interface SubmitFeedbackData {
  name: string;
  email?: string;
  rating: number;
  comment: string;
}

// Submit feedback via API endpoint (secure server-side submission)
export async function submitFeedback(
  feedbackData: SubmitFeedbackData
): Promise<{ success: boolean; message: string; entryId?: string }> {
  try {
    // Use the Vercel API endpoint for secure submission
    const response = await fetch("/api/submit-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Feedback submission failed:", result);
      return {
        success: false,
        message: result.message || "Failed to submit feedback. Please try again later.",
      };
    }

    return {
      success: true,
      message: result.message || "Thank you! Your feedback has been submitted successfully.",
      entryId: result.entryId,
    };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return {
      success: false,
      message: "Failed to submit feedback. Please try again later.",
    };
  }
}


// Fetch approved feedback entries
export async function fetchApprovedFeedback(
  locale: string = "en-US"
): Promise<FeedbackItem[]> {
  if (!client) return [];

  try {
    const response = await client.getEntries({
      content_type: "feedback",
      "fields.approved": true,
      order: ["-fields.createdAt"],
      locale,
    });

    return response.items.map((entry: Entry) => ({
      id: entry.sys.id,
      name: entry.fields.name as string,
      email: entry.fields.email as string | undefined,
      rating: entry.fields.rating as number,
      comment: entry.fields.comment as string,
      createdAt: entry.fields.createdAt as string,
      approved: entry.fields.approved as boolean,
    }));
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }
}

export const contentfulService = {
  fetchHeroContent,
  fetchAboutContent,
  fetchGames,
  fetchEvents,
  fetchEventById,
  fetchPricingPlans,
  fetchGalleryItems,
  fetchGalleryItemById,
  fetchContactInfo,
  fetchFAQs,
  fetchActiveOffers,
  fetchTestimonials,
  fetchCommunityStats,
  clearCache,
  submitFeedback,
  fetchApprovedFeedback,
};

export default contentfulService;
