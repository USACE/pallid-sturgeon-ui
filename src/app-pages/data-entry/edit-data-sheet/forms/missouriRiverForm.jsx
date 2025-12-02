import { useEffect, useReducer, useState, useRef, useCallback } from 'react';
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

import { db } from '../../../../offline/db';
import { createMoRiver } from '../../../../offline/api';

import { seedMesoCacheIfEmpty, getMesoOptionsForMacro } from '../../../../offline/mesoOptionCache';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'INITIALIZE_FORM':
      return Object.assign({}, state, action.payload);
    case 'RESET_FORM':
      return { ...action.payload, startTime: '', recorder: '', lastEditComment: '' };
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
      startTime: '',
      recorder: '',
      lastEditComment: '',
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    const [isAddSuppRow, setIsAddSuppRow] = useState(false);
    const [suppRowId, setSuppRowId] = useState(null);

    const [isAddProcRow, setIsAddProcRow] = useState(false);
    const [procRowId, setProcRowId] = useState(null);

    const [isNoTurbidity, setIsNoTurbidity] = useState(false);
    const [isNoVelocity, setIsNoVelocity] = useState(false);

    const [mesoOptions, setMesoOptions] = useState([]);

    const siteId = routeParams?.siteId;
    const mrId = routeParams.mrId;
    const formComplete = true;

    const [clientId, setClientId] = useState(null);
    useEffect(() => {
      let cid = sessionStorage.getItem('moriver-draft');
      if (!cid) {
        cid = (crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`).toString();
        sessionStorage.setItem('moriver-draft', cid);
      }
      setClientId(cid);
    }, []);

    const [localStatus, setLocalStatus] = useState('draft');

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

    const debounceT = useRef(null);
    const saveDraft = useCallback(
      (patch) => {
        if (!clientId) return;
        clearTimeout(debounceT.current);
        debounceT.current = setTimeout(async () => {
          const current = await db.moriver.get(clientId);
          const next = {
            ...(current || { clientId, version: current?.version ?? 0 }),
            ...patch,
            _status: current?._status || 'draft',
          };
          await db.moriver.put(next);
          setLocalStatus(next._status || 'draft');
        }, 150);
      },
      [clientId, setLocalStatus]
    );

    const handleChange = (e) => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: e.target.value,
      });
      saveDraft({ [e.target.name]: e.target.value });
    };

    const handleNumber = (e) => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
      });
      saveDraft({ [e.target.value]: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) });
    };

    const handleFloat = (e) => {
      dispatch({
        type: 'UPDATE_INPUT',
        field: e.target.name,
        payload: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value),
      });
      saveDraft({ [e.target.value]: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value) });
    };

    const handleSelect = (field, val) => {
      if (field === 'macro') {
        doDomainsMesoFetch({ macro: val });
      }
      if (field === 'microStructure') {
        doDomainsStructureFlowFetch({ microStructure: val });
        doDomainsSetSite1Fetch({ microstructure: val });
      }
      if (field === 'structureFlow') {
        doDomainsStructureModFetch({ structureFlow: val });
      }
      if (field === 'setSite1') {
        doDomainsSetSite2Fetch({ setsite1: val });
      }
      dispatch({
        type: 'UPDATE_INPUT',
        field: field,
        payload: val,
      });
    };

    const handleNoTurbidityCheckbox = () => {
      const val = !isNoTurbidity;
      setIsNoTurbidity(val);
      handleSelect('noTurbidity', val === false ? 'N' : 'Y');
    };

    const handleNoVelocityCheckbox = () => {
      const val = !isNoVelocity;
      setIsNoVelocity(val);
      handleSelect('noVelocity', val === false ? 'N' : 'Y');
    };

    const doSave = async () => {
      console.log('[doSave] called, online =', navigator.onLine);

      const requiredFields = Boolean(
        state.setdate &&
          state.subsample &&
          state.subsamplepass &&
          state.subsamplen &&
          state.gearType &&
          state.recorder &&
          state.macro &&
          state.meso &&
          state.temp
      );
      if (!requiredFields) {
        alert('Please fill all required fields before saving');
        return;
      }

      const asNum = (v) => (v === '' || v == null ? undefined : Number(v));

      if (!navigator.onLine) {
        console.log('[doSave] offline branch hit');

        const payload = {
          clientId,
          siteId: state.siteId != null ? Number(state.siteId) : Number(routeParams.siteId),
          setdate: state.setdate,
          gear_type: state.gearType,
          gear: state.gear,
          recorder: state.recorder,
          macro: state.macro,
          meso: state.meso,
          temp: asNum(state.temp),
          width: asNum(state.width),
          micro: state.micro,
          micro_structure: state.microStructure,
          structure_flow: state.structureFlow,
          structure_mod: state.structureMod,
          set_site_1: state.setSite1,
          set_site_2: state.setSite2,
          set_site_3: state.setSite3,
          starttime: state.startTime,
          startlatitude: asNum(state.startlatitude),
          startlongitude: asNum(state.startlongitude),
          distance: asNum(state.distance),
          depth1: asNum(state.depth1),
          depth2: asNum(state.depth2),
          depth3: asNum(state.depth3),
          stoptime: state.stoptime,
          stoplatitude: asNum(state.stoplatitude),
          stoplongitude: asNum(state.stoplongitude),
          u1: state.u1,
          u2: state.u2,
          u3: state.u3,
          u4: state.u4,
          u5: state.u5,
          u6: state.u6,
          u7: state.u7,
          structurenumber: state.structurenumber,
          netrivermile: asNum(state.netrivermile),
          conductivity: asNum(state.conductivity),
          do: asNum(state.dissolvedOxygen),
          usgs: state.usgs,
          riverstage: asNum(state.riverstage),
          discharge: asNum(state.discharge),
          habitatrn: state.habitatrn,
          turbidity: asNum(state.turbidity),
          no_turbidity: state.noTurbidity,
          cobble: asNum(state.cobble),
          silt: asNum(state.silt),
          organic: asNum(state.organic),
          sand: asNum(state.sand),
          watervel: asNum(state.watervel),
          gravel: asNum(state.gravel),
          velocitybot1: asNum(state.velocitybot1),
          velocity08_1: asNum(state.velocity081),
          velocity02or06_1: asNum(state.velocity02or061),
          velocitybot2: asNum(state.velocitybot2),
          velocity08_2: asNum(state.velocity082),
          velocity02or06_2: asNum(state.velocity02or062),
          velocitybot3: asNum(state.velocitybot3),
          velocity08_3: asNum(state.velocity083),
          velocity02or06_3: asNum(state.velocity02or063),
          no_velocity: state.noVelocity,
          last_edit_comment: state.lastEditComment || 'Offline demo queued entry',
          edit_initials: state.editInitials,
          // _status: 'queued',
        };

        await createMoRiver(payload);

        dispatch({ type: 'RESET_FORM', payload: initialState });

        if (typeof setLocalStatus === 'function') {
          setLocalStatus('queued');
        }

        window.alert('Saved locally (queued). Go online and press "Sync now".');
        return;
      }
      isEditForm ? doUpdateMoRiverDataEntry(state) : doSaveMoRiverDataEntry(state);
      dispatch({ type: 'RESET_FORM', payload: initialState });
    };

    const didInitRef = useRef(false);
    useEffect(() => {
      if (didInitRef.current) return;
      didInitRef.current = true;

      // If there is existing Missouri River data entry
      if (isEditForm) {
        dispatch({
          type: 'INITIALIZE_FORM',
          payload: dataEntryData,
        });

        // Format Date
        dataEntryData?.setdate && handleSelect('setdate', formatDate(dataEntryData.setdate));

        // Set state of checkboxes
        setIsNoTurbidity(dataEntryData?.noTurbidity === 'Y');
        setIsNoVelocity(dataEntryData?.noVelocity === 'Y');
      } else {
        // Reset data if adding new Missouri River datasheet
        doResetMoRiverDataEntryData();
        handleSelect('siteId', Number(routeParams?.siteId));
      }
    }, []);

    useEffect(() => {
      // netrivermile in baseData
      doUpdateBaseData('netrivermile', state['netrivermile']);
    }, [state['netrivermile']]);

    useEffect(() => {
      seedMesoCacheIfEmpty().catch((e) => {
        console.error('Failed to seed meso cache', e);
      });
    }, []);

    useEffect(() => {
      if (!state['macro']) {
        setMesoOptions([]);
        return;
      }

      let cancelled = false;

      (async () => {
        try {
          const rows = await getMesoOptionsForMacro(state['macro']);
          if (!cancelled) {
            setMesoOptions(rows);
          }
        } catch (e) {
          console.error('Failed to load meso options from cache', e);
          if (!cancelled) {
            setMesoOptions([]);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [state['macro']]);

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
                  content: (
                    <>
                      <Row>
                        <div className='col-md-2'>
                          <Input
                            label='Setdate'
                            name='setdate'
                            type='date'
                            value={state['setdate'] ? state['setdate'].split('T')[0] : ''}
                            onChange={handleChange}
                            isRequired
                          />
                        </div>
                        <div className='col-sm-1'>
                          <Input
                            label='Subsample'
                            name='subsample'
                            type='number'
                            value={state['subsample'] || ''}
                            placeholder='max 3 digits'
                            onChange={handleNumber}
                            isDisabled={!formComplete}
                            isRequired
                          />
                        </div>
                        <div className='col-sm-1'>
                          <Input
                            label='Pass'
                            name='subsamplepass'
                            type='number'
                            value={state['subsamplepass'] || ''}
                            placeholder='max 1 digit'
                            onChange={handleNumber}
                            isDisabled={!formComplete}
                            isRequired
                          />
                        </div>
                        <div className='col-sm-2'>
                          <SelectCustomLabel
                            label='R/N'
                            name='subsamplen'
                            value={state['subsamplen']}
                            onChange={(val) => handleSelect('subsamplen', val)}
                            options={[
                              { value: 'R', text: 'R - Random' },
                              { value: 'N', text: 'N - Non-Random' },
                            ]}
                            isDisabled={!formComplete}
                            isRequired
                          />
                        </div>
                        <div className='col-sm-2'>
                          <SelectCustomLabel
                            label='Gear Type'
                            name='gearType'
                            value={state['gearType']}
                            defaultValue='S'
                            onChange={(val) => handleSelect('gearType', val)}
                            options={[{ value: 'E' }, { value: 'S' }, { value: 'W' }]}
                            isDisabled={!formComplete}
                            isRequired
                          />
                        </div>
                        <div className='col-md-2'>
                          <SelectCustomLabel
                            label='Gear Code'
                            name='gear'
                            value={state['gear']}
                            onChange={(val) => handleSelect('gear', val)}
                            options={gearCodeOptions}
                            isDisabled={!formComplete}
                          />
                        </div>
                        <div className='col-md-2'>
                          <Input
                            label='Recorder Initials'
                            name='recorder'
                            value={state['recorder']}
                            onChange={handleChange}
                            isDisabled={!formComplete}
                            isRequired
                          />
                        </div>
                      </Row>
                      <Row>
                        <div className='col-md-4 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                          <Row>
                            <div className='col-md-6'>
                              <SelectCustomLabel
                                label='Macro'
                                name='macro'
                                value={state['macro']}
                                onChange={(val) => handleSelect('macro', val)}
                                options={macroOptions}
                                isDisabled={!formComplete}
                                isRequired
                              />
                            </div>
                            <div className='col-md-6'>
                              <SelectCustomLabel
                                label='Meso'
                                name='meso'
                                value={state['meso']}
                                onChange={(val) => handleSelect('meso', val)}
                                options={createMesoOptions(mesoOptions)}
                                isDisabled={!formComplete}
                                isRequired
                              />
                            </div>
                          </Row>
                          <Row className='mt-2'>
                            <div className='col-md-6'>
                              <Input
                                label='Temp (c)'
                                name='temp'
                                type='number'
                                value={state['temp'] || ''}
                                placeholder='ex: 12.1'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                                isRequired
                              />
                            </div>
                            <div className='col-md-6'>
                              <Input
                                label='Width'
                                name='width'
                                type='number'
                                value={state['width'] || ''}
                                placeholder='ex: 12.1'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                        </div>
                        <div className='col-md-8 pb-3'>
                          <Row>
                            <div className='col-md-3'>
                              {/* this field is a calculated field? */}
                              <Input
                                label='Micro'
                                name='micro'
                                value={state['micro']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <SelectCustomLabel
                                label='Micro Structure'
                                name='microStructure'
                                value={state['microStructure']}
                                onChange={(val) => handleSelect('microStructure', val)}
                                options={microStructureOptions}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <SelectCustomLabel
                                label='Structure Flow'
                                name='structureFlow'
                                value={state['structureFlow']}
                                onChange={(val) => handleSelect('structureFlow', val)}
                                options={createStructureFlowOptions(domainsStructureFlow)}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <SelectCustomLabel
                                label='Structure Mod'
                                name='structureMod'
                                value={state['structureMod']}
                                onChange={(val) => handleSelect('structureMod', val)}
                                options={createStructureModOptions(domainsStructureMod)}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                          <Row>
                            <div className='col-md-3 offset-3'>
                              <SelectCustomLabel
                                label='Set Site 1'
                                name='setSite1'
                                value={state['setSite1']}
                                onChange={(val) => handleSelect('setSite1', val)}
                                options={createStructureModOptions(domainsSetSite1)}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <SelectCustomLabel
                                label='Set Site 2'
                                name='setSite2'
                                value={state['setSite2']}
                                onChange={(val) => handleSelect('setSite2', val)}
                                options={createStructureModOptions(domainsSetSite2)}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <SelectCustomLabel
                                label='Set Site 3'
                                name='setSite3'
                                value={state['setSite3']}
                                onChange={(val) => handleSelect('setSite3', val)}
                                options={setSite_3Options}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                        </div>
                      </Row>

                      <Row>
                        <div className='col-md-5 pb-3' style={{ borderRight: '1px solid lightgray' }}>
                          <Row>
                            <div className='col-md-4'>
                              <Input
                                label='Start Time (hh:mm:ss)'
                                name='startTime'
                                value={state['startTime']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                                isRequired
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Start Latitude'
                                name='startlatitude'
                                type='number'
                                value={state['startlatitude'] || ''}
                                placeholder='ex: 12.34567'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                                isRequired
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Start Longitude'
                                name='startlongitude'
                                type='number'
                                value={state['startlongitude'] || ''}
                                placeholder='ex: 12.34567'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                                isRequired
                              />
                            </div>
                          </Row>
                          <Row>
                            <div className='col-md-3'>
                              <Input
                                label='Distance (m)'
                                name='distance'
                                type='number'
                                value={state['distance'] || ''}
                                placeholder='max 3 digits'
                                onChange={handleNumber}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label='Depth (m)'
                                name='depth1'
                                type='number'
                                value={state['depth1'] || ''}
                                placeholder='ex: 1.2'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label=' '
                                name='depth2'
                                type='number'
                                value={state['depth2'] || ''}
                                placeholder='ex: 1.2'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label=' '
                                name='depth3'
                                type='number'
                                value={state['depth3'] || ''}
                                placeholder='ex: 1.2'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                          <Row className='mt-2'>
                            <div className='col-md-4'>
                              <Input
                                label='Stop Time (hh:mm:ss)'
                                name='stoptime'
                                value={state['stoptime']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Stop Latitude'
                                name='stoplatitude'
                                type='number'
                                value={state['stoplatitude'] || ''}
                                placeholder='ex: 12.34567'
                                onChange={handleNumber}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Stop Longitude'
                                name='stoplongitude'
                                type='number'
                                value={state['stoplongitude'] || ''}
                                placeholder='ex: 12.34567'
                                onChange={handleNumber}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                        </div>
                        <div className='col-md-7 pb-3'>
                          <Row className='no-gutters'>
                            <div className='col-md-1 mr-2'>
                              <Input
                                label='U1'
                                name='u1'
                                value={state['u1']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-1 mr-2'>
                              <Input
                                label='U2'
                                name='u2'
                                value={state['u2']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-1 mr-2'>
                              <Input
                                label='U3'
                                name='u3'
                                value={state['u3']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-1 mr-2'>
                              <Input
                                label='U4'
                                name='u4'
                                value={state['u4']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-2 mr-2'>
                              <Input
                                label='U5'
                                name='u5'
                                value={state['u5']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-2 mr-2'>
                              <SelectCustomLabel
                                label='U6'
                                name='u6'
                                value={state['u6']}
                                onChange={(val) => handleSelect('u6', val)}
                                options={[{ value: 'MNCF' }, { value: 'NSTS' }]}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <SelectCustomLabel
                                label='U7'
                                name='u7'
                                value={state['u7']}
                                onChange={(val) => handleSelect('u7', val)}
                                options={u7Options}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                          <Row>
                            <div className='col-md-3'>
                              <Input
                                label='Structure Number'
                                name='structurenumber'
                                value={state['structurenumber']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label='Net River Mile'
                                name='netrivermile'
                                type='number'
                                value={state['netrivermile'] || ''}
                                placeholder='ex: 123.4'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label='Conductivity'
                                name='conductivity'
                                type='number'
                                value={state['conductivity'] || ''}
                                placeholder='max 4 digits'
                                onChange={handleNumber}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label='D.O. (Dissolved Oxygen)'
                                name='dissolvedOxygen'
                                type='number'
                                step={0.1}
                                value={state['dissolvedOxygen'] || ''}
                                placeholder='ex: 12.3'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                          <Row>
                            <div className='col-md-3'>
                              <Input
                                label='USGS Gauge Code'
                                name='usgs'
                                value={state['usgs']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label='River Stage'
                                name='riverstage'
                                type='number'
                                step={0.1}
                                value={state['riverstage'] || ''}
                                placeholder='ex: 12.3'
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label='Discharge'
                                name='discharge'
                                type='number'
                                value={state['discharge'] || ''}
                                placeholder='ex: 12345'
                                onChange={handleNumber}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                        </div>
                      </Row>

                      <Row>
                        <div className='col-md-5'>
                          <Row>
                            <div className='col-md-5'>
                              <SelectCustomLabel
                                label='Habitat R/N'
                                name='habitatrn'
                                value={state['habitatrn']}
                                onChange={(val) => handleSelect('habitatrn', val)}
                                options={[
                                  { value: 'R', text: 'R - Random' },
                                  { value: 'N', text: 'N - Non-random' },
                                ]}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-3'>
                              <Input
                                label='Turbidity'
                                name='turbidity'
                                type='number'
                                value={state['turbidity'] || ''}
                                placeholder='max 4 digits'
                                onChange={handleNumber}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4 text-center'>
                              <label>
                                <small>No Turbidity</small>
                              </label>
                              <input
                                name='noTurbidity'
                                type='checkbox'
                                title='No Turbidity Field'
                                className='form-control mt-1'
                                style={{
                                  height: '15px',
                                  width: '15px',
                                  margin: 'auto',
                                }}
                                checked={isNoTurbidity}
                                onChange={handleNoTurbidityCheckbox}
                                disabled={!formComplete}
                              />
                            </div>
                          </Row>
                        </div>
                        <div className='col-md-7'>
                          <Row>
                            <div className='col-md-2 text-right mt-1'>
                              <label>
                                <small>Cobble</small>
                              </label>
                            </div>
                            <div className='col-md-4'>
                              <SelectCustomLabel
                                name='cobble'
                                value={Number(state['cobble'])}
                                defaultValue={0}
                                onChange={(val) => handleSelect('cobble', val)}
                                options={[
                                  { value: 0, text: '0 - None' },
                                  { value: 1, text: '1 - Incidental' },
                                  { value: 2, text: '2 - Dominant' },
                                  { value: 3, text: '3 - Ubiquitous' },
                                ]}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-2 text-right mt-1'>
                              <label>
                                <small>Silt (%)</small>
                              </label>
                            </div>
                            <div className='col-md-4'>
                              <Input
                                name='silt'
                                type='number'
                                value={state['silt'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                          <Row className='mt-2'>
                            <div className='col-md-2 text-right mt-1'>
                              <label>
                                <small>Organic</small>
                              </label>
                            </div>
                            <div className='col-md-4'>
                              <SelectCustomLabel
                                name='organic'
                                value={Number(state['organic'])}
                                defaultValue={0}
                                onChange={(val) => handleSelect('organic', val)}
                                options={[
                                  { value: 0, text: '0 - None' },
                                  { value: 1, text: '1 - Incidental' },
                                  { value: 2, text: '2 - Dominant' },
                                  { value: 3, text: '3 - Ubiquitous' },
                                ]}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-2 text-right mt-1'>
                              <label>
                                <small>Sand (%)</small>
                              </label>
                            </div>
                            <div className='col-md-4'>
                              <Input
                                name='sand'
                                type='number'
                                value={state['sand'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                          <Row className='mt-2'>
                            <div className='col-md-2 text-right mt-1'>
                              <label>
                                <small>Water Velocity</small>
                              </label>
                            </div>
                            <div className='col-md-4'>
                              <SelectCustomLabel
                                name='watervel'
                                value={Number(state['watervel'])}
                                defaultValue={0}
                                onChange={(val) => handleSelect('watervel', val)}
                                options={[
                                  { value: 0, text: 'Not reliable' },
                                  { value: 1, text: 'Eddy' },
                                  { value: 2, text: '0 - 0.3 m/s' },
                                  { value: 3, text: '0.3 - 0.6 m/s' },
                                  { value: 4, text: '0.6 - 0.9 m/s' },
                                  { value: 5, text: '> 0.9 m/s' },
                                ]}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-2 text-right mt-1'>
                              <label>
                                <small>Gravel (%)</small>
                              </label>
                            </div>
                            <div className='col-md-4'>
                              <Input
                                name='gravel'
                                type='number'
                                value={state['gravel'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                        </div>
                      </Row>

                      <Row>
                        <div className='col-md-5'>
                          <Row>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 1 (bot)'
                                name='velocitybot1'
                                type='number'
                                value={state['velocitybot1'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 1 (0.8 or 0.5)'
                                name='velocity081'
                                type='number'
                                value={state['velocity081'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 1 (0.2 or 0.6)'
                                name='velocity02or061'
                                type='number'
                                value={state['velocity02or061'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                          <div className='row mt-2'>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 2 (bot)'
                                name='velocitybot2'
                                type='number'
                                value={state['velocitybot2'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 2 (0.8 or 0.5)'
                                name='velocity082'
                                type='number'
                                value={state['velocity082'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 2 (0.2 or 0.6)'
                                name='velocity02or062'
                                type='number'
                                value={state['velocity02or062'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </div>
                          <Row className='mt-2'>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 3 (bot)'
                                name='velocitybot3'
                                type='number'
                                value={state['velocitybot3'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 3 (0.8)'
                                name='velocity083'
                                type='number'
                                value={state['velocity083'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                            <div className='col-md-4'>
                              <Input
                                label='Velocity 3 (0.2 or 0.6)'
                                name='velocity02or063'
                                type='number'
                                value={state['velocity02or063'] || ''}
                                onChange={handleFloat}
                                isDisabled={!formComplete}
                              />
                            </div>
                          </Row>
                        </div>
                        <div className='col-md-2 text-center'>
                          <label>
                            <small>No Velocities</small>
                          </label>
                          <input
                            name='noVelocity'
                            type='checkbox'
                            title='No Velocties Field'
                            className='form-control mt-1'
                            style={{
                              height: '15px',
                              width: '15px',
                              margin: 'auto',
                            }}
                            checked={isNoVelocity}
                            onChange={handleNoVelocityCheckbox}
                            disabled={!formComplete}
                          />
                        </div>
                        <div className='col-md-5'>
                          <TextArea
                            label='Comments'
                            name='lastEditComment'
                            rows={5}
                            value={state['lastEditComment']}
                            onChange={handleChange}
                            isDisabled={!formComplete}
                            isRequired={isEditForm}
                          />
                          <Row className='mt-2'>
                            <div className='col-md-9 pt-1 text-right'>
                              <label>
                                <small>Edit Initials</small>
                              </label>
                            </div>
                            <div className='col-md-3'>
                              <Input
                                name='editInitials'
                                value={state['editInitials']}
                                onChange={handleChange}
                                isDisabled={!formComplete}
                                isRequired={isEditForm}
                              />
                            </div>
                          </Row>
                        </div>
                      </Row>

                      <hr />
                      <Row>
                        <div className='col-md-2 offset-10'>
                          <div className='float-right'>
                            <Button
                              size='small'
                              variant='success'
                              className='btn-width'
                              text={isEditForm ? 'Apply Changes' : 'Save'}
                              handleClick={() => doSave()}
                              // isDisabled={saveIsDisabled}
                            />
                          </div>
                        </div>
                      </Row>
                    </>
                  ),
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
