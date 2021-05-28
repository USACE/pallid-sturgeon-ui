import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import { classArray } from '../../utils';

import '../../css/accordion.scss';

const Accordion = connect(
  'doAuthLogin',
  'selectAuthIsLoggedIn',
  'selectProjectsByRoute',
  'selectPathname',
  ({
    doAuthLogin,
    authIsLoggedIn,
    projectsByRoute: project,
    pathname,
  }) => {

    const accordionClass = classArray([
      'accordion',
    ]);

    return (
      <>
        <div className={accordionClass}>

          <div id='accordion' class='accordion pt-3'>
            <div class='card mb-0'>
              <div class='card-header collapsed' data-toggle='collapse' href='#collapseOne'>
                <a class='card-title'> USG Species with No Vial Number </a>
              </div>
              <div id='collapseOne' class='card-body collapse' data-parent='#accordion'>
                <p></p>
              </div>
              <div class='card-header collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseTwo'>
                <a class='card-title'> Unchecked Data a Sheet Records </a>
              </div>
              <div id='collapseTwo' class='card-body collapse' data-parent='#accordion'>
                <p> </p>
              </div>
              <div class='card-header collapsed' data-toggle='collapse' data-parent='#accordion' href='#collapseThree'>
                <a class='card-title'> Office Error Log </a>
              </div>
              <div id='collapseThree' class='collapse' data-parent='#accordion'>
                <div class='card-body'> There are no unresolved error message at this time.</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default Accordion;
