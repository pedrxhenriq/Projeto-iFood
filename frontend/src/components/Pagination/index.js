import React from 'react';
import './index.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <FaChevronLeft />
      </button>
      <span>
        {page} de {totalPages}
      </span>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;