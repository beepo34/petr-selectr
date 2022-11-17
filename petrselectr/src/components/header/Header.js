import React, { useState } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap';

function Header({getData}) {
    const [courseID, setCourseID] = useState("");
    return (
        <Navbar bg="light" className="mb-3">
            <h1 href="#">PetrSelectr</h1>
            <Form className="d-flex" onSubmit={(e) => {e.preventDefault(); getData(courseID)}}>
                <Form.Control type="text" name="course" value={courseID} placeholder="Search Course" onChange={(e)=>{setCourseID(e.target.value)}}/>
                <Button type="submit" variant="dark">Search</Button>
            </Form>
        </Navbar>
    )
}

export default Header