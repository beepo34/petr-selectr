import './bootstrap.min.css';
import React, { useState } from 'react';
import Header from './components/Header.js'
import Schedule from './components/Schedule.js'
import Professors from './components/Professors.js'
import { courseInfoQuery } from './api/queries/queries'
import useFetch from 'use-http'
function App() {

  const [profs, setProfs] = useState([{ name: 'shindler', rating: 3.8 }, { name: 'wongma', rating: 2.8 }, { name: 'pattis', rating: 4.8 }, { name: 'thornton', rating: 4.8 }, { name: 'gassko', rating: 1.8 }]);
  const [fall, setFall] = useState([]);
  const [winter, setWinter] = useState([]);
  const [spring, setSpring] = useState([]);

  const options = {
    // displays error message when an error occurs
    onError: ({error}) => {
      console.log("An error occurred. Please try searching the course again.")
    }
  }

  const graphqlRequest = useFetch('https://api.peterportal.org/graphql/', options) // may be better to put this link in .env?
  const getCourseInfo = id => graphqlRequest.query(courseInfoQuery, {classID: id})

  const getData = async e => {
    e.preventDefault();
    const formData = new FormData(e.target),
    formDataObj = Object.fromEntries(formData.entries())
    console.log(formDataObj) //form input
    
    getCourseInfo(formDataObj.course)
  }

  return (
    <>
      <Header getData={getData} />
      <Schedule fall={fall} winter={winter} spring={spring} />
      <Professors profs={profs} />
    </>
  );
}

export default App;
