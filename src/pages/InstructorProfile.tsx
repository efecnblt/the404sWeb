import Wrapper from '../layouts/Wrapper';
import InstructorProfileMain from '../dashboard/instructor-dashboard/profile';
import SEO from '../components/SEO';

const InstructorProfile = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Profile'} />
         <InstructorProfileMain />
      </Wrapper>
   );
};

export default InstructorProfile;