import Wrapper from '../layouts/Wrapper';
import HomeFourMain from '../components/homes/home-four';
import SEO from '../components/SEO';

const HomeFour = () => {
  return (
    <Wrapper>
      <SEO pageTitle={'404 Academy Home Four'} />
      <HomeFourMain />
    </Wrapper>
  );
};

export default HomeFour;