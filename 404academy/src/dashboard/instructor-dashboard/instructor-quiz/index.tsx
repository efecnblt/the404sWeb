import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import InstructorQuizArea from './InstructorQuizArea'
import {AuthProvider} from "../../../firebase/AuthContext.tsx";

const InstructorQuiz = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <InstructorQuizArea />
         </main>
         <FooterOne />

      </>
   )
}

export default InstructorQuiz
