import Wrapper from '../layouts/Wrapper';
import InstructorQuizMain from '../dashboard/instructor-dashboard/instructor-quiz';
import SEO from '../components/SEO';

const InstructorQuiz = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Instructor Quiz'} />
         <InstructorQuizMain />
      </Wrapper>
   );
};

export default InstructorQuiz;