import {useEffect, useState} from "react";
import Overview from "./Overview";
import Sidebar from "./Sidebar";
import Curriculum from "./Curriculum"
import Reviews from "./Reviews"
import Instructors from "./Instructors"
import {Link, useParams} from "react-router-dom";
import {getFirestore, doc, getDoc} from "firebase/firestore";

const tab_title: string[] = ["Overview", "Curriculum", "Instructors", "reviews"];


const CourseDetailsArea = () => {

  const [activeTab, setActiveTab] = useState(0);

  const { authorId, courseId } = useParams<{ authorId: string; courseId: string }>();
  const [authorData, setAuthorData] = useState<any>(null);
  const [courseData, setCourseData] = useState<any>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();

        // Author verisi referansı
        const authorRef = doc(db, `authors/${authorId}`);
        const courseRef = doc(db, `authors/${authorId}/courses/${courseId}`);

        // Author ve Course verilerini paralel olarak çek
        const [authorSnapshot, courseSnapshot] = await Promise.all([
          getDoc(authorRef),
          getDoc(courseRef),
        ]);

        // Author verisi kontrolü
        if (authorSnapshot.exists()) {
          setAuthorData({ id: authorSnapshot.id, ...authorSnapshot.data() });
        } else {
          console.error("Author document not found!");
        }

        // Course verisi kontrolü
        if (courseSnapshot.exists()) {
          setCourseData({ id: courseSnapshot.id, ...courseSnapshot.data() });
        } else {
          console.error("Course document not found!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (authorId && courseId) {
      fetchData();
    }
  }, [authorId, courseId]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  // Genişlik kontrolü için JavaScript kullanıyoruz
  const isDesktop = window.innerWidth >= 768;
  const styles = {
    base: {
      width: '100%', // Varsayılan genişlik
      height: 'auto', // Oranı korur
      maxWidth: '1050px', // Maksimum genişlik
      maxHeight: '470px', // Maksimum yükseklik
      objectFit: 'cover', // Alanı düzgün doldurur
    },
    desktop: {
      width: '1050px',
      height: '470px',
    },
  };

  return (
    <section className="courses__details-area section-py-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            {courseData && (
            <div className="courses__details-thumb">
              <img src={courseData.image_url} alt="img"  style={isDesktop ? styles.desktop : styles.base} />
            </div>
            )}
            {authorData && courseData && (
            <div className="courses__details-content">
              <ul className="courses__item-meta list-wrap">
                <li className="courses__item-tag">
                  <Link to="/courses">{courseData.department}</Link>
                </li>
                <li className="avg-rating"><i className="fas fa-star"></i>{courseData.rating} Reviews</li>
              </ul>
              <h2 className="title">{courseData.name}</h2>
              <div className="courses__details-meta">
                <ul className="list-wrap">
                  <li className="author-two">
                    <img  src={authorData.image_url}
                          alt="img"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }} />
                    By <Link to={`/instructor-details/${authorId}`}>{authorData.name}</Link>
                  </li>
                  <li><i className="flaticon-mortarboard"></i>{authorData.studentCount} Students</li>
                </ul>
              </div>
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                {tab_title.map((tab, index) => (
                  <li key={index} onClick={() => handleTabClick(index)} className="nav-item" role="presentation">
                    <button className={`nav-link ${activeTab === index ? "active" : ""}`}>{tab}</button>
                  </li>
                ))}
              </ul>
              <div className="tab-content" id="myTabContent">
                <div className={`tab-pane fade ${activeTab === 0 ? 'show active' : ''}`} id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab">
                  <Overview  authorData={authorData} courseData={courseData} />
                </div>
                <div className={`tab-pane fade ${activeTab === 1 ? 'show active' : ''}`} id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab">
                  <Curriculum />
                </div>
                <div className={`tab-pane fade ${activeTab === 2 ? 'show active' : ''}`} id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab">
                  <Instructors authorData={authorData}/>
                </div>
                <div className={`tab-pane fade ${activeTab === 3 ? 'show active' : ''}`} id="overview-tab-pane" role="tabpanel" aria-labelledby="overview-tab">
                  <Reviews authorData={authorData} courseData={courseData}/>
                </div>
              </div>
            </div>
            )}
          </div>
          <Sidebar authorData={authorData} courseData={courseData}/>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailsArea
