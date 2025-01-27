import React, { useEffect, useState } from "react";
import VideoPopup from "../../../modals/VideoPopup";
import { useParams } from "react-router-dom";
import axios from "axios";
import {useAuth} from "../../../firebase/AuthContext.tsx";

interface VideoType {
   videoID: number;
   sectionId: number;
   order: number;
   title: string;
   duration: number; // Duration in seconds
   url: string;
}

interface SectionType {
   sectionID: number;
   courseId: number;
   order: number;
   title: string;
   videos?: VideoType[];
}

const Curriculum = () => {
   const { courseId } = useParams(); // Extract courseId from the URL
   const [sections, setSections] = useState<SectionType[]>([]);
   const [loading, setLoading] = useState(true);
   const [isVideoOpen, setIsVideoOpen] = useState(false);
   const [currentOpenSectionId, setCurrentOpenSectionId] = useState<number | null>(null); // For toggling sections
   const { user } = useAuth(); // Kullanıcı bilgisi
   const [isEnrolled, setIsEnrolled] = useState(false); // Kullanıcının kayıtlı olup olmadığını takip et


   useEffect(() => {
      const fetchSectionsAndVideos = async () => {
         setLoading(true); // Start loading
         try {
            if (user && courseId) {
               const enrollmentResponse = await axios.get(
                   `http://165.232.76.61:5001/api/StudentCourses/getstudentsbycourse?courseId=${courseId}`
               );
               const enrolledStudents = enrollmentResponse.data;

               // Eğer kullanıcı bu kursta kayıtlıysa state'i güncelle
               const isUserEnrolled = enrolledStudents.some(
                   (student: any) => student.studentId === user.studentId
               );
               setIsEnrolled(isUserEnrolled);
            }

            // Fetch sections by course ID
            const sectionsResponse = await axios.get(
                `http://165.232.76.61:5001/api/Sections/course/${courseId}`
            );
            const sectionsData = sectionsResponse.data;

            // Fetch videos for each section
            const sectionsWithVideos = await Promise.all(
                sectionsData.map(async (section: SectionType) => {

                   try {
                      const videosResponse = await axios.get(
                          `http://165.232.76.61:5001/api/Videos/section/${section.sectionID}`
                      );

                      return { ...section, videos: videosResponse.data };
                   } catch (error) {
                      console.error(`Error fetching videos for section ${section.sectionID}:`, error);
                      return { ...section, videos: [] };
                   }
                })
            );




            setSections(sectionsWithVideos);
         } catch (error) {
            console.error("Error fetching sections or videos:", error);
         } finally {
            setLoading(false); // Stop loading
         }
      };

      if (courseId) {
         fetchSectionsAndVideos();
      }
   }, [courseId, user]);




   const handleToggleSection = (sectionId: number) => {
      // If the same section is clicked, close it. Otherwise, open the new one.
      setCurrentOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
   };

   if (loading) {
      return <p>Loading...</p>; // Replace with a proper loading spinner if desired
   }

   if (!sections || sections.length === 0) {
      return <p>No sections available for this course.</p>;
   }
   const formatDuration = (durationInSeconds: number) => {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
   };


   return (
       <>
          <div className="courses__curriculum-wrap">
             <h3 className="title">Course Curriculum</h3>
             <p>
                Explore the course content. Click on a section to reveal the videos available for it.
             </p>
             <div className="accordion" id="accordionExample">
                {sections.map((section) => (
                    <div key={section.sectionID} className="accordion-item">
                       <h2 className="accordion-header" id={`heading${section.sectionID}`}>
                          <button
                              className={`accordion-button ${
                                  currentOpenSectionId === section.sectionID ? "" : "collapsed"
                              }`}
                              type="button"
                              onClick={() => handleToggleSection(section.sectionID)}
                              aria-expanded={currentOpenSectionId === section.sectionID}
                              aria-controls={`collapse${section.sectionID}`}
                          >
                             {section.title}
                          </button>
                       </h2>
                       <div
                           id={`collapse${section.sectionID}`}
                           className={`accordion-collapse collapse ${
                               currentOpenSectionId === section.sectionID ? "show" : ""
                           }`}
                           aria-labelledby={`heading${section.sectionID}`}
                           data-bs-parent="#accordionExample"
                       >
                          <div className="accordion-body">
                             {section.videos && section.videos.length > 0 ? (
                                 <ul className="list-wrap">
                                    {section.videos.map((video) => (
                                        <li
                                            key={video.videoID}
                                            className={`course-item ${isEnrolled && video.url ? "open-item" : ""}`}
                                        >
                                           <a
                                               onClick={() =>
                                                   isEnrolled && video.url && setIsVideoOpen(true)
                                               }
                                               style={{
                                                  cursor: isEnrolled && video.url ? "pointer" : "default",
                                               }}
                                               className="course-item-link"
                                           >
                                              <span className="item-name">{video.title}</span>
                                              <div className="course-item-meta">
                                             <span className="item-meta duration">
                                                {formatDuration(video.duration)}
                                             </span>
                                                 {!isEnrolled && (
                                                     <span className="item-meta course-item-status">
                                                   <img
                                                       src="/assets/img/icons/lock.svg"
                                                       alt="icon"
                                                   />
                                                </span>
                                                 )}
                                              </div>
                                           </a>
                                        </li>
                                    ))}
                                 </ul>
                             ) : (
                                 <p>No videos available for this section.</p>
                             )}
                          </div>
                       </div>
                    </div>
                ))}
             </div>
          </div>
          <VideoPopup
              isVideoOpen={isVideoOpen}
              setIsVideoOpen={setIsVideoOpen}
              videoId={"Ml4XCF-JS0k"} // Use dynamic videoId if needed
          />
       </>
   );
};

export default Curriculum;
