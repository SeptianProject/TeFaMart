import { Search } from "lucide-react";

type EmptyStateProps = {
  searchQuery: string;
};

export function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        Tidak ada hasil
      </h3>
      <p className="text-sm text-gray-500">
        Tidak ditemukan untuk &quot;{searchQuery}&quot;
      </p>
    </div>
  );
}
