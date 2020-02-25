import * as React from 'react'
import { Button } from 'semantic-ui-react'
import Auth from '../infra/auth/Auth'
import { AllAvailable } from './scratches/AllAvailable'
import { getAllAvailable } from '../api/scratchApi'

interface PublicProps {
  auth: Auth
  history: any
}

interface PublicState { }

export class Public extends React.PureComponent<PublicProps, PublicState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <AllAvailable {...this.props} title="Public" recoverItems={getAllAvailable} shouldEdit={false}/>
      </div>
    )
  }
}
