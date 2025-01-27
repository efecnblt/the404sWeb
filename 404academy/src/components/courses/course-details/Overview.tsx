import { useEffect, useState } from "react";
import axios from "axios";
import {LearningOutcome} from "../../../modals/LearningOutcome.ts";
import {useParams} from "react-router-dom";

const Overview = ({ authorData, courseData }: { authorData: any; courseData: any }) => {
    const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]); // İşlenmiş outcomes için state
    const [descriptionParts, setDescriptionParts] = useState<string[]>([]); // Ayrıştırılmış description parçaları
    const { courseId } = useParams<{ authorId: string; courseId: string }>();

    useEffect(() => {
        const fetchLearningOutcomes = async () => {
            try {
                // API isteği
                const response = await axios.get<LearningOutcome[]>("http://165.232.76.61:5001/api/LearningOutcomes/getByCourseId", {
                    params: { courseId: courseId },

                });

                const outcomeText = response.data?.[0]?.outcomeText || ""; // İlk outcome'ı alın


                // Outcome text'i array'e dönüştür
                const outcomesArray = outcomeText
                    .split(/\[\d+\]/) // "[1]", "[2]" gibi numaralara göre ayır
                    .map((item: string) => item.trim()) // Boşlukları temizle
                    .filter((item: string) => item); // Boş string'leri çıkar


                setLearningOutcomes(outcomesArray);
            } catch (error) {
                console.error("Error fetching learning outcomes:", error);
            }
        };

        const parseDescription = () => {
            const description = courseData?.description || "";
            const parts = description
                .split(/\[\d+\]/)
                .map((item: string) => item.trim())
                .filter((item: string) => item);


            setDescriptionParts(parts);
        };


        if (courseId) {
            fetchLearningOutcomes(); // Öğrenim çıktıları API'sini çağır

        }
        if (courseData?.description) {
            parseDescription();
        }

    }, [courseData]);


    return (
        <div className="courses__overview-wrap">
            {authorData && courseData && (
                <>
                    <h3 className="title">Course Description</h3>
                    {descriptionParts[0] && (
                        <p>{descriptionParts[0]}</p>
                    )}

                    <h3 className="title">What you'll learn in this course?</h3>
                    {descriptionParts[1] && (
                        <p>{descriptionParts[1]}</p>
                    )}

                    {/* Learning Outcomes Listesi */}
                    <ul className="about__info-list list-wrap">
                        {learningOutcomes.length > 0 ? (
                            <ul className="about__info-list list-wrap">
                                {learningOutcomes.map((outcome, index) => (
                                    <li className="about__info-list-item" key={index}>
                                        <i className="flaticon-angle-right"></i>
                                        <p className="content">{outcome}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No learning outcomes available.</p>
                        )}
                    </ul>

                    {descriptionParts[2] && (
                        <p className="last-info">
                            {descriptionParts[2]}</p>
                    )}
                        </>
                    )}
                </div>
            );
            };

export default Overview;
