import * as React from 'react'
import { Button, Divider } from 'semantic-ui-react'
import Auth from '../../infra/auth/Auth'
import { AllAvailable } from './../scratches/AllAvailable'
import { getAllAvailable, getAllByUserId } from '../../api/scratchApi'
import { CreateScratchModal } from './CreateScratch'

interface MyScratchesProps {
    auth: Auth
    history: any
}

interface MyScratchesState {
    countReload: number
}

export class MyScratches extends React.PureComponent<MyScratchesProps, MyScratchesState> {
    state = {
        countReload: 1
    }
    onLogin = () => {
        this.props.auth.login()
    }
    reloadme = (v: boolean) => {
        this.setState({ countReload: this.state.countReload + 1 })
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <CreateScratchModal auth={this.props.auth} reloadMe={this.reloadme} />
                <Divider />
                <AllAvailable {...this.props} title="My Scratches" recoverItems={
                    () => {
                        return getAllByUserId(this.props.auth.idToken)
                    }} shouldEdit />
                <Divider />
                <AllAvailable {...this.props} title="Public" recoverItems={getAllAvailable} shouldEdit={false}/>
            </div>
        )
    }
}
