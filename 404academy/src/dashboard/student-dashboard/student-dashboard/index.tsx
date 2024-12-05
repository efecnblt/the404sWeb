import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentDashboardArea from './StudentDashboardArea'
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const StudentDashboard = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentDashboardArea />
         </main>
          <FooterThree />

      </>
   )
}

export default StudentDashboard
