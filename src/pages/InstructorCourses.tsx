import Wrapper from '../layouts/Wrapper';
import InstructorCoursesMain from '../dashboard/instructor-dashboard/instructor-courses';
import SEO from '../components/SEO';

const InstructorCourses = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Courses'} />
         <InstructorCoursesMain />
      </Wrapper>
   );
};

export default InstructorCourses;