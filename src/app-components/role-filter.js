import React from 'react';
import { connect } from 'redux-bundler-react';

export const isUserAllowed = (userRole, allowRoles = []) => {
  // If there are no userRole, user shouldn't be here
  if (!userRole) return false;
  if (userRole.role === 'ADMINISTRATOR') return true;

  // set our default show value, false makes us find an allow role, true makes us deny
  // if you add both allow and deny we first see if you are allowed, then deny overrides
  let showChildren = allowRoles.length > 0 ? false : true;

  // check allow roles, make sure the user has one of the allow roles
  for (var i = 0; i < allowRoles.length; i++) {
    const roleString = allowRoles[i];

    if (userRole.role === roleString) {
      showChildren = true;
      break;
    }
  }

  return showChildren;
};

export default connect(
  'selectUserRole',
  ({
    userRole,
    allowRoles = [],
    alt = null,
    children,
  }) => {
    const showChildren = isUserAllowed(userRole, allowRoles);

    if (showChildren) {
      return <>{children}</>;
    } else {
      const Alt = alt ? alt : null;
      return Alt ? <Alt /> : null;
    }
  }
);
