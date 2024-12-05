import Wrapper from '../layouts/Wrapper';
import InstructorMain from '../components/inner-pages/instructors/instructor';
import SEO from '../components/SEO';

const Instructor = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor'} />
         <InstructorMain />
      </Wrapper>
   );
};

export default Instructor;