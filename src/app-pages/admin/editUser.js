import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';

import Card from 'app-components/card';

import EditCellRenderer from 'common/gridCellRenderers/editCellRenderer';
import FieldOfficeEditor from 'common/gridCellEditors/fieldOfficeEditor';
import RolesEditor from 'common/gridCellEditors/rolesEditor,';

export default connect(
  'doFetchFieldOffices',
  'doFetchUsers',
  'doFetchRoles',
  'selectFieldOffices',
  'selectUsersData',
  'selectRoles',
  ({
    doFetchFieldOffices,
    doFetchUsers,
    doFetchRoles,
    fieldOffices,
    usersData,
    roles, 
  }) => {
    useEffect(() => {
      doFetchUsers();
      doFetchRoles();
      doFetchFieldOffices();
    }, []);

    return (
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
                  defaultColDef={{
                    width: 200,
                    editable: true,
                    lockPinned: true,
                  }}
                  frameworkComponents={{
                    editCellRenderer: EditCellRenderer,
                    fieldOfficeEditor: FieldOfficeEditor,
                    rolesEditor: RolesEditor
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
                  <AgGridColumn field='firstName' />
                  <AgGridColumn field='lastName' />
                  <AgGridColumn field='email' />
                  <AgGridColumn field='role' cellEditor='rolesEditor' cellEditorParams={{ roles }} />
                  <AgGridColumn field='officeCode' cellEditor='fieldOfficeEditor' cellEditorParams={{ fieldOffices }} />
                </AgGridReact>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
);
