import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Card from 'app-components/card';
import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import FieldOfficeEditor from 'common/gridCellEditors/fieldOfficeEditor';
import RolesEditor from 'common/gridCellEditors/rolesEditor,';
import ProjectEditor from 'common/gridCellEditors/projectEditor';
import RoleFilter from 'app-components/role-filter';

import { rolesList, fieldOfficeList, projectCodeList } from './helper';
import { NoRoleAccessMessage } from './helper';

export default connect(
  'doDomainFieldOfficesFetch',
  'doDomainProjectsFetch',
  'doFetchUsers',
  'doFetchRoles',
  'doUpdateRoleOffice',
  'selectUsersData',
  'selectRoles',
  'selectDomains',
  ({
    doDomainFieldOfficesFetch,
    doDomainProjectsFetch,
    doFetchUsers,
    doFetchRoles,
    doUpdateRoleOffice,
    usersData,
    roles,
    domains
  }) => {
    const { projects, fieldOffices } = domains;

    useEffect(() => {
      doDomainFieldOfficesFetch({ showAll: true });
      doDomainProjectsFetch();
      doFetchUsers();
      doFetchRoles();
    }, []);

    return (
      <RoleFilter
        allowRoles={['ADMINISTRATOR']}
        alt={() => <NoRoleAccessMessage className='p-2' />}>
        <div className='container-fluid'>
          <div className='container-fluid'>
            <h4>Edit User</h4>
            <Card className='mt-3'>
              <Card.Header text='User List' />
              <Card.Body>
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
                      cellEditorParams={{ projects }}
                      cellRenderer={(params) => projectCodeList[params.value]}
                    />
                  </AgGridReact>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </RoleFilter>
    );
  }
);
