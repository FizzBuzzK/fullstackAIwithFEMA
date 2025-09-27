'use client';

import { useEffect } from 'react';
import React, { useActionState } from 'react';

import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import addMessage from '@/app/actions/addMessage';
import SubmitMessageButton from './SubmitMessageButton';

import type { PropertyEntity } from '@/types/property';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Textarea } from './ui/textarea';

type Props = {
  property: PropertyEntity;
};

type MessageFormState = {
  error?: string;
  submitted?: boolean;
};

const initialState: MessageFormState = {
  error: undefined,
  submitted: false,
};


/**
 * ====================================================
 * @param param0 
 * @returns 
 * ====================================================
 */
export default function PropertyContactForm({ property }: Props) {

  const { data: session } = useSession();

  // Tell TS that addMessage has the (state, formData) signature the hook expects
  const [state, formAction] = useActionState<MessageFormState, FormData>(
    addMessage as unknown as (
      prevState: MessageFormState,
      formData: FormData
    ) => Promise<MessageFormState>,

    initialState
  );


  useEffect(() => {
    if (state?.error) toast.error(state.error);
    if (state?.submitted) toast.success('Message sent successfully');
  }, [state]);


  if (state?.submitted) {
    return (
      <p className="text-teal-700 text-xl font-bold mb-4">
        Your message has been sent successfully
      </p>
    );
  }


  //====================================================
  return (
    
    session && (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-6">Contact Property Manager</h3>

        <form action={formAction}>
          <Input type="hidden" id="property" name="property" defaultValue={property._id} />
          <Input type="hidden" id="recipient" name="recipient" defaultValue={property.owner} />

          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name:
            </Label>

            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
            />
          </div>


          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email:
            </Label>

            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone:
            </Label>

            <Input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter your phone number"
            />
          </div>


          <div className="mb-4">
            <Label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message:
            </Label>

            <Textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
              id="message"
              name="message"
              placeholder="Enter your message"
            ></Textarea>
          </div>

          <div>
            <SubmitMessageButton />
          </div>

        </form>

      </div>
    )

  );

}










