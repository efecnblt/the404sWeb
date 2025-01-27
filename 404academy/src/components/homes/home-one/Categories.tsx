import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";

const iconMap: { [key: string]: string } = {
   "Cyber Security": "fas fa-shield-alt",
   "Front-end Developer": "fas fa-code",
   "Ethical Hacking": "fas fa-user-secret",
   "Phishing Awareness": "fas fa-fish",
   "Network Defense": "fas fa-network-wired",
   "Cloud Security": "fas fa-cloud",
   "Web Security": "fas fa-globe",
   "Mobile Security": "fas fa-mobile-alt",
   "DevOps Security": "fas fa-tools",
   "Application Security": "fas fa-lock",
   "AI Security": "fas fa-robot",
   "Incident Response": "fas fa-fire-extinguisher",
   "Compliance": "fas fa-check-circle",
   "Cryptography": "fas fa-key",
   "Penetration Testing": "fas fa-hammer",
   "Threat Intelligence": "fas fa-bolt",
   "IoT Security": "fas fa-microchip",
   "Blockchain Security": "fas fa-cubes",
   "Malware Analysis": "fas fa-bug",
   "Identity and Access Management": "fas fa-user-lock",
   "Secure Coding": "fas fa-code-branch",
   "Data Protection": "fas fa-database",
   "Disaster Recovery": "fas fa-sync-alt",
   "Social Engineering": "fas fa-user-friends",
};




// slider setting
const setting = {
   slidesPerView: 6,
   spaceBetween: 44,
   loop: true,
   // Navigation arrows
   navigation: {
      nextEl: '.categories-button-next',
      prevEl: '.categories-button-prev',
   },
   breakpoints: {
      '1500': {
         slidesPerView: 6,
      },
      '1200': {
         slidesPerView: 5,
      },
      '992': {
         slidesPerView: 4,
         spaceBetween: 30,
      },
      '768': {
         slidesPerView: 3,
         spaceBetween: 25,
      },
      '576': {
         slidesPerView: 2,
      },
      '0': {
         slidesPerView: 2,
         spaceBetween: 20,
      },
   },
};

const Categories = () => {
   const [categories, setCategories] = useState<any[]>([]); // Kategorileri saklamak için state

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            // API'den kategorileri çek
            const response = await axios.get("http://165.232.76.61:5001/api/Categories/getall");
            console.log("Categories:", response.data); // Gelen veriyi inceleyin
            setCategories(response.data); // Gelen kategorileri state'e ata
         } catch (error) {
            console.error("Error fetching categories:", error);
         }
      };

      fetchCategories(); // Kategorileri çek
   }, []);

   return (
      <section className="categories-area section-py-120">
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-5 col-lg-7">
                  <div className="section__title text-center mb-40">
                     <span className="sub-title">Trending Categories</span>
                     <h2 className="title">Top Category We Have</h2>
                  </div>
               </div>
            </div>

            <div className="row">
               <div className="col-12">
                  <div className="categories__wrap">
                     <Swiper {...setting} modules={[Navigation]} className="swiper categories-active">
                        {categories.map((item) => (
                           <SwiperSlide key={item.categoryId} className="swiper-slide">
                              <div className="categories__item">
                                 <Link to="/courses">
                                    <div className="icon">
                                       <i className={iconMap[item.name] || "fas fa-layer-group"}></i> {/* İkon eşleştirme */}
                                    </div>
                                    <span className="name">{item.name}</span>

                                 </Link>
                              </div>
                           </SwiperSlide>
                        ))}
                     </Swiper>

                     <div className="categories__nav">
                        <button className="categories-button-prev">
                           <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15 7L1 7M1 7L7 1M1 7L7 13" stroke="#161439" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                        </button>
                        <button className="categories-button-next">
                           <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 7L15 7M15 7L9 1M15 7L9 13" stroke="#161439" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           </svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default Categories
