import Wrapper from '../layouts/Wrapper';
import InstructorAttemptMain from '../dashboard/instructor-dashboard/instructor-attempts';
import SEO from '../components/SEO';

const InstructorAttempt = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Attempt'} />
         <InstructorAttemptMain />
      </Wrapper>
   );
};

export default InstructorAttempt;