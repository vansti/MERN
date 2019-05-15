import React, { Component,Fragment } from 'react';
import { Modal, ModalHeader, ModalBody, NavLink, ModalFooter, Button, Col, FormGroup, Label, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { addSubmission, getSubmission, download, deleteSubmission, clearErrors } from '../../../actions/exerciseActions';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom';
import ReactDropzone from "react-dropzone";
import isEmptyObj from '../../../validation/is-empty';

class SubmitExercise extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attachFile: null,
      large: false,
      errors: {},
      isLoading: false,
      loading: false,
      submission: ''
    };

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  componentWillReceiveProps(nextProps) {

    if (!isEmptyObj(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, isLoading: false});
    }

    this.setState({ errors: nextProps.errors});
    if (nextProps.success.mes === "Nộp bài tập thành công!") {
      this.setState({
        isLoading: false,
        attachFile: null,
        fileName: ''
      })
    }

    const { submission, loading } = nextProps.submission
    this.setState({ 
      submission,
      loading 
    });

  }


  onDrop = (files) => {
    let file = files[0];
   
    this.setState({
      attachFile: file,
      fileName: file.name
    });
  }

  onsubmit = (e) => {
    e.preventDefault();
    const data = {
      file: this.state.attachFile,
    }
    this.props.clearErrors();
    this.props.addSubmission(data, this.props.exerciseId);
    this.setState({
      isLoading: true,
    })
  }

  download = (e) => {
    e.preventDefault();
    this.props.download(this.props.exerciseId, this.props.submission.submission);
  }

  deleteSubmission = (e) => {
    e.preventDefault();
    this.props.deleteSubmission(this.props.exerciseId);
  }

  onOpenModal = e => {
    e.preventDefault();
    this.setState({
      exerciseId: this.props.exerciseId
    })
    this.props.getSubmission(this.props.exerciseId);
    this.setState({
      large: !this.state.large,
    });
  }

  render() {
    const { errors, submission, loading } = this.state;

    return (
      <Fragment>
        <Button block color="primary" onClick={this.onOpenModal} >Nộp bài tập</Button>
        <Modal isOpen={this.state.large} toggle={this.toggleLarge} className='modal-lg modal-primary'>
          <ModalHeader  toggle={this.toggleLarge}>Nộp bài tập</ModalHeader>
          <ModalBody>
            <FormGroup row> 
              <Col md="4">
                <ReactDropzone onDrop={this.onDrop} >
                  Thả file vào đây!
                </ReactDropzone>
              </Col>
              <Col xs="12" md="8">
                <p>{this.state.fileName}</p>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="4">
                <Label>Bài đã nộp</Label>
              </Col>
              <Col xs="12" md="8"> 
              {
                submission === ''
                ? <div>Chưa có bài nộp</div>
                :<NavLink href="#" onClick={this.download}>{submission}</NavLink>
              }    
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="4">
                <Button color="danger" onClick={this.deleteSubmission}>Hủy bài nộp</Button>
              </Col>
              <Col xs="12" md="8">
                {/* errors.file là thông tin từ server */}
                {errors.file && <Alert color="danger">{errors.file}</Alert>}
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.onsubmit}>Nộp</Button>{' '}
            <Button color="secondary" onClick={this.toggleLarge}>Hủy</Button>
          </ModalFooter>
        </Modal>
        {/* Phần loading */}
        <Modal isOpen={loading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Loading</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
        {/* Phần thông báo nộp bài thành công */}
        <Modal isOpen={this.state.isLoading} className='modal-sm' >
          <ModalBody className="text-center">
            <h3>Đang xử lý</h3>
            <br/>
            <div style={{marginLeft:100}}><ReactLoading type='bars' color='#05386B' height={100} width={50} /></div>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

SubmitExercise.propTypes = {
  addSubmission: PropTypes.func.isRequired,
  submission: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  submission: state.submission,
  errors: state.errors,
  success: state.success
});

export default withRouter(connect(mapStateToProps, { addSubmission, getSubmission, download, deleteSubmission, clearErrors })(SubmitExercise)); 