import Link from 'next/link';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
}


/**
 * ========================================================
 * Pagination Component
 * ========================================================
 */
export default function Pagination({ page, pageSize, totalItems }: PaginationProps) {

  const totalPages = Math.ceil(totalItems / pageSize);

  //==========================================================
  return (
    <section className="container mx-auto flex justify-center items-center my-8">
      {page > 1 ? 
      (
        <Link
          className="bg-slate-50 mr-2 px-2 py-1 text-lg border border-gray-300 rounded"
          href={`/properties?page=${page - 1}`}
        >
          Previous
        </Link>
      ) : 
      null}


      <span className="text-lg mx-2">
        Page {page} of {totalPages}
      </span>


      {page < totalPages ? 
      (
        <Link
          className="bg-slate-50 ml-2 px-2 py-1 text-lg border border-gray-300 rounded"
          href={`/properties?page=${page + 1}`}
        >
          Next
        </Link>
      ) : 
      null}

    </section>

  );
  
}





