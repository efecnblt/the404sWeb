import Wrapper from '../layouts/Wrapper';
import InstructorHistoryMain from '../dashboard/instructor-dashboard/instructor-history';
import SEO from '../components/SEO';

const InstructorHistory = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor History'} />
         <InstructorHistoryMain />
      </Wrapper>
   );
};

export default InstructorHistory;