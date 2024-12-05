interface DataType {
   id: number;
   page: string;
   question: string;
   answer: string;
   showAnswer: boolean;
};

const faq_data: DataType[] = [
   {
      id: 1,
      page: "home_1",
      question: "What is 404 Academy and what does it offer?",
      answer: "404 Academy is an innovative learning platform designed to provide high-quality educational content across various fields. Whether you want to develop technical skills, learn new subjects, or advance your career, our expert-designed courses and interactive materials are tailored to meet your needs.",
      showAnswer:false,
   },
   {
      id: 2,
      page: "home_1",
      question: "Are the courses suitable for beginners?",
      answer: "Absolutely! Our courses are designed for learners at all levels. Each course includes step-by-step guidance, making it easy for beginners to follow along while offering advanced insights for more experienced learners.",
      showAnswer:false,
   },
   {
      id: 3,
      page: "home_1",
      question: "How can I track my learning progress on the platform?",
      answer: "404 Academy provides a progress tracker that allows you to monitor completed lessons, quizzes, and overall achievements. You can also earn badges and certificates as you advance through your courses.",
      showAnswer:false,
   },
   {
      id: 4,
      page: "home_1",
      question: "Can I access the courses on multiple devices?",
      answer: "Yes, our platform is accessible on all major devices, including smartphones, tablets, and computers. With 404 Academy, you can learn anytime, anywhere, at your own pace.",
      showAnswer:false,
   },
];

export default faq_data;