import React, { useEffect, useState } from 'react';
import { Comment, CommentBody, Tweet } from '../typings';
import TimeAgo from 'react-timeago';
import {
  ArrowsRightLeftIcon,
  ArrowUpTrayIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon as HeartIconOutline,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconFill } from '@heroicons/react/24/solid';
import { fetchComments } from '../utils/fetchComments';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Props {
  tweet: Tweet;
}

const TweetComponent = ({ tweet }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [retweeted, setRetweeted] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  const { data: session } = useSession();

  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  };

  useEffect(() => {
    refreshComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const commentToast = toast.loading('Posting Comment...');

    const comment: CommentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || 'Unknown User',
      profileImage:
        session?.user?.image ||
        'https://wallpapercave.com/dwp1x/wp10557975.jpg',
    };

    const result = await fetch(`/api/addComments`, {
      body: JSON.stringify(comment),
      method: 'POST',
    });

    console.log('New Commet Added', result);

    toast.success('Comment Posted!', {
      id: commentToast,
    });

    setInput('');
    setCommentBoxVisible(false);
    refreshComments();
  };

  // console.log(comments);

  // console.log(comments);
  return (
    <div className="flex flex-col space-x-3 border-y p-5 border-gray-100">
      <div className="flex space-x-3">
        <div>
          <div className="flex items-center space-x-2">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={
                tweet.profileImage ||
                'https://wallpapercave.com/wp/wp7027819.jpg'
              }
              alt=""
            ></img>
            <p className="mr-1 font-bold">{tweet.username}</p>
            <p className="hidden text-sm text-gray-500 sm:inline">
              @{tweet.username.replace(/\s+/g, '').toLowerCase()} ·
            </p>

            <TimeAgo
              date={tweet._createdAt}
              className="text-xs text-gray-500 md:text-sm"
            />
          </div>

          <p className="pt-1">{tweet.text}</p>

          {tweet.image && (
            <img
              src={tweet.image}
              alt=""
              className="m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm"
            />
          )}
        </div>
      </div>

      <div className="mt-5 flex justify-between">
        <div
          className="flex cursor-pointer items-center space-x-3"
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
        >
          {commentBoxVisible ? (
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-twitter" />
          ) : (
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div
          className="flex cursor-pointer items-center space-x-3 "
          onClick={() => setRetweeted(!retweeted)}
        >
          {retweeted ? (
            <ArrowsRightLeftIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div
          className="flex cursor-pointer items-center space-x-3"
          onClick={() => setIsLiked(!isLiked)}
        >
          {isLiked ? (
            <HeartIconFill className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIconOutline className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div className="flex cursor-pointer items-center space-x-3">
          <ArrowUpTrayIcon className="h-5 w-5" />
        </div>
      </div>

      {/* Comments Box */}
      {commentBoxVisible && (
        <form className="mt-3 flex space-x-3" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Write a comment..."
            className="flex-1 rounded-lg bg-gray-100 p-2 outline-none "
          />
          <button
            className="text-twitter disabled:text-gray-200"
            disabled={!input}
            type="submit"
          >
            Post
          </button>
        </form>
      )}

      {comments.length > 0 && (
        <div className="my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5">
          {comments.map((comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute  left-5 top-10 h-8 border-x border-twitter/30" />
              <img
                src={comment.profileImage}
                className="mt-2 h-7 w-7 rounded-full object-cover"
                alt=""
              />
              <div className="">
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold">{comment.username}</p>
                  <p className="hidden lg:inline text-sm text-gray-500 ">
                    @{comment.username.replace(/\s+/g, '').toLowerCase()} ·
                  </p>

                  <TimeAgo
                    className="text-sm text-gray-500"
                    date={comment._createdAt}
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TweetComponent;
