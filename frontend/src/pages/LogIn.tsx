import * as React from 'react'
import { Button, Divider } from 'semantic-ui-react'
import Auth from '../../src/infra/auth/Auth'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h3>You want to see and manage your scratches? Please logIn</h3>
        <Divider/>

        <Button onClick={this.onLogin} size="large" color="blue">
          Log in
        </Button>
      </div>
    )
  }
}
