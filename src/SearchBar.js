import React from 'react';
import './head.css';
import 'font-awesome/css/font-awesome.min.css';

const SearchBar = () => {
  return (
    <div style={{ backgroundColor: 'rgb(148, 148, 145)', minHeight: '100vh', width: 'auto', margin: 'auto'}}>
      <div className="search">
        <div className="center">
          <form action="#">
            <input type="text" placeholder="Search Signs" name="search" />
            <button className="search-button">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>

      <div className="eng-to-asl-button">
        <button>Test</button>
      </div>
    </div>
  );
};

export default SearchBar;
