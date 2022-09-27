import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

const Widgets = () => {
  return (
    <div className="mt-2 px-2 col-span-3 hidden lg:inline">
      <div className="mt-2 bg-gray-100 flex items-center space-x-2 p-3 rounded-full">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search Twitter"
          className="bg-transparent flex-1 outline-none"
        />
      </div>

      <div className="overflow-y-auto">
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="KarthickSiva_07"
          options={{ height: 800 }}
        />
      </div>
    </div>
  );
};

export default Widgets;
