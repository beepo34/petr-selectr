import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Header({getData}) {
    return (
        <Navbar bg="light" className="mb-3">
            <h1 href="#">PetrSelectr</h1>
            <Form className="d-flex" onSubmit={getData}>
                <Form.Control type="text" name="course" placeholder="Search Course" />
                <Button type="submit" variant="dark">Search</Button>
            </Form>
        </Navbar>
    )
}

export default Header