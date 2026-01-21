type SearchSuggestionsProps = {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
};

export function SearchSuggestions({
  suggestions,
  onSuggestionClick,
}: SearchSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Mungkin Anda mencari:
      </h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 bg-gray-100 hover:bg-primary/20 border border-gray-200 hover:border-primary/80 rounded-lg text-sm text-gray-700 hover:text-primary transition-all duration-200 font-medium">
            {suggestion}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Klik salah satu untuk melihat hasil pencarian
      </p>
    </div>
  );
}
