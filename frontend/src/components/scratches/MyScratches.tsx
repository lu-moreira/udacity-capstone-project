import * as React from 'react'
import { Button, Divider } from 'semantic-ui-react'
import Auth from '../../infra/auth/Auth'
import { AllAvailable } from './../scratches/AllAvailable'
import { getAllAvailable, getAllByUserId } from '../../api/scratchApi'
import { CreateScratchModal } from './CreateScratch'
import { ScratchItem } from '../../domain/ScratchItem'

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
    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handleOnItemCreated(item : ScratchItem) {

    }

    render() {
        return (
            <div>
                <CreateScratchModal auth={this.props.auth} onItemCreated={this.handleOnItemCreated} />
                <Divider />
                <AllAvailable {...this.props} title="My Scratches" recoverItems={
                    () => {
                        return getAllByUserId(this.props.auth.idToken)
                    }} shouldEdit />
                <Divider />
                <AllAvailable {...this.props} title="Public" recoverItems={getAllAvailable} shouldEdit={false} />
            </div>
        )
    }
}
