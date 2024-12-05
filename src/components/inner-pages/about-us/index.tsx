import HeaderOne from "../../../layouts/headers/HeaderOne"
import BrandOne from "../../common/brands/BrandOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import Features from "../../homes/home-one/Features"
import Newsletter from "../../homes/home-one/Newsletter"
import Feature from "../../homes/home-two/Feature"
import About from "./About"
import Testimonial from "./Testimonial"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";
import { AuthProvider } from "../../../firebase/AuthContext.tsx"

const AboutUs = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Who We Are" sub_title="About Us" />
            <About />
            <BrandOne />
            <Feature style={true} />
            <Newsletter />
            <Features />
            <Testimonial />
         </main>
         <FooterThree />

      </>
   )
}

export default AboutUs
