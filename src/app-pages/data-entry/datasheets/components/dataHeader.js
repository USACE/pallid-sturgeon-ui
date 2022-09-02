import React from 'react';
import Card from 'app-components/card';
import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

const DataHeader = ({
  type,
  id,
  fid,
  year,
  fieldOffice,
  project,
  segment,
  season,
  sampleUnitType,
  sampleUnit,
  bendrn,
  bendRiverMile,
}) => (
  <Card className='mb-3'>
    <Card.Body>
      <Row className='border-bottom'>
        <div className='col-2'>
          <b className='mr-2'>{type} ID:</b>
          {id || '--'}
        </div>
        {fid && (
          <div className='col-2'>
            <b className='mr-2'>Field ID:</b>
            {fid || '--'}
          </div>
        )}
        <div className='col-2'>
          <b className='mr-2'>Year:</b>
          {year || '--'}
        </div>
        <div className='col-2'>
          <b className='mr-2'>Field Office:</b>
          {fieldOffice || '--'}
        </div>
        <div className='col-2'>
          <b className='mr-2'>Project:</b>
          {project || '--'}
        </div>
        <div className='col-2'>
          <b className='mr-2'>Segment:</b>
          {segment || '--'}
        </div>
        <div className='col-2'>
          <b className='mr-2'>Season:</b>
          {season || '--'}
        </div>
      </Row>
      <Row>
        <div className='col-2'>
          <b className='mr-2'>Sample Unit Type:</b>
          {sampleUnitType || '--'}
        </div>
        <div className='col-2'>
          <b className='mr-2'>Sample Unit:</b>
          {sampleUnit || '--'}
        </div>
        <div className='col-2'>
          <b className='mr-2'>R/N:</b>
          {bendrn || '--'}
        </div>
        <div className='col-2'>
          <b className='mr-2'>Bend River Mile:</b>
          {bendRiverMile || '--'}
        </div>
      </Row>
    </Card.Body>
  </Card>
);

export default DataHeader;