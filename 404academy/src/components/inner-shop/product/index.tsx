import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import ProductArea from "./ProductArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";


const Product = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Shop Page" sub_title="Shop Page" />
            <ProductArea />
         </main>
         <FooterThree />

      </>
   )
}

export default Product
