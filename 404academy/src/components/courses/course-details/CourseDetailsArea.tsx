import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Overview from "./Overview";
import Sidebar from "./Sidebar";
import Curriculum from "./Curriculum";
import Reviews from "./Reviews";
import Instructors from "./Instructors";
import axios from "axios";
import {useAuth} from "../../../firebase/AuthContext.tsx";
import {Mosaic} from "react-loading-indicators";

const tab_title: string[] = ["Overview", "Curriculum", "Instructors", "Reviews"];

const CourseDetailsArea = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { authorId, courseId } = useParams<{ authorId: string; courseId: string }>();

  const [authorData, setAuthorData] = useState<any>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const { loading } = useAuth();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorResponse, courseResponse, departmentsResponse] = await Promise.all([
          axios.get(`http://165.232.76.61:5001/api/Authors/getbyid/${authorId}`),
          axios.get(`http://165.232.76.61:5001/api/Courses/getbyid`, {
            params: { id: courseId },
          }),
          axios.get(`http://165.232.76.61:5001/api/Departments`),
        ]);

        const author = authorResponse.data;
        const department = departmentsResponse.data.find(
            (dept: any) => dept.departmentID === author.departmentID
        );

        // Author verisine departmentName ekliyoruz
        setAuthorData({
          ...author,
          departmentName: department ? department.departmentName : "Unknown Department",
        });

        setCourseData(courseResponse.data.data); // Verinin `data` alanına erişiyoruz
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

  if (!courseData || !authorData) {
    return <p>Error: Unable to load course or author details!</p>;
  }



  const { name, image, rating, ratingCount } = courseData;
  const { name: authorName, imageURL: authorImage, studentCount, departmentName } = authorData;

  return (
      <section className="courses__details-area section-py-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="courses__details-thumb">
                <img
                    src={image || "/default-course.jpg"}
                    alt={name || "Course"}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "1050px",
                      maxHeight: "470px",
                      objectFit: "cover",
                    }}
                />
              </div>
              <div className="courses__details-content">
                <ul className="courses__item-meta list-wrap">
                  <li className="courses__item-tag">
                    <Link to="/courses">{departmentName || "General"}</Link>
                  </li>
                  <li className="avg-rating">
                    <i className="fas fa-star"></i> {rating || 0} ({ratingCount || 0} Reviews)
                  </li>
                </ul>
                <h2 className="title">{name || "Course Title"}</h2>
                <div className="courses__details-meta">
                  <ul className="list-wrap">
                    <li className="author-two">
                      <img
                          src={authorImage || "/default-author.jpg"}
                          alt={authorName || "Author"}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                      />
                      By <Link to={`/instructor-details/${authorId}`}>{authorName || "Unknown Author"}</Link>
                    </li>
                    <li>
                      <i className="flaticon-mortarboard"></i> {studentCount || 0} Students
                    </li>
                  </ul>
                </div>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  {tab_title.map((tab, index) => (
                      <li key={index} className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === index ? "active" : ""}`}
                            onClick={() => handleTabClick(index)}
                        >
                          {tab}
                        </button>
                      </li>
                  ))}
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div
                      className={`tab-pane fade ${activeTab === 0 ? "show active" : ""}`}
                      id="overview-tab-pane"
                      role="tabpanel"
                      aria-labelledby="overview-tab"
                  >
                    <Overview authorData={authorData} courseData={courseData} />
                  </div>
                  <div
                      className={`tab-pane fade ${activeTab === 1 ? "show active" : ""}`}
                      id="curriculum-tab-pane"
                      role="tabpanel"
                      aria-labelledby="curriculum-tab"
                  >
                    <Curriculum />
                  </div>
                  <div
                      className={`tab-pane fade ${activeTab === 2 ? "show active" : ""}`}
                      id="instructors-tab-pane"
                      role="tabpanel"
                      aria-labelledby="instructors-tab"
                  >
                    <Instructors authorData={authorData} />
                  </div>
                  <div
                      className={`tab-pane fade ${activeTab === 3 ? "show active" : ""}`}
                      id="reviews-tab-pane"
                      role="tabpanel"
                      aria-labelledby="reviews-tab"
                  >
                    <Reviews authorData={authorData} courseData={courseData} />
                  </div>
                </div>
              </div>
            </div>
            <Sidebar authorData={authorData} courseData={courseData} />
          </div>
        </div>
      </section>
  );
};

export default CourseDetailsArea;
