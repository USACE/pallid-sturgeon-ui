import React from 'react';
import { ModalContent, ModalHeader, ModalFooter } from '../../app-components/modal';

const LandingModal = () => (
  <ModalContent size='lg'>
    <ModalHeader title='DEPARTMENT OF DEFENSE TERMS OF AGREEMENT' />
    <section className='modal-body'>
      <div className='container-fluid'>
        <p><b>You are accessing a U.S. Government (USG) information system (IS) that is provided for USG-authorized use only. By using this IS (which includes any device attached to this IS), you can consent to the following conditions:</b></p>
        <ul>
          <li>The USG routinely intercepts and monitors communications on this IS for purposes including,
          but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM), law enforcement (LE), and counterintelligence (CI) investigations.</li>
          <li>At any time, the USG may inspect and seize data stored on this IS.</li>
          <li>Communications using, or data stored on, this IS are not private, are subject to routine monitoring, interceptions, and search, and may be disclosed or used for
          any USG-authorized purpose.</li>
          <li>This IS includes security measures (e.g., authentication and access controls) to protect USG interests--not for your personal benefit or privacy.</li>
            Notwithstanding the above, using
          <li>this IS does not constitute consent to PM, LE or CI investigative searching or monitoring of the content of privileged communications, or work product, to personal representation or services by attorneys,
          psychotherapists, or clergy, and their assistants. Such communications and work product are private and confidential. See User Agreement for details.</li>
        </ul>
      </div>
    </section>
    <ModalFooter
      doModalClose
      saveText='I Accept'
    />
  </ModalContent >
);

export default LandingModal;