import React, { useRef } from 'react';
import { connect } from 'redux-bundler-react';

import Card from '../../app-components/card';
import ProfileForm from '../../app-components/profile-form';

export default connect(
  // 'doProfileSave',
  'doUpdateUrl',
  'selectAuthIsLoggedIn',
  // 'selectProfileActive',
  ({
    // doProfileSave,
    doUpdateUrl,
    authIsLoggedIn: isLoggedIn,
    // profileActive: profile,
  }) => {
    // If user already has a profile or is not logged in,
    // i.e. navigated directly to "/signup", redirect them back to home.
    // if (profile || isLoggedIn) {
    //   doUpdateUrl(['/']);
    // }

    const form = useRef();
    const handleSave = () => {
      if (form.current) {
        form.current.save();
        doUpdateUrl(['/']);
      }
    };

    return (
      <div>
        <section
          className='container'
          style={{
            position: 'absolute',
            top: '6em',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div
            style={{ display: 'grid', placeItems: 'center', height: '100%' }}
          >
            <Card style={{ maxWidth: '32em' }}>
              <Card.Body>
                <h5>Create your profile to continue</h5>
                <p>
                  <small>
                    This information will be used to display your identity
                    associated with changes you make within this system and to
                    facilitate sending notifications. We wont send you any
                    notifications unless you or an admin subscribe to alerts.
                  </small>
                </p>
                {/* <ProfileForm ref={form} onSave={handleSave} /> */}
                <div className='clearfix'>
                  <div className='float-right'>
                    <a href='/logout'>
                      <button className='btn btn-sm btn-secondary mr-2'>
                        Logout
                      </button>
                    </a>
                    <button
                      // onClick={doProfileSave}
                      className='btn btn-sm btn-success'
                    >
                      Save and Continue
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </section>
      </div>
    );
  }
);
