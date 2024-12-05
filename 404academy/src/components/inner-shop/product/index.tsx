import FooterOne from "../../../layouts/footers/FooterOne"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import ProductArea from "./ProductArea"
import {AuthProvider} from "../../../firebase/AuthContext.tsx";

const Product = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Shop Page" sub_title="Shop Page" />
            <ProductArea />
         </main>
         <FooterOne style={false} style_2={false} />

      </>
   )
}

export default Product
