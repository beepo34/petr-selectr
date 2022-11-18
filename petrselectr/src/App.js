import './bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Header from './components/header/Header.js'
import Schedule from './components/schedule/Schedule.js'
import Professors from './components/professors/Professors.js'
import { courseInfoQuery } from './api/queries/queries'
import useFetch from 'use-http'
function App() {

  const [profs, setProfs] = useState([]);
  const [courseInfo, setCourseInfo] = useState({});
  const [gradeInfo, setGradeInfo] = useState({});
  const [fall, setFall] = useState([]);
  const [winter, setWinter] = useState([]);
  const [spring, setSpring] = useState([]);

  const options = {
    // displays error message when an error occurs
    onError: ({ error }) => {
      console.log("An error occurred. Please try searching the course again.")
    },
    responseType: "json"
  }

  const graphqlRequest = useFetch('https://api.peterportal.org/graphql/', options) // may be better to put this link in .env?
  const getCourseInfo = id => graphqlRequest.query(courseInfoQuery, { classID: id })

  const getData = async (id) => {
    console.log(id) //form input

    await getCourseInfo(id)
      .then((response) => {
        console.log(response.data)
        setCourseInfo(response.data.course)
        const instructors = []
        response.data.course.instructor_history.forEach(prof => {
          instructors.push({ucinetid: prof.ucinetid, name: prof.name, shortened_name: prof.shortened_name})
        })
        console.log(instructors)
        setProfs(instructors)
      })
  }

  const getInstructorCourseGrades = async () => {
    const instructorCourseGradesQuery = "query {" + courseInfo.instructor_history.reduce((query, prof) => {
      return query + `${prof.ucinetid}: grades(instructor: "${prof.shortened_name}", department: "${courseInfo.department}", number: "${courseInfo.number}") {
          aggregate{
            sum_grade_a_count
            sum_grade_b_count
            sum_grade_c_count
            sum_grade_d_count
            sum_grade_f_count
            average_gpa
          }
        }`
      }, "") + "}" // constructs instructor grade distribution query
    await graphqlRequest.query(instructorCourseGradesQuery)
    .then((response) => {
      console.log(response.data)
      const grades = response.data
      for (var key in grades) {
        if (grades[key]) {
        grades[key] = {x: ["A", "B", "C", "D", "F"], 
                          y: [grades[key].aggregate.sum_grade_a_count,
                          grades[key].aggregate.sum_grade_b_count,
                          grades[key].aggregate.sum_grade_c_count,
                          grades[key].aggregate.sum_grade_d_count,
                          grades[key].aggregate.sum_grade_f_count]}
        }
      }
      setGradeInfo(response.data)
    })
  }

  useEffect(() => {
    if (JSON.stringify(courseInfo) !== "{}") getInstructorCourseGrades();
  }, [courseInfo])

  return (
    <>
      <Header getData={getData} />
      <Schedule course={courseInfo} fall={fall} winter={winter} spring={spring} />
      <Professors profs={profs} gradeInfo={gradeInfo} />
    </>
  );
}

export default App;
