import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import { AuthProvider } from '../../../firebase/AuthContext'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentAttemptsArea from './StudentAttemptsArea'
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const StudentAttempts = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentAttemptsArea />
         </main>
          <FooterThree />

      </>
   )
}

export default StudentAttempts

