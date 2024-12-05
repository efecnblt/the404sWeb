import Wrapper from '../layouts/Wrapper';
import HomeEightMain from '../components/homes/home-eight';
import SEO from '../components/SEO';

const HomeEight = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Home Eight'} />
         <HomeEightMain />
      </Wrapper>
   );
};

export default HomeEight;