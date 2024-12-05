import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Course from '../pages/Course';
import Lesson from '../pages/Lesson';
import CourseDetails from '../pages/CourseDetails';
import About from '../pages/About';
import Instructor from '../pages/Instructor';
import Event from '../pages/Event';
import EventDetails from '../pages/EventDetails';
import Shop from '../pages/Shop';
import ShopDetails from '../pages/ShopDetails';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import CheckOut from '../pages/CheckOut';
import Blog from '../pages/Blog';
import BlogTwo from '../pages/BlogTwo';
import BlogThree from '../pages/BlogThree';
import BlogDetails from '../pages/BlogDetails';
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import Contact from '../pages/Contact';
import InstructorDashboard from '../pages/InstructorDashboard';
import InstructorProfile from '../pages/InstructorProfile';
import InstructorEnrollCourse from '../pages/InstructorEnrolledCourses';
import InstructorWishlist from '../pages/InstructorWishlist';
import InstructorReview from '../pages/InstructorReview';
import InstructorQuiz from '../pages/InstructorQuiz';
import InstructorHistory from '../pages/InstructorHistory';
import InstructorCourses from '../pages/InstructorCourses';
import InstructorAnnouncement from '../pages/InstructorAnnouncement';
import InstructorAssignment from '../pages/InstructorAssignment';
import InstructorSetting from '../pages/InstructorSetting';
import InstructorAttempt from '../pages/InstructorAttempt';
import StudentDashboard from '../pages/StudentDashboard';
import StudentProfile from '../pages/StudentProfile';
import StudentEnrollCourse from '../pages/StudentEnrolledCourses';
import StudentWishlist from '../pages/StudentWishlist';
import StudentReview from '../pages/StudentReview';
import StudentAttempt from '../pages/StudentAttempt';
import StudentHistory from '../pages/StudentHistory';
import StudentSetting from '../pages/StudentSetting';
import NotFound from '../pages/NotFound';
import InstructorsDetails from "../components/inner-pages/instructors/instructor-details";
import { AuthProvider } from '../firebase/AuthContext';
import {useLoading} from '../LoadingContext';
import {useLocation} from "react-use";
import {useEffect} from "react";

const AppNavigation = () => {
  const { setLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    // Sayfa geçişi başladığında loading'i başlat
    setLoading(true);

    // Simülasyon: Sayfa geçişinden sonra loading'i kapat
    const timeout = setTimeout(() => setLoading(false), 500); // 0.5 saniyelik yükleme simülasyonu

    return () => clearTimeout(timeout); // Temizlik işlemi
  }, [location, setLoading]);

  return (

      <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />


        <Route path="/lesson" element={<Lesson />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/instructors" element={<Instructor />} />
        <Route path="/instructor-details/:instructorId" element={<InstructorsDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Course />} />
        <Route path="/course-details/:authorId/:courseId" element={<CourseDetails />} />
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor-profile" element={<InstructorProfile />} />
        <Route path="/instructor-enrolled-courses" element={<InstructorEnrollCourse />} />
        <Route path="/instructor-wishlist" element={<InstructorWishlist />} />
        <Route path="/instructor-review" element={<InstructorReview />} />
        <Route path="/instructor-attempts" element={<InstructorAttempt />} />
        <Route path="/instructor-history" element={<InstructorHistory />} />
        <Route path="/instructor-courses" element={<InstructorCourses />} />
        <Route path="/instructor-announcement" element={<InstructorAnnouncement />} />
        <Route path="/instructor-quiz" element={<InstructorQuiz />} />
        <Route path="/instructor-assignment" element={<InstructorAssignment />} />
        <Route path="/instructor-setting" element={<InstructorSetting />} />
        <Route path="/student-dashboard/:userId" element={<StudentDashboard />} />

        <Route path="/student-profile/:userId" element={<StudentProfile />} />
        <Route path="/student-enrolled-courses/:userId" element={<StudentEnrollCourse />} />
        <Route path="/student-wishlist/:userId" element={<StudentWishlist />} />
        <Route path="/student-review/:userId" element={<StudentReview />} />
        <Route path="/student-attempts/:userId" element={<StudentAttempt />} />
        <Route path="/student-history/:userId" element={<StudentHistory />} />
        <Route path="/student-setting/:userId" element={<StudentSetting />} />
        {/* <Route path="/blog-details/:id" element={<DynamicBlogDeatils />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
        </ AuthProvider>

  );
};

export default AppNavigation;
