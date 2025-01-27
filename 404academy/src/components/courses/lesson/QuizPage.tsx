// QuizPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
} from "@mui/material";

/** API'den gelen verilerin arayüzü */
interface Choice {
    choiceID: number;
    questionID: number;
    choiceText: string;
    isCorrect: boolean;
}

interface Question {
    questionID: number;
    quizID: number;
    questionText: string;
    points: number;
    choices: Choice[];
}

/** API isteğini yapacak yardımcı fonksiyon */
const fetchQuestionsByQuizId = async (quizID: string): Promise<Question[]> => {
    const response = await fetch(
        `http://165.232.76.61:5001/api/Questions/getbyquizid/${quizID}`
    );
    const data = await response.json();
    return data; // [ { questionID, quizID, questionText, points, choices: [ ... ] } ]
};

const QuizPage: React.FC = () => {
    const { quizID } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<{ [questionID: number]: number | null }>(
        {}
    );
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    // Quiz sorularını ilk yükleyiş
    useEffect(() => {
        if (quizID) {
            fetchQuestionsByQuizId(quizID).then((data) => {
                setQuestions(data);

                // Toplam puanı hesapla
                const total = data.reduce((acc, question) => acc + question.points, 0);
                setTotalPoints(total);

                // UserAnswers başlangıcı
                const initialAnswers: { [key: number]: number | null } = {};
                data.forEach((q) => {
                    initialAnswers[q.questionID] = null;
                });
                setUserAnswers(initialAnswers);
            });
        }
    }, [quizID]);

    // Kullanıcının şık seçimi
    const handleAnswerSelect = (questionID: number, choiceID: number) => {
        setUserAnswers((prev) => ({ ...prev, [questionID]: choiceID }));
    };

    // İleri butonu tıklandığında
    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            // Son sorudayız, skoru hesapla
            calculateScore();
        }
    };

    // Skor hesaplama
    const calculateScore = () => {
        let calculatedScore = 0;

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const selectedChoiceID = userAnswers[question.questionID];
            if (selectedChoiceID) {
                // Doğru seçeneği bul
                const correctChoice = question.choices.find((c) => c.isCorrect);
                if (correctChoice && correctChoice.choiceID === selectedChoiceID) {
                    calculatedScore += question.points;
                }
            }
        }

        setScore(calculatedScore);
        setShowScore(true);
    };

    // Ders sayfasına dön
    const handleGoBack = () => {
        navigate("/");
    };

    // Eğer quizID yoksa
    if (!quizID) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h5" color="error">
                    Quiz bulunamadı.
                </Typography>
            </Container>
        );
    }

    // Skor ekranı
    if (showScore) {
        return (
            <Container
                maxWidth="sm"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            >
                <Card sx={{ width: "100%", p: 2, boxShadow: 4 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Quiz Tamamlandı!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Toplam Puanınız: <strong>{score}</strong> / {totalPoints}
                        </Typography>
                        <Box textAlign="center">
                            <Button variant="contained" color="primary" onClick={handleGoBack}>
                                Derse Geri Dön
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    // Sorular yüklenmemişse
    const question = questions[currentQuestionIndex];
    if (!question) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h5">Yükleniyor...</Typography>
            </Container>
        );
    }

    // Quiz ekranı (Soru + Seçenekler)
    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
            }}
        >
            <Card sx={{ width: "100%", boxShadow: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Soru {currentQuestionIndex + 1} / {questions.length}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {question.questionText}
                    </Typography>

                    <RadioGroup
                        value={userAnswers[question.questionID] || ""}
                        onChange={(e) =>
                            handleAnswerSelect(question.questionID, Number(e.target.value))
                        }
                    >
                        {question.choices.map((choice) => (
                            <FormControlLabel
                                key={choice.choiceID}
                                value={choice.choiceID}
                                control={<Radio color="primary" />}
                                label={choice.choiceText}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </RadioGroup>

                    <Box textAlign="center" mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNextQuestion}
                        >
                            {currentQuestionIndex === questions.length - 1
                                ? "Bitir"
                                : "Sonraki Soru"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default QuizPage;
