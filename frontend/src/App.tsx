import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Button } from 'semantic-ui-react'

import Auth from './infra/auth/Auth'
import { NotFound } from './components/NotFound'
import { AllAvailable } from './components/scratches/AllAvailable'
import { MyScratches } from './components/scratches/MyScratches'
import { Public } from './components/Public'
import { style } from './styles/theme'
import useWindowScroll from "@react-hook/window-scroll";
import { getAllAvailable } from './api/scratchApi'

const Header = () => {
  const scrollY = useWindowScroll(5);
  return (
    <div className={style("header", scrollY > 64 && "minify")}>
      <div>
        <h1> WallScratch </h1>
      </div>
    </div>);
};

export interface AppProps { }

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState { }

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <main className={style("container")}>
        <div className={style("masonic")}>
          {this.generateMenu()}
          <Router history={this.props.history}>
            {this.generateCurrentPage()}
          </Router>
        </div>
        <Header></Header>
      </main>
    );
  }

  generateMenu() {
    return (
      <Menu secondary>
        <Menu.Menu position="right">
          <Menu.Item name="home">
            <Link to="/">Home</Link>
          </Menu.Item>
          {this.meButton()}
          {this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    );
  }

  meButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="me-scracthes">
          <Link to="/me">My Scratches</Link>
        </Menu.Item>
      )
    }
    return (<div></div>)
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <Public auth={this.props.auth} history={this.props.history} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <AllAvailable {...props} auth={this.props.auth} title="Public" recoverItems={getAllAvailable} shouldEdit={false}/>
          }}
        />

        <Route
          path="/me"
          exact
          render={props => {
            return <MyScratches {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}