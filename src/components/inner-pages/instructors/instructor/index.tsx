
import HeaderOne from "../../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../../common/breadcrumb/BreadcrumbOne"
import InstructorArea from "./InstructorArea"
import FooterThree from "../../../../layouts/footers/FooterThree.tsx";
import {useState} from "react";


const Instructors = () => {
    const [instructorName] = useState("Instructor"); // Varsayılan değer

   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title={instructorName} sub_title="Instructors" />
             <InstructorArea />
         </main>
         <FooterThree />

      </>
   )
}

export default Instructors
