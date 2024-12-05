
import HeaderOne from "../../../layouts/headers/HeaderOne"
import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne"
import LoginArea from "./LoginArea"
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const Login = () => {
   return (
      <>
         <HeaderOne />
         <main className="main-area fix">
            <BreadcrumbOne title="Student Login" sub_title="Login" />
            <LoginArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Login

