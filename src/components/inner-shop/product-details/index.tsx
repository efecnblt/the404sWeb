import FooterOne from "../../../layouts/footers/FooterOne"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import ProductDetailsArea from "./ProductDetailsArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";
import {AuthProvider} from "../../../firebase/AuthContext.tsx";

const ProductDetails = () => {
  return (
    <>

      <HeaderOne />
      <main className="main-area fix">
        <BreadcrumbOne title="Shop Details" sub_title="Shop Details" />
        <ProductDetailsArea />
      </main>
      <FooterThree />

    </>
  )
}

export default ProductDetails
