import Wrapper from '../layouts/Wrapper';
import InstructorAssignmentMain from '../dashboard/instructor-dashboard/instructor-assignment';
import SEO from '../components/SEO';

const InstructorAssignment = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Assignment'} />
         <InstructorAssignmentMain />
      </Wrapper>
   );
};

export default InstructorAssignment;