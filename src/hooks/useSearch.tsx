import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchData, Product, Category, Tefa } from "@/types/search";

// Fetch function for React Query
async function fetchSearch(
  query: string,
  signal?: AbortSignal,
): Promise<SearchData | null> {
  if (!query.trim() || query.trim().length < 2) {
    return null;
  }

  const response = await fetch(
    `/api/products/search?q=${encodeURIComponent(query)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  const result = await response.json();
  return result.success ? result.data : null;
}

export function useSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // React Query with auto-caching and AbortController
  const { data: searchData, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: ({ signal }) => fetchSearch(debouncedQuery, signal),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1,
  });

  // Handle input change with optimized debounce (250ms)
  // Handle input change with optimized debounce (250ms)
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedIndex(-1);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Optimal debounce: 250ms
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 250);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Add to search history
  const addToHistory = (query: string) => {
    if (query.trim()) {
      const newHistory = [
        query,
        ...searchHistory.filter((item) => item !== query),
      ].slice(0, 10);

      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  };

  // Navigation handlers
  const handleSearch = (query: string, onClose: () => void) => {
    if (query.trim()) {
      addToHistory(query);
      router.push(`/products?search=${encodeURIComponent(query)}`);
      onClose();
      setSearchQuery("");
    }
  };

  const handleProductClick = (product: Product, onClose: () => void) => {
    addToHistory(product.name);
    router.push(`/products/${product.slug}`);
    onClose();
    setSearchQuery("");
  };

  const handleCategoryClick = (category: Category, onClose: () => void) => {
    addToHistory(category.name);
    router.push(`/products?category=${category.slug}`);
    onClose();
    setSearchQuery("");
  };

  const handleTefaClick = (tefa: Tefa, onClose: () => void) => {
    addToHistory(tefa.name);
    router.push(`/products?tefa=${tefa.id}`);
    onClose();
    setSearchQuery("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleInputChange(suggestion);
  };

  // History management
  const removeHistoryItem = (item: string) => {
    const newHistory = searchHistory.filter((h) => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, onClose: () => void) => {
    if (!searchData) {
      if (e.key === "Enter") {
        handleSearch(searchQuery, onClose);
      } else if (e.key === "Escape") {
        onClose();
      }
      return;
    }

    const items = [
      ...(searchData.tefas || []),
      ...(searchData.products || []),
      ...(searchData.categories || []),
    ];
    const maxIndex = items.length - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex === -1) {
          handleSearch(searchQuery, onClose);
        } else if (selectedIndex < (searchData.tefas?.length || 0)) {
          handleTefaClick(searchData.tefas[selectedIndex], onClose);
        } else if (
          selectedIndex <
          (searchData.tefas?.length || 0) + (searchData.products?.length || 0)
        ) {
          const productIndex = selectedIndex - (searchData.tefas?.length || 0);
          handleProductClick(searchData.products[productIndex], onClose);
        } else {
          const categoryIndex =
            selectedIndex -
            (searchData.tefas?.length || 0) -
            (searchData.products?.length || 0);
          handleCategoryClick(searchData.categories[categoryIndex], onClose);
        }
        break;
      case "Escape":
        onClose();
        break;
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    searchHistory,
    searchData,
    isLoading,
    selectedIndex,
    handleInputChange,
    handleSearch,
    handleProductClick,
    handleCategoryClick,
    handleTefaClick,
    handleSuggestionClick,
    removeHistoryItem,
    clearAllHistory,
    handleKeyDown,
  };
}
