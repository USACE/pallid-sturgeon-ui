import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { useEffect, useState } from 'react';

const DSSearchReportTable = ({ rowData }) => {
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setIsDarkMode(event.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <>
      <div
        className={isDarkMode ? 'ag-theme-balham-dark' : 'ag-theme-balham'}
        style={{ width: '100%', height: '600px' }}
      >
        <AgGridReact rowData={rowData}>
          {/* <AgGridColumn field='link' sortable unSortIcon /> */}
          <AgGridColumn field='seId' sortable unSortIcon />
          <AgGridColumn field='searchDate' sortable unSortIcon />
          <AgGridColumn field='recorder' sortable unSortIcon />
          <AgGridColumn field='searchTypeCode' sortable unSortIcon />
          <AgGridColumn field='startTime' sortable unSortIcon />
          <AgGridColumn field='startLatitude' sortable unSortIcon />
          <AgGridColumn field='startLongitude' sortable unSortIcon />
          <AgGridColumn field='stopTime' sortable unSortIcon />
          <AgGridColumn field='stopLatitude' sortable unSortIcon />
          <AgGridColumn field='stopLongitude' sortable unSortIcon />
          <AgGridColumn field='seFid' sortable unSortIcon />
          <AgGridColumn field='dsId' sortable unSortIcon />
          <AgGridColumn field='siteFid' sortable unSortIcon />
          <AgGridColumn field='temp' sortable unSortIcon />
          <AgGridColumn field='conductivity' sortable unSortIcon />
        </AgGridReact>
      </div>
    </>
  );
};

export default DSSearchReportTable;
