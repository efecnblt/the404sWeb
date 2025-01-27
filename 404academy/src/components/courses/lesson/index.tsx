
import HeaderOne from "../../../layouts/headers/HeaderOne"
import LessonArea from "./LessonArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const Lesson = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <LessonArea />
         </main>
         <FooterThree/>

      </>
   )
}

export default Lesson
