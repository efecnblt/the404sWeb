import Wrapper from '../layouts/Wrapper';
import ContactMain from '../components/inner-pages/contact';
import SEO from '../components/SEO';

const Contact = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Contact'} />
         <ContactMain />
      </Wrapper>
   );
};

export default Contact;