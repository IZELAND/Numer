import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Sider from 'antd/lib/layout/Sider';
import Layout, { Content } from 'antd/lib/layout/layout';
import Falseposition from './Root/Falseposition';
import Baisection from './Root/Baisection';
import Onepoint from './Root/Onepoint';
import Newton from './Root/Newton';
import Secant from './Root/Secant';
import Cramerrule from './Linear/Cramerrule';
import Lagrange from './Interpolation/Lagrange';
import Jordan from './Linear/Jordan';
import LU from './Linear/LU';
import Jacobi from './Linear/Jacobi';

const { SubMenu } = Menu;

class App extends React.Component {
  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <Router>
        <Layout>
          
        <Sider width = {256}>
        <Menu
          onClick={this.handleClick}
          style={{ width: 256 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          <SubMenu key="sub1" title="Root of equation">
              <Menu.Item key="1">Bisection<Link to="/Baisection"></Link></Menu.Item>
              <Menu.Item key="2">False-position<Link to="/Falseposition"></Link></Menu.Item>
              <Menu.Item key="3">One-point Iteration<Link to="/Onepoint"></Link></Menu.Item>
              <Menu.Item key="4">Newtonraphson<Link to="/Newton"></Link></Menu.Item>
              <Menu.Item key="5">Secant<Link to="/Secant"></Link></Menu.Item>
          </SubMenu>
          <SubMenu key="sub2"  title="Linear eqaution">
            <Menu.Item key="6">Cramer's rule<Link to="/Cramerrule"></Link></Menu.Item>
            <Menu.Item key="7">Guass elimination</Menu.Item>
            <Menu.Item key="8">Guass jordan<Link to="/Jordan"></Link></Menu.Item>
            <Menu.Item key="9">LU<Link to="/LU"></Link></Menu.Item>
            <Menu.Item key="10">Cholesky</Menu.Item>
            <Menu.Item key="11">Jacobi<Link to="/Jacobi"></Link></Menu.Item>
            <Menu.Item key="12">Conjugate</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3"  title="Interpolation">
            <Menu.Item key="13">Newton divided-differences</Menu.Item>
            <Menu.Item key="14">Lagrange polynomials<Link to="/Lagrange"></Link></Menu.Item>
            <Menu.Item key="15">Spline interpolation</Menu.Item>
          </SubMenu>
          <SubMenu key="sub4"  title="Last sqaues regresstion">
            <Menu.Item key="16">Linear regression</Menu.Item>
            <Menu.Item key="17">Polynomials Regresstion</Menu.Item>
            <Menu.Item key="18">Multiple linear regresstion</Menu.Item>
          </SubMenu>
        </Menu>
        </Sider>
        <Layout>
          <Content>
          <Route path="/Baisection" component={Baisection}></Route>
          <Route path="/Falseposition" component={Falseposition}></Route>
          <Route path="/Onepoint" component={Onepoint}></Route>
          <Route path="/Newton" component={Newton}></Route>
          <Route path="/Secant" component={Secant}></Route>
          <Route path="/Cramerrule" component={Cramerrule}></Route>
          <Route path="/Jordan" component={Jordan}></Route>
          <Route path="/LU" component={LU}></Route>
          <Route path="/Jacobi" component={Jacobi}></Route>
          <Route path="/Lagrange" component={Lagrange}></Route>
          </Content>
        </Layout>
        </Layout>
        </Router>
    );
  }
}

export default App;
