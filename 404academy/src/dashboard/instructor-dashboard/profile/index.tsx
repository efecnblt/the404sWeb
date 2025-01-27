import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import InstructorProfileArea from './InstructorProfileArea'
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
