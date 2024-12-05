import Wrapper from '../layouts/Wrapper';
import CourseDetailsMain from '../components/courses/course-details';
import SEO from '../components/SEO';

const CourseDetails = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Course Details'} />
         <CourseDetailsMain />
      </Wrapper>
   );
};

export default CourseDetails;