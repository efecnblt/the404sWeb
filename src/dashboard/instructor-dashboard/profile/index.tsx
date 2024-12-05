import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import InstructorProfileArea from './InstructorProfileArea'
import {AuthProvider} from "../../../firebase/AuthContext.tsx";
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const InstructorProfile = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <InstructorProfileArea />
         </main>
          <FooterThree />

      </>
   )
}

export default InstructorProfile
