import Wrapper from '../layouts/Wrapper';
import InstructorDashboardMain from '../dashboard/instructor-dashboard/dashboard-home';
import SEO from '../components/SEO';

const InstructorDashboard = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Dashboard'} />
         <InstructorDashboardMain />
      </Wrapper>
   );
};

export default InstructorDashboard;