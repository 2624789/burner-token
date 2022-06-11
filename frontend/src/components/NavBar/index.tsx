import React from 'react';

import Connect from './../Connect';

import './style.scss';

const NavBar: React.FC = () =>
  <div className="NavBar">
    <div className="Container">
      <div className="NavBar-Content">
        <p>Burn</p>
        <Connect />
      </div>
    </div>
  </div>

export default NavBar;
