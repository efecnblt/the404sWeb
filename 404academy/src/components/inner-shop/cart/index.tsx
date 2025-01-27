import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import CartArea from "./CartArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const Cart = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Cart" sub_title="Cart" />
            <CartArea />
         </main>
         <FooterThree />

      </>
   )
}

export default Cart
