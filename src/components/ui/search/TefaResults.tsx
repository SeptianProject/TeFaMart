import { Store, Building2, ArrowRight } from "lucide-react";
import { Tefa } from "@/types/search";

type TefaResultsProps = {
  tefas: Tefa[];
  searchQuery: string;
  selectedIndex: number;
  onTefaClick: (tefa: Tefa) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
};

export function TefaResults({
  tefas,
  searchQuery,
  selectedIndex,
  onTefaClick,
  highlightText,
}: TefaResultsProps) {
  if (tefas.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-600 mb-2.5 px-1 flex items-center gap-1.5">
        <Store className="w-4 h-4" />
        Toko / Pendidikan Vokasi
      </h3>
      <div className="space-y-1.5">
        {tefas.map((tefa, index) => (
          <div
            key={tefa.id}
            onClick={() => onTefaClick(tefa)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group border border-transparent ${
              selectedIndex === index
                ? "bg-blue-50 border-blue-200"
                : "hover:bg-gray-50 hover:border-gray-200"
            }`}>
            <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {highlightText(tefa.name, searchQuery)}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-gray-600 truncate">
                  {tefa.campus.name}
                </p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-blue-600 font-medium">
                  {tefa._count.products} produk
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {tefa.major}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 shrink-0 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
