import React, { useState } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import logo from './petr_logo.png'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import "./HeaderStyle.css"

function Header({ getData, items }) {
    return (
        <Navbar className="mb-3">
            <img src={logo} alt="petr" className="petr"/>
            <h1 href="#">PetrSelectr</h1>
            <div className="search-bar">
                <ReactSearchAutocomplete
                    items={items}
                    onSearch={(s, r) => {
                        getData(s)
                    }}
                />
            </div>
        </Navbar >
    )
}

export default Header