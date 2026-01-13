import React from "react";

interface SkeletonProps {
     className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
     return (
          <div
               className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
          />
     );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
     return (
          <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                         <tr>
                              {Array.from({ length: columns }).map((_, i) => (
                                   <th key={i} className="px-6 py-3">
                                        <Skeleton className="h-4 w-24" />
                                   </th>
                              ))}
                         </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                         {Array.from({ length: rows }).map((_, rowIndex) => (
                              <tr key={rowIndex}>
                                   {Array.from({ length: columns }).map((_, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4">
                                             <Skeleton className="h-4 w-full" />
                                        </td>
                                   ))}
                              </tr>
                         ))}
                    </tbody>
               </table>
          </div>
     );
}

// Product Table Skeleton (with image)
export function ProductTableSkeleton({ rows = 5 }: { rows?: number }) {
     return (
          <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                         <tr>
                              <th className="px-6 py-3 text-left">
                                   <Skeleton className="h-4 w-20" />
                              </th>
                              <th className="px-6 py-3 text-left">
                                   <Skeleton className="h-4 w-32" />
                              </th>
                              <th className="px-6 py-3 text-left">
                                   <Skeleton className="h-4 w-20" />
                              </th>
                              <th className="px-6 py-3 text-left">
                                   <Skeleton className="h-4 w-16" />
                              </th>
                              <th className="px-6 py-3 text-right">
                                   <Skeleton className="h-4 w-16 ml-auto" />
                              </th>
                         </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                         {Array.from({ length: rows }).map((_, index) => (
                              <tr key={index}>
                                   <td className="px-6 py-4">
                                        <div className="flex items-center">
                                             <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
                                             <div className="ml-4 flex-1">
                                                  <Skeleton className="h-4 w-32 mb-2" />
                                                  <Skeleton className="h-3 w-48" />
                                             </div>
                                        </div>
                                   </td>
                                   <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-3 w-32" />
                                   </td>
                                   <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-24" />
                                   </td>
                                   <td className="px-6 py-4">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                   </td>
                                   <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                             <Skeleton className="h-8 w-8 rounded" />
                                             <Skeleton className="h-8 w-8 rounded" />
                                        </div>
                                   </td>
                              </tr>
                         ))}
                    </tbody>
               </table>
          </div>
     );
}

// Card Skeleton
export function CardSkeleton({ count = 4 }: { count?: number }) {
     return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {Array.from({ length: count }).map((_, index) => (
                    <div
                         key={index}
                         className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                         <div className="flex items-center justify-between mb-4">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-10 w-10 rounded-lg" />
                         </div>
                         <Skeleton className="h-8 w-20 mb-2" />
                         <Skeleton className="h-4 w-24" />
                    </div>
               ))}
          </div>
     );
}

// Stats Skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
     return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {Array.from({ length: count }).map((_, index) => (
                    <div
                         key={index}
                         className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                         <div className="flex items-center justify-between mb-4">
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-10 w-10 rounded-lg" />
                         </div>
                         <Skeleton className="h-8 w-16 mb-2" />
                         <Skeleton className="h-4 w-32" />
                    </div>
               ))}
          </div>
     );
}

// TEFA Card Skeleton
export function TefaCardSkeleton({ count = 6 }: { count?: number }) {
     return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {Array.from({ length: count }).map((_, index) => (
                    <div
                         key={index}
                         className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                    >
                         <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                   <Skeleton className="h-6 w-40 mb-2" />
                                   <Skeleton className="h-4 w-32" />
                              </div>
                         </div>
                         <Skeleton className="h-12 w-full mb-4" />
                         <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <Skeleton className="h-4 w-20" />
                              <div className="flex gap-2">
                                   <Skeleton className="h-9 w-9 rounded-lg" />
                                   <Skeleton className="h-9 w-9 rounded-lg" />
                              </div>
                         </div>
                    </div>
               ))}
          </div>
     );
}
