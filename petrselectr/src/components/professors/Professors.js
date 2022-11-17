import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

function Professors({profs}) {
    return (
        <Container fluid className="d-flex flex-row flex-nowrap overflow-auto">
            {
                profs.map((prof) => (
                    <Col key={prof.name} className="col-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{prof.name}</Card.Title>
                                <Card.Text>
                                    {prof.rating}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            }
        </Container>
    )
}

export default Professors