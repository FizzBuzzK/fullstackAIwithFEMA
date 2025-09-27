'use client';

import { useState, useEffect } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import bookmarkProperty from '@/app/actions/bookmarkProperty';
import checkBookmarkStatus from '@/app/actions/checkBookmarkStatus';
import { toast } from 'react-toastify';


type BookmarkButtonProps = {
  property: { _id: string }; 
};

type BookmarkStatusResponse = {
  isBookmarked: boolean;
  error?: string;
};

type BookmarkToggleResponse = {
  isBookmarked: boolean;
  message: string;
  error?: string;
};


/**
 * ==========================================================
 * @param param0 
 * @returns 
 * ==========================================================
 */
export default function BookmarkButton({ property }: BookmarkButtonProps) {

  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {

    if (!userId) {
      setLoading(false);
      return;
    }

    (async () => {
      try{
        const res = (await checkBookmarkStatus(property._id)) as BookmarkStatusResponse;
        if(res.error){
          toast.error(res.error);
        } 
        else if(typeof res.isBookmarked === 'boolean'){
          setIsBookmarked(res.isBookmarked);
        }
      } 
      catch(err){
        toast.error('Failed to check bookmark status');
      } 
      finally{
        setLoading(false);
      }
    })();
  }, [property._id, userId]); // no need to include imported function in deps



  const handleClick = async () => {

    if(!userId){
      toast.error('Sign in to bookmark a property');
      return;
    }

    try{
      const res = (await bookmarkProperty(property._id)) as BookmarkToggleResponse;

      if(res.error){
        toast.error(res.error);
        return;
      }
      setIsBookmarked(res.isBookmarked);
      toast.success(res.message);
    }
    catch{
      toast.error('Failed to update bookmark');
    }
  };


  if (loading) return <p className="text-center">Loading...</p>;


  return isBookmarked ? 
  (
    <button
      onClick={handleClick}
      className="bg-pink-200 hover:bg-pink-400 text-white font-bold w-full mt-10 m-auto py-5 px-5 rounded-full flex items-center justify-center hover:cursor-pointer"
    >
      <FaBookmark className="mr-2" /> Remove Bookmark
    </button>
  ) : 
  (
    <button
      onClick={handleClick}
      className="bg-sky-700 hover:bg-sky-800 text-white font-bold w-full mt-10 m-auto py-5 px-5 rounded-full flex items-center justify-center hover:cursor-pointer"
    >
      <FaBookmark className="mr-2" /> Bookmark Property
    </button>
  );

}


