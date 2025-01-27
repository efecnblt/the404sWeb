import { useEffect } from "react"
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
import FooterThree from "../../../layouts/footers/FooterThree.tsx"
import { useLoading } from "../../../LoadingContext"
import { Mosaic } from "react-loading-indicators"

const HomeOne = () => {
   const { loading, setLoading } = useLoading();

   useEffect(() => {
      // Set loading to true when component mounts
      setLoading(true);

      // Simulate data loading
      const timer = setTimeout(() => {
         setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
   }, [setLoading]);

   if (loading) {
      return (
         <div
            style={{
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               height: "100vh",
               backgroundColor: "#f9f9f9",
            }}
         >
            <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
         </div>
      );
   }

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
