import { useEffect, useReducer, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '@components/button';
import Card from '@components/card';
import DataHeader from '@pages/data-entry/datasheets/components/dataHeader';
import Approval from '@pages/data-entry/datasheets/components/approval';
import TabContainer from '@components/tab';
import FishDsTable from '@pages/data-entry/datasheets/tables/fishDsTable';
import SuppDsTable from '@pages/data-entry/datasheets/tables/suppDsTable';
import ProcedureDsTable from '@pages/data-entry/datasheets/tables/procedureDsTable';
import Breadcrumb from '@src/app-components/breadcrumb';

import {
  gearCodeOptions,
  macroOptions,
  microStructureOptions,
  setSite_3Options,
  u7Options,
} from './_shared/selectHelper';
import { createMesoOptions, createStructureFlowOptions, createStructureModOptions } from '@pages/data-entry/helpers';
import { Input, Row, SelectCustomLabel, TextArea } from './_shared/helper';
import { formatDate } from '@src/utils/helpers';

import '../../../data-summaries/data-summary.scss';
import MissouriRiverDataEntryForm from './missouri-river/MissouriRiverDataEntryForm';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'INITIALIZE_FORM':
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

const MissouriRiverForm = connect(
  'doUpdateBaseData',
  'doSaveMoRiverDataEntry',
  'doUpdateMoRiverDataEntry',
  'doUpdateCurrentTab',
  'doDomainsMesoFetch',
  'doDomainsStructureFlowFetch',
  'doDomainsStructureModFetch',
  'doDomainsSetSite1Fetch',
  'doDomainsSetSite2Fetch',
  'doResetMoRiverDataEntryData',
  'selectDataEntryData',
  'selectDomainsMeso',
  'selectDomainsStructureFlow',
  'selectDomainsStructureMod',
  'selectDomainsSetSite1',
  'selectDomainsSetSite2',
  'selectDataEntryFishTotalCount',
  'selectDataEntrySupplementalTotalCount',
  'selectDataEntryProcedureTotalCount',
  'selectCurrentTab',
  'selectRouteParams',
  'selectIsEditForm',
  ({
    doUpdateBaseData,
    doSaveMoRiverDataEntry,
    doUpdateMoRiverDataEntry,
    doUpdateCurrentTab,
    doDomainsMesoFetch,
    doDomainsStructureFlowFetch,
    doDomainsStructureModFetch,
    doDomainsSetSite1Fetch,
    doDomainsSetSite2Fetch,
    doResetMoRiverDataEntryData,
    dataEntryData,
    domainsMeso,
    domainsStructureFlow,
    domainsStructureMod,
    domainsSetSite1,
    domainsSetSite2,
    dataEntryFishTotalCount,
    dataEntrySupplementalTotalCount,
    dataEntryProcedureTotalCount,
    currentTab,
    routeParams,
    isEditForm,
  }) => {
    const initialState = {
      noTurbidity: 'N',
      noVelocity: 'N',
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    const [isAddSuppRow, setIsAddSuppRow] = useState(false);
    const [suppRowId, setSuppRowId] = useState(null);

    const [isAddProcRow, setIsAddProcRow] = useState(false);
    const [procRowId, setProcRowId] = useState(null);

    // const [isNoTurbidity, setIsNoTurbidity] = useState(false);
    // const [isNoVelocity, setIsNoVelocity] = useState(false);

    const siteId = routeParams?.siteId;
    const mrId = routeParams.mrId;
    // const formComplete = true;

    const breadcrumbLinks = [
      {
        text: 'Sites List',
        href: '/sites-list',
        current: false,
      },
      {
        text: siteId,
        href: `/sites-list/${siteId}`,
        current: false,
      },
      {
        text: `Missouri River - ${mrId ? mrId : 'Create'}`,
        current: true,
      },
    ];

    // const handleChange = (e) => {
    //   dispatch({
    //     type: 'UPDATE_INPUT',
    //     field: e.target.name,
    //     payload: e.target.value,
    //   });
    // };

    // const handleNumber = (e) => {
    //   dispatch({
    //     type: 'UPDATE_INPUT',
    //     field: e.target.name,
    //     payload: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
    //   });
    // };

    // const handleFloat = (e) => {
    //   dispatch({
    //     type: 'UPDATE_INPUT',
    //     field: e.target.name,
    //     payload: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value),
    //   });
    // };

    // const handleSelect = (field, val) => {
    //   if (field === 'macro') {
    //     doDomainsMesoFetch({ macro: val });
    //   }
    //   if (field === 'microStructure') {
    //     doDomainsStructureFlowFetch({ microStructure: val });
    //     doDomainsSetSite1Fetch({ microstructure: val });
    //   }
    //   if (field === 'structureFlow') {
    //     doDomainsStructureModFetch({ structureFlow: val });
    //   }
    //   if (field === 'setSite1') {
    //     doDomainsSetSite2Fetch({ setsite1: val });
    //   }
    //   dispatch({
    //     type: 'UPDATE_INPUT',
    //     field: field,
    //     payload: val,
    //   });
    // };

    // const handleNoTurbidityCheckbox = () => {
    //   const val = !isNoTurbidity;
    //   setIsNoTurbidity(val);
    //   handleSelect('noTurbidity', val === false ? 'N' : 'Y');
    // };

    // const handleNoVelocityCheckbox = () => {
    //   const val = !isNoVelocity;
    //   setIsNoVelocity(val);
    //   handleSelect('noVelocity', val === false ? 'N' : 'Y');
    // };

    // const doSave = () => {
    //   isEditForm ? doUpdateMoRiverDataEntry(state) : doSaveMoRiverDataEntry(state);
    // };

    // const saveIsDisabled = !(
    //   !!state['setdate'] &&
    //   !!state['subsample'] &&
    //   !!state['subsamplepass'] &&
    //   !!state['subsamplen'] &&
    //   !!state['gearType'] &&
    //   !!state['recorder'] &&
    //   !!state['macro'] &&
    //   !!state['meso'] &&
    //   !!state['temp'] &&
    //   !!state['startTime'] &&
    //   !!state['startlatitude'] &&
    //   !!state['startlongitude'] &&
    //   (isEditForm ? !!state['editInitials'] && !!state['lastEditComment'] : true)
    // );

    // useEffect(() => {
    //   // If there is existing Missouri River data entry
    //   if (isEditForm) {
    //     dispatch({
    //       type: 'INITIALIZE_FORM',
    //       payload: dataEntryData,
    //     });

    //     // Format Date
    //     dataEntryData?.setdate && handleSelect('setdate', formatDate(dataEntryData.setdate));

    //     // Set state of checkboxes
    //     setIsNoTurbidity(dataEntryData?.noTurbidity === 'Y' ? true : false);
    //     setIsNoVelocity(dataEntryData?.noVelocity === 'Y' ? true : false);
    //   } else {
    //     // Reset data if adding new Missouri River datasheet
    //     doResetMoRiverDataEntryData();
    //     handleSelect('siteId', siteId);
    //   }
    // }, [isEditForm, dataEntryData]);

    useEffect(() => {
      // netrivermile in baseData
      doUpdateBaseData('netrivermile', state['netrivermile']);
    }, [state['netrivermile']]);

    return (
      <div className='container-fluid'>
        <Breadcrumb paths={breadcrumbLinks} />
        <div className='row'>
          <div className='col-9'>
            <h4>
              {isEditForm ? '' : 'Create'} Missouri River Datasheet {isEditForm ? `Overview (ID: ${mrId})` : ''}
            </h4>
          </div>
        </div>
        {/* Top Level Info */}
        <DataHeader />
        {/* Approval */}
        {/* TO DO: include component props */}
        <Approval />
        {/* Form Fields */}
        <Card className='mt-3'>
          <Card.Header text='Missouri River and Related Data' />
          <Card.Body>
            <p>
              Select any tab to view Missouri River, Fish, Supplemental, and Procedure datasheet data for Missouri River
              ID: {dataEntryData?.mrId}
            </p>
            <TabContainer
              tabs={[
                {
                  title: 'Missouri River',
                  content: <MissouriRiverDataEntryForm />,
                },
                {
                  title: `Fish (${dataEntryFishTotalCount})`,
                  content: (
                    <>
                      <FishDsTable setIsAddRow={setIsAddSuppRow} setRowId={setSuppRowId} />
                    </>
                  ),
                },
                {
                  title: `Supplemental (${dataEntrySupplementalTotalCount})`,
                  content: (
                    <>
                      <SuppDsTable
                        isAddRow={isAddSuppRow}
                        rowId={suppRowId}
                        setIsAddRow={setIsAddProcRow}
                        setRowId={setProcRowId}
                      />
                    </>
                  ),
                },
                {
                  title: `Procedure (${dataEntryProcedureTotalCount})`,
                  content: (
                    <>
                      <ProcedureDsTable isAddRow={isAddProcRow} rowId={procRowId} />
                    </>
                  ),
                },
              ]}
              onTabChange={(_str, ind) => doUpdateCurrentTab(ind)}
              defaultTab={currentTab}
            />
          </Card.Body>
        </Card>
      </div>
    );
  }
);

export default MissouriRiverForm;
