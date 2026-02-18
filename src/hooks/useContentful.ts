import { useState, useEffect, useCallback, useRef } from "react";
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
} from "../types/contentful";
import contentfulService from "../services/contentful";

interface UseContentfulOptions {
  locale?: string;
  cache?: boolean;
  refetchInterval?: number;
}

interface UseContentfulResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Generic hook for Contentful data fetching
function useContentfulData<T>(
  fetchFn: () => Promise<T | null>,
  options: UseContentfulOptions = {}
): UseContentfulResult<T> {
  const { refetchInterval } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data")
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    let intervalId: number | undefined;
    if (refetchInterval && refetchInterval > 0) {
      intervalId = window.setInterval(fetchData, refetchInterval);
    }

    return () => {
      mountedRef.current = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, refetchInterval]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for Hero Content
export function useHeroContent(
  options: UseContentfulOptions = {}
): UseContentfulResult<HeroContent> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchHeroContent(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for About Content
export function useAboutContent(
  options: UseContentfulOptions = {}
): UseContentfulResult<AboutContent> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchAboutContent(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Games
export function useGames(
  options: UseContentfulOptions = {}
): UseContentfulResult<GameItem[]> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchGames(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Events
export function useEvents(
  includePast: boolean = false,
  options: UseContentfulOptions = {}
): UseContentfulResult<EventItem[]> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchEvents(locale, includePast),
    [locale, includePast]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for single Event
export function useEvent(
  id: string,
  options: UseContentfulOptions = {}
): UseContentfulResult<EventItem> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchEventById(id, locale),
    [id, locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Pricing Plans
export function usePricingPlans(
  options: UseContentfulOptions = {}
): UseContentfulResult<PricingPlan[]> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchPricingPlans(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Gallery Items
export function useGalleryItems(
  options: UseContentfulOptions = {}
): UseContentfulResult<GalleryItem[]> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchGalleryItems(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for single Gallery Item
export function useGalleryItem(
  id: string,
  options: UseContentfulOptions = {}
): UseContentfulResult<GalleryItem> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchGalleryItemById(id, locale),
    [id, locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Contact Info
export function useContactInfo(
  options: UseContentfulOptions = {}
): UseContentfulResult<ContactInfo> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchContactInfo(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for FAQs
export function useFAQs(
  options: UseContentfulOptions = {}
): UseContentfulResult<FAQItem[]> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchFAQs(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Active Offers
export function useActiveOffers(
  options: UseContentfulOptions = {}
): UseContentfulResult<OfferItem[]> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchActiveOffers(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Testimonials
export function useTestimonials(
  options: UseContentfulOptions = {}
): UseContentfulResult<TestimonialItem[]> {
  const { locale = "en-US" } = options;
  const fetchFn = useCallback(
    () => contentfulService.fetchTestimonials(locale),
    [locale]
  );
  return useContentfulData(fetchFn, options);
}

// Hook for Community Stats
export function useCommunityStats(
  options: UseContentfulOptions = {}
): UseContentfulResult<CommunityStats> {
  const fetchFn = useCallback(
    () => contentfulService.fetchCommunityStats(),
    []
  );
  return useContentfulData(fetchFn, options);
}

// Export all hooks
export const contentfulHooks = {
  useHeroContent,
  useAboutContent,
  useGames,
  useEvents,
  useEvent,
  usePricingPlans,
  useGalleryItems,
  useGalleryItem,
  useContactInfo,
  useFAQs,
  useActiveOffers,
  useTestimonials,
  useCommunityStats,
};

export default contentfulHooks;
