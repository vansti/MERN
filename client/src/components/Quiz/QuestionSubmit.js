import React, { Component } from 'react';
import PropTypes from 'prop-types';
class Question extends Component {
  constructor(props){
    super(props);
    this.state = {
      incorrectAnswer: false,
      correctAnswer: false,
      showNextQuestionButton: false,
      disibaleNextQuestionButton: false,
      disibalePreQuestionButton: true,
      endQuiz: false,
      currentQuestionIndex: 0,
      buttons: {},
      buttonClasses: {},
      answers: [],
      correct: [],
      incorrect: [],
      filteredValue: 'all',
      showDefaultResult: this.props.showDefaultResult !== undefined ? this.props.showDefaultResult : true,
      onComplete: this.props.onComplete !== undefined ? this.props.onComplete : null,
      customResultPage: this.props.customResultPage !== undefined ? this.props.customResultPage : null,
    };
  }
  checkAnswer = (index, correctAnswer) => {
    const { currentQuestionIndex } = this.state;
    this.nextQuestion(currentQuestionIndex);
  }

  nextQuestion = (currentQuestionIndex) => {
    const { questions } = this.props;

    var initState = {
      buttons: {},
    }

    if(currentQuestionIndex + 1 === questions.length) {
      this.setState({
        ...initState,
        endQuiz: true
      })
    } else {
      this.setState({
        ...initState,
        currentQuestionIndex: currentQuestionIndex + 1,
        disibalePreQuestionButton: false
      })
    }
  }

  preQuestion = (currentQuestionIndex) => {
    if(currentQuestionIndex === 0) {
      this.setState({
        disibalePreQuestionButton: true
      })
    } else {
      this.setState({
        currentQuestionIndex: currentQuestionIndex - 1,
        endQuiz: false
      })
    }
  }

  onSubmit = () => {

  }

  render() {
    const { questions } = this.props;
    const questionSummary = {
      numberOfQuestions: this.props.questions.length,
      numberOfCorrectAnswers: this.state.correct.length,
      numberOfIncorrectAnswers: this.state.incorrect.length,
      questions: this.state.correct
    };
    let question = questions[this.state.currentQuestionIndex];
    
    return (
      <div className="questionWrapper">
        <div className="questionWrapperBody">
          <div className="questionModal">
            <div className="alert default">
              <h3>Câu hỏi {this.state.currentQuestionIndex + 1}: <span>{question.question}</span></h3>
            </div>
          </div>
          {
            question.answers.map( (answer, index) => {
              if(this.state.buttons[index] !== undefined) {
                return (
                  <button key={index} className={`${this.state.buttons[index].className} answerBtn btn`}  onClick={() => this.checkAnswer(index+1, question.correctAnswer)}>
                    { question.questionType === 'text' && <span>{answer}</span> }
                    { question.questionType === 'photo' && <img src={answer} alt="" /> }
                  </button>
                )
              } else {
                return (
                  <button key={index} onClick={() => this.checkAnswer(index+1, question.correctAnswer)} className="answerBtn btn">{answer}
                  {/* { question.questionType === 'text' && answer }
                  { question.questionType === 'photo' && <img src={answer} alt="" /> } */}
                  </button>
                )
              }
            })
          }
          <div className="row justify-content-between m-0">
            <button disabled={ this.state.disibalePreQuestionButton || false } onClick={() => this.preQuestion(this.state.currentQuestionIndex)} className="nextQuestionBtn btn col-4">Quay lại</button>
            {
              this.state.endQuiz && <button onClick={this.submit} className="nextQuestionBtn btn col-4">Nộp bài</button>
            }
            {
              !this.state.endQuiz && <button onClick={() => this.nextQuestion(this.state.currentQuestionIndex)} className="nextQuestionBtn btn col-4">Tiếp tục</button>
            }
          </div>
        </div>
        {
          this.state.endQuiz && this.state.onComplete !== undefined &&
             this.state.onComplete(questionSummary)
        }
        {
          this.state.endQuiz && !this.state.showDefaultResult  && this.state.customResultPage !== undefined &&
             this.state.customResultPage(questionSummary)
        }
        </div>
    );
  }
}

Question.propTypes = {
  questions: PropTypes.array,
  showDefaultResult: PropTypes.bool,
  onComplete: PropTypes.func,
  customResultPage: PropTypes.func
};

export default Question;