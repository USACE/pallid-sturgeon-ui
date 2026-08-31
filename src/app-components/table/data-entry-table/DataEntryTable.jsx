import React, { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Icon from '@components/icon/icon';
import { mdiArrowUp, mdiArrowDown } from '@mdi/js';
import { Label, Select, Table, Pagination, Checkbox } from '@trussworks/react-uswds';

import Tooltip from '@src/app-components/tooltip/Tooltip';
import HeaderCell from '../table-cell-components/header-cell/HeaderCell';
import EmptyTableRow from '../EmptyTableRow';

import './dataEntryTable.scss';

const pageBreakdown = [10, 20, 30, 50];

const DataEntryTable = ({
  data,
  columns,
  validationSchema,
  isCellRequired,
  initialTableState,
  updateSourceData,
  addRow,
  removeMultipleRows,
  addMultipleRows,
  rowErrorCallback,
  hideDrag = true,
  tableVersion,
  isFullWidth = false,
  placeholderText,
  placeholderClick,
  ignoredHeaders,
  showValidationErrors = true,
  enablePagination = true,
  showAddRowButton = true,
}) => {
  const [rowErrors, setRowErrors] = useState();

  useEffect(() => {
    const hasErrors = (rowErrors && Object?.keys(rowErrors)?.length > 0) ?? false;
    rowErrorCallback(() => hasErrors);
  }, [rowErrorCallback, rowErrors]);

  const debounce = useCallback((func, wait) => {
    let timeout;

    const executedFunction = function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };

    executedFunction.cancel = function () {
      clearTimeout(timeout);
    };

    return executedFunction;
  }, []);

  const debouncedValidation = useCallback(
    () =>
      debounce((rows) => {
        rows.forEach(({ rowIndex, updatedRowData }) => {
          validationSchema
            .validate(updatedRowData, { abortEarly: false })
            .then(() => {
              setRowErrors((currentErrors) => {
                const newErrors = { ...currentErrors };
                delete newErrors[rowIndex];
                return newErrors;
              });
            })
            .catch((err) => {
              if (err.inner && Array.isArray(err.inner)) {
                const newRowErrors = err.inner.reduce((acc, currError) => {
                  acc[currError.path] = currError.message;
                  return acc;
                }, {});

                setRowErrors((currentErrors) => ({
                  ...currentErrors,
                  [rowIndex]: newRowErrors,
                }));
              } else {
                console.error('Validation error:', err.message);
              }
            });
        });
      }, 500),
    [validationSchema, debounce]
  );

  useEffect(() => {
    if (data) {
      const rowsToValidate = data.map((feature, index) => ({
        rowIndex: index,
        updatedRowData: feature,
      }));
      const validateRows = debouncedValidation();
      validateRows(rowsToValidate);
    }
  }, [data, debouncedValidation]);

  const [sorting, setSorting] = useState([]);
  const [editedRows, setEditedRows] = useState({});

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    ...(enablePagination ? { manualPagination: false, autoResetPageIndex: false } : {}),
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    initialState: {
      ...initialTableState,
      ...(enablePagination
        ? {
            pagination: {
              pageIndex: 0,
              pageSize: 10,
            },
          }
        : {}),
      sorting,
    },
    meta: {
      tableVersion,
      editedRows,
      setEditedRows,
      updateData: (rowIndex, columnId, value) => {
        updateSourceData(rowIndex, columnId, value);
        const updatedRowData = { ...data[rowIndex], [columnId]: value };
        debouncedValidation([{ rowIndex, updatedRowData }]);
      },
      addRow: () => {
        addRow();
      },
      addRowsFromFile: (newRows) => {
        addMultipleRows(newRows);
      },
      removeSelectedRows: (selectedRows) => {
        const confirmed = confirm(
          `Are you sure you want to delete ${selectedRows?.length} rows? This action is permanent and cannot be undone!`
        );
        confirmed && removeMultipleRows(selectedRows);
        confirmed && table.resetRowSelection();
      },
    },
  });
  return (
    <div className={showValidationErrors ? 'show-validation-errors' : ''}>
      <div
        style={{ minWidth: '600px', maxWidth: `${table.getTotalSize() > 1500 ? 'auto' : table.getTotalSize() + 'px'}` }}
      >
        <HeaderCell
          table={table}
          hideDrag={hideDrag}
          ignoredHeaders={ignoredHeaders}
          showAddRowButton={showAddRowButton}
        />
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div
          className={`pn-table-container ${isFullWidth && 'width-full'}`}
          style={{ width: !isFullWidth && table.getTotalSize() }}
        >
          <Table bordered fullWidth={isFullWidth}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <React.Fragment key={headerGroup.id}>
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          position: 'relative',
                          width: header.getSize() + 'px',
                          cursor: 'col-resize',
                          userSelect: header.column.getIsResizing() ? 'none' : 'auto',
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              style={{
                                cursor: header.column.getIsResizing() ? 'col-resize' : 'auto',
                                position: 'relative',
                              }}
                            >
                              {/* Render "Select All" toggle for selection column */}
                              {header.id === 'edit' ? (
                                <div
                                  style={{
                                    paddingBottom: '30px',
                                    paddingLeft: '8px',
                                    backgroundColor: '#eeeeee',
                                    width: header.getSize() + 'px',
                                  }}
                                >
                                  <Checkbox
                                    className='box-shadow-1px'
                                    name='edit'
                                    title='Select All Rows'
                                    label=''
                                    id={`${uuidv4()}_edit`}
                                    checked={table.getIsAllRowsSelected()}
                                    onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
                                  />
                                </div>
                              ) : (
                                flexRender(header.column.columnDef.header, header.getContext())
                              )}

                              {/* Tooltip and other meta elements */}
                              {header.column.columnDef.meta?.tooltip && (
                                <Tooltip
                                  header={header.column.columnDef.header}
                                  content={header.column.columnDef.meta?.tooltip}
                                />
                              )}
                              {header.column.columnDef.meta?.required && <span className='red-asterisk'>*</span>}

                              {/* Sorting Icons */}
                              {
                                {
                                  asc: <Icon path={mdiArrowUp} size={'16px'} />,
                                  desc: <Icon path={mdiArrowDown} size={'16px'} />,
                                }[header.column.getIsSorted() ?? null]
                              }
                            </div>

                            {/* Add resizer element */}
                            <div
                              className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              style={{ padding: '0 5px', cursor: 'col-resize' }}
                            />
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </thead>
            <tbody style={{ width: table.getTotalSize() }}>
              {table.getRowModel()?.rows?.length === 0 && (
                <EmptyTableRow onAddClick={placeholderClick} placeholderText={placeholderText} />
              )}
              {table.getRowModel()?.rows?.map((row) => (
                <tr
                  key={row.id}
                  className={[
                    row.getIsSelected() ? 'selected-row' : '',
                    showValidationErrors &&
                    rowErrors &&
                    rowErrors?.[row.id] &&
                    Object.keys(rowErrors[row.id])?.length !== 0
                      ? 'row-error'
                      : '',
                    row.original?._syncRecoveryError ? 'sync-recovery-row' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellError = rowErrors?.[row.id]?.[cell.column.id];
                    const isCellError = showValidationErrors && cellError !== undefined;
                    const cellClasses = isCellError ? 'cell-error' : '';
                    const showRequiredAsterisk =
                      typeof isCellRequired === 'function' && isCellRequired(row.original, cell.column.id, row.index);
                    return (
                      <td className={cellClasses} key={cell.id} style={{ width: cell.column.getSize() + 'px' }}>
                        <div className='d-flex align-items-center'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {showRequiredAsterisk && (
                            <span aria-hidden='true' className='cell-required-asterisk'>
                              *
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {enablePagination && table.getCoreRowModel().rows.length >= 11 && (
        <div className='pn-table-container'>
          <div className='pagination-container'>
            <div className='d-flex justify-content-center usa-prose'>
              <div className='d-flex flex-align-center'>
                <Pagination
                  className='margin-right-3 pagination-styles'
                  currentPage={table.getState().pagination.pageIndex + 1}
                  maxSlots={7}
                  totalPages={table.getPageCount()}
                  onClickNext={() => table.nextPage()}
                  onClickPageNumber={(e) => table.setPageIndex(Number(e.target.innerText) - 1)}
                  onClickPrevious={() => table.previousPage()}
                  pathname=''
                />

                <span
                  className='d-flex flex-align-center margin-right-3 rows-per-page'
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Label htmlFor='rows_per_page' className='margin-right-1'>
                    rows per page:
                  </Label>
                  <div className='footer-select-container'>
                    <Select
                      name='rows_per_page'
                      id='rows_per_page'
                      defaultValue={10}
                      onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                      {pageBreakdown.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  </div>
                </span>

                <span className='d-flex flex-align-center'>
                  {`${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()} page${table.getPageCount() !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataEntryTable;
