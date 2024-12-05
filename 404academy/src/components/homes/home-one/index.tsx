import Banner from "./Banner"
import CourseArea from "./CourseArea"
import Newsletter from "./Newsletter"
import Instructor from "./Instructor"
import Counter from "./Counter"
import FaqArea from "./FaqArea"
import Features from "./Features"
import InstructorTwo from "./InstructorTwo"
import Categories from "./Categories"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BrandOne from "../../common/brands/BrandOne"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const HomeOne = () => {
   return (
      <>
         <HeaderOne />
         <main className="main-area fix">
            <Banner />
            <Categories />
            <BrandOne />
            {/*<About />*/}
            <CourseArea style={false} />
            <Newsletter />
            <Instructor />
            <Counter />

            <Features />
            <InstructorTwo style={false} />
             <FaqArea />
         </main>
         <FooterThree />

      </>
   )
}

export default HomeOne
