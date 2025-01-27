import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import FooterOne from '../../../layouts/footers/FooterOne'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import DashboardHomeArea from './DashboardHomeArea'
import {AuthProvider} from "../../../firebase/AuthContext.tsx";
import FooterThree from "../../../layouts/footers/FooterThree.tsx";

const DashboardHome = () => {
  return (
    <>

      <HeaderOne />
      <main className="main-area fix">
        <DashboardBreadcrumb />
        <DashboardHomeArea />
      </main>
      <FooterThree />

    </>
  )
}

export default DashboardHome
