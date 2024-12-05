import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import RegistrationArea from "./RegistrationArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const Registration = () => {
   return (
      <>
         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Student Sign Up" sub_title="SingUp" />
            <RegistrationArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Registration

