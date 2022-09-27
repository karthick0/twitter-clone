import React from 'react';
import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  ListBulletIcon,
  EnvelopeIcon,
  UserIcon,
  HomeIcon,
  EllipsisHorizontalCircleIcon,
} from '@heroicons/react/24/outline';
import Twitter from '../Assets/twitter.svg';
import SideBarRow from './SidebarRow';
import { useSession, signOut, signIn } from 'next-auth/react';
const Sidebar = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col col-span-2 sm:col-span-3 items-center px-4 md:items-start">
      {/* Icon */}
      <div className="m-3 h-10 w-10">
        <Twitter />
      </div>

      <SideBarRow Icon={HomeIcon} title="Home" />
      <SideBarRow Icon={HashtagIcon} title="Explore" />
      <SideBarRow Icon={BellIcon} title="Notifications" />
      <SideBarRow Icon={EnvelopeIcon} title="Messages" />
      <SideBarRow Icon={BookmarkIcon} title="Bookmarks" />
      <SideBarRow Icon={ListBulletIcon} title="Lists" />
      <SideBarRow
        Icon={UserIcon}
        title={session ? 'Sign Out' : 'Sign In'}
        onClick={session ? signOut : signIn}
      />
      <SideBarRow Icon={EllipsisHorizontalCircleIcon} title="More" />
    </div>
  );
};

export default Sidebar;
