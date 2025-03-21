const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/quizDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
});

const Question = mongoose.model('Question', questionSchema);

// GET: Fetch a random question
app.get('/api/question', async (req, res) => {
    const count = await Question.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomQuestion = await Question.findOne().skip(randomIndex).select('-correctAnswer');
    res.json(randomQuestion);
});

// POST: Submit an answer
app.post('/api/answer', async (req, res) => {
    const { questionId, selectedAnswer } = req.body;
    const question = await Question.findById(questionId);
    if (!question) {
        return res.status(404).json({ message: 'Question not found' });
    }
    const isCorrect = question.correctAnswer === selectedAnswer;
    res.json({ correct: isCorrect });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
