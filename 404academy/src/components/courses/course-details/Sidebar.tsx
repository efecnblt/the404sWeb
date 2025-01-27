import {useEffect, useState} from "react";
import InjectableSvg from "../../../hooks/InjectableSvg";
import { Link } from "react-router-dom";
import BtnArrow from "../../../svg/BtnArrow";
import VideoPopup from "../../../modals/VideoPopup";
import {getDiscountedPrice} from "../../../modals/DiscountPrice.ts";
import axios from "axios";
import UseWishlistInfo from "../../../hooks/UseWishlistInfo.ts";
import {useDispatch} from "react-redux";
import {addFavorite, removeFavorite} from "../../../redux/features/wishlistSlice.ts";
import {useAuth} from "../../../firebase/AuthContext.tsx";
import {toast} from "react-toastify";
import Product from "../../inner-shop/product";


const Sidebar = ({ authorData, courseData }: { authorData: any; courseData: any }) => {

    const { user, loading } = useAuth();
   const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false); // Kullanıcının kursa kayıtlı olup olmadığı

    const [totalVideos, setTotalVideos] = useState<number>(0); // Toplam video sayısı
    const [totalDuration, setTotalDuration] = useState<number>(0);
    const [totalQuizzes, setTotalQuizzes] = useState<number>(0); // Toplam quiz sayısı


    // WISHLIST İLE İLGİLİ HOOK VE DİSPATCH
    const dispatch = useDispatch();
    const { wishlistItems } = UseWishlistInfo();

    // Bu kurs favoride mi kontrol edelim
    const isCourseInWishlist = wishlistItems.some((item) => item.id === courseData.courseID);


    const skillLevelOptions = [
        { label: "Beginner", levelId: 1 },
        { label: "Intermediate", levelId: 2 },
        { label: "Advanced", levelId: 3 },
    ];

    // FAVORİ BUTONU TIKLANINCA ÇALIŞACAK
    const handleToggleWishlist = () => {
        if (loading) {
            return;
        }

        if (!user) {
            toast.error("Please log in to manage your wishlist");
            return;
        }

        const studentId = user.studentId;
        console.log(courseData);
        if (isCourseInWishlist) {
            dispatch(removeFavorite(studentId, courseData.courseID));
        } else {
            const product: Product = {
                id: courseData.courseID,
                title: courseData.name,
                thumb: courseData.image,
                price: courseData.price,
                authorId: courseData.authorId

            };
            console.log(product)
            dispatch(addFavorite(studentId, product));
        }
    };

    useEffect(() => {
        const fetchSectionsAndVideos = async () => {
            try {
                // 1. `sections` tablosundan courseId'ye göre section'ları çek
                const sectionsResponse = await axios.get(
                    `http://165.232.76.61:5001/api/Sections/course/${courseData.courseID}`
                );
                const sections = sectionsResponse.data;

                // 2. Her section için videoları çek ve toplam süreyi hesapla
                let totalDurationInSeconds = 0;
                let totalVideosCount = 0;
                let totalQuizzesCount = 0;

                await Promise.all(
                    sections.map(async (section: any) => {
                        const videosResponse = await axios.get(
                            `http://165.232.76.61:5001/api/Videos/section/${section.sectionID}`
                        );
                        const videos = videosResponse.data;

                        // Her section'daki videoların toplam süresi ve sayısını hesapla
                        totalDurationInSeconds += videos.reduce(
                            (total: number, video: any) => total + video.duration,
                            0
                        );

                        totalVideosCount += videos.length; // To

                        // Quizleri çek
                        const quizzesResponse = await axios.get(
                            `http://165.232.76.61:5001/api/Quiz/list-by-section/${section.sectionID}`
                        );
                        const quizzes = quizzesResponse.data;

                        // Quiz sayısını artır
                        totalQuizzesCount += quizzes.length;

                        // Her section'daki videoların süresini hesapla
                        const sectionDuration = videos.reduce(
                            (total: number, video: any) => total + video.duration,
                            0
                        );

                        totalDurationInSeconds += sectionDuration;
                    })
                );
                setTotalQuizzes(totalQuizzesCount);
                setTotalVideos(totalVideosCount);
                // Toplam süreyi state'e ata
                setTotalDuration(totalDurationInSeconds);
            } catch (error) {
                console.error("Error fetching sections or videos:", error);
            }
        };

        if (courseData.courseID) {
            fetchSectionsAndVideos();
        }
    }, [courseData.courseID]);

    // Süreyi saat, dakika ve saniye formatına dönüştürme
    const formatTotalDuration = (durationInSeconds: number) => {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    useEffect(() => {
        const fetchEnrollmentStatus = async () => {
            if (!user || !courseData.courseID) return;

            try {
                const response = await axios.get(
                    `http://165.232.76.61:5001/api/StudentCourses/getstudentsbycourse?courseId=${courseData.courseID}`
                );

                const students = response.data;

                // Kullanıcının kayıtlı olup olmadığını kontrol et
                const isEnrolled = students.some(
                    (student: any) => student.userId === user.id
                );

                setIsEnrolled(isEnrolled);

                // Kayıtlı ise favorilerden kaldır
                if (isEnrolled && isCourseInWishlist) {
                    await axios.get(
                        `http://165.232.76.61:5001/api/FavoriteCourses/removeFromFavorites?studentId=${user.studentId}&courseId=${courseData.courseID}`
                    );
                    dispatch(removeFavorite(user.studentId, courseData.courseID));

                }
            } catch (error) {
                console.error("Error fetching enrollment status:", error);
            }
        };

        fetchEnrollmentStatus();
    }, [user, courseData.courseID]);

    const courseLevel = skillLevelOptions.find(option => option.levelId === courseData.levelId)?.label || "Unknown";

   return (
      <>
         {authorData && courseData && (

         <div className="col-xl-3 col-lg-4">
            <div className="courses__details-sidebar">
               <div className="courses__details-video">
                  <img src={courseData.image} alt="img"/>
                  <a onClick={() => setIsVideoOpen(true)} style={{ cursor: "pointer" }} className="popup-video"><i className="fas fa-play"></i></a>
               </div>
               <div className="courses__cost-wrap">
                  <span>This Course Fee:</span>
                  <h2 className="title">${courseData.price} <del>${getDiscountedPrice(courseData.price, courseData.discount).toFixed(2)}</del></h2>
               </div>
               <div className="courses__information-wrap">
                  <h5 className="title">Course includes:</h5>
                  <ul className="list-wrap">
                     <li>
                        <InjectableSvg src="/assets/img/icons/course_icon01.svg" alt="img" className="injectable" />
                        Level
                        <span>{courseLevel}</span>
                     </li>
                      <li>
                          <InjectableSvg src="/assets/img/icons/course_icon02.svg" alt="img" className="injectable"/>
                          Duration
                          <span>{formatTotalDuration(totalDuration)}</span>
                      </li>
                      <li>
                      <InjectableSvg src="/assets/img/icons/course_icon03.svg" alt="img" className="injectable" />
                        Lessons
                        <span>{totalVideos}</span>
                     </li>
                      <li>
                          <InjectableSvg src="/assets/img/icons/course_icon04.svg" alt="img" className="injectable"/>
                          Quizzes
                          <span>{totalQuizzes}</span>
                      </li>
                      <li>
                      <InjectableSvg src="/assets/img/icons/course_icon05.svg" alt="img" className="injectable" />
                        Certifications
                        <span>Yes</span>
                     </li>
                  </ul>
               </div>
               <div className="courses__payment">
                  <h5 className="title">Secure Payment:</h5>
                  <img src="/assets/img/others/payment.png" alt="img" />
               </div>
               <div className="courses__details-social">
                  <h5 className="title">Share this course:</h5>
                  <ul className="list-wrap">
                     <li><Link to="#"><i className="fab fa-facebook-f"></i></Link></li>
                     <li><Link to="#"><i className="fab fa-twitter"></i></Link></li>
                     <li><Link to="#"><i className="fab fa-whatsapp"></i></Link></li>
                     <li><Link to="#"><i className="fab fa-instagram"></i></Link></li>
                     <li><Link to="#"><i className="fab fa-youtube"></i></Link></li>
                  </ul>
               </div>

                {/* FAVORİ BUTONU (EKLENEN KISIM) */}
                <div style={{ margin: "15px 0" }}>

                </div>

               <div className="courses__details-enroll">
                  <div className="tg-button-wrap">
                      {isEnrolled ? (
                          <Link to="/courses" className="btn btn-two arrow-btn">
                              Start Course<BtnArrow />
                          </Link>
                      ) : (
                          <button
                              onClick={handleToggleWishlist}
                              className="btn"
                              style={{width: "100%"}}
                          >
                              {isCourseInWishlist ? "Remove From Favorites" : "Add To Favorites"}
                          </button>
                      )}
                  </div>
               </div>
            </div>
         </div>
         )}
          <VideoPopup
              isVideoOpen={isVideoOpen}
              setIsVideoOpen={setIsVideoOpen}
              videoId={"MTUsIRYeKIQ"}
          />
      </>
   )
}

export default Sidebar
