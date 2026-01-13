import React from 'react'
import { StatsSkeleton } from '@/components/Skeleton';

const loading = () => {
     return (
          <div className="space-y-6">
               <div>
                    <div className="animate-pulse">
                         <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                         <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
               </div>
               <StatsSkeleton count={4} />
          </div>
     )
}

export default loading