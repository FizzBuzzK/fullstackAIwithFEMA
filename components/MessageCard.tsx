'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import markMessageAsRead from '@/app/actions/markMessageAsRead';
import deleteMessage from '@/app/actions/deleteMessage';
import { useGlobalContext } from '@/context/GlobalContext';
import Link from 'next/link';
import { Button } from './ui/button';


interface Message {
  _id: string;
  read: boolean;
  body: string;
  email: string;
  phone: string;
  createdAt: string | Date;
  property: {
    name: string;
  };
}


interface MessageCardProps {
  message: Message;
}


/**
 * ========================================================
 * @param param0 
 * @returns 
 * ========================================================
 */
export default function MessageCard({ message }: MessageCardProps) {

  const [isRead, setIsRead] = useState<boolean>(message.read);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const { setUnreadCount } = useGlobalContext();


  const handleReadClick = async () => {
    const read: boolean = await markMessageAsRead(message._id);
    setIsRead(read);
    setUnreadCount((prevCount: number) => (read ? prevCount - 1 : prevCount + 1));
    toast.success(`Marked as ${read ? 'read' : 'new'}`);
  };


  const handleDeleteClick = async () => {
    await deleteMessage(message._id);
    setIsDeleted(true);
    setUnreadCount((prevCount: number) => (isRead ? prevCount : prevCount - 1));
    toast.success('Message Deleted');
  };


  if (isDeleted) {
    return <p>Deleted message</p>;
  }


  //==========================================================
  return (
    <div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">

      {!isRead && (
        <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-md">
          New
        </div>
      )}

      <h2 className="text-xl mb-4">
        <span className="font-bold">Property Inquiry:</span> {message.property.name}
      </h2>

      <p className="text-gray-700">{message.body}</p>

      <ul className="mt-4">
        <li>
          <strong>Reply Email:</strong>{' '}
          <Link href={`mailto:${message.email}`} className="text-blue-500">
            {message.email}
          </Link>
        </li>

        <li>
          <strong>Reply Phone:</strong>{' '}
          <Link href={`tel:${message.phone}`} className="text-blue-500">
            {message.phone}
          </Link>
        </li>

        <li>
          <strong>Received:</strong>{' '}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>

      <Button
        onClick={handleReadClick}
        className={`mt-4 mr-3 ${
          isRead ? 'bg-gray-300' : 'bg-sky-600 text-white'
        } py-1 px-3 rounded-md`}
      >
        {isRead ? 'Mark As New' : 'Mark As Read'}
      </Button>

      <Button
        onClick={handleDeleteClick}
        className="mt-4 bg-pink-500 text-white py-1 px-3 rounded-md"
      >
        Delete
      </Button>
    </div>

  );

}




