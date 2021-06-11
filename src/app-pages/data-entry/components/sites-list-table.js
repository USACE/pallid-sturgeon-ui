import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Icon from '../../../app-components/icon';
import Button from '../../../app-components/button';
import Select from '../../../app-components/select';
import MultiSelect from '../../../app-components/multi-select/multi-select';
import Pagination, { handlePageChange } from '../../../app-components/pagination';

import '../dataentry.scss';

const titlize = str => str ? str.charAt(0).toUpperCase() + str.slice(1) : 'N/A';

const Table = connect(
  'doModalOpen',
  ({
    doModalOpen,
    sitesList,
  }) => {
    const seasonOptions = [...new Set(sitesList.map(site => titlize(site.season)))].map(season => ({ value: season }));
    const initialSeasonOptions = seasonOptions.map(o => o.value);
    const [seasonFilter, setSeasonFilter] = useState(initialSeasonOptions);
    const [upperLimit, setUpperLimit] = useState(10);
    const [lowerLimit, setLowerLimit] = useState(0);
    const [filteredSitesList, setFilteredSitesList] = useState(sitesList);

    // If a filter changes, filter the current sitesList based on user selection
    useEffect(() => {
      const filtered = sitesList.filter(site => (
        seasonFilter.includes(site.season) 
      ));

      setFilteredSitesList(filtered);
    }, [seasonFilter, sitesList, setFilteredSitesList]);

    // If new sitesList are added, update the filteredSitesList to include them
    useEffect(() => {
      setFilteredSitesList(sitesList);
    }, [sitesList, setFilteredSitesList]);

    
    const csvTitle = 'Field Office, Project, Segment, Season, Sample Unit, Sample Unit Type, Bend R/N, Bend River Mile\n';

    const handleClick = (e) => {
      var csv = csvTitle;
      filteredSitesList.forEach((row) => {
        csv += row.fieldOffice + ', ' + row.project + ', ' + row.segment + ', ' + row.season + ', ' + row.sampleUnit + ', ' + row.sampleUnitType + ', ' + row.bendRN + ', ' + row.bendRiverMile + '\n ' ;
      });
      const blob = new Blob([csv], { type: 'application/text' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'sample.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    return (
      <>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label><small>Select Project</small></label>
              <div className='select'>
                <Select
                  onChange={value => doChartUpdateType(value)}
                  placeholderText='Project'
                  data-size='3'
                  options={[
                    { value: '2021', text: '2021' },
                    { value: '2020', text: '2020' },
                    { value: '2019', text: '2019' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className='col-md-3 pl-0'>
            <div className='form-group'>
              <label><small>Select Segment</small></label>
              <div className='select'>
                <Select
                  onChange={value => doChartUpdateType(value)}
                  placeholderText='Segment'
                  data-size='3'
                  options={[
                    { value: '2021', text: '2021' },
                    { value: '2020', text: '2020' },
                    { value: '2019', text: '2019' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-3'>
            <div className='form-group'>
              <label><small>Select Season</small></label>
              <div className='select'>
                <Select
                  onChange={value => doChartUpdateType(value)}
                  placeholderText='Season'
                  data-size='3'
                  options={[
                    { value: '2021', text: '2021' },
                    { value: '2020', text: '2020' },
                    { value: '2019', text: '2019' },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className='col-md-3 pl-0'>
            <div className='form-group'>
              <label><small>Select Bend</small></label>
              <div className='select'>
                <Select
                  onChange={value => doChartUpdateType(value)}
                  placeholderText='Bend'
                  data-size='3'
                  options={[
                    { value: '2021', text: '2021' },
                    { value: '2020', text: '2020' },
                    { value: '2019', text: '2019' },
                  ]}
                />
              </div>
            </div>
          </div>
          
          <div className='col-md-2 align-self-end pl-1'>
            <div className='form-group'>
              <Button
                size='small'
                variant='light'
                isOutline
                text='Clear Filter'
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6 pl-3'>
            <div className='block_container'>
              <div className='info-message'><Icon icon='help-circle' /></div>
              <div className='info-message'>Please make selections from the pull-down lists to go to the Missouri River data sheets 
              Associated with your selection.
              </div>
            </div>
          </div>
        </div>
        <div className='pt-3'>
          <Button
            variant='info'
            size='small'
            isOutline
            icon={<Icon icon='download' />}
            text='Export To CSV'
            handleClick={handleClick}
          />
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th>Edit</th>
                <th>Field Office</th>
                <th>Project</th>
                <th>Segment</th>
                <th style={{ width: '10%' }}>Season
                  {seasonOptions.length > 1 && (
                    <MultiSelect
                      withSelectAllOption
                      buttonSize='small'
                      className='d-inline p-0'
                      options={seasonOptions}
                      text={<span><Icon icon='filter'/></span>}
                      initialValues={initialSeasonOptions}
                      onChange={val => setSeasonFilter(val)}
                    />
                  )}
                </th>
                <th>Sample Unit</th>
                <th>Sample Unit Type</th>
                <th>Bend R/N</th>
                <th>Bend River Mile</th>
              </tr>
            </thead>
            <tbody>
              {filteredSitesList.map((site, i) => {
                if (i >= lowerLimit && i < upperLimit) {
                  return (
                    <tr key={site.id}>
                      <td><Button
                        className={`icon-button ${site.id} small-btn`}
                        title='Edit'
                        icon={<Icon icon='pencil' className={`button-icon ${site.id} mr-2`}/>}
                      /></td>
                      <td>{site.fieldOffice}</td>
                      <td>{site.project}</td>
                      <td>{site.segment}</td>
                      <td >{site.season}</td>
                      <td className='text-center' style={{ width: '10%' }}>{site.sampleUnit}</td>
                      <td className='text-center' style={{ width: '12%' }}>{site.sampleUnitType}</td>
                      <td className='text-center' style={{ width: '10%' }}>{site.bendRN}</td>
                      <td className='text-center' style={{ width: '12%' }}>{site.bendRiverMile}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
          <Pagination
            itemCount={lowerLimit.length}
            handlePageChange={(newPage, pageSize) => handlePageChange({ newPage, pageSize, setUpperLimit, setLowerLimit })}
          />
        </div>
      </>
    );
  }
);

export default Table;
