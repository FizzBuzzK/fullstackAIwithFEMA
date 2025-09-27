import { useFormStatus } from 'react-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { Button } from './ui/button';


/**
 * ========================================================
 * @returns 
 * ========================================================
 */
export default function SubmitMessageButton() {

  const { pending } = useFormStatus();

  //========================================================
  return (
    <Button type='submit'
      className='bg-sky-700 hover:bg-sky-800 text-white font-bold 
      py-2 px-4 rounded-full w-full focus:outline-none 
      focus:shadow-outline flex items-center justify-center hover:cursor-pointer'
      disabled={pending}
    >
      <FaPaperPlane className='mr-2' />{' '}
      
      {pending ? 
      'Sending...' : 
      'Send Message'}
    </Button>
  );

};


