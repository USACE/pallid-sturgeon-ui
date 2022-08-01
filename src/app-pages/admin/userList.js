import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';
import Select from 'app-components/select';
import { createDropdownOptions, createRolesDropdownOptions } from 'app-pages/data-entry/helpers';

import './admin.scss';

export default connect(
  'doFetchUserAccessRequests',
  'doFetchRoles',
  'doRoleOfficeUpdate',
  'selectUserAccessRequests',
  'selectRoles',
  'selectDomains',
  ({
    doFetchUserAccessRequests,
    doFetchRoles,
    doRoleOfficeUpdate,
    userAccessRequests,
    roles,
    domains
  }) => {
    const { projects, fieldOffices } = domains;
    const [roleUpdated, setRoleUpdated] = useState([]);
    const [officeUpdated, setOfficeUpdated] = useState([]);
    const [projectUpdated, setProjectUpdated] = useState([]);

    const handleRoleUpdate = (id) => {
      const updatedIndex = roleUpdated.indexOf(id);
      let newUpdated = roleUpdated;

      if (updatedIndex === -1) {
        newUpdated = newUpdated.concat(id);
      }

      setRoleUpdated(newUpdated);
    };

    const removeRoleUpdate = (id) => {
      const updatedIndex = roleUpdated.indexOf(id);
      let newUpdated = [];

      if (updatedIndex === 0) {
        newUpdated = newUpdated.concat(roleUpdated.slice(1));
      } else if (updatedIndex === roleUpdated.length - 1) {
        newUpdated = newUpdated.concat(roleUpdated.slice(0, -1));
      } else if (updatedIndex > 0) {
        newUpdated = newUpdated.concat(
          roleUpdated.slice(0, updatedIndex),
          roleUpdated.slice(updatedIndex + 1),
        );
      }

      setRoleUpdated(newUpdated);
    };

    const isRoleUpdated = (id) => roleUpdated.indexOf(id) !== -1;

    const handleOfficeUpdate = (id) => {
      const updatedIndex = officeUpdated.indexOf(id);
      let newUpdated = officeUpdated;

      if (updatedIndex === -1) {
        newUpdated = newUpdated.concat(id);
      }

      setOfficeUpdated(newUpdated);
    };

    const removeOfficeUpdate = (id) => {
      const updatedIndex = officeUpdated.indexOf(id);
      let newUpdated = [];

      if (updatedIndex === 0) {
        newUpdated = newUpdated.concat(officeUpdated.slice(1));
      } else if (updatedIndex === officeUpdated.length - 1) {
        newUpdated = newUpdated.concat(officeUpdated.slice(0, -1));
      } else if (updatedIndex > 0) {
        newUpdated = newUpdated.concat(
          officeUpdated.slice(0, updatedIndex),
          officeUpdated.slice(updatedIndex + 1),
        );
      }

      setOfficeUpdated(newUpdated);
    };

    const isOfficeUpdated = (id) => officeUpdated.indexOf(id) !== -1;

    const handleProjectUpdate = (id) => {
      const updatedIndex = projectUpdated.indexOf(id);
      let newUpdated = projectUpdated;

      if (updatedIndex === -1) {
        newUpdated = newUpdated.concat(id);
      }

      setProjectUpdated(newUpdated);
    };

    const removeProjectUpdate = (id) => {
      const updatedIndex = projectUpdated.indexOf(id);
      let newUpdated = [];

      if (updatedIndex === 0) {
        newUpdated = newUpdated.concat(projectUpdated.slice(1));
      } else if (updatedIndex === projectUpdated.length - 1) {
        newUpdated = newUpdated.concat(projectUpdated.slice(0, -1));
      } else if (updatedIndex > 0) {
        newUpdated = newUpdated.concat(
          projectUpdated.slice(0, updatedIndex),
          projectUpdated.slice(updatedIndex + 1),
        );
      }

      setProjectUpdated(newUpdated);
    };

    const isProjectUpdated = (id) => projectUpdated.indexOf(id) !== -1;

    useEffect(() => {
      doFetchUserAccessRequests();
      doFetchRoles();
    }, []);

    return (
      <div className='col-md-9'>
        <table className='table table-bordered'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Office</th>
              <th>Project</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {userAccessRequests.data.map((user, i) => {
              const isRoleItemUpdated = isRoleUpdated(user.id);
              const isOfficeItemUpdated = isOfficeUpdated(user.id);
              const isProjectItemUpdated = isProjectUpdated(user.id);
              return (
                <tr key={user.id}>
                  <td className='text-center' style={{ width: '20%' }}>{user.firstName} {user.lastName}</td>
                  <td className='text-center' style={{ width: '20%' }}>{user.email}</td>
                  <td className='text-center' style={{ width: '20%' }}><div className='select'>
                    <Select
                      onChange={function (val) {
                        user.roleId = val;
                        handleRoleUpdate(user.id);
                      }}
                      placeholderText='Select Role...'
                      data-size='3'
                      options={createRolesDropdownOptions(roles)}
                    />
                  </div></td>
                  <td className='text-center' style={{ width: '20%' }}><div className='select'>
                    <Select
                      onChange={function (val) {
                        user.officeId = val;
                        handleOfficeUpdate(user.id);
                      }}
                      placeholderText='Select Office...'
                      data-size='3'
                      options={createDropdownOptions(fieldOffices)}
                    />
                  </div></td>
                  <td className='text-center' style={{ width: '20%' }}><div className='select'>
                    <Select
                      onChange={function (val) {
                        user.projectCode = val;
                        handleProjectUpdate(user.id);
                      }}
                      placeholderText='Select Project...'
                      data-size='3'
                      options={createDropdownOptions(projects)}
                    />
                  </div></td>
                  <td style={{ width: '5%' }}>
                    <Button
                      className={'icon-button small-btn'}
                      title='Save'
                      disabled={!isRoleItemUpdated || !isOfficeItemUpdated || !isProjectItemUpdated}
                      onClick={function (e) {
                        doRoleOfficeUpdate({
                          userId: user.id,
                          roleId: parseInt(user.roleId),
                          officeId: parseInt(user.officeId),
                          projectCode: user.projectCode
                        }, () => {
                          removeRoleUpdate(user.id);
                          removeOfficeUpdate(user.id);
                          removeProjectUpdate(user.id);
                        });
                      }}
                      icon={<Icon icon='content-save'
                        className={`button-icon ${user.id} mr-2`}
                      />}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);
