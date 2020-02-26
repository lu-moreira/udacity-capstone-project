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
import { onCreateItemSubject } from './CreateScratch'
import { Subscription } from 'rxjs'
import { onDeleteItemSubject } from './DeleteScratch'

interface ScratchesProps {
    auth: Auth
    history: History
    title: string
    shouldEdit: boolean
    recoverItems: () => Promise<ScratchItem[]>
    newItems?: ScratchItem[]
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

    // Used for unsubscribing when our component unmounts
    createItemSub: Subscription
    deleteSub: Subscription

    constructor(props: ScratchesProps) {
        super(props)

        this.createItemSub = onCreateItemSubject.subscribe((data: ScratchItem) => {
            this.setState({
                availableScratches: [... this.state.availableScratches, data]
            })
        })

        this.deleteSub = onDeleteItemSubject.subscribe((data: ScratchItem) => {
            this.setState({
                availableScratches: this.state.availableScratches.filter(x => x.id != data.id)
            })
        })
    }

    handleOnItemUpdate(item: ScratchItem, index: any) {
        const currentItems = this.state.availableScratches
        currentItems[index] = item
        this.setState({ availableScratches: currentItems })
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
            alert(`Failed to recover available scratches: ${e.message}`)
        }
    }

    componentWillUnmount() {
        this.createItemSub.unsubscribe()
        this.deleteSub.unsubscribe()
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
        return this.renderAllScratchesV2()
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

    renderAllScratchesV2() {
        if (!this.state.availableScratches || this.state.availableScratches.length == 0) {
            return (<div>
                <h3>Seams that you don't have any scratch, try to create one.</h3>
            </div>)
        }
        return (
            <Grid relaxed columns={3}>
                {
                    this.state.availableScratches.map((item, index) => {
                        return (
                            <Grid.Column key={item.id}>
                                <ItemCard
                                    item={item}
                                    auth={this.props.auth}
                                    shouldEdit={this.props.shouldEdit}
                                    onItemUpdate={(item: ScratchItem) => {
                                        this.handleOnItemUpdate(item, index)
                                    }}
                                />
                            </Grid.Column>
                        )
                    })
                }
            </Grid>)
    }

    renderAllScratches() {
        if (this.state.availableScratches) {
            return (<div>
                <h3>Seams that you don't have any scratch, try to create one.</h3>
            </div>)
        }
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
                                this.handleOnItemUpdate(item, data.index)
                            }}
                        />
                    </div>);
                }}
            />
        )
    }
}