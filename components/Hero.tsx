import PropertySearchForm from './PropertySearchForm';


/**
 * ========================================================
 * Hero section with search bar to display in Home page
 * @returns 
 * ========================================================
 */
export default function Hero() {

  //========================================================
  return (
    
    <section className='bg-gradient-to-b from-slate-100 to-sky-700 py-40'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold text-white sm:text-5xl md:text-6xl'>
            Find The Perfect Rental
          </h1>

          <p className='my-4 text-xl text-white'>
            Discover the perfect property that suits your needs.
          </p>
        </div>

        <PropertySearchForm />
      </div>
    </section>

  );

};


