import FooterOne from "../../../layouts/footers/FooterOne"
import HeaderOne from "../../../layouts/headers/HeaderOne"
import LessonArea from "./LessonArea"
import {AuthProvider} from "../../../firebase/AuthContext.tsx";

const Lesson = () => {
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <LessonArea />
         </main>
         <FooterOne style={false} style_2={true} />

      </>
   )
}

export default Lesson
