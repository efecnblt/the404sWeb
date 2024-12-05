import Wrapper from '../layouts/Wrapper';
import EventMain from '../components/inner-pages/events/event';
import SEO from '../components/SEO';

const Event = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Event'} />
         <EventMain />
      </Wrapper>
   );
};

export default Event;