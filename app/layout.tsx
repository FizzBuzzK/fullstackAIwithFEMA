// app/layout.tsx

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import AuthProvider from '@/components/AuthProvider';
import { GlobalProvider } from '@/context/GlobalContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@/assets/styles/globals.css';
import 'photoswipe/dist/photoswipe.css';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


//========================================================
// Metadata: Info about the web page
export const metadata: Metadata = {
  title: 'SafeHaven',
  description: 'Spot Your Best Rental Property',
  keywords: 'rental, property, real estate, ai',
};


/**
 * ========================================================
 * Wraps every page
 * Entry point of the app
 * @param param0 
 * @returns 
 * ========================================================
 */
export default function RootLayout({ children, }: Readonly<{children: React.ReactNode;}>) {

  //========================================================
  return (

    // Wrap Layout with AuthProvider 
    // so that everything within our app has access to the session via useSession()
    <AuthProvider>
      <GlobalProvider>
        <html lang='en'>
          <body>
            <Navbar />
          
            <main>{children}</main>
           
            <Footer />

            <ToastContainer />
          </body>
        </html>
      </GlobalProvider>
    </AuthProvider>
  );

}

