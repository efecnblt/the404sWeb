
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import ContactArea from "./ContactArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";
import {AuthProvider} from "../../../firebase/AuthContext.tsx";

const Contact = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Contact With Us" sub_title="Contact" />
            <ContactArea />
         </main>
         <FooterThree />

      </>
   )
}

export default Contact

