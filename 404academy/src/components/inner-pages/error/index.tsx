
import HeaderOne from "../../../layouts/headers/HeaderOne"
import ErrorArea from "./ErrorArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const NotFound = () => {
   return (
      <>
         <HeaderOne />
         <main className="main-area fix">
            <ErrorArea />
         </main>
         <FooterThree />
      </>
   )
}

export default NotFound

