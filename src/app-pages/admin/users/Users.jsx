import { useEffect, useMemo, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiAccountPlus } from '@mdi/js';

import Breadcrumb from '@src/app-components/breadcrumb';
import AddUserFormModal from './AddUserModal';
import Button from '@components/button';
import Card from '@components/card';
import EditCellRenderer from '@common/gridCellRenderers/editCellRenderer';
import FieldOfficeEditor from '@common/gridCellEditors/fieldOfficeEditor';
import RolesEditor from '@common/gridCellEditors/rolesEditor';
import ProjectEditor from '@common/gridCellEditors/projectEditor';
import RoleFilter from '@components/role-filter';
import Icon from '@components/icon/icon';

import { rolesList, fieldOfficeList, projectCodeList, NoRoleAccessMessage } from '../helper';
import { commonColDef } from '@src/utils/helpers';

const breadcrumbLinks = [{ text: 'Users', current: true }];

const components = {
  editCellRenderer: EditCellRenderer,
  fieldOfficeEditor: FieldOfficeEditor,
  projectEditor: ProjectEditor,
  rolesEditor: RolesEditor,
};

export default connect(
  'doDomainFieldOfficesFetch',
  'doDomainProjectsFetch',
  'doFetchUsers',
  'doFetchRoles',
  'doModalOpen',
  'doUpdateRoleOffice',
  'selectUsersData',
  'selectRoles',
  'selectDomains',
  ({
    doDomainFieldOfficesFetch,
    doDomainProjectsFetch,
    doFetchUsers,
    doFetchRoles,
    doModalOpen,
    doUpdateRoleOffice,
    usersData,
    roles,
    domains,
  }) => {
    const [rowData, setRowData] = useState(usersData);
    const [columnDefs] = useMemo(
      () => [
        {
          field: 'edit',
          width: 90,
          pinned: true,
          lockPosition: true,
          cellRenderer: 'editCellRenderer',
          cellRendererParams: { type: 'user' },
          editable: false,
          sortable: false,
          unSortIcon: false,
          resizable: false,
        },
        {
          field: 'firstName',
          editable: false,
        },
        {
          field: 'lastName',
          editable: false,
        },
        {
          field: 'roleId',
          headerName: 'Role',
          editable: true,
          cellEditor: RolesEditor,
          cellEditorParams: { options: roles },
          cellRenderer: (params) => rolesList[params.value],
          // **Add valueSetter** to update rowData
          valueSetter: (params) => {
            console.warn('params: ', params);
            if (params.newValue !== params.oldValue) {
              params.data.role = params.newValue;
              return true; // tells AG Grid the value changed
            }
            return false;
          },
        },
        {
          field: 'officeId',
          headerName: 'Field Office',
          width: 400,
          cellRenderer: (params) => fieldOfficeList[params.value],
        },
        {
          field: 'projectCode',
          headerName: 'Project',
          width: 300,
          cellRenderer: (params) => projectCodeList[params.value],
        },
      ],
      []
    );

    const defaultColDef = useMemo(() => ({ ...commonColDef, editable: true, lockPinned: true }), []);

    const onRowValueChanged = (params) => {
      console.log('Row updated:', params.data);
      setRowData([...rowData]); // optional: force state update
    };

    useEffect(() => {
      doFetchUsers();
    }, []);

    return (
      <RoleFilter allowRoles={['ADMINISTRATOR']} alt={() => <NoRoleAccessMessage className='p-2' />}>
        <div className='container-fluid'>
          <Breadcrumb paths={breadcrumbLinks} />
          <Card>
            <Card.Header text='User List' />
            <Card.Body>
              <Button
                isOutline
                size='small'
                variant='info'
                text='Add Account to Existing User'
                icon={<Icon path={mdiAccountPlus} />}
                handleClick={() => doModalOpen(AddUserFormModal)}
              />
              <div className='ag-theme-quartz mt-3' style={{ width: '100%', height: '600px' }}>
                <AgGridReact
                  className='ag-theme-quartz'
                  columnDefs={columnDefs}
                  components={components}
                  editType='fullRow'
                  defaultColDef={defaultColDef}
                  onCellValueChanged={() => console.warn('cell value changed')}
                  onRowValueChanged={onRowValueChanged}
                  onRowEditingStarted={() => console.warn('editing started')}
                  onRowEditingStopped={() => console.warn('editing stopped')}
                  rowData={rowData}
                  rowHeight={45}
                  theme='legacy'
                  stopEditingWhenCellsLoseFocus={true}
                />
              </div>
            </Card.Body>
          </Card>
        </div>
      </RoleFilter>
    );
  }
);
