import React, { Component,Fragment } from 'react';
import { 
  Modal, 
  ModalHeader, 
  ModalBody, 
  Button, 
  Row, 
  Col,
  Card, 
  CardHeader,
  CardBody,
  Collapse,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getListQuiz } from '../../../actions/testQuizAction'; 
import { addQuizLesson, getLessonIncourse, clearSuccess } from '../../../actions/lessonActions'; 
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class QuizModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accordion: [],
      listTestQuiz: [],
      loading: true,
      isOpenModal: false,
      isLoading: false,
      isShowSuccess: false,
      isShowError: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleClickQuiz = this.handleClickQuiz.bind(this);
  }

  toggleModal() {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  onOpenModal = e => {
    e.preventDefault();

    this.props.getListQuiz();
    this.setState({
      isOpenModal: !this.state.isOpenModal
    });
  }

  handleClickQuiz(quizId){
    const deadlineData = {}

    this.state.listTestQuiz.forEach(elem => {
      if(elem._id.toString() === quizId.toString())
        deadlineData.deadline = elem.deadLine  
    })

    if(deadlineData.deadline === undefined)
      this.setState({
        isShowError: true
      })
    else{
      this.props.addQuizLesson(this.props.courseId, this.props.eventId, quizId, deadlineData)
      this.setState({ isLoading: true })
    }
  } 

  componentWillReceiveProps(nextProps) {
    if (nextProps.testQuiz) {
      const { listTestQuiz, loading } = nextProps.testQuiz
      if(listTestQuiz)
      {
        var accordion = [];
        listTestQuiz.map(()=>accordion.push(false))
        this.setState({
          accordion,
          listTestQuiz,
          loading
        })
      }

      this.setState({
        loading
      })
    }

    if (nextProps.success.mes === "Chọn bài trắc nghiệm cho bài học thành công") {
      this.setState({isShowSuccess: true, isLoading: false})
      this.props.clearSuccess()
    }
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false
    })
    this.props.getLessonIncourse(this.props.courseId, this.props.eventId)
  }

  hideAlertError(){
    this.setState({
      isShowError: false
    })
  }

  toggleAccordion(tab) {
    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  onChangeDeadline(quizId, time){
    this.state.listTestQuiz.map(elem => {
      if(elem._id.toString() === quizId.toString())
        return elem.deadLine = time;
      return elem;
    })
    this.setState({
      listTestQuiz: this.state.listTestQuiz
    })
  }

  render() {
    const { listTestQuiz, loading } = this.state;
    return (
      <Fragment>
        <Button color="danger" onClick={this.onOpenModal}>Chọn trắc nghiệm</Button>
        <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal} className='modal-lg'>
          <ModalHeader  toggle={this.toggleModal}>Chọn trắc nghiệm</ModalHeader>
          <ModalBody style={{overflowY:'scroll', height:500}}>
          {
            loading
            ?
            <ReactLoading type='bars' color='#05386B' />
            :
            <Fragment>
            {
              listTestQuiz.length === 0
              ?
              <b>Chưa có bài trắc nghiệm</b>
              :
              <Fragment>
              {
                listTestQuiz.map((quiz,index)=>
                  <Card className="mb-0" key={quiz._id} style={{marginTop:10}}>
                    <CardHeader style={{backgroundColor: 'lightblue'}}>
                      <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls="collapseOne">
                        <h5 className="m-0 p-0" style={{color: 'black'}}>{quiz.title}</h5>
                      </Button>
                    </CardHeader>
                    <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id="collapseOne">
                      <CardBody>
                        <Row>
                          <Col xs="10">
                            <Label style={{marginRight: 10, fontWeight:'bold'}}>Hạn chót làm bài: </Label> 
                            {
                              quiz.deadLine
                              ?
                              <DatePicker
                                selected={quiz.deadLine}
                                onChange={this.onChangeDeadline.bind(this, quiz._id)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                isClearable={true}
                                dateFormat="dd/MM/yyyy HH:mm aa"
                                customInput={<Input />}
                                timeCaption="time"
                              />
                              :
                              <DatePicker
                                onChange={this.onChangeDeadline.bind(this, quiz._id)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                isClearable={true}
                                dateFormat="dd/MM/yyyy HH:mm aa"
                                customInput={<Input />}
                                timeCaption="time"
                              />
                            }

                          </Col>
                          <Col >
                            <Button color="primary" onClick={this.handleClickQuiz.bind(this, quiz._id)}>
                              Chọn
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Collapse>
                  </Card>
                )
              }
              </Fragment>
            }
            </Fragment>
          }
          </ModalBody>
        </Modal>
        <SweetAlert
          	success
            confirmBtnText="OK"
            title='Chọn bài trắc nghiệm cho bài học thành công'            
          	confirmBtnBsStyle="success"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        <SweetAlert
          	danger
            confirmBtnText="OK"
            title='Hãy chọn deadline'            
          	confirmBtnBsStyle="danger"
            show={this.state.isShowError}
            onConfirm={this.hideAlertError.bind(this)}>
        </SweetAlert>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  testQuiz: state.testQuiz,
  success: state.success
});

export default connect(mapStateToProps, { getListQuiz, addQuizLesson, clearSuccess, getLessonIncourse })(QuizModal);  