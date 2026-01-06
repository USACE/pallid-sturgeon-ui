import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact } from 'ag-grid-react';
import { mdiAccountPlus } from '@mdi/js';
import { themeQuartz } from '@ag-grid-community/theming';

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

const defaultColDef = { ...commonColDef, editable: true, lockPinned: true };
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
    const { projects, fieldOffices } = domains;

    const columnDefs = [
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
      { field: 'firstName', editable: false },
      { field: 'lastName', editable: false },
      {
        field: 'roleId',
        headerName: 'Role',
        cellEditor: 'rolesEditor',
        cellEditorParams: { roles },
        cellRenderer: (params) => rolesList[params.value],
      },
      {
        field: 'officeId',
        headerName: 'Field Office',
        width: 400,
        cellEditor: 'fieldOfficeEditor',
        cellEditorParams: { fieldOffices, isId: true },
        cellRenderer: (params) => fieldOfficeList[params.value],
      },
      {
        field: 'projectCode',
        headerName: 'Project',
        width: 300,
        cellEditor: 'projectEditor',
        cellEditorParams: { projects },
        cellRenderer: (params) => projectCodeList[params.value],
      },
    ];

    useEffect(() => {
      doDomainFieldOfficesFetch({ showAll: true });
      doDomainProjectsFetch(false);
      doFetchUsers();
      doFetchRoles();
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
                  columnDefs={columnDefs}
                  components={components}
                  defaultColDef={defaultColDef}
                  editType='fullRow'
                  onRowValueChanged={({ data }) => doUpdateRoleOffice(data)}
                  rowData={usersData}
                  theme={themeQuartz}
                  rowHeight={45}
                />
              </div>
            </Card.Body>
          </Card>
        </div>
      </RoleFilter>
    );
  }
);
