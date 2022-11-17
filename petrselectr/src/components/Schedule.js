import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';

function Schedule({fall, winter, spring}) {
    return (
        <Table bordered>
            <tbody>
                <tr>
                    <th rowSpan={2} className="text-center">Course</th>
                    <th className="col-3">Fall</th>
                    <th className="col-3">Winter</th>
                    <th className="col-3">Spring</th>
                </tr>
                <tr>
                    <td>
                        {
                            fall.map((prof) => (
                                <p key={prof.name}>{prof.name}</p>
                            ))
                        }
                    </td>
                    <td>
                        {
                            winter.map((prof) => (
                                <p key={prof.name}>{prof.name}</p>
                            ))
                        }
                    </td>
                    <td>
                        {
                            spring.map((prof) => (
                                <p key={prof.name}>{prof.name}</p>
                            ))
                        }
                    </td>
                </tr>
            </tbody>
        </Table>
    )
}

export default Schedule