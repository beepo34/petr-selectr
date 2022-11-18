export const courseInfoQuery = `query($classID: String!) {
    course(id: $classID) {
      id
      title
      department
      number
      units
      description
      course_level
      department
      number
      prerequisite_list{
        id
      }
      instructor_history {
        name
        shortened_name
        ucinetid
      }
    }
  }`;