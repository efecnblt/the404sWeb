import Newsletter from "../components/Newsletter";
import CoursesSection from "../components/CoursesSection";
import HeroSection from "../components/HeroSection";
import InstructorsSection from "../components/InstructorsSection";
import TopCoursesSection from "../components/TopCoursesSection";
import Footer from "../components/Footer";


function Home() {


    return (
        <div>
            <HeroSection/>
            <CoursesSection/>
            <InstructorsSection/>
            <TopCoursesSection/>
            <Newsletter/>
            <Footer/>
        </div>
    );
}

export default Home;
