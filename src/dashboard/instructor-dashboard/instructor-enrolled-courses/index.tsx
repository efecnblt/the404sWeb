import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import InstructorEnrolledCourseArea from './InstructorEnrolledCourseArea'
import {AuthProvider} from "../../../firebase/AuthContext.tsx";

const InstructorEnrolledCourse = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <InstructorEnrolledCourseArea />
         </main>
         <FooterOne />

      </>
   )
}

export default InstructorEnrolledCourse
