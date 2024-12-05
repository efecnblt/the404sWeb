import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentHistoryArea from './StudentHistoryArea'
import {AuthProvider} from "../../../firebase/AuthContext.tsx";
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const StudentHistory = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentHistoryArea />
         </main>
          <FooterThree />

      </>
   )
}

export default StudentHistory

