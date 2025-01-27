import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Course from '../pages/Course';
import Lesson from '../pages/Lesson';
import CourseDetails from '../pages/CourseDetails';
import About from '../pages/About';
import Instructor from '../pages/Instructor';
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
import {AuthProvider} from '../firebase/AuthContext';
import {useLoading} from '../LoadingContext';
import {useLocation} from "react-use";
import {useEffect} from "react";
import VerificationForm from "../forms/VerificationForm.tsx";
import Wishlist from "../pages/Wishlist.tsx";
import Cart from "../pages/Cart.tsx";
import CheckOut from "../pages/CheckOut.tsx";
import CreateCourse from "../dashboard/instructor-dashboard/create-course/CreateCourse.tsx";
import AddQuiz from '../dashboard/quiz/AddQuiz.tsx';
import QuizPage from "../components/courses/lesson/QuizPage.tsx";
import ProtectedRoute from "../components/protected-route/ProtectedRoute.tsx";


const AppNavigation = () => {
    const {setLoading} = useLoading();
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
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about-us" element={<About/>}/>
                    <Route path="/instructors" element={<Instructor/>}/>
                    <Route path="/instructor-details/:instructorId" element={<InstructorsDetails/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/registration" element={
                        <ProtectedRoute allowedForGuests={true}>
                            <Registration />
                        </ProtectedRoute>

                    }/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/courses" element={<Course/>}/>
                    <Route path="/verify" element={<VerificationForm/>}/>
                    <Route path="/wishlist" element={

                        <Wishlist/>

                    }/>
                    <Route path="/cart" element={

                        <Cart/>

                    }/>
                    <Route path="/check-out" element={

                        <CheckOut/>

                    }/>
                    <Route path="/lesson/:courseId" element={<Lesson/>}/>
                    <Route path="/student-dashboard/:id" element={

                        <StudentDashboard/>

                    }/>
                    <Route path="/course-details/:authorId/:courseId" element={<CourseDetails/>}/>
                    <Route path="/instructor-dashboard/:encodedId" element={

                        <InstructorDashboard/>

                    }/>
                    <Route path="/create-course" element={

                        <CreateCourse/>

                    }/>
                    <Route path="/add-quiz" element={

                        <AddQuiz/>


                    }/>
                    <Route path="/instructor-profile/:userId" element={

                        <InstructorProfile/>

                    }/>
                    <Route path="/instructor-enrolled-courses/:userid" element={

                        <InstructorEnrollCourse/>

                    }/>

                    <Route path="/instructor-wishlist" element={<InstructorWishlist/>}/>
                    <Route path="/instructor-review" element={<InstructorReview/>}/>
                    <Route path="/instructor-attempts/:userId" element={

                        <InstructorAttempt/>


                    }/>

                    <Route path="/quiz/:quizID" element={<QuizPage/>}/>
                    <Route path="/instructor-history" element={<InstructorHistory/>}/>
                    <Route path="/instructor-courses" element={<InstructorCourses/>}/>
                    <Route path="/instructor-announcement" element={<InstructorAnnouncement/>}/>
                    <Route path="/instructor-quiz" element={<InstructorQuiz/>}/>
                    <Route path="/instructor-assignment" element={<InstructorAssignment/>}/>
                    <Route path="/instructor-setting/:userid" element={<InstructorSetting/>}/>
                    <Route path="/student-profile/:firebaseUID" element={
                        <StudentProfile/>
                    }/>
                    <Route path="/student-enrolled-courses/:userId" element={

                        <StudentEnrollCourse/>

                    }/>

                    <Route path="/student-review/:userId" element={<StudentReview/>}/>
                    <Route path="/student-attempts/:userId" element={<StudentAttempt/>}/>
                    <Route path="/student-history/:userId" element={<StudentHistory/>}/>
                    <Route path="/student-setting/:userId" element={<StudentSetting/>}/>
                    {/* <Route path="/blog-details/:id" element={<DynamicBlogDeatils />} /> */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </ AuthProvider>

    );
};

export default AppNavigation;
