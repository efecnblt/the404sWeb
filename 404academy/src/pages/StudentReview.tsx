import Wrapper from '../layouts/Wrapper';
import StudentReviewMain from '../dashboard/student-dashboard/student-review';
import SEO from '../components/SEO';

const StudentReview = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Student Review'} />
         <StudentReviewMain />
      </Wrapper>
   );
};

export default StudentReview;