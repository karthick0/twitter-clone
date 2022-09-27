import { ArrowPathIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Tweet } from '../typings';
import { fetchTweets } from '../utils/fetchTweets';
import TweetComponent from './Tweet';
import TweetBox from './TweetBox';
import toast from 'react-hot-toast';

interface Props {
  tweets: Tweet[];
}

const Feed = ({ tweets: tweetProp }: Props) => {
  const [tweets, setTweets] = useState<Tweet[]>(tweetProp);

  const handleRefresh = async () => {
    const refreshToast = toast.loading('Refreshiing...');
    const tweets = await fetchTweets();
    setTweets(tweets);
    toast.success('Feed Updated!', {
      id: refreshToast,
    });
  };

  return (
    <div className="col-span-10 sm:col-span-8 lg:col-span-6 border-x max-h-screen overflow-y-scroll scrollbar-hide">
      <div className="flex items-center justify-between cursor-pointer">
        <h1 className="p-5 pb-0 text-xl font-bold">Home</h1>
        <ArrowPathIcon
          className="mr-5 mt-5 h-8 w-8 cursor-pointer text-blue transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
          onClick={handleRefresh}
        />
      </div>

      <TweetBox setTweets={setTweets} />

      {/* Feed */}
      <div>
        {tweets.map((tweet) => (
          <TweetComponent key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
