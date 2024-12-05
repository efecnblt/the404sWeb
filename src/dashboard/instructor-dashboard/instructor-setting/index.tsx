import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import { AuthProvider } from '../../../firebase/AuthContext'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import InstructorSettingArea from './InstructorSettingArea'
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const InstructorSetting = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <InstructorSettingArea />
         </main>
          <FooterThree />

      </>
   )
}

export default InstructorSetting
