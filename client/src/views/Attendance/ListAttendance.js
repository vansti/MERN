import React, { Component, Fragment } from 'react';
import {  Card, CardHeader, CardBody, Input, Modal, ModalBody, Badge, Table, Button , ModalHeader, ListGroup, ListGroupItem, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { getManageCourses } from '../../actions/courseActions';
import { getAttendance, clearAttendance, getTodayAttendance } from '../../actions/attendanceActions';
import { getSchedule } from '../../actions/scheduleActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import isEmptyObj from '../../validation/is-empty';
import { Chart } from 'react-google-charts';
import Moment from 'react-moment'; 
import 'moment/locale/vi';
var moment = require('moment');

const styles = {
  bigAvatar: {
    height: 40,
    width: 40,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  }
};

class ListAttendance extends Component {
  constructor() {
    super();
    this.state = {
      isOpenModal: false,
      courseTitle: null,
      loadingUserAttendance: true,
      events: [],
      loadingEvent :true,
      managecourses: [], 
      intialManagecourses: [],
      loadingCourses: true,
      users:[],
      intialUsers: [],
      courseId: '0',
      isLoading: false,
      selectDate: null,
      highlightDates: [],
      chartData:[
        [
          {
            type: "date",
            id: "Date"
          },
          {
            type: "number",
            id: "Absent"
          }
        ]
      ],
      loadingAttendance: false,
      attendance: []
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleToSudentInfo = this.handleToSudentInfo.bind(this);
  }

  toggleModal = () => {
    this.setState({
      isOpenModal: !this.state.isOpenModal,
    });
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleToSudentInfo(studentId){
    this.props.history.push('/student-info/' + studentId)
  }
  
  handleChangeDate(selectDate) {
    var date = {
      selectDate
    };

    this.props.getTodayAttendance(this.state.courseId, date);
    this.setState({
      selectDate
    });
  }

  handleChangeDateChart = (selectDate) => {
    var date = {
      selectDate: moment(selectDate).format('YYYY-MM-DD')
    };
    this.props.getTodayAttendance(this.state.courseId, date);
    this.setState({
      selectDate: moment(selectDate).format('YYYY-MM-DD')
    });
  }

  onChangeSelectCourse(courseId, courseTitle) {
    this.props.getSchedule(courseId);
    this.props.getAttendance(courseId);
    this.setState({ 
      isOpenModal: false,
      courseTitle,
      courseId, 
      selectDate: null,
      users: [],
      intialUsers: [],
      chartData: [
        [
          {
            type: "date",
            id: "Date"
          },
          {
            type: "number",
            id: "Absent"
          }
        ]
      ]
    });
  }

  componentWillReceiveProps(nextProps) {

    const { schedule, loading } = nextProps.schedule
    if(!isEmptyObj(schedule))
      this.setState({ 
        events: schedule.events,
        loadingEvent: loading
      });
    this.setState({
      loadingEvent: loading 
    });  

    if (nextProps.courses) {
      const { managecourses, loading } = nextProps.courses
      this.setState({ 
        intialManagecourses: managecourses,
        managecourses, 
        loadingCourses: loading
      });
    }

    if (!isEmptyObj(nextProps.attendance)) {
      const { loading, today_attendance } = nextProps.attendance

      if(today_attendance === null)
        this.setState({
          intialUsers: [],
          users: [],
          loadingUserAttendance: loading
        })
      else
        this.setState({
          intialUsers: today_attendance.students,
          users: today_attendance.students,
          loadingUserAttendance: loading
        })
    }

    if (!isEmptyObj(nextProps.attendance)) {
      const { loading, attendance } = nextProps.attendance

      this.setState({
        attendance,
        loadingAttendance: loading
      })

      attendance.forEach(element => {
        var tempList = [];
        tempList.push(new Date(element.date))
        var count = 0
        element.students.forEach(student=>{
          if(student.isPresent === false)
            count++
        })
        tempList.push(count)
        this.setState(prevState => ({
          chartData: [...prevState.chartData, tempList]
        }))
      })

      var dateList = [];
      nextProps.attendance.attendance.forEach(element => {
        dateList.push(new Date(element.date))
      })
      this.setState({
        highlightDates: dateList
      })
    }
  }

  componentDidMount = () => {
    this.props.getManageCourses();
    this.props.clearAttendance();
  }
  

  submit=()=>{
    if(this.state.selectDate !== null)
    {
      var userList = [];
      this.props.attendance.attendance.forEach(element => {
        if(moment(this.state.selectDate).format('YYYY-MM-DD') === element.date)
          userList = element.students
      })
      this.setState({
        users: userList,
        intialUsers: userList
      })
    }
  }

  onchange = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialUsers));
    updatedList = updatedList.filter((user)=>
      user.userId.email.toLowerCase().search(e.target.value.toLowerCase()) !== -1 ||
      user.userId.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1
    );
    this.setState({users: updatedList});
  }

  back=()=>{
    this.setState({
      selectDate: null,
      users: [],
      intialUsers: []
    })
  }

  onSearch = e =>{
    var updatedList = JSON.parse(JSON.stringify(this.state.intialManagecourses));
    updatedList = updatedList.filter((course)=>
      course.title.toLowerCase().search(e.target.value.toLowerCase()) !== -1);
    this.setState({ managecourses: updatedList });
  }

  render() {
    const superClass = this;
    const { 
      loadingAttendance, 
      users, 
      courseId, 
      intialUsers, 
      attendance, 
      loadingCourses, 
      managecourses,
      loadingEvent,
      events,
      selectDate,
      loadingUserAttendance,
      courseTitle
    } = this.state;

    var SelectDateChart = <div></div>;

    if(!isEmptyObj(attendance) && courseId !== '0')
    {
      SelectDateChart =
          <Chart
            chartType="Calendar"
            loader={<div><ReactLoading type='bars' color='#05386B' /></div>}
            data={this.state.chartData}
            options={{
              title: 'Thống kê số lượng sinh viên nghỉ'
            }}
            chartEvents={[
              {
                eventName: "select",
                callback({ chartWrapper }) {
                  superClass.handleChangeDateChart(chartWrapper.getChart().getSelection()[0].date)
                }
              }
            ]}
            rootProps={{ 'data-testid': '1' }}
          />
    }

    var LessonList = null;
    if(courseId !== '0'){
      LessonList = 
        <div className="animated fadeIn">
          <Table hover responsive bordered>
            <thead className="thead-light">
              <tr>
                <th>Ngày học</th>
                <th>Giờ học</th>
                <th>Bài học</th>
              </tr>
            </thead>
            <tbody>
            {
              events.map(e=>
                <tr key={e._id} className="changeCursor" onClick={this.handleChangeDate.bind(this, e.date)}>
                  <td>
                    {this.capitalizeFirstLetter(moment(e.date).locale('vi').format("dddd, [ngày] DD [thg] MM, YYYY"))}
                  </td>
                  <td>
                    <Moment format="HH:mm - ">
                      {e.start}
                    </Moment>
                    <Moment format="HH:mm">
                      {e.end}
                    </Moment>
                  </td>
                  <td>
                    {e.text}
                  </td>
                </tr>
              )
            }
            </tbody>
          </Table>
        </div>
    }

    var StudentList = null;
    if(courseId !== '0')
    {
      StudentList = <div className="animated fadeIn">
                      <Button color="primary" onClick={this.back}>
                        <i className="fa fa-arrow-left"></i> Trở về
                      </Button>
                      <h4 style={{marginTop: 20}}>Chưa có điểm danh</h4>
                    </div>
    }
    if(!isEmptyObj(intialUsers) && isEmptyObj(users) && courseId !== '0')
    {
      StudentList = <div className="animated fadeIn">
                      <Button color="primary" onClick={this.back}>
                        <i className="fa fa-arrow-left"></i> Trở về
                      </Button>
                      <Input style={{marginTop: 20}} type="text" onChange={this.onchange} placeholder="Email hoặc Họ Tên ..."  />
                      <br/>
                      <h4>Không tìm thấy kết quả</h4>
                    </div>
    }

    if(!isEmptyObj(users) && courseId !== '0'){
      StudentList = 
        <div className="animated fadeIn">
          <Button color="primary" onClick={this.back}>
            <i className="fa fa-arrow-left"></i> Trở về
          </Button>
          <Input style={{marginTop: 20}} type="text" onChange={this.onchange} placeholder="Email hoặc Họ Tên ..."  />
          <br/>
          <Table hover bordered striped responsive size="sm">
            <thead>
              <tr>
                <th>Hình đại diện</th>
                <th>Email</th>
                <th>Họ và Tên</th>
                <th>Trạng thái điểm danh</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map(user =>
                  <tr key={user._id} onClick={this.handleToSudentInfo.bind(this, user.userId._id)} className="changeCursor">
                    <th>                      
                      <div className="avatar">
                        <img src={user.userId.photo} className="img-avatar" alt="" />
                      </div>
                    </th>
                    <td>{user.userId.email}</td> 
                    <td>{user.userId.name}</td>
                    <td>{user.isPresent === true
                        ?<Badge className="mr-1" color="success" pill>Hiện diện</Badge>
                        :<Badge className="mr-1" color="danger" pill>Vắng</Badge>
                        }
                    </td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        </div>
    }


    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>Xem lịch sử điểm danh</strong>
          </CardHeader>
          <CardBody>
            {
              loadingCourses
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Button color="primary" onClick={this.toggleModal}> Chọn khóa học </Button>
            }
            <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal} className='modal-lg'>
              <ModalHeader  toggle={this.toggleModal}>Chọn khóa học</ModalHeader>
              <ModalBody style={{overflowY:'scroll', height:500}}>
                <Input style={{marginBottom: 10}} type="text" onChange={this.onSearch} placeholder="Tên khóa học . . ."/>
                {
                  managecourses.length === 0
                  ?
                  <b>Không có khóa học</b>
                  :
                  <ListGroup>
                  {
                    managecourses.map(course=>
                      <ListGroupItem key={course._id} color="secondary" tag="button" action onClick={this.onChangeSelectCourse.bind(this, course._id, course.title)}>
                        <img src={course.coursePhoto} alt="" style={styles.bigAvatar}/>
                        <span style={{marginLeft: 10}}>{course.title}</span>
                      </ListGroupItem>
                    )
                  }
                  </ListGroup>
                }
              </ModalBody>
            </Modal>
            {
              courseTitle &&
              <Alert style={{marginBottom: 20, marginTop: 20, textAlign: 'center', fontWeight:'bold'}} color="primary">
                Lịch sử điểm danh của {courseTitle}
              </Alert>
            }

          {
            selectDate
            ?
            <Fragment>
            {
              loadingUserAttendance
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              StudentList
            }
            </Fragment>
            :
            <Fragment>
            {
              loadingAttendance || loadingEvent
              ?
              <ReactLoading type='bars' color='#05386B'/>
              :
              <Fragment>
                {SelectDateChart}
                {LessonList}
              </Fragment>
            }
            </Fragment>
          }
          </CardBody>
        </Card>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

ListAttendance.propTypes = {
  courses: PropTypes.object.isRequired,
  getManageCourses : PropTypes.func.isRequired,
  attendance : PropTypes.object.isRequired,
  getAttendance: PropTypes.func.isRequired,
  clearAttendance: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  courses: state.courses,
  attendance: state.attendance,
  schedule: state.schedule
});

export default connect(mapStateToProps, { getSchedule, getManageCourses, getAttendance, clearAttendance, getTodayAttendance })(ListAttendance);  