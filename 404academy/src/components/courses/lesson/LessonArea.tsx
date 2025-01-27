import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import LessonFaq from "./LessonFaq";
import LessonVideo from "./LessonVideo";
import {useAuth} from "../../../firebase/AuthContext.tsx";
import {Mosaic} from "react-loading-indicators";

const LessonArea = () => {
   // URL üzerinden /lesson/:id bilgisini alıyoruz
   const { courseId } = useParams();
   const {user} = useAuth();

   // Bölüm ve video bilgilerini saklayacağımız state
   const [sections, setSections] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // Seçilen video bilgisini tutacak state
   const [selectedVideo, setSelectedVideo] = useState(null);

   useEffect(() => {
      const fetchSectionsAndVideos = async () => {
         setLoading(true); // İsteğe başlamadan önce loading'i true yapalım
         setError(null); // Hata mesajını sıfırlayalım
         try {
            // 1) Kursa ait bölümleri çek
            const sectionsRes = await axios.get(
                `http://165.232.76.61:5001/api/Sections/course/${courseId}`
            );

            const rawSections = sectionsRes.data;

            if (!Array.isArray(rawSections)) {
               throw new Error("Dönen yanıt dizi formatında değil.");
            }

            // 2) Her bölümün videolarını çek
            const sectionsWithVideos = await Promise.all(
                rawSections.map(async (section) => {
                   const videosRes = await axios.get(
                       `http://165.232.76.61:5001/api/Videos/section/${section.sectionID}`
                   );
                   return {
                      ...section,
                      videos: videosRes.data || [],
                   };
                })
            );

            setSections(sectionsWithVideos);

            // İlk video otomatik olarak seçilsin
            if (sectionsWithVideos.length > 0 && sectionsWithVideos[0].videos.length > 0) {
               setSelectedVideo(sectionsWithVideos[0].videos[0]);
            }
         } catch (error) {
            console.error("Bölümler veya videolar çekilirken hata oluştu:", error);
            setError(error.message || "Bilinmeyen bir hata oluştu.");
         } finally {
            setLoading(false);
         }
      };

      if (courseId) {
         fetchSectionsAndVideos();
      } else {
         setLoading(false);
         setError("Geçersiz kurs ID.");
      }
   }, [courseId]);

   // Bir video seçildiğinde state’i güncelleyecek fonksiyon
   const handleVideoSelect = (video) => {
      setSelectedVideo(video);
   };

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

   // 2) Eğer hata varsa
   if (error) {
      return (
          <div style={{ padding: "50px", textAlign: "center", color: "red" }}>
             {error}
          </div>
      );
   }

   // 3) Ne yükleniyor, ne hata var -> Normal içerik
   return (
       <section className="lesson__area section-pb-120">
          <div className="container-fluid p-0">
             <div className="row gx-0">
                {/* Sol taraf - Course Content */}
                <div className="col-xl-3 col-lg-4">
                   <div className="lesson__content">
                      <h2 className="title">Course Content</h2>
                      {/* FAQ component içerisine çekilen section listesini yolluyoruz */}
                      <LessonFaq sections={sections} onVideoSelect={handleVideoSelect} userId={user?.id}/>
                   </div>
                </div>

                {/* Sağ taraf - Video oynatıcı ve üst kısım */}
                <div className="col-xl-9 col-lg-8">
                   <div className="lesson__video-wrap">
                      <div className="lesson__video-wrap-top">
                         <div className="lesson__video-wrap-top-left">
                            <Link to="#">
                               <i className="flaticon-arrow-right"></i>
                            </Link>
                            <span>{selectedVideo?.title || "Video Seçin"}</span>
                         </div>
                         <div className="lesson__video-wrap-top-right">
                            <Link to="#">
                               <i className="fas fa-times"></i>
                            </Link>
                         </div>
                      </div>

                      {/* Video oynatıcı - Seçili video yoksa uyarı */}
                      {selectedVideo ? (
                          <LessonVideo video={selectedVideo} />
                      ) : (
                          <div style={{ padding: "20px", textAlign: "center" }}>
                             Lütfen soldan bir video seçiniz.
                          </div>
                      )}

                      <div className="lesson__next-prev-button">
                         <button className="prev-button" title="Önceki Video">
                            <i className="flaticon-arrow-left"></i>
                         </button>
                         <button className="next-button" title="Sonraki Video">
                            <i className="flaticon-arrow-right"></i>
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>
   );
};

export default LessonArea;
