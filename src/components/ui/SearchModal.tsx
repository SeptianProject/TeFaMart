"use client";

import { useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { SearchModalProps } from "@/types/search";
import { useSearch } from "@/hooks/useSearch";
import { TefaResults } from "./search/TefaResults";
import { ProductResults } from "./search/ProductResults";
import { CategoryResults } from "./search/CategoryResults";
import { SearchSuggestions } from "./search/SearchSuggestions";
import { SearchHistory } from "./search/SearchHistory";
import { EmptyState } from "./search/EmptyState";
import { LoadingState } from "./search/LoadingState";
import { KeyboardShortcuts } from "./search/KeyboardShortcuts";

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    searchHistory,
    searchData,
    isLoading,
    selectedIndex,
    handleInputChange,
    handleProductClick,
    handleCategoryClick,
    handleTefaClick,
    handleSuggestionClick,
    removeHistoryItem,
    clearAllHistory,
    handleKeyDown,
  } = useSearch();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current && selectedIndex >= 0) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  // Highlight matched text utility
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 text-gray-900">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </>
    );
  };

  if (!isOpen) return null;

  const hasResults =
    searchQuery &&
    searchData &&
    (searchData.tefas.length > 0 ||
      searchData.products.length > 0 ||
      searchData.categories.length > 0);
  const showEmpty =
    searchQuery &&
    searchData &&
    searchData.tefas.length === 0 &&
    searchData.products.length === 0 &&
    searchData.categories.length === 0;
  const showSuggestions =
    searchQuery &&
    searchData &&
    searchData.suggestions.length > 0 &&
    !hasResults;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal - Floating with Popup Animation */}
      <div className="fixed inset-x-0 top-20 z-50 flex justify-center px-4 animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-300">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200">
          {/* Search Input */}
          <div
            className={`p-5 ${hasResults ? "border-b border-gray-200" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative group">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Cari produk, toko, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, onClose)}
                  className="w-full bg-background rounded-full border-2 border-[#7c7c7c]/10  py-6 px-5 pl-12 text-base focus:outline-none focus:border-primary transition-all duration-300"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c7c7c] w-5 h-5 group-focus-within:text-primary transition-colors" />
                {isLoading && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 animate-spin" />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-primary h-11 w-11 shrink-0">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content Area - Scrollable */}
          <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
            {(hasResults ||
              showEmpty ||
              showSuggestions ||
              (!searchQuery && searchHistory.length > 0)) && (
              <div className="p-5">
                {/* Loading State */}
                {isLoading && searchQuery && <LoadingState />}

                {/* Search Results - Tefa/Store */}
                {hasResults && searchData && (
                  <>
                    <TefaResults
                      tefas={searchData.tefas}
                      searchQuery={searchQuery}
                      selectedIndex={selectedIndex}
                      selectedItemRef={selectedItemRef}
                      onTefaClick={(tefa) => handleTefaClick(tefa, onClose)}
                      highlightText={highlightText}
                    />

                    {/* Search Results - Products */}
                    <ProductResults
                      products={searchData.products}
                      searchQuery={searchQuery}
                      selectedIndex={selectedIndex}
                      selectedItemRef={selectedItemRef}
                      tefasLength={searchData.tefas.length}
                      onProductClick={(product) =>
                        handleProductClick(product, onClose)
                      }
                      highlightText={highlightText}
                    />

                    {/* Search Results - Categories */}
                    <CategoryResults
                      categories={searchData.categories}
                      searchQuery={searchQuery}
                      selectedIndex={selectedIndex}
                      selectedItemRef={selectedItemRef}
                      tefasLength={searchData.tefas.length}
                      productsLength={searchData.products.length}
                      onCategoryClick={(category) =>
                        handleCategoryClick(category, onClose)
                      }
                      highlightText={highlightText}
                    />
                  </>
                )}

                {/* Suggestions */}
                {showSuggestions && searchData && (
                  <SearchSuggestions
                    suggestions={searchData.suggestions}
                    onSuggestionClick={handleSuggestionClick}
                  />
                )}

                {/* Empty State */}
                {showEmpty && !showSuggestions && (
                  <EmptyState searchQuery={searchQuery} />
                )}

                {/* Search History */}
                {!searchQuery && (
                  <SearchHistory
                    history={searchHistory}
                    onHistoryClick={(item) => {
                      setSearchQuery(item);
                      handleInputChange(item);
                    }}
                    onRemoveItem={removeHistoryItem}
                    onClearAll={clearAllHistory}
                  />
                )}
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Hint */}
          {(hasResults ||
            showSuggestions ||
            (!searchQuery && searchHistory.length > 0)) && (
            <KeyboardShortcuts />
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}
