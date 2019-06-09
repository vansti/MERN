import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import { vnpayReturn, clearVnpayReturn } from '../actions/userActions';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import isEmptyObj from '../validation/is-empty';
import smile from '../assets/img/smile.png'

class VnPay extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      idStudent: ''
    };
  }

  componentDidMount() {
    this.props.vnpayReturn(this.props.location.search)
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmptyObj(nextProps.users.pay_return)) {
      this.setState({ loading: false, idStudent: nextProps.users.pay_return })
      this.props.clearVnpayReturn()
    }
  }

  render() {
    const { loading, idStudent } = this.state
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            {
              loading
              ?
              <ReactLoading type='spinningBubbles' color='#05386B' />
              :
              <div>
                <img src={smile} alt="avatar" style={{width: 100, height: 100}}/>
                <div style={{textAlign: 'center', fontFamily:'Roboto Slab, serif', fontSize:30, fontWeight:'bold'}}>
                  Chúc mừng! Bạn đã ghi danh thành công.
                </div> 
                <p style={{fontWeight:'bold'}}>
                  Mã số sinh viên của bạn là: {idStudent} <br/>
                  Mật khẩu đăng nhập vào hệ thống LMS là mật khẩu của bạn hiện tại
                </p>
              </div>
            }
          </Row>
        </Container>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  users: state.users
});

export default connect(mapStateToProps, { vnpayReturn, clearVnpayReturn })(VnPay);
