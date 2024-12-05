import Wrapper from '../layouts/Wrapper';
import BlogMain from '../components/blogs/blog';
import SEO from '../components/SEO';

const Blog = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'404 Academy Blog'} />
         <BlogMain />
      </Wrapper>
   );
};

export default Blog;