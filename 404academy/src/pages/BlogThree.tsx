import Wrapper from '../layouts/Wrapper';
import BlogThreeMain from '../components/blogs/blog-three';
import SEO from '../components/SEO';

const BlogThree = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Blog Three'} />
         <BlogThreeMain />
      </Wrapper>
   );
};

export default BlogThree;