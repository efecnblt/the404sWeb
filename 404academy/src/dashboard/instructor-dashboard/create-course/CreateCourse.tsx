import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../firebase/AuthContext";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';

interface FormData {
    courseName: string;
    descriptions: string[];
    learningOutcomes: string[];
    hashtags: string[];
    categoryId: number | null;
    levelId: number | null;
    sections: {
        title: string;
        order: number;
        videos: {
            title: string;
            url: string;
            order: number;
            duration: number;
        }[];
    }[];
    price: number | string;
    imageUrl: string;
}

interface CoursePayload {
    courseID: number;
    name: string;
    categoryId: number;
    description: string;
    authorId: number;
    rating: number;
    ratingCount: number;
    price: number;
    discount: number;
    totalStudentCount: number;
    image: string;
    hashtags: string;
    levelId: number;
}

// Add this interface for errors
interface FormErrors {
    courseName?: string;
    price?: string;
    imageUrl?: string;
    categoryId?: string;
    levelId?: string;
    sections?: string;
    hashtags?: string;
    outcomes?: string;
    [key: string]: string | undefined; // For dynamic error keys like description0, video0_1_title etc.
}

interface SectionPayload {
    sectionID: number;
    courseID: number;
    order: number;
    title: string;
}

interface VideoPayload {
    videoID: number;
    sectionID: number;
    order: number;
    title: string;
    duration: number;
    url: string;
}

// Add this interface for learning outcomes payload
interface LearningOutcomesPayload {
    outcomeID: number;
    courseID: number;
    outcomeText: string;
}

// Add this enum at the top with other interfaces
enum PublishingStep {
    NotStarted = 'not_started',
    CreatingCourse = 'creating_course',
    AddingLearningOutcomes = 'adding_learning_outcomes',
    CreatingSections = 'creating_sections',
    AddingVideos = 'adding_videos',
    Completed = 'completed'
}

const PublishingProgress = ({ step }: { step: PublishingStep }) => {
    const steps = [
        { key: PublishingStep.CreatingCourse, label: 'Creating Course' },
        { key: PublishingStep.AddingLearningOutcomes, label: 'Learning Outcomes' },
        { key: PublishingStep.CreatingSections, label: 'Course Sections' },
        { key: PublishingStep.AddingVideos, label: 'Adding Videos' }
    ];

    const currentIndex = steps.findIndex(s => s.key === step);

    return (
        <div className="publishing-progress">
            <div className="publishing-steps">
                {steps.map((s, index) => (
                    <div
                        key={s.key}
                        className={`publishing-step ${index <= currentIndex ? 'active' : ''}`}
                    >
                        <div className="step-number">{index + 1}</div>
                        <div className="step-label">{s.label}</div>
                    </div>
                ))}
            </div>
            <div className="publishing-bar">
                <div
                    className="publishing-progress-bar"
                    style={{ width: `${(currentIndex + 1) * 25}%` }}
                />
            </div>
        </div>
    );
};

interface AuthorCourse {
    courseID: number;
    name: string;
    description: string;
    rating: number;
    price: number;
    totalStudentCount: number;
}

interface AuthorProfile {
    authorID: number;
    courses: AuthorCourse[];
    // ... other fields
}

