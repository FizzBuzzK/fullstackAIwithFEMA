'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import Image from 'next/image';
import logo from '@/assets/images/logo-white.png';
import profileDefault from '@/assets/images/profile.png';
import { usePathname } from 'next/navigation';
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  type ClientSafeProvider,
} from 'next-auth/react';
import UnreadMessageCount from '@/components/UnreadMessageCount';
import { Button } from '@/components/ui/button';

import { SquareMenu } from 'lucide-react';
import { Mails } from 'lucide-react';


/**
 * ==========================================================
 * @returns 
 * ==========================================================
 */
export default function Navbar() {

  const { data: session } = useSession();
  const profileImage = session?.user?.image ?? null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  const pathname = usePathname();


  useEffect(() => {

    const setAuthProviders = async () => {
      const res = await getProviders(); // Record<string, ClientSafeProvider> | null
      setProviders(res);
    };

    setAuthProviders();

    const onResize = () => setIsMobileMenuOpen(false);
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);

  }, []);


  //==========================================================
  return (

    <nav className="bg-gradient-to-t from-slate-50 to-slate-400">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">

          {/* Mobile menu icon */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <button
              type="button"
              id="mobile-dropdown-button"
              className="relative inline-flex items-center justify-center rounded-md p-1 font-bold text-indigo-500 hover:bg-indigo-600 hover:text-slate-100 hover:cursor-pointer focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              
              <SquareMenu />
            </button>
          </div>


          {/* Desktop menu buttons */}
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link className="flex flex-shrink-0 items-center" href="/">
              <Image className="h-10 w-auto" src={logo} alt="safehaven" />
              <span className="hidden md:block text-stone-700 text-2xl font-bold ml-2">SafeHaven</span>
            </Link>

            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-2">
                <Link
                  href="/"
                  className={`${pathname === '/' ? 'bg-black text-white/80' : ''} font-bold text-stone-600 hover:bg-black hover:text-white/80 rounded-md px-3 py-2`}
                >
                  Home
                </Link>

                <Link
                  href="/properties"
                  className={`${pathname === '/properties' ? 'bg-black text-white/80' : ''} font-bold text-stone-600 hover:bg-black hover:text-white/80 rounded-md px-3 py-2`}
                >
                  Properties
                </Link>

                <Link
                  href="/analysis"
                  className={`${pathname === '/analysis' ? 'bg-black text-white/80' : ''} font-bold text-stone-600 hover:bg-black hover:text-white/80 rounded-md px-3 py-2`}
                >
                  FEMA+
                </Link>

                {session && (
                  <Link
                    href="/properties/add"
                    className={`${pathname === '/properties/add' ? 'bg-black text-white/80' : ''} font-bold text-stone-600 hover:bg-black hover:text-white/80 rounded-md px-3 py-2`}
                  >
                    Add
                  </Link>
                )}
              </div>
            </div>
          </div>


          {/* Logged out: Login */}
          {!session && (
            <div className="hidden md:block md:ml-6">
              <div className="flex items-center">
                {providers &&
                  Object.values(providers).map((provider: ClientSafeProvider) => (
                    <Button
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                      className="flex items-center text-white bg-stone-600 hover:bg-stone-800 hover:text-white hover:cursor-pointer rounded-md px-3 py-2 my-3 "
                    >
                      <FaGoogle className="text-white mr-2" />
                      <span>Signin / Signup</span>
                    </Button>
                  ))}
              </div>
            </div>
          )}


          {/* Logged in buttons */}
          {session && (
            <div className="m-4 p-4 absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">

              <Link href="/messages" className="relative group">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white hover:cursor-pointer"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>

                  <Mails />
                </button>

                <UnreadMessageCount />
              </Link>

              {/* Profile dropdown */}
              <div className="relative ml-4">
                <div>
                  <Button
                    type="button"
                    className="relative flex h-auto w-auto p-0 rounded-full bg-gray-800 hover:cursor-pointer"
                    id="user-menu-button"
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  >
                    <Image
                      src={profileImage || profileDefault}
                      alt=""
                      className="h-8 w-8 rounded-full"
                      width={40}
                      height={40}
                    />
                  </Button>
                </div>


                {isProfileMenuOpen && (
                  <div
                    id="user-menu"
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg hover:cursor-pointer"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-2 text-sm text-gray-700 text-center"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>

                    <Link
                      href="/properties/saved"
                      className="block w-full px-4 py-2 text-sm text-gray-700 text-center"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Saved Properties
                    </Link>

                    <Button
                      type="button"
                      onClick={() => { setIsProfileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                      variant="ghost"
                      size="sm"
                      className="block w-full h-auto px-4 py-2 text-sm font-normal text-gray-700 justify-center hover:bg-gray-100 hover:cursor-pointer"
                      role="menuitem"
                      tabIndex={-1}
                    >
                      Sign Out
                    </Button>
                    
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`${pathname === '/' ? 'bg-black' : ''} text-indigo-500 hover:bg-black block rounded-md px-3 py-2 text-base font-medium`}
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              Home
            </Link>

            <Link
              href="/properties"
              className={`${pathname === '/properties' ? 'bg-black' : ''} text-indigo-500 hover:bg-black block rounded-md px-3 py-2 text-base font-medium`}
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              Properties
            </Link>


            <Link
              href="/analysis"
              className={`${pathname === '/analysis' ? 'bg-black' : ''} text-indigo-500 hover:bg-black block rounded-md px-3 py-2 text-base font-medium`}
              onClick={() => {
                setIsMobileMenuOpen(false);
              }}
            >
              FEMA+
            </Link>


            {session && (
              <Link
                href="/properties/add"
                className={`${pathname === '/properties/add' ? 'bg-black' : ''} text-indigo-500 hover:bg-black block rounded-md px-3 py-2 text-base font-medium`}
                onClick={() => {
                setIsMobileMenuOpen(false);
              }}
              >
                Add
              </Link>
            )}


            {!session && (
              <div className="block md:ml-6">
                <div className="flex items-center">
                  {providers &&
                    Object.values(providers).map((provider: ClientSafeProvider) => (
                      <button
                        key={provider.name}
                        onClick={() => {
                          setIsMobileMenuOpen(false) 
                          signIn(provider.id) 
                        }}
                        className="flex items-center text-white bg-gray-700 hover:bg-black hover:text-indigo-500 hover:cursor-pointer rounded-md px-3 py-2 my-3"
                      >
                        <FaGoogle className="text-white mr-2" />
                        <span>Signin / Signup</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </nav>

  );
  
}






