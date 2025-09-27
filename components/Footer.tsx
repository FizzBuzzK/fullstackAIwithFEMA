import Link from 'next/link';

/**
 * ========================================================
 * Footer displayed on all pages via the root layout
 * @returns 
 * ========================================================
 */
export default function Footer() {

  const currentYear = new Date().getFullYear();

  //========================================================
  return (
    <footer className='bg-gradient-to-b from-slate-50 to-slate-400 py-5'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between px-4'>
        
        {/* Text links */}
        <div className='flex flex-wrap justify-center md:justify-start mb-4 md:mb-0'>
          <ul className='flex space-x-4'>
            <li>
              <Link href='/properties'>Properties</Link>
            </li>
            
            <li>
              Terms of Service
            </li>
          </ul>
        </div>
        
        {/* Copyright */}
        <div>
          <p className='text-sm text-gray-500 mt-2 md:mt-0'>
            &copy; {currentYear} SafeHaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );

};


