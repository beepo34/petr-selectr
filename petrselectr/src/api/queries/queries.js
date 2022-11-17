export const courseInfoQuery = `query($classID: String!) {
    course(id: $classID) {
      id
      title
      department
      units
      description
      course_level
      prerequisite_list{
        id
      }
    }
  }`;