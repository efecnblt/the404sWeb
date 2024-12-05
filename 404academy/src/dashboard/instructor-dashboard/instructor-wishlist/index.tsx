import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import InstructorWishlistArea from './InstructorWishlistArea'
import {AuthProvider} from "../../../firebase/AuthContext.tsx";
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const InstructorWishlist = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <InstructorWishlistArea />
         </main>
          <FooterThree />

      </>
   )
}

export default InstructorWishlist
