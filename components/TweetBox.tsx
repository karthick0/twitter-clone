import React, { useState, useRef } from 'react';
import {
  CalendarIcon,
  FaceSmileIcon,
  MapPinIcon,
  PhotoIcon,
  GifIcon,
  ChartBarSquareIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { Tweet, TweetBody } from '../typings';
import { fetchTweets } from '../utils/fetchTweets';
import toast from 'react-hot-toast';

interface Props {
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
}

const TweetBox = ({ setTweets }: Props) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<string>('');
  const [imageUrlBoxIsOpen, setImageUrlIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>('');

  const { data: session } = useSession();

  const imageUrl = () => {
    setImageUrlIsOpen(!imageUrlBoxIsOpen);
  };

  const addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!imageInputRef.current?.value) return;
    setImage(imageInputRef.current.value);
    imageInputRef.current.value = '';
    setImageUrlIsOpen(false);
  };

  const postTweets = async () => {
    const newTweet: TweetBody = {
      text: input,
      username: session?.user?.name || 'Unknown User',
      profileImage:
        session?.user?.image || 'https://wallpapercave.com/wp/wp7027819.jpg',
      image: image,
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(newTweet),
      method: 'POST',
    });

    const json = await result.json();

    const newTweets = await fetchTweets();
    setTweets(newTweets);

    toast('Tweet Posted', {
      icon: '🚀',
    });

    return json;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    postTweets();
    setInput('');
    setImage('');
    setImageUrlIsOpen(false);
  };
  return (
    <div className="flex space-x-2 p-5">
      <div className="flex flex-1 items-center">
        <form className="flex flex-1 flex-col">
          <div className="flex space-x-4 pl-2">
            <img
              className="mt-4 h-14 w-14 rounded-full object-cover"
              src={
                session?.user?.image ||
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
              }
              alt=""
            />
            <input
              type="text"
              placeholder="What's Happening?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-24 outline-none flex-1"
            />
          </div>
          <div className="flex flex-row gap-y-4 md:gap-y-0 items-center w-full">
            <div className="flex flex-1 space-x-2 text-twitter">
              <PhotoIcon className="search-icon" onClick={imageUrl} />
              <GifIcon className="search-icon" />
              <ChartBarSquareIcon className="search-icon" />
              <FaceSmileIcon className="search-icon" />
              <CalendarIcon className="search-icon" />
              <MapPinIcon className="search-icon" />
            </div>
            <button
              disabled={!input || !session}
              className="bg-twitter text-white sm:px-5 px-3 py-2 font-bold rounded-full disabled:opacity-40 text-xs sm:text-base "
              onClick={handleSubmit}
            >
              Tweet
            </button>
          </div>

          {imageUrlBoxIsOpen && (
            <form className="mt-5 rounded-lg flex bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                type="text"
                placeholder="Enter Image URL ..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white"
              />
              <button
                className="font-bold text-white"
                type="submit"
                onClick={addImageToTweet}
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              alt=""
              className="mt-10 h-40 w-full rounded-xl object-contain shadow-lg"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default TweetBox;
