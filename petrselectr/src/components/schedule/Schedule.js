import React, { useState } from 'react';
import './ScheduleStyle.css'

function Schedule({ course, fall, winter, spring }) {
    return (
        <table bordered className="table-bordered scheduleTable">
            <thead>
                <tr>
                    <th className="course-title col-3 text-center">Course</th>
                    <th className="col-3">Fall</th>
                    <th className="col-3">Winter</th>
                    <th className="col-3">Spring</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="course-info">
                        <b>{course.department} {course.number}</b>
                        <p>{course.title}</p>
                        <p className="description">{course.description}</p>
                        {course.course_level == null && course.units == null ?
                            null
                            :
                            <span>
                                <span className="tag">
                                    {course.course_level}
                                </span>
                                <span className="tag">
                                    {course.units} units
                                </span>
                            </span>
                        }
                    </td>
                    <td>
                        <div className="professor-cell">
                        {
                            fall.map((prof) => (
                                <p className="professor"><a href={prof.link}>{prof.name}</a></p>
                            ))
                        }
                        </div>
                    </td>
                    <td className="professor-cell">
                    <div className="professor-cell">
                        {
                            winter.map((prof) => (
                                <p className="professor"><a href={prof.link}>{prof.name}</a></p>
                            ))
                        }
                        </div>
                    </td>
                    <td className="professor-cell">
                    <div className="professor-cell">
                        {
                            spring.map((prof) => (
                                <p className="professor"><a href={prof.link}>{prof.name}</a></p>
                            ))
                        }
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default Schedule