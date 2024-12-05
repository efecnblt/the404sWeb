import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentProfileArea from './StudentProfileArea'
import FooterThree from "../../../layouts/footers/FooterThree.tsx";


const StudentProfile = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentProfileArea />
         </main>
         <FooterThree />

      </>
   )
}

export default StudentProfile
