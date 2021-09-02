import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import FilterSelect from 'app-components/filter-select';
import Select from 'app-components/select';

import { createDropdownOptions, createBendsDropdownOptions } from '../../helpers';
import { dropdownYearsToNow } from 'utils';

const CreateNewSite = connect(
  'doDataEntryLoadData',
  'selectDatasheetItemsObject',
  ({
    doDataEntryLoadData,
    datasheetItemsObject,
  }) => {
    const { projects = [], seasons = [], bends = [], segments = [] } = datasheetItemsObject;

    const [year, setYear] = useState('');
    const [fieldOffice, setFieldOffice] = useState('');
    const [recorder, setRecorder] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [project, setProject] = useState('');
    const [segment, setSegment] = useState('');
    const [sampleUnitType, setSampleUnitType] = useState('');
    const [season, setSeason] = useState('');
    const [bend, setBend] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
      doDataEntryLoadData();
    }, [doDataEntryLoadData]);

    return (
      <div className='container-fluid'>
        <Card>
          <Card.Header text='Create New Site' />
          <Card.Body>
            <div className='row'>
              <div className='col-3'>
                <Select
                  label='Year'
                  placeholder='Select year...'
                  onChange={val => setYear(val)}
                  options={dropdownYearsToNow()}
                />
              </div>
              <div className='col-3'>
                <Select
                  label='Field Office'
                  placeholder='Select field office...'
                  onChange={val => setFieldOffice(val)}
                  options={createDropdownOptions([])}
                />
              </div>
              <div className='col-3'>
                <label><small>Recorder</small></label>
                <input
                  type='text'
                  placeholder='Enter initials...'
                  className='form-control mt-1'
                  onChange={e => setRecorder(e.target.value)}
                  value={recorder}
                />
              </div>
              <div className='col-3'>
                <label><small>Complete?</small></label>
                <input
                  type='checkbox'
                  className='form-control mt-2'
                  style={{ height: '18px', width: '18px' }}
                  onChange={e => setIsComplete(e.target.value)}
                />
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-4'>
                <Select
                  label='Project'
                  placeholderText='Select project...'
                  onChange={value => setProject(value)}
                  options={createDropdownOptions(projects)}
                />
              </div>
              <div className='col-4'>
                <Select
                  label='Season'
                  placeholderText='Select season...'
                  onChange={value => setSeason(value)}
                  options={createDropdownOptions(seasons)}
                />
              </div>
              <div className='col-4'>
                <Select
                  label='Sample Unit Type'
                  placeholderText='Select sample unit type...'
                  onChange={value => setSampleUnitType(value)}
                  options={createDropdownOptions([])}
                />
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-6'>
                <FilterSelect
                  label='Segment'
                  placeholder='Select segment...'
                  onChange={(_, __, value) => setSegment(value)}
                  items={createDropdownOptions(segments)}
                />
              </div>
              <div className='col-6'>
                <FilterSelect
                  label='Bend R/N'
                  placeholder='Select bend r/n...'
                  onChange={(_, __, value) => setBend(value)}
                  items={createBendsDropdownOptions(bends)}
                />
              </div>
            </div>
            <hr />
            <div className='row mt-3'>
              <div className='col-12'>
                <label><small>Comments</small></label>
                <textarea
                  rows={3}
                  placeholder='Enter comments...'
                  className='form-control mt-1'
                  onChange={e => setComments(e.target.value)}
                  value={comments}
                />
              </div>
            </div>
            <hr />
            <div className='d-flex justify-content-end'>
              <Button
                variant='secondary'
                text='Cancel'
                href='/sites-list'
              />
              <Button
                className='ml-2'
                variant='success'
                text='Create'
                handleClick={() => alert('create site!')}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default CreateNewSite;
