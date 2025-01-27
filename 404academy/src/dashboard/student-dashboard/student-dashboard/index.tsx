import DashboardBreadcrumb from '../../../components/common/breadcrumb/DashboardBreadcrumb'
import HeaderOne from '../../../layouts/headers/HeaderOne'
import StudentDashboardArea from './StudentDashboardArea'
import FooterThree from "../../../layouts/footers/FooterThree.tsx";
import {Mosaic} from "react-loading-indicators";
import {useEffect, useState} from "react";


const StudentDashboard = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a delay for loading (örnek: veri yükleniyor gibi)
        const timeout = setTimeout(() => setLoading(false), 1000); // 1 saniye gecikme

        return () => clearTimeout(timeout); // Temizlik işlemi
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Mosaic color={["#33CCCC", "#33CC36", "#B8CC33", "#FCCA00"]} />
            </div>
        );
    }
   return (
      <>

         <HeaderOne />
         <main className="main-area fix">
            <DashboardBreadcrumb />
            <StudentDashboardArea />
         </main>
          <FooterThree />

      </>
   )
}

export default StudentDashboard
