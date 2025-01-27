// LessonFaq.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// MUI ICONS
import { PlayArrow, Description } from "@mui/icons-material";

interface VideoType {
   videoID: number;
   sectionID: number;
   title: string;
   duration: number;
   url: string;
}

interface SectionType {
   sectionID: number;
   courseID: number;
   order: number;
   title: string;
   videos: VideoType[];
}

interface QuizType {
   quizID: number;
   sectionID: number;
   name: string;
   totalPoints: number;
}

interface LessonFaqProps {
   sections: SectionType[];
   userId: number;
   onVideoSelect: (video: VideoType) => void;
}

// API istek fonksiyonu (değiştirmeye gerek yok)
const fetchQuizBySectionId = async (sectionID: number): Promise<QuizType | null> => {
   try {
      const response = await fetch(`http://165.232.76.61:5001/api/Quiz/list-by-section/${sectionID}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
         return data[0];
      }
      return null;
   } catch (error) {
      console.error("Quiz fetch error: ", error);
      return null;
   }
};

const LessonFaq: React.FC<LessonFaqProps> = ({ sections, onVideoSelect }) => {
   const [sectionQuizzes, setSectionQuizzes] = useState<{ [key: number]: QuizType | null }>({});

   useEffect(() => {
      const fetchAllQuizzes = async () => {
         const quizzesMap: { [key: number]: QuizType | null } = {};

         for (const section of sections) {
            const quiz = await fetchQuizBySectionId(section.sectionID);
            quizzesMap[section.sectionID] = quiz;
         }
         setSectionQuizzes(quizzesMap);
      };

      fetchAllQuizzes();
   }, [sections]);

   const handleVideoSelect = (video: VideoType) => {
      onVideoSelect(video);
   };

   return (
       <div className="accordion" id="accordionExample">
          {sections.map((section, index) => {
             const isFirstSection = index === 0;
             const quizData = sectionQuizzes[section.sectionID];

             return (
                 <div key={section.sectionID} className="accordion-item">
                    <h2 className="accordion-header" id={`heading${section.sectionID}`}>
                       <button
                           type="button"
                           className={`accordion-button ${!isFirstSection ? "collapsed" : ""}`}
                           data-bs-toggle="collapse"
                           data-bs-target={`#collapseSection${section.sectionID}`}
                           aria-expanded={isFirstSection ? "true" : "false"}
                           aria-controls={`collapseSection${section.sectionID}`}
                       >
                          {section.title}
                          <span>{`${section.videos.length} Video`}</span>
                       </button>
                    </h2>

                    <div
                        id={`collapseSection${section.sectionID}`}
                        className={`accordion-collapse collapse ${isFirstSection ? "show" : ""}`}
                        aria-labelledby={`heading${section.sectionID}`}
                        data-bs-parent="#accordionExample"
                    >
                       <div className="accordion-body">
                          <ul className="list-wrap">
                             {/* Videolar */}
                             {section.videos.map((video) => (
                                 <li key={video.videoID} className="course-item open-item">
                                    <Link
                                        to="#"
                                        className="course-item-link popup-video"
                                        onClick={() => handleVideoSelect(video)}
                                    >
                                       {/* Play ikonu */}
                                       <span className="item-name">{video.title}</span>

                                       <div className="course-item-meta">
                                          <span className="item-meta duration">
                                             {Math.floor(video.duration / 60)}:
                                             {(video.duration % 60).toString().padStart(2, "0")}
                                          </span>
                                       </div>
                                    </Link>
                                 </li>
                             ))}

                             {/* Quiz varsa quiz item */}
                             {quizData && (
                                 <li className="course-item quiz-item">
                                    <Link
                                        to={`/quiz/${quizData.quizID}`}
                                        className="course-item-link quiz-link"
                                    >
                                       <span className="item-name">
                                          {quizData.name} - Toplam Puan: {quizData.totalPoints}
                                       </span>
                                    </Link>
                                 </li>
                             )}
                          </ul>
                       </div>
                    </div>
                 </div>
             );
          })}
       </div>
   );
};

export default LessonFaq;

