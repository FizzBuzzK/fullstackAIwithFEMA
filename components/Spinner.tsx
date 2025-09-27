// components/Spinner.tsx

'use client';

import ClipLoader from 'react-spinners/ClipLoader';

//========================================================
const override = {
  display: 'block',
  margin: '100px auto',
};


type SpinnerProps = {
  loading: boolean;
};


/**
 * ========================================================
 * @param param0 
 * @returns 
 * ========================================================
 */
export default function Spinner({ loading } : SpinnerProps) {

  //========================================================
  return (
    <ClipLoader
      color='#3b82f6'
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label='Loading Spinner'
    />
  );
};



