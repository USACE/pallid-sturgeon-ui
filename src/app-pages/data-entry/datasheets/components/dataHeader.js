import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';
import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const DataHeader = connect(
  'doFetchHeaderData',
  'selectHeaderData',
  ({
    doFetchHeaderData,
    headerData,
    id,
  }) => {
    useEffect(() => {
      doFetchHeaderData({siteId: id});
    }, [id]);

    return (
      <Card className='mb-3'>
        <Card.Body>
          <Row className='border-bottom'>
            <div className='col-2'>
              <b className='mr-2'>Site ID:</b>
              {id || '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>Year:</b>
              {headerData[0] ? headerData[0].year : '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>Field Office:</b>
              {headerData[0] ? headerData[0].fieldoffice : '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>Project:</b>
              {headerData[0] ? headerData[0].project : '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>Segment:</b>
              {headerData[0] ? headerData[0].segment : '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>Season:</b>
              {headerData[0] ? headerData[0].season : '--'}
            </div>
          </Row>
          <Row>
            <div className='col-2'>
              <b className='mr-2'>Sample Unit Type:</b>
              {headerData[0] ? headerData[0].sampleUnitType : '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>Sample Unit:</b>
              {headerData[0] ? headerData[0].bend : '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>R/N:</b>
              {headerData[0] ? headerData[0].bendrn : '--'}
            </div>
            <div className='col-2'>
              <b className='mr-2'>Bend River Mile:</b>
              {headerData[0] ? headerData[0].bendrivermile : '--'}
            </div>
          </Row>
        </Card.Body>
      </Card>
    );
  });

export default DataHeader;