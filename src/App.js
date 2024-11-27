import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sayfa ve Bileşenlerin Importları
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Profile from "./components/Profile";
import SearchPage from "./pages/SearchPage";
import InstructorProfile from "./components/InstructorProfile";
import CoursePage from "./pages/CoursePage";
import Layout from "./components/Layout";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import CourseDetail from "./components/CourseDetail";

function App() {
    return (
        <Router>
            <Routes>
                {/* İlk Açılış: Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Layout ile Sarılan Rotalar */}
                <Route path="/app" element={<Layout />}>
                    <Route index element={<Home />} /> {/* "/app" ana sayfa */}
                    <Route path="profile" element={<Profile />} />
                    <Route path="home" element={<Home />} />
                    <Route path="/app/home/instructor/:instructorId" element={<InstructorProfile />} />
                    <Route path="/app/home/search" element={<SearchPage />} />
                    <Route path="/app/home/contact" element={<Contact />} />
                    <Route path="/app/home/about" element={<AboutUs />} />

                    <Route path="/app/home/course/:authorId/:courseId" element={<CourseDetail />} />

                </Route>

                {/* Bağımsız Rotalar */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </Router>
    );
}

export default App;
