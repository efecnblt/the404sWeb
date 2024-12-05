import Wrapper from '../layouts/Wrapper';
import InstructorEnrollCourseMain from '../dashboard/instructor-dashboard/instructor-enrolled-courses';
import SEO from '../components/SEO';

const InstructorEnrollCourse = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Enroll Course'} />
         <InstructorEnrollCourseMain />
      </Wrapper>
   );
};

export default InstructorEnrollCourse;