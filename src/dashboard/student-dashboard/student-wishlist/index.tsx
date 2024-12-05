import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentWishlistArea from './StudentWishlistArea'
import {AuthProvider} from "../../../firebase/AuthContext.tsx";
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const StudentWishlist = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentWishlistArea />
         </main>
          <FooterThree />

      </>
   )
}

export default StudentWishlist
