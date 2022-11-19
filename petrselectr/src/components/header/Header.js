import React, { useState } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';
import logo from './petr_logo.png'
import './HeaderStyle.css'

function Header({getData}) {
    const [courseID, setCourseID] = useState("");
    return (
        <Navbar className="mb-3">
            <img src={logo} alt="petr" className="petr"/>
            <h1 href="#">PetrSelectr</h1>
            <Form className="d-flex search-bar" onSubmit={(e) => {e.preventDefault(); getData(courseID)}}>
                <Form.Control type="text" name="course" value={courseID} placeholder="Search Course" onChange={(e)=>{setCourseID(e.target.value)}}/>
                <Button type="submit" className='search-button'>Search</Button>
            </Form>
        </Navbar>
    )
}

export default Header