import Wrapper from '../layouts/Wrapper';
import InstructorSettingMain from '../dashboard/instructor-dashboard/instructor-setting';
import SEO from '../components/SEO';

const InstructorSetting = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Setting'} />
         <InstructorSettingMain />
      </Wrapper>
   );
};

export default InstructorSetting;