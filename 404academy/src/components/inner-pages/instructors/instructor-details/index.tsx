import HeaderOne from "../../../../layouts/headers/HeaderOne"
import BreadcrumbTwo from "../../../common/breadcrumb/BreadcrumbTwo"
import InstructorDetailsArea from "./InstructorDetailsArea"
import FooterThree from "../../../../layouts/footers/FooterThree.tsx";
import {useState} from "react";


const InstructorsDetails = () => {

    const [instructorName, setInstructorName] = useState("Instructor");

   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbTwo title={instructorName} sub_title="Instructors" />
             <InstructorDetailsArea setInstructorName={setInstructorName} />
         </main>
         <FooterThree />

      </>
   )
}

export default InstructorsDetails
