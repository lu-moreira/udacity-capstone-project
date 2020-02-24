import { History } from 'history'
import * as React from 'react'
import {
    Container,
    Grid,
    Header,
    Loader
} from 'semantic-ui-react'
import Auth from '../../infra/auth/Auth'
import { ScratchItem } from '../../domain/ScratchItem'
import { Masonry } from "masonic";
import { ItemCard } from './ItemCard'

interface ScratchesProps {
    auth: Auth
    history: History
    title: string
    shouldEdit: boolean
    recoverItems: () => Promise<ScratchItem[]>
}

interface ScratchesState {
    availableScratches: ScratchItem[]
    loadingScratches: boolean
    newScratch: ScratchItem
    openModal: boolean
}

export class AllAvailable extends React.PureComponent<ScratchesProps, ScratchesState> {
    state: ScratchesState = {
        availableScratches: [],
        loadingScratches: true,
        newScratch: {} as ScratchItem,
        openModal: false
    }

    handleOnItemUpdate(item: ScratchItem, index: any) {
        // const currentItems = this.state.availableScratches
        // currentItems[index] = item
        // this.setState({ availableScratches: currentItems })
    }

    async recoverAllScratches() {
        const scratches = await this.props.recoverItems()
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
                <Container>
                    <Header as="h1">{this.props.title}</Header>
                    <Grid relaxed>
                        <Grid.Row>
                            {this.renderScratches()}
                        </Grid.Row>
                    </Grid>
                </Container>
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
            <Grid.Column width={8}>
                <Loader indeterminate active inline="centered">
                    Waiting to load all scratches
                </Loader>
            </Grid.Column>
        )
    }

    renderAllScratches() {
        return (
            <Masonry
                items={this.state.availableScratches}
                columnGutter={8}
                columnWidth={172}
                overscanBy={6}
                render={(data: { index: any, data: ScratchItem, width: any }) => {
                    return (<div>
                        <ItemCard
                            item={data.data}
                            auth={this.props.auth}
                            shouldEdit={this.props.shouldEdit}
                            onItemUpdate={(item: ScratchItem) => {
                                console.log(`Item updated: ${data.index}`)
                                this.handleOnItemUpdate(item, data.index)
                            }}
                        />
                    </div>);
                }}
            />
        )
    }
}