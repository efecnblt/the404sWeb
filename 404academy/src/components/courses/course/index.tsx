import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import CourseArea from "./CourseArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const Course = () => {


   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="All Courses" sub_title="Courses" sub_title_2="" style={false} />
            <CourseArea />
         </main>
         <FooterThree />

      </>
   )
}

export default Course
