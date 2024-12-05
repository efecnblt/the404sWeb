import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import { AuthProvider } from '../../../firebase/AuthContext'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentEnrolledCoursesArea from './StudentEnrolledCoursesArea'
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const StudentEnrolledCourses = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentEnrolledCoursesArea />
         </main>
          <FooterThree />

      </>
   )
}

export default StudentEnrolledCourses
