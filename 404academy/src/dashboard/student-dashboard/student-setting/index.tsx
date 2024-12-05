import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import { AuthProvider } from '../../../firebase/AuthContext'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentSettingArea from './StudentSettingArea'
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const StudentSetting = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentSettingArea />
         </main>
          <FooterThree />

      </>
   )
}

export default StudentSetting

