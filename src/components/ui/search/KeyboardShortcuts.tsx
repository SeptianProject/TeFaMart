export function KeyboardShortcuts() {
  return (
    <div className="px-5 py-3 border-t border-gray-200 ">
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium shadow-sm">
            ↑↓
          </kbd>
          Navigasi
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium shadow-sm">
            Enter
          </kbd>
          Pilih
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-medium shadow-sm">
            Esc
          </kbd>
          Tutup
        </span>
      </div>
    </div>
  );
}
