import FooterOne from "../../../layouts/footers/FooterOne"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import WishlistArea from "./WishlistArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";
import {AuthProvider} from "../../../firebase/AuthContext.tsx";

const Wishlist = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Wishlist" sub_title="Wishlist" />
            <WishlistArea />
         </main>
         <FooterThree />

      </>
   )
}

export default Wishlist
