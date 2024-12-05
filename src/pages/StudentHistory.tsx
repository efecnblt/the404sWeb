import Wrapper from '../layouts/Wrapper';
import StudentHistoryMain from '../dashboard/student-dashboard/student-history';
import SEO from '../components/SEO';

const StudentHistory = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Student History'} />
         <StudentHistoryMain />
      </Wrapper>
   );
};

export default StudentHistory;