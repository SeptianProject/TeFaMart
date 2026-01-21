import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchData, Product, Category, Tefa } from "@/types/search";

export function useSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Fetch search results with debounce
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`,
      );
      const result = await response.json();

      if (result.success) {
        setSearchData(result.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSelectedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSearchResults(value);
    }, 300);
  };

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
