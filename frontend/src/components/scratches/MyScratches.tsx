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
    newItems: ScratchItem[]
}

export class MyScratches extends React.PureComponent<MyScratchesProps, MyScratchesState> {
    state = {
        countReload: 1,
        newItems: [] as ScratchItem[]
    }
    constructor(props: MyScratchesProps) {
        super(props)
        this.handleOnItemCreated = this.handleOnItemCreated.bind(this)
    }
    onLogin = () => {
        this.props.auth.login()
    }

    componentDidMount() {
        this.setState({newItems: [] })
    }

    handleOnItemCreated(item: ScratchItem) {
        const items = this.state.newItems
        items.push(item)
        this.setState({ newItems: items })
    }

    render() {
        return (
            <div>
                <CreateScratchModal auth={this.props.auth} onItemCreated={this.handleOnItemCreated} />
                <Divider />
                <AllAvailable {...this.props} title="My Scratches" recoverItems={
                    () => {
                        return getAllByUserId(this.props.auth.idToken)
                    }} shouldEdit newItems={this.state.newItems} />
                <Divider />
                <AllAvailable {...this.props} title="Public" recoverItems={getAllAvailable} shouldEdit={false} />
            </div>
        )
    }
}
