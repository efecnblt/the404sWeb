import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import CheckOutArea from "./CheckOutArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const CheckOut = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="check-out" sub_title="check-out" />
            <CheckOutArea />
         </main>
         <FooterThree />

      </>
   )
}

export default CheckOut
