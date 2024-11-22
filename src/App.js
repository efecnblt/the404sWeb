import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import CourseDetail from "./pages/CourseDetail";
import AuthorCourses from "./pages/AuthorCourses";
import CourseDetailPage from "./pages/CourseDetail";
import AuthorsSection from "./components/AuthorsSection";
import CoursesList from "./components/CoursesList";
import InstructorDetail from "./pages/InstructorDetail";
import InstructorProfile from "./components/InstructorProfile";
import InstructorsSection from "./components/InstructorsSection";
import CourseDetails from "./components/CourseDetails";
import TopCoursesSection from "./components/TopCoursesSection";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./components/Profile";
import SearchPage from "./pages/SearchPage";
// Doğru yolu belirleyin
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </Router>
        /*<Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/author/:authorId" element={<AuthorCourses />} />
                <Route path="/author/:authorId/course/:courseId" element={<CourseDetailPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                {/!* Eğitmenler sayfası *!/}
                <Route path="/" element={<AuthorsSection />} />

                {/!* Bir eğitmenin kurs listesi *!/}
                <Route path="/authors/:authorId/courses" element={<CoursesList />} />

                {/!* Bir kursun detay sayfası *!/}
                <Route path="/authors/:authorId/courses/:courseId" element={<CourseDetail />} />
                <Route path="/" element={<InstructorsSection />} />
                <Route path="/instructors/:instructorId" element={<InstructorDetail />} />
                <Route path="/instructor/:instructorId" element={<InstructorProfile />} />
                <Route path="/course/:courseId" element={<CourseDetails />} />


            </Routes>
            <Footer />
        </Router>*/
    );
}

export default App;
