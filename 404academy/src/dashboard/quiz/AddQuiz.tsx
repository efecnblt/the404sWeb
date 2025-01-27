import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Divider,
  Radio,
  FormControlLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

interface IAuthorProfile {
  authorID: number;
  name: string;
  biography: string;
  departmentID: number;
  rating: number;
  studentCount: number;
  courseCount: number;
  imageURL: string;
  courses: ICourse[];
}

interface ICourse {
  courseID: number;
  name: string;
  description: string;
  rating: number;
  price: number;
  totalStudentCount: number;
}

interface ISection {
  sectionID: number;
  courseID: number;
  order: number;
  title: string;
}

interface IQuiz {
  quizID?: number; // Varsa eklenebilir
  sectionID: number;
  name: string;
  totalPoints: number;
  questions: IQuestion[];
}

interface IQuestion {
  questionText: string;
  choices: IChoice[];
}

interface IChoice {
  choiceText: string;
  isCorrect: boolean;
}

const ManageQuizzes: React.FC = () => {
  const [authorProfile, setAuthorProfile] = useState<IAuthorProfile | null>(
      null
  );
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [sections, setSections] = useState<ISection[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | "">("");

  // Quizzes for the selected section
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);

  // Add Quiz Form States
  const [quizName, setQuizName] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [questions, setQuestions] = useState<IQuestion[]>([
    { questionText: "", choices: [{ choiceText: "", isCorrect: false }] },
  ]);

  // 1) Eğitmenin tüm bilgilerini çek
  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const response = await axios.get<IAuthorProfile>(
            "http://165.232.76.61:5001/api/Authors/getauthorallprofile?authorId=9"
        );
        setAuthorProfile(response.data);
      } catch (error) {
        console.error("Author Profile Fetch Error:", error);
      }
    };
    fetchAuthorProfile();
  }, []);

  // 2) Kurs seçilince, sectionları çek
  useEffect(() => {
    if (selectedCourse !== "") {
      const fetchSections = async () => {
        try {
          const response = await axios.get<ISection[]>(
              `http://165.232.76.61:5001/api/Sections/course/${selectedCourse}`
          );
          setSections(response.data);
        } catch (error) {
          console.error("Sections Fetch Error:", error);
        }
      };
      fetchSections();
    } else {
      setSections([]);
      setSelectedSection("");
      setQuizzes([]);
    }
  }, [selectedCourse]);

  // 3) Section seçilince, quizleri çek
  useEffect(() => {
    // Örnek endpoint: /api/Quiz/section/{sectionID}
    if (selectedSection !== "") {
      const fetchQuizzes = async () => {
        try {
          // Bu endpoint'i proje ihtiyaçlarınıza göre düzenleyin.
          // Örneğin: GET http://165.232.76.61:5001/api/Quiz/section/${selectedSection}
          const response = await axios.get<IQuiz[]>(
              `http://165.232.76.61:5001/api/Quiz/section/${selectedSection}`
          );
          setQuizzes(response.data);
        } catch (error) {
          // Eğer endpoint henüz yoksa bu kısmı uyarlayabilirsiniz
          console.error("Quizzes Fetch Error:", error);
        }
      };
      fetchQuizzes();
    } else {
      setQuizzes([]);
    }
  }, [selectedSection]);

  /*******************************************************
   * QUIZ EKLEME FORMU İŞLEMLERİ
   *******************************************************/
  const handleAddQuiz = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedSection) {
      toast.error("Lütfen bir section seçin!");
      return;
    }

    const quizData: IQuiz = {
      sectionID: Number(selectedSection),
      name: quizName,
      totalPoints,
      questions,
    };

    try {
      await axios.post("/api/Quiz/add-quiz", quizData);
      toast.success("Quiz başarıyla eklendi!");

      // Formu resetle
      setQuizName("");
      setTotalPoints(0);
      setQuestions([{ questionText: "", choices: [{ choiceText: "", isCorrect: false }] }]);
      // Yeni eklenen quiz'i listeye eklemek isterseniz, tekrar fetch ya da setQuizzes([...quizzes, response.data]) yapabilirsiniz.
    } catch (error) {
      console.error("Error adding quiz:", error);
      toast.error("Quiz ekleme başarısız oldu!");
    }
  };

  // Soru Metni Değişimi
  const handleQuestionChange = (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = event.target.value;
    setQuestions(newQuestions);
  };

  // Seçenek Metni Değişimi
  const handleChoiceChange = (
      questionIndex: number,
      choiceIndex: number,
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices[choiceIndex].choiceText =
        event.target.value;
    setQuestions(newQuestions);
  };

  // Doğru Seçenek Değişimi
  const handleCorrectChange = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.forEach((choice, idx) => {
      choice.isCorrect = idx === choiceIndex;
    });
    setQuestions(newQuestions);
  };

  // Yeni Soru Ekle
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { questionText: "", choices: [{ choiceText: "", isCorrect: false }] },
    ]);
  };

  // Yeni Seçenek Ekle
  const addChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.push({
      choiceText: "",
      isCorrect: false,
    });
    setQuestions(newQuestions);
  };

  return (
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" mb={2}>
            Eğitmen Kursları ve Quiz Yönetimi
          </Typography>

          {/** 1) Eğitmenin Kurslarını Seçim İçin Listele **/}
          <Box sx={{ mt: 3, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="select-course-label">Kurs Seç</InputLabel>
              <Select
                  labelId="select-course-label"
                  value={selectedCourse}
                  label="Kurs Seç"
                  onChange={(e) => setSelectedCourse(e.target.value as number)}
              >
                <MenuItem value="">
                  <em>Seçiniz</em>
                </MenuItem>
                {authorProfile?.courses.map((course) => (
                    <MenuItem key={course.courseID} value={course.courseID}>
                      {course.name}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/** 2) Seçilen Kurstaki Sectionları Listele **/}
          {selectedCourse !== "" && (
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="select-section-label">Section Seç</InputLabel>
                  <Select
                      labelId="select-section-label"
                      value={selectedSection}
                      label="Section Seç"
                      onChange={(e) => setSelectedSection(e.target.value as number)}
                  >
                    <MenuItem value="">
                      <em>Seçiniz</em>
                    </MenuItem>
                    {sections.map((section) => (
                        <MenuItem key={section.sectionID} value={section.sectionID}>
                          {section.title}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
          )}

          {/** 3) Seçilen Section’ın Quizzelerini Listele **/}
          {selectedSection !== "" && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Mevcut Quizler
                </Typography>
                {quizzes && quizzes.length > 0 ? (
                    quizzes.map((quiz) => (
                        <Paper
                            key={quiz.quizID}
                            variant="outlined"
                            sx={{ p: 2, mb: 2, backgroundColor: "#fafafa" }}
                        >
                          <Typography variant="subtitle1">
                            Quiz Adı: {quiz.name}
                          </Typography>
                          <Typography variant="body2">
                            Puan: {quiz.totalPoints}
                          </Typography>
                          {/* Daha fazla quiz detayı göstermek isterseniz. */}
                        </Paper>
                    ))
                ) : (
                    <Typography>Bu section'a ait henüz bir quiz yok.</Typography>
                )}
              </Box>
          )}

          {/** 4) Yeni Quiz Ekleme Formu **/}
          {selectedSection !== "" && (
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" mb={2}>
                  Yeni Quiz Ekle
                </Typography>
                <Box component="form" onSubmit={handleAddQuiz}>
                  <TextField
                      label="Quiz Adı"
                      type="text"
                      value={quizName}
                      onChange={(e) => setQuizName(e.target.value)}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                  />

                  <TextField
                      label="Toplam Puan"
                      type="number"
                      value={totalPoints}
                      onChange={(e) => setTotalPoints(Number(e.target.value))}
                      fullWidth
                      required
                      sx={{ mb: 2 }}
                  />

                  <Divider sx={{ my: 2 }} />

                  {questions.map((question, questionIndex) => (
                      <Paper
                          key={questionIndex}
                          variant="outlined"
                          sx={{ p: 2, mb: 3, backgroundColor: "#fafafa" }}
                      >
                        <Typography variant="h6" mb={2}>
                          Soru {questionIndex + 1}
                        </Typography>
                        {/* Soru Metni */}
                        <TextField
                            label="Soru Metni"
                            type="text"
                            value={question.questionText}
                            onChange={(e) => handleQuestionChange(questionIndex, e)}
                            required
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        {/* Seçenekler */}
                        {question.choices.map((choice, choiceIndex) => (
                            <Box
                                key={choiceIndex}
                                display="flex"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                              <TextField
                                  label={`Seçenek ${choiceIndex + 1}`}
                                  value={choice.choiceText}
                                  onChange={(e) =>
                                      handleChoiceChange(questionIndex, choiceIndex, e)
                                  }
                                  fullWidth
                                  required
                              />
                              <FormControlLabel
                                  control={
                                    <Radio
                                        checked={choice.isCorrect}
                                        onChange={() =>
                                            handleCorrectChange(questionIndex, choiceIndex)
                                        }
                                    />
                                  }
                                  label="Doğru"
                                  sx={{ ml: 2 }}
                              />
                            </Box>
                        ))}
                        {/* Seçenek ekleme butonu */}
                        <Box>
                          <Button
                              variant="outlined"
                              startIcon={<AddCircleOutlineIcon />}
                              onClick={() => addChoice(questionIndex)}
                          >
                            Seçenek Ekle
                          </Button>
                        </Box>
                      </Paper>
                  ))}

                  {/* Soru Ekle / Submit */}
                  <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={addQuestion}
                        startIcon={<AddCircleOutlineIcon />}
                    >
                      Soru Ekle
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ ml: 2 }}
                    >
                      Quiz Oluştur
                    </Button>
                  </Box>
                </Box>
              </Paper>
          )}
        </Paper>
      </Container>
  );
};

export default ManageQuizzes;
