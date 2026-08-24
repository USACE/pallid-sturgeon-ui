import { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { mdiAccountPlus } from '@mdi/js';

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
import Breadcrumb from '@src/app-components/breadcrumb';

const breadcrumbLinks = [
  {
    text: 'Users',
    current: true,
  },
];

export default connect(
  'doFetchUsers',
  'doFetchRoles',
  'doModalOpen',
  'doUpdateRoleOffice',
  'selectUsersData',
  'selectRoles',
  'selectLookupData',
  'selectUserRole',
  ({ doFetchUsers, doFetchRoles, doModalOpen, doUpdateRoleOffice, usersData, roles, lookupData, userRole }) => {
    const { projects, fieldOffices } = lookupData;
    const { projectCode } = userRole;
    const projectPspa = [1, 3, 4, 5, 6];
    const projectOptions = projects.filter((item) =>
      Number(projectCode) === 2 ? Number(item.code) === 2 : projectPspa.includes(Number(item.code))
    );

    useEffect(() => {
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
              <div className='ag-theme-balham mt-3' style={{ width: '100%', height: '600px' }}>
                <AgGridReact
                  suppressClickEdit
                  rowHeight={35}
                  rowData={usersData}
                  editType='fullRow'
                  onRowValueChanged={({ data }) => doUpdateRoleOffice(data)}
                  defaultColDef={{
                    width: 150,
                    editable: true,
                    lockPinned: true,
                  }}
                  frameworkComponents={{
                    editCellRenderer: EditCellRenderer,
                    fieldOfficeEditor: FieldOfficeEditor,
                    rolesEditor: RolesEditor,
                    projectEditor: ProjectEditor,
                  }}
                >
                  <AgGridColumn
                    field='edit'
                    width={90}
                    pinned
                    lockPosition
                    cellRenderer='editCellRenderer'
                    cellRendererParams={{
                      type: 'user',
                    }}
                    editable={false}
                  />
                  <AgGridColumn field='firstName' editable={false} />
                  <AgGridColumn field='lastName' editable={false} />
                  <AgGridColumn field='email' width={250} editable={false} />
                  <AgGridColumn
                    field='roleId'
                    headerName='Role'
                    cellEditor='rolesEditor'
                    cellEditorParams={{ roles }}
                    cellRenderer={(params) => rolesList[params.value]}
                  />
                  <AgGridColumn
                    field='officeId'
                    headerName='Field Office'
                    width={300}
                    cellEditor='fieldOfficeEditor'
                    cellEditorParams={{ fieldOffices, isId: true }}
                    cellRenderer={(params) => fieldOfficeList[params.value]}
                  />
                  <AgGridColumn
                    field='projectCode'
                    headerName='Project'
                    width={300}
                    cellEditor='projectEditor'
                    cellEditorParams={{ projects: projectOptions }}
                    cellRenderer={(params) => projectCodeList[params.value]}
                  />
                </AgGridReact>
              </div>
            </Card.Body>
          </Card>
        </div>
      </RoleFilter>
    );
  }
);
