import Wrapper from '../layouts/Wrapper';
import WishlistMain from '../components/inner-shop/wishlist';
import SEO from '../components/SEO';

const Wishlist = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Wishlist'} />
         <WishlistMain />
      </Wrapper>
   );
};

export default Wishlist;