import Wrapper from '../layouts/Wrapper';
import StudentAttemptMain from '../dashboard/student-dashboard/student-attempts';
import SEO from '../components/SEO';

const StudentAttempt = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Student Attempt'} />
         <StudentAttemptMain />
      </Wrapper>
   );
};

export default StudentAttempt;