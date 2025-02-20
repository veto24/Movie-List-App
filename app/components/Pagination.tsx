import React from "react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const getPageNumbers = () => {
    const pages = [];
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-20 space-x-2">
      <Link href={`/?page=${Math.max(currentPage - 1, 1)}`}>
        <button
          className={`text-gray-300 hover:text-white font-bold ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={currentPage === 1}
        >
          Prev
        </button>
      </Link>
      {getPageNumbers().map((page) => (
        <Link key={page} href={`/?page=${page}`}>
          <button
            className={`px-3 py-1 rounded-md font-bold ${
              page === currentPage
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {page}
          </button>
        </Link>
      ))}
      <Link href={`/?page=${Math.min(currentPage + 1, totalPages)}`}>
        <button
          className={`text-gray-300 hover:text-white font-bold ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </Link>
    </div>
  );
};

export default Pagination;
