import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
    Button,
    Checkbox,
    Divider,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Loader
} from 'semantic-ui-react'
import Auth from '../infra/auth/Auth'
import { ScratchItem } from '../domain/ScratchItem'
import { getAllAvailable, getAllByUserId } from '../api/scratchApi'

interface ScratchesProps {
    auth: Auth
    history: History
}

interface ScratchesState {
    availableScratches: ScratchItem[]
    meScratches: ScratchItem[]
    loadingScratches: boolean
    newScratch: ScratchItem
}

export class Scratches extends React.PureComponent<ScratchesProps, ScratchesState> {
    state: ScratchesState = {
        availableScratches: [],
        loadingScratches: true,
        meScratches: [],
        newScratch: {} as ScratchItem
    }

    async recoverAllScratches() {
        if (this.props.auth) {
            const scratches = await getAllByUserId(this.props.auth.getIdToken())
            this.setState({
                meScratches: scratches,
            })
        }
        const scratches = await getAllAvailable()
        this.setState({
            availableScratches: scratches,
            loadingScratches: false
        })
    }

    async componentDidMount() {
        try {
            await this.recoverAllScratches()
        } catch (e) {
            console.log(`Failed to recover available scratches: ${e.message}`)
        }
    }

    render() {
        return (
            <div>
                <Header as="h1">Wall Scratches</Header>
                {/* {this.renderCreateTodoInput()} */}

                {this.renderScratches()}
            </div>
        )
    }

    renderScratches() {
        if (this.state.loadingScratches) {
            return this.renderLoading()
        }
        return this.renderAllScratches()
    }

    renderLoading() {
        return (
            <Grid.Row>
                <Loader indeterminate active inline="centered">
                    Waiting to load all scratches
            </Loader>
            </Grid.Row>
        )
    }

    // TODO: continue from here
    renderAllScratches() {
        return (
            <Header> TODO: CONTINUE FROM HERE </Header>
        )
    }

}