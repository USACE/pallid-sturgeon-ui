import React from 'react';
import { connect } from 'redux-bundler-react';

import Pagination from 'app-components/pagination/pagination';

import FishTable from '../tables/fishTable';
import MissouriRiverTable from '../tables/missouriRiverTable';
import SupplementalTable from '../tables/supplementalTable';

const selectTable = (tab, data) => {
  const { missouriRiverData = {}, fishData = {}, suppData = {}} = data;
  const tables = {
    missouriRiver: <MissouriRiverTable rowData={missouriRiverData.items} />,
    fish: <FishTable rowData={fishData.items} />,
    supplemental: <SupplementalTable rowData={suppData.items} />,
  };

  return tables[tab];
};

const selectItemCount = (tab, data) => {
  const { missouriRiverData = {}, fishData = {}, suppData = {} } = data;

  const itemCount = {
    missouriRiver: missouriRiverData.totalCount,
    fish: fishData.totalCount,
    supplemental: suppData.totalCount,
  };

  return itemCount[tab];
};

const TableContainer = connect(
  'selectDatasheetItemsObject',
  ({
    datasheetItemsObject,
    tab = '',
  }) => {
    const { data = {} } = datasheetItemsObject;

    return (
      <>
        { selectTable(tab, data) }
        <Pagination
          className='mt-2'
          itemCount={selectItemCount(tab, data)}
          defaultItemsPerPage={20}
        />
      </>
    );
  }
);

export default TableContainer;