const CreateCourse = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        courseName: "",
        descriptions: ["", "", ""],
        learningOutcomes: [""],
        hashtags: [],
        categoryId: null,
        levelId: null,
        sections: [
            {
                title: "",
                order: 1,
                videos: [
                    {
                        title: "",
                        url: "",
                        order: 1,
                        duration: 0,
                    },
                ],
            },
        ],
        price: "",
        imageUrl: "",
    });

    // Update the errors state with proper typing
    const [errors, setErrors] = useState<FormErrors>({});

    // Add available hashtags constant
    const AVAILABLE_HASHTAGS = [
        "cybersecurity",
        "hack",
        "flutter",
        "CSS",
        "javascript",
        "react",
        "nodejs",
        "python",
        "java",
        "android",
        "ios",
        "web",
        "mobile",
        "database",
        "cloud",
    ];

    // Add these constants at the top of the component
    const COURSE_CATEGORIES = [
        { id: 1, name: "Web Development" },
        { id: 2, name: "Mobile Development" },
        { id: 3, name: "Data Science" },
        { id: 4, name: "Cybersecurity" },
        { id: 5, name: "Cloud Computing" },
        { id: 6, name: "DevOps" },
        { id: 7, name: "Artificial Intelligence" },
        { id: 8, name: "Machine Learning" },
        { id: 9, name: "Game Development" },
        { id: 10, name: "Digital Marketing" },
    ];

    const COURSE_LEVELS = [
        { id: 1, name: "Beginner" },
        { id: 2, name: "Intermediate" },
        { id: 3, name: "Advanced" },
    ];

    // Add this state with other states
    const [publishingStep, setPublishingStep] = useState<PublishingStep>(PublishingStep.NotStarted);

    // Handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Navigation between steps
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => prev - 1);
    };

    // Step validation
    const validateStep = (step: number) => {
        const newErrors: FormErrors = {};

        switch (step) {
            case 1:
                if (!formData.courseName.trim()) {
                    newErrors.courseName = "Course name is required";
                }
                break;
            case 2:
                formData.descriptions.forEach((desc, index) => {
                    if (!desc.trim()) {
                        newErrors[`description${index}`] = "Description is required";
                    } else if (desc.length < 70) {
                        newErrors[`description${index}`] =
                            "Description must be at least 70 characters";
                    }
                });
                break;
            case 3:
                if (formData.learningOutcomes.length === 0) {
                    newErrors.outcomes = "At least one learning outcome is required";
                }
                formData.learningOutcomes.forEach((outcome, index) => {
                    if (!outcome.trim()) {
                        newErrors[`outcome${index}`] = "Learning outcome is required";
                    } else if (outcome.length > 60) {
                        newErrors[`outcome${index}`] =
                            "Learning outcome must be maximum 60 characters";
                    }
                });
                break;
            case 4:
                if (formData.hashtags.length === 0) {
                    newErrors.hashtags = "Please select at least one hashtag";
                }
                break;
            case 5:
                if (!formData.categoryId) {
                    newErrors.categoryId = "Please select a category";
                }
                if (!formData.levelId) {
                    newErrors.levelId = "Please select a level";
                }
                break;
            case 6:
                if (formData.sections.length === 0) {
                    newErrors.sections = "Please add at least one section";
                    console.log("Validation error: No sections added");
                }
                formData.sections.forEach((section, sIndex) => {
                    if (!section.title.trim()) {
                        newErrors[`section${sIndex}`] = "Section title is required";
                        console.log(`Validation error: Section ${sIndex + 1} title is empty`);v
                    }
                    if (section.videos.length === 0) {
                        newErrors[`sectionVideos${sIndex}`] = "Please add at least one video";
                        console.log(`Validation error: No videos in section ${sIndex + 1}`);
                    }
                    section.videos.forEach((video, vIndex) => {
                        if (!video.title.trim()) {
                            newErrors[`video${sIndex}_${vIndex}_title`] =
                                "Video title is required";
                            console.log(
                                `Validation error: Video ${vIndex + 1} in section ${
                                    sIndex + 1
                                } title is empty`
                            );
                        }
                        if (!video.url.trim()) {
                            newErrors[`video${sIndex}_${vIndex}_url`] = "Video URL is required";
                            console.log(
                                `Validation error: Video ${vIndex + 1} in section ${
                                    sIndex + 1
                                } file is missing`
                            );
                        }
                    });
                });
                break;
            case 7:
                const priceValue =
                    typeof formData.price === "string"
                        ? parseFloat(formData.price.replace(",", "."))
                        : formData.price;

                if (!priceValue || priceValue <= 0) {
                    newErrors.price = "Please enter a valid price";
                }
                if (!formData.imageUrl) {
                    newErrors.imageUrl = "Please upload a course image";
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle description changes
    const handleDescriptionChange = (index: number, value: string) => {
        const newDescriptions = [...formData.descriptions];
        newDescriptions[index] = value;
        setFormData((prev) => ({
            ...prev,
            descriptions: newDescriptions,
        }));
    };

    // Add new function to handle learning outcomes
    const handleAddOutcome = () => {
        if (formData.learningOutcomes.length < 5) {
            setFormData((prev) => ({
                ...prev,
                learningOutcomes: [...prev.learningOutcomes, ""],
            }));
        }
    };

    const handleRemoveOutcome = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index),
        }));
    };

    const handleOutcomeChange = (index: number, value: string) => {
        const newOutcomes = [...formData.learningOutcomes];
        newOutcomes[index] = value;
        setFormData((prev) => ({
            ...prev,
            learningOutcomes: newOutcomes,
        }));
    };

    // Add hashtag handling functions
    const handleHashtagToggle = (hashtag: string) => {
        setFormData((prev) => {
            const currentTags = prev.hashtags;
            if (currentTags.includes(hashtag)) {
                return {
                    ...prev,
                    hashtags: currentTags.filter((tag) => tag !== hashtag),
                };
            } else if (currentTags.length < 5) {
                return {
                    ...prev,
                    hashtags: [...currentTags, hashtag],
                };
            }
            return prev;
        });
    };

    // Add these handler functions
    const handleCategorySelect = (categoryId: number) => {
        setFormData((prev) => ({
            ...prev,
            categoryId: categoryId,
        }));
    };

    const handleLevelSelect = (levelId: number) => {
        setFormData((prev) => ({
            ...prev,
            levelId: levelId,
        }));
    };

    // Add these new handler functions
    const handleAddSection = () => {
        setFormData((prev) => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    title: "",
                    order: prev.sections.length + 1,
                    videos: [],
                },
            ],
        }));
    };

    const handleRemoveSection = (sectionIndex: number) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections
                .filter((_, index) => index !== sectionIndex)
                .map((section, index) => ({
                    ...section,
                    order: index + 1,
                })),
        }));
    };

    const handleSectionChange = (sectionIndex: number, title: string) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((section, index) =>
                index === sectionIndex ? { ...section, title } : section
            ),
        }));
    };

    const handleAddVideo = (sectionIndex: number) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((section, index) => {
                if (index === sectionIndex) {
                    return {
                        ...section,
                        videos: [
                            ...section.videos,
                            {
                                title: "",
                                url: "",
                                order: section.videos.length + 1,
                                duration: 0,
                            },
                        ],
                    };
                }
                return section;
            }),
        }));
    };

    const handleRemoveVideo = (sectionIndex: number, videoIndex: number) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((section, index) => {
                if (index === sectionIndex) {
                    return {
                        ...section,
                        videos: section.videos
                            .filter((_, vIndex) => vIndex !== videoIndex)
                            .map((video, vIndex) => ({
                                ...video,
                                order: vIndex + 1,
                            })),
                    };
                }
                return section;
            }),
        }));
    };


    const handleVideoFileChange = async (
        sectionIndex: number,
        videoIndex: number,
        file: File | null
    ) => {
        if (!file) return;

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `course-videos/${Date.now()}_${file.name}`);

            // Dosyayı Firebase'e yükle
            await uploadBytes(storageRef, file);

            // Yüklenen dosyanın URL'sini alın
            const downloadURL = await getDownloadURL(storageRef);

            // FormData'yı güncelle
            setFormData((prev) => ({
                ...prev,
                sections: prev.sections.map((section, index) => {
                    if (index === sectionIndex) {
                        return {
                            ...section,
                            videos: section.videos.map((video, vIndex) => {
                                if (vIndex === videoIndex) {
                                    return { ...video, url: downloadURL };
                                }
                                return video;
                            }),
                        };
                    }
                    return section;
                }),
            }));
            toast.success("Video uploaded successfully");
        } catch (error) {
            console.error("Error uploading video:", error);
            toast.error("Failed to upload video");
        }
    };


    const handleVideoChange = (
        sectionIndex: number,
        videoIndex: number,
        field: "title" | "url",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((section, index) => {
                if (index === sectionIndex) {
                    return {
                        ...section,
                        videos: section.videos.map((video, vIndex) => {
                            if (vIndex === videoIndex) {
                                return { ...video, [field]: value };
                            }
                            return video;
                        }),
                    };
                }
                return section;
            }),
        }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Sadece sayılar, virgül ve nokta karakterlerine izin ver
        if (!value || /^\d*([.,]\d{0,2})?$/.test(value)) {
            setFormData((prev) => ({
                ...prev,
                price: value,
            }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `english-videos/${Date.now()}_${file.name}`);

            // Upload file
            await uploadBytes(storageRef, file);

            // Get download URL
            const downloadURL = await getDownloadURL(storageRef);

            setFormData((prev) => ({
                ...prev,
                imageUrl: downloadURL,
            }));

            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    // Add loading state
    const [isPublishing, setIsPublishing] = useState(false);

    // Update handlePublishCourse function
    const handlePublishCourse = async () => {
        if (!validateStep(currentStep)) {
            return;
        }

        setIsPublishing(true);
        setPublishingStep(PublishingStep.CreatingCourse);

        try {
            // 1. Create Course
            const coursePayload: CoursePayload = {
                courseID: 0,
                name: formData.courseName,
                categoryId: formData.categoryId || 0,
                description: formData.descriptions
                    .map((desc, index) => `[${index + 1}] ${desc}`)
                    .join(' '),
                authorId: 9,
                rating: 0,
                ratingCount: 0,
                price: typeof formData.price === 'string'
                    ? parseFloat(formData.price.replace(',', '.'))
                    : formData.price,
                discount: 0,
                totalStudentCount: 0,
                image: formData.imageUrl,
                hashtags: formData.hashtags.join(','),
                levelId: formData.levelId || 0
            };

            console.log('Creating course:', coursePayload);
            await axios.post(
                'http://165.232.76.61:5001/api/Courses/add',
                coursePayload
            );

            // 2. Get author's profile to find the newly created course
            const authorResponse = await axios.get<AuthorProfile>(
                'http://165.232.76.61:5001/api/Authors/getauthorallprofile?authorId=9'
            );

            // Find the newly created course (it should be the last one in the list)
            const authorCourses = authorResponse.data.courses;
            const newCourse = authorCourses.find(course =>
                course.name === formData.courseName
            );

            if (!newCourse) {
                throw new Error('Could not find newly created course');
            }

            const courseId = newCourse.courseID;
            console.log('Course created with ID:', courseId);

            // 3. Add Learning Outcomes
            setPublishingStep(PublishingStep.AddingLearningOutcomes);
            const learningOutcomesPayload: LearningOutcomesPayload = {
                outcomeID: 0,
                courseID: courseId,
                outcomeText: formData.learningOutcomes
                    .map((outcome, index) => `[${index + 1}] ${outcome}`)
                    .join(' ')
            };

            console.log('Adding learning outcomes:', learningOutcomesPayload);

            await axios.post(
                'http://165.232.76.61:5001/api/LearningOutcomes/add',
                learningOutcomesPayload
            );

            // 4. Create Sections
            setPublishingStep(PublishingStep.CreatingSections);
            for (const section of formData.sections) {
                const sectionPayload: SectionPayload = {
                    sectionID: 0,
                    courseID: courseId,
                    order: section.order,
                    title: section.title
                };

                console.log('Creating section:', sectionPayload);
                await axios.post(
                    'http://165.232.76.61:5001/api/Sections/add',
                    sectionPayload
                );

                // 5. Get sections to find the newly created section ID
                const sectionsResponse = await axios.get(
                    `http://165.232.76.61:5001/api/Sections/course/${courseId}`
                );

                const newSection = sectionsResponse.data.find(
                    (s: any) => s.title === section.title && s.order === section.order
                );

                if (!newSection) {
                    throw new Error('Could not find newly created section');
                }

                // 6. Add videos for this section
                setPublishingStep(PublishingStep.AddingVideos);
                for (const video of section.videos) {
                    if (!video.url) {
                        toast.error(`Video file missing in section ${section.order}, video ${video.order}`);
                        return;
                    }
                    const videoPayload: VideoPayload = {
                        videoID: 0,
                        sectionID: newSection.sectionID,
                        order: video.order,
                        title: video.title,
                        duration: video.duration,
                        url: video.url
                    };


                    await axios.post(
                        'http://165.232.76.61:5001/api/Videos/add',
                        videoPayload
                    );
                }
            }

            setPublishingStep(PublishingStep.Completed);
            toast.success('Course published successfully!');
            setTimeout(() => {
                navigate(`/instructor-profile/${user?.encodedStudentId}`);
                toast.success('Your course is now live and available for students!');
            }, 1500);


        } catch (error: any) {
            console.error('Error publishing course:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                data: error.response?.data
            });

            toast.error(error.response?.data?.message || 'Failed to publish course. Please try again.');
        } finally {
            setIsPublishing(false);
            setPublishingStep(PublishingStep.NotStarted);
        }
    };

    // Add this function to get the publishing status message
    const getPublishingStatus = () => {
        switch (publishingStep) {
            case PublishingStep.CreatingCourse:
                return 'Creating course...';
            case PublishingStep.AddingLearningOutcomes:
                return 'Adding learning outcomes...';
            case PublishingStep.CreatingSections:
                return 'Creating course sections...';
            case PublishingStep.AddingVideos:
                return 'Adding videos...';
            case PublishingStep.Completed:
                return 'Course published successfully!';
            default:
                return 'Publishing course...';
        }
    };

    // Render current step content
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="create-course__step">
                        <h2>Course Name</h2>
                        <div className="form-group">
                            <input
                                type="text"
                                name="courseName"
                                value={formData.courseName}
                                onChange={handleInputChange}
                                placeholder="Enter course name"
                                className={`form-control ${errors.courseName ? "is-invalid" : ""}`}
                            />
                            {errors.courseName && (
                                <div className="invalid-feedback">{errors.courseName}</div>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="create-course__step">
                        <h2>Course Descriptions</h2>
                        <p className="create-course__subtitle">
                            Please provide three detailed descriptions for your course (minimum 70 characters each)
                        </p>
                        {formData.descriptions.map((description, index) => (
                            <div key={index} className="form-group">
                                <label htmlFor={`description${index}`} className="form-label">
                                    Description {index + 1}
                                </label>
                                <textarea
                                    id={`description${index}`}
                                    value={description}
                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    placeholder={`Enter description ${index + 1}`}
                                    className={`form-control ${
                                        errors[`description${index}`] ? "is-invalid" : ""
                                    }`}
                                    rows={4}
                                />
                                <div className="form-text">
                                    {description.length}/70 characters (minimum)
                                </div>
                                {errors[`description${index}`] && (
                                    <div className="invalid-feedback">
                                        {errors[`description${index}`]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );

            case 3:
                return (
                    <div className="create-course__step">
                        <h2>Learning Outcomes</h2>
                        <p className="create-course__subtitle">
                            Add up to 5 learning outcomes (maximum 60 characters each)
                        </p>

                        {formData.learningOutcomes.map((outcome, index) => (
                            <div key={index} className="form-group outcome-group">
                                <div className="outcome-input-wrapper">
                                    <input
                                        type="text"
                                        value={outcome}
                                        onChange={(e) => handleOutcomeChange(index, e.target.value)}
                                        placeholder="Enter a learning outcome"
                                        className={`form-control ${
                                            errors[`outcome${index}`] ? "is-invalid" : ""
                                        }`}
                                        maxLength={60}
                                    />
                                    <button
                                        type="button"
                                        className="btn-remove-outcome"
                                        onClick={() => handleRemoveOutcome(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="form-text">{outcome.length}/60 characters</div>
                                {errors[`outcome${index}`] && (
                                    <div className="invalid-feedback">{errors[`outcome${index}`]}</div>
                                )}
                            </div>
                        ))}

                        {formData.learningOutcomes.length < 5 && (
                            <button
                                type="button"
                                onClick={handleAddOutcome}
                                className="btn btn-add-outcome"
                            >
                                + Add Learning Outcome
                            </button>
                        )}

                        {errors.outcomes && (
                            <div className="invalid-feedback d-block">{errors.outcomes}</div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="create-course__step">
                        <h2>Course Hashtags</h2>
                        <p className="create-course__subtitle">
                            Select up to 5 hashtags that best describe your course
                        </p>

                        {/*
              Modernize edilmiş hashtag butonları;
              "hashtag-button" yerine "hashtag-chip" gibi bir sınıf da kullanabilirsiniz.
            */}
                        <div className="hashtags-container">
                            {AVAILABLE_HASHTAGS.map((hashtag) => (
                                <button
                                    key={hashtag}
                                    type="button"
                                    onClick={() => handleHashtagToggle(hashtag)}
                                    className={`hashtag-button ${
                                        formData.hashtags.includes(hashtag) ? "selected" : ""
                                    }`}
                                    disabled={
                                        formData.hashtags.length >= 5 &&
                                        !formData.hashtags.includes(hashtag)
                                    }
                                >
                                    {hashtag}
                                </button>
                            ))}
                        </div>

                        <div className="hashtags-selected">
                            <p className="form-text">
                                Selected Hashtags ({formData.hashtags.length}/5)
                            </p>
                            {formData.hashtags.length > 0 ? (
                                <div className="selected-tags-container">
                                    {formData.hashtags.map((tag) => (
                                        <span key={tag} className="selected-tag">
                      #{tag}
                                            <span
                                                className="remove-tag"
                                                onClick={() => handleHashtagToggle(tag)}
                                            >
                        ×
                      </span>
                    </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="form-text no-hashtags">
                                    No hashtags selected yet
                                </p>
                            )}
                            {errors.hashtags && (
                                <div className="invalid-feedback d-block">{errors.hashtags}</div>
                            )}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="create-course__step">
                        <h2>Course Category & Level</h2>
                        <p className="create-course__subtitle">
                            Select the category and difficulty level of your course
                        </p>

                        <div className="category-level-container">
                            <div className="form-group">
                                <label htmlFor="categoryId" className="form-label">
                                    Course Category
                                </label>
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId || ""}
                                    onChange={(e) => handleCategorySelect(Number(e.target.value))}
                                    className={`form-select ${
                                        errors.categoryId ? "is-invalid" : ""
                                    }`}
                                >
                                    <option value="">Select a category</option>
                                    {COURSE_CATEGORIES.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.categoryId && (
                                    <div className="invalid-feedback">{errors.categoryId}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="levelId" className="form-label">
                                    Course Level
                                </label>
                                <select
                                    id="levelId"
                                    name="levelId"
                                    value={formData.levelId || ""}
                                    onChange={(e) => handleLevelSelect(Number(e.target.value))}
                                    className={`form-select ${errors.levelId ? "is-invalid" : ""}`}
                                >
                                    <option value="">Select a level</option>
                                    {COURSE_LEVELS.map((level) => (
                                        <option key={level.id} value={level.id}>
                                            {level.name} -{" "}
                                            {level.id === 1
                                                ? "No prior knowledge required"
                                                : level.id === 2
                                                    ? "Basic knowledge required"
                                                    : "Expert level content"}
                                        </option>
                                    ))}
                                </select>
                                {errors.levelId && (
                                    <div className="invalid-feedback">{errors.levelId}</div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="create-course__step">
                        <h2>Course Content</h2>
                        <p className="create-course__subtitle">
                            Organize your course into sections and add videos to each section
                        </p>

                        <div className="sections-container">
                            {formData.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="section-box">
                                    <div className="section-header">
                                        <h3>Section {sectionIndex + 1}</h3>
                                        <button
                                            type="button"
                                            className="btn-remove-section"
                                            onClick={() => handleRemoveSection(sectionIndex)}
                                        >
                                            Remove Section
                                        </button>
                                    </div>

                                    {/* Section Title Input */}
                                    <div className="form-group">
                                        <label htmlFor={`section${sectionIndex}_title`} className="form-label">
                                            Section Title
                                        </label>
                                        <input
                                            type="text"
                                            id={`section${sectionIndex}_title`}
                                            value={section.title}
                                            onChange={(e) => handleSectionChange(sectionIndex, e.target.value)}
                                            placeholder="Enter section title"
                                            className={`form-control ${
                                                errors[`section${sectionIndex}`] ? "is-invalid" : ""
                                            }`}
                                        />
                                        {errors[`section${sectionIndex}`] && (
                                            <div className="invalid-feedback">
                                                {errors[`section${sectionIndex}`]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Video Inputs */}
                                    <div className="videos-container">
                                        {section.videos.map((video, videoIndex) => (
                                            <div key={videoIndex} className="video-item">
                                                <div className="video-header">
                                                    <span>Video {video.order}</span>
                                                    <button
                                                        type="button"
                                                        className="btn-remove-video"
                                                        onClick={() =>
                                                            handleRemoveVideo(sectionIndex, videoIndex)
                                                        }
                                                    >
                                                        ×
                                                    </button>
                                                </div>

                                                {/* Video Title */}
                                                <div className="form-group">
                                                    <label htmlFor={`video${sectionIndex}_${videoIndex}_title`}
                                                           className="form-label">
                                                        Video Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id={`video${sectionIndex}_${videoIndex}_title`}
                                                        value={video.title}
                                                        onChange={(e) =>
                                                            handleVideoChange(
                                                                sectionIndex,
                                                                videoIndex,
                                                                "title",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter video title"
                                                        className={`form-control ${
                                                            errors[`video${sectionIndex}_${videoIndex}_title`]
                                                                ? "is-invalid"
                                                                : ""
                                                        }`}
                                                    />
                                                    {errors[`video${sectionIndex}_${videoIndex}_title`] && (
                                                        <div className="invalid-feedback">
                                                            {errors[`video${sectionIndex}_${videoIndex}_title`]}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Video File Input */}
                                                <div className="form-group">
                                                    <label
                                                        htmlFor={`video${sectionIndex}_${videoIndex}_file`}
                                                        className="form-label"
                                                    >
                                                        Upload Video
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id={`video${sectionIndex}_${videoIndex}_file`}
                                                        accept="video/*"
                                                        onChange={(e) =>
                                                            handleVideoFileChange(
                                                                sectionIndex,
                                                                videoIndex,
                                                                e.target.files?.[0] || null
                                                            )
                                                        }
                                                        className="form-control"
                                                    />
                                                    {video.url && (
                                                        <p className="form-text">
                                                            Uploaded:{" "}
                                                            <a
                                                                href={video.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                Preview
                                                            </a>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn-add-video"
                                            onClick={() => handleAddVideo(sectionIndex)}
                                        >
                                            + Add Video
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn-add-section" onClick={handleAddSection}>
                                + Add New Section
                            </button>
                        </div>


                    </div>
                );

            case 7:
                return (
                    <div className="create-course__step">
                        <h2>Course Price & Image</h2>
                        <p className="create-course__subtitle">
                            Set your course price and upload a cover image
                        </p>

                        <div className="price-image-container">
                            <div className="form-group price-input">
                                <label htmlFor="price" className="form-label">
                                    Course Price (USD)
                                </label>
                                <div className="price-field">
                                    <span className="currency-symbol">$</span>
                                    <input
                                        type="text"
                                        id="price"
                                        value={formData.price}
                                        onChange={handlePriceChange}
                                        placeholder="0.00"
                                        className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                    />
                                </div>
                                {errors.price && (
                                    <div className="invalid-feedback">{errors.price}</div>
                                )}
                            </div>

                            <div className="form-group image-upload">
                                <label className="form-label">Course Cover Image</label>
                                <div className="image-upload-area">
                                    {formData.imageUrl ? (
                                        <div className="image-preview">
                                            <img src={formData.imageUrl} alt="Course cover"/>
                                            <button
                                                type="button"
                                                className="btn-change-image"
                                                onClick={() =>
                                                    document.getElementById("imageInput")?.click()
                                                }
                                            >
                                                Change Image
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="upload-placeholder"
                                            onClick={() => document.getElementById("imageInput")?.click()}
                                        >
                                            <div className="upload-icon">
                                                <i className="fas fa-cloud-upload-alt"></i>
                                            </div>
                                            <p>Click to upload image</p>
                                            <span>Maximum file size: 5MB</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="imageInput"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{display: "none"}}
                                    />
                                </div>
                                {errors.imageUrl && (
                                    <div className="invalid-feedback d-block">{errors.imageUrl}</div>
                                )}
                            </div>
                        </div>

                        {isPublishing && (
                            <div className="publishing-status">
                                <PublishingProgress step={publishingStep}/>
                                <div className="publishing-message">
                                    <span className="spinner-border spinner-border-sm"/>
                                    <span>{getPublishingStatus()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="create-course">
            <div className="container">
                <div className="create-course__header">
                    <h1>Create New Course</h1>
                    <div className="create-course__progress">Step {currentStep} of 7</div>
                </div>

                <div className="create-course__content">{renderStep()}</div>

                <div className="create-course__actions">
                    {currentStep > 1 && (
                        <button onClick={prevStep} className="btn btn-previous">
                            Previous
                        </button>
                    )}
                    {currentStep < 7 ? (
                        <button onClick={nextStep} className="btn btn-two btn-next">
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handlePublishCourse}
                            className="btn btn-two btn-publish"
                            disabled={isPublishing}
                        >
                            {isPublishing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {getPublishingStatus()}
                                </>
                            ) : (
                                'Publish Course'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;
