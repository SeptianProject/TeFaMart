import { Clock, X } from "lucide-react";
import { Button } from "../button";

type SearchHistoryProps = {
  history: string[];
  onHistoryClick: (item: string) => void;
  onRemoveItem: (item: string) => void;
  onClearAll: () => void;
};

export function SearchHistory({
  history,
  onHistoryClick,
  onRemoveItem,
  onClearAll,
}: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Riwayat Pencarian
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2">
          Hapus Semua
        </Button>
      </div>
      <div className="space-y-1">
        {history.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 group cursor-pointer transition-all"
            onClick={() => onHistoryClick(item)}>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7">
              <X className="w-3.5 h-3.5 text-gray-400" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
