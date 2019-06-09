import React, { Component , Fragment } from 'react';
import {
  Modal, 
  ModalBody, 
  Alert, 
  Card, 
  CardBody, 
  CardHeader, 
  Col, 
  Row, 
  Button, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  InputGroup, 
  InputGroupText, 
  InputGroupAddon
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCourseInfo, editCourse, clearErrors, clearSuccess } from '../../actions/courseActions';
import isEmptyObj from '../../validation/is-empty';
import ReactDropzone from "react-dropzone";
import CKEditor from 'ckeditor4-react';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import ReactLoading from 'react-loading';
import SweetAlert from 'react-bootstrap-sweetalert';

const styles = {
  bigAvatar: {
    height: 200,
    width: 200,
    margin: 'auto',
    border: '1px solid #ddd',
    borderRadius: 5
  },
  buttonDanger: {
    margin: '0 0 0 10px'
  }
}

class EditCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      title: '',
      intro: '',
      coursePhoto: '',
      enrollDeadline: null,
      studyTime: '',
      openingDay: null,
      endDay: null,
      fee: '',
      info: '',
      file: null,
      isShowSuccess: false,
      errors: {},
      isLoading: false,
      invalidImg: false,
      pointColumns: [],
      maxStudent: '',
      minStudent: ''
    };
    this.onEditorChange = this.onEditorChange.bind( this );
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});


    if (nextProps.success.data === 'Chỉnh sửa khóa học thành công') {
      this.setState({isShowSuccess: true, isLoading: false})
    }
    if (!isEmptyObj(nextProps.courses))
    {
      let { courseinfo, loading } = nextProps.courses
      this.setState({ 
        loading,
        title: courseinfo.course.title,
        intro: courseinfo.course.intro,
        coursePhoto: courseinfo.course.coursePhoto,
        enrollDeadline: new Date(courseinfo.course.enrollDeadline),
        studyTime: courseinfo.course_detail.studyTime,
        openingDay: new Date(courseinfo.course_detail.openingDay),
        endDay: courseinfo.course_detail.endDay ? new Date(courseinfo.course_detail.endDay) : null,
        fee: courseinfo.course_detail.fee,
        info: courseinfo.course_detail.info,
        pointColumns: courseinfo.course.pointColumns ? courseinfo.course.pointColumns : [],
        maxStudent: courseinfo.course_detail.maxStudent,
        minStudent: courseinfo.course_detail.minStudent
      });
    }
  }

  componentDidMount = () => {
    this.props.getCourseInfo(this.props.match.params.courseId);
  }

  handleChange = name => event => {
    const value = event.target.value
    this.setState({ [name]: value })
  }

  onDrop = (files) => {
    if(files[0] === undefined)
    {
      this.setState({
        invalidImg: true
      })
    }else{
      let file = files[0]
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          coursePhoto: reader.result,
          invalidImg: false
        });
      }
      reader.readAsDataURL(file)
      this.setState({
        file: files[0]
      })
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const courseData = {
      title: this.state.title,
      intro: this.state.intro,
      enrollDeadline: this.state.enrollDeadline,
      fee: this.state.fee,
      info: this.state.info,
      pointColumns: this.state.pointColumns,
      openingDay: this.state.openingDay,
      endDay: this.state.endDay,
      maxStudent: this.state.maxStudent,
      minStudent: this.state.minStudent
    };
    this.props.clearErrors();
    this.props.editCourse(this.props.match.params.courseId, courseData, this.state.file);
    this.setState({isLoading: true});
  }

  hideAlertSuccess(){
    this.setState({
      isShowSuccess: false,
      errors: {},
      isLoading: false,
      invalidImg: false,
      days: [],
    })
    this.props.getCourseInfo(this.props.match.params.courseId);
    this.props.clearSuccess();
    this.props.clearErrors();
  }

  onEditorChange( evt ) {
    this.setState({
      info: evt.editor.getData()
    });
  }

  onChangeDeadline = enrollDeadline => this.setState({ enrollDeadline })

  handlePointColumnNameChange = idx => evt => {
    const newpointColumns = this.state.pointColumns.map((column, sidx) => {
      if (idx !== sidx) return column;
      return { ...column, pointName: evt.target.value };
    });

    this.setState({ pointColumns: newpointColumns });
  };

  handlePointColumnPointRateChange = idx => evt => {
    const newpointColumns = this.state.pointColumns.map((column, sidx) => {
      if (idx !== sidx) return column;
      return { ...column, pointRate: evt.target.value };
    });

    this.setState({ pointColumns: newpointColumns });
  };

  handleAddPointColumn = () => {
    this.setState({
      pointColumns: this.state.pointColumns.concat([{ pointName: "", pointRate: ""}])
    });
  };

  handleRemovePointColumn = idx => () => {
    this.setState({
      pointColumns: this.state.pointColumns.filter((s, sidx) => idx !== sidx)
    });
  };

  onChangeOpeningDay = openingDay => this.setState({ openingDay })

  onChangeEndDay = endDay => this.setState({ endDay })

  render() {
    const { errors, loading } = this.state;

    return (
      <div className="animated fadeIn">
      {
        loading
        ?
        <ReactLoading type='bars' color='#05386B'/>
        :
        <Fragment>
        <Form className="form-horizontal" id="add-course-form" onSubmit={this.onSubmit}>
          <Card>
            <CardHeader>
              <i className="fa fa-list-alt" aria-hidden="true"></i>Tóm tắt khóa học
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Tên khóa học</Label>
                <Input type="text" value={this.state.title} onChange={this.handleChange('title')}/>
              </FormGroup>
              {errors.title && <Alert color="danger">{errors.title}</Alert>}
              <FormGroup>
                <Label>Giới thiệu ngắn về khóa học</Label>
                <Input rows="3" type="textarea" value={this.state.intro} onChange={this.handleChange('intro')}/>
              </FormGroup>
              {errors.intro && <Alert color="danger">{errors.intro}</Alert>}
              <FormGroup>
                <Label>Học phí</Label>
                <InputGroup>
                  <Input type="number" value={this.state.fee} onChange={this.handleChange('fee')}/>
                  <InputGroupAddon addonType="append">
                    <InputGroupText>VND</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
              {errors.fee && <Alert color="danger">{errors.fee}</Alert>}
              <FormGroup>
                <Label>Hình đại diện khóa học</Label>
                <Row>
                  <Col xs="4">
                    <div className="preview-image">
                      {
                        this.state.coursePhoto === ''
                        ?
                        <img src='https://res.cloudinary.com/dk9jsd8vf/image/upload/v1552047406/1.png' alt="avatar" style={styles.bigAvatar}/>
                        :
                        <img src={this.state.coursePhoto} alt="avatar" style={styles.bigAvatar}/>
                      }
                    </div>
                  </Col>
                  <Col>
                    <ReactDropzone accept="image/*" onDrop={this.onDrop} >
                      Thả hình vào đây!
                    </ReactDropzone>
                  </Col>
                </Row>
              </FormGroup>
              {
                this.state.invalidImg === true
                ? <Alert color="danger">Hình ảnh không hợp lệ</Alert>
                : null
              }
              <FormGroup>
                <Label>Hạn chót ghi danh</Label> <br/>
                <DateTimePicker value={this.state.enrollDeadline} onChange={this.onChangeDeadline} />
              </FormGroup>
              {errors.enrollDeadline && <Alert color="danger">{errors.intro}</Alert>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <i className="fa fa-info-circle" aria-hidden="true"></i>Chi tiết khóa học
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Ngày khai giảng</Label> <br/>
                <DatePicker
                  selected={this.state.openingDay}
                  onChange={this.onChangeOpeningDay}
                  isClearable={true}
                  dateFormat="dd/MM/yyyy"
                  customInput={<Input />}
                />
              </FormGroup>
              {errors.openingDay && <Alert color="danger">{errors.openingDay}</Alert>}
              <FormGroup>
                <Label>Ngày kết thúc</Label> <br/>
                <DatePicker
                  selected={this.state.endDay}
                  onChange={this.onChangeEndDay}
                  isClearable={true}
                  dateFormat="dd/MM/yyyy"
                  customInput={<Input />}
                />
              </FormGroup>
              {errors.endDay && <Alert color="danger">{errors.endDay}</Alert>}
              <FormGroup>
                <Label>Thời gian học và buổi học</Label> <br/>
                <Alert color="dark">{this.state.studyTime}</Alert>
              </FormGroup>
              {this.state.pointColumns.map((pointColumn, idx) => (
              <FormGroup key={idx}>
                <div className="point-columns form-row">
                  <div className="col form-row">
                    <Label className="col-3">Tên cột điểm: </Label>
                    <input
                      className="form-control col"
                      type="text"
                      placeholder={`Tên cột điểm`}
                      value={pointColumn.pointName}
                      onChange={this.handlePointColumnNameChange(idx)}
                    />
                  </div>
                  <div className="col form-row">
                    <Label className="col-3">Tỉ lệ điểm (%): </Label>
                    <input
                      className="form-control col"
                      type="number"
                      placeholder={`Tỉ lệ điểm`}
                      value={pointColumn.pointRate}
                      onChange={this.handlePointColumnPointRateChange(idx)}
                    />
                  </div>
                  <button style={styles.buttonDanger} type="button" className="btn btn-danger" onClick={this.handleRemovePointColumn(idx)}><i className="fa fa-times" aria-hidden="true"></i></button>
                </div>
              </FormGroup>
              ))}
              <FormGroup>
                <button type="button" onClick={this.handleAddPointColumn} className="btn btn-success">Thêm cột điểm</button>
                {errors.pointColumns && <Alert color="danger">{errors.pointColumns}</Alert>}
              </FormGroup>

              <FormGroup>
                <div className="form-row">
                  <Label className="col-3" style={{fontWeight: 'bold'}}>Số lượng học viên tối đa </Label>
                  <div className="col-2">
                    <Input type="number" min='0' value={this.state.maxStudent} onChange={this.handleChange('maxStudent')}/>
                  </div>
                </div>
              </FormGroup>
              {errors.maxStudent && <Alert color="danger">{errors.maxStudent}</Alert>}

              <FormGroup>
                <div className="form-row">
                  <Label className="col-3" style={{fontWeight: 'bold'}}>Số lượng học viên tối thiểu </Label>
                  <div className="col-2">
                    <Input type="number" min='0' value={this.state.minStudent} onChange={this.handleChange('minStudent')}/>
                  </div>
                </div>
              </FormGroup>
              {errors.minStudent && <Alert color="danger">{errors.minStudent}</Alert>}

              <Label>Giới thiệu nội dung khóa học</Label>
              <CKEditor data={this.state.info} onChange={this.onEditorChange} />
              {errors.info && <Alert color="danger">{errors.info}</Alert>}
            </CardBody>
          </Card>

        </Form>

        <Button type="submit" style={{marginBottom:20}} color="primary" onClick={this.onSubmit}>Chỉnh sửa</Button>
        <SweetAlert
          	success
          	confirmBtnText="OK"
          	confirmBtnBsStyle="success"
          	title="Chỉnh sửa khóa học thành công!"
            show={this.state.isShowSuccess}
            onConfirm={this.hideAlertSuccess.bind(this)}>
        </SweetAlert>
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang lưu thay đổi</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        </Fragment>
        }
      </div>
    )
  }
}

EditCourse.propTypes = {
  getCourseInfo: PropTypes.func.isRequired, 
  editCourse: PropTypes.func.isRequired, 
  courses: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  courses: state.courses,
  success: state.success,
  errors: state.errors
});
export default connect(mapStateToProps, { getCourseInfo, editCourse, clearErrors, clearSuccess })(EditCourse); 