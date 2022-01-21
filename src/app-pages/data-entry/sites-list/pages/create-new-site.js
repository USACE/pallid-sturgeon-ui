import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Card from 'app-components/card';
import FilterSelect from 'app-components/filter-select';
import Select from 'app-components/select';

import { createDropdownOptions, createBendsDropdownOptions } from '../../helpers';
import { dropdownYearsToNow } from 'utils';

const CreateNewSite = connect(
  'doPostNewSite',
  'doNewSiteLoadData',
  'selectDomains',
  ({
    doPostNewSite,
    doNewSiteLoadData,
    domains,
  }) => {
    const { projects, seasons, bends, segments, sampleUnitTypes } = domains;

    const [year, setYear] = useState('');
    const [recorder, setRecorder] = useState('');
    const [project, setProject] = useState('');
    const [segment, setSegment] = useState('');
    const [sampleUnitType, setSampleUnitType] = useState('');
    const [season, setSeason] = useState('');
    const [bend, setBend] = useState('');

    useEffect(() => {
      doNewSiteLoadData();
    }, [doNewSiteLoadData]);

    const createNewSite = () => {
      const payload = {
        siteYear: Number(year),
        project,
        segment: String(segment),
        season,
        sampleUnitTypeCode: sampleUnitType,
        bendrn: String(bend),
        editInitials: recorder,
      };

      doPostNewSite(payload);
    };

    return (
      <div className='container-fluid w-75'>
        <Card>
          <Card.Header text='Create New Site' />
          <Card.Body>
            <div className='row'>
              <div className='col-2'>
                <Select
                  label='Year'
                  placeholderText='Select year...'
                  onChange={val => setYear(val)}
                  options={dropdownYearsToNow()}
                />
              </div>
              <div className='col-2'>
                <label><small>Recorder</small></label>
                <input
                  type='text'
                  placeholder='Enter initials...'
                  className='form-control mt-1'
                  onChange={e => setRecorder(e.target.value)}
                  value={recorder}
                />
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-3'>
                <Select
                  label='Project'
                  placeholderText='Select project...'
                  onChange={value => setProject(value)}
                  options={createDropdownOptions(projects)}
                />
              </div>
              <div className='col-3'>
                <Select
                  label='Season'
                  placeholderText='Select season...'
                  onChange={value => setSeason(value)}
                  options={createDropdownOptions(seasons)}
                />
              </div>
              <div className='col-3'>
                <Select
                  label='Sample Unit Type'
                  placeholderText='Select sample unit type...'
                  onChange={value => setSampleUnitType(value)}
                  options={createDropdownOptions(sampleUnitTypes)}
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
                handleClick={() => createNewSite()}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default CreateNewSite;
