import React, { useEffect, useState } from 'react';

import Select from '../select';
import { determinePagesToShow, createPage } from './helper';
import { classArray } from 'utils';

import './pagination.scss';

const Pagination = ({
  itemCount = 0,
  handlePageChange = (_pageNumber, _itemsPerPage) => {},
  defaultItemsPerPage = '10',
  className = ''
}) => {
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(Math.ceil(itemCount / itemsPerPage));
  const classes = classArray([
    'd-flex',
    'justify-content-between',
    'noselect',
    className,
  ]);

  // If user changes items or items per page, go back to page 0 to avoid Array Out of Bounds error and redetermine page count
  useEffect(() => {
    setCurrentPage(0);
    setPageCount(Math.ceil(itemCount / itemsPerPage));
  }, [itemsPerPage, itemCount, setPageCount, setCurrentPage]);

  // Execute callback when page changes
  useEffect(() => {
    handlePageChange(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, handlePageChange]);

  const pageDown = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageUp = () => {
    if (currentPage < pageCount - 1) setCurrentPage(currentPage + 1);
  };

  return (
    itemCount > 10 && (
      <div className={classes}>
        <Select
          title='Page Size'
          className='pagination-select pointer'
          defaultOption={defaultItemsPerPage}
          onChange={val => setItemsPerPage(val)}
          options={[
            { value: '10' },
            { value: '20' },
            { value: '50' },
          ]}
        />
        <ul className='pagination pointer'>
          <li className='page-item' onClick={pageDown}>
            <a className='page-link' aria-label={'Go to previous page'}>
              «
            </a>
          </li>

          {/* Always show Page 1 (index 0) */}
          {createPage(currentPage, setCurrentPage, 0)}

          {/* Determine middle pages to show */}
          {determinePagesToShow(pageCount, currentPage, setCurrentPage)}

          {/* Show Last Page if more than 1 page (index pageCount - 1) */}
          {pageCount > 1 && (
            createPage(currentPage, setCurrentPage, pageCount - 1)
          )}

          <li className='page-item' onClick={pageUp}>
            <a className='page-link' aria-label={'Go to next page'}>
              »
            </a>
          </li>
        </ul>
      </div>
    )
  );
};

export default Pagination;