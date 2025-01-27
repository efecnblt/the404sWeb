import HeaderOne from "../../../layouts/headers/HeaderOne";
import BreadcrumbTwo from "../../common/breadcrumb/BreadcrumbTwo";
import CourseDetailsArea from "./CourseDetailsArea";
import FooterThree from "../../../layouts/footers/FooterThree";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CourseDetails = () => {
    const { authorId, courseId } = useParams<{ authorId: string; courseId: string }>();
    const [courseData, setCourseData] = useState<any>(null);
    const [authorData, setAuthorData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl = "http://165.232.76.61:5001/api";

                // Kurs ve yazar verilerini paralel olarak çek
                const [courseResponse, authorResponse] = await Promise.all([
                    fetch(`${baseUrl}/Courses/getbyid?id=${courseId}`),
                    fetch(`${baseUrl}/Authors/getbyid/${authorId}`),
                ]);

                const course = await courseResponse.json();
                const author = await authorResponse.json();

                setCourseData(course);
                setAuthorData(author);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (authorId && courseId) {
            fetchData();
        }
    }, [authorId, courseId]);

    if (loading) {
        return <p>Loading...</p>;
    }


    return (
        <>
            <HeaderOne />
            <main className="main-area fix">
                <BreadcrumbTwo
                    title={loading ? "Loading..." : courseData?.name || "Course Details"}
                    sub_title="Courses"
                />
                <CourseDetailsArea courseData={courseData} authorId={authorId} />
            </main>
            <FooterThree />
        </>
    );
};

export default CourseDetails;
