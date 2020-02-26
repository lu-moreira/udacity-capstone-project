import Auth from "../../infra/auth/Auth";
import * as React from 'react'
import { ScratchItem, addInFavor, addDisFavor } from '../../domain/ScratchItem'
import { Card, Image, Icon, Label, Button } from "semantic-ui-react";
import { likeItem } from "../../api/scratchApi";
import DeleteScratchModal from "./DeleteScratch";
import { V2UpdateScratchModal } from "./UpdateScratchV2";

interface ItemCardProps {
    item: ScratchItem
    auth: Auth
    shouldEdit: boolean
    onItemUpdate: (item: ScratchItem) => void
}

interface ItemCardState {
    openUpdateModal: boolean
    openDeleteModal: boolean
    currentItem: ScratchItem
}

export class ItemCard extends React.PureComponent<ItemCardProps, ItemCardState> {
    state = {
        openDeleteModal: false,
        openUpdateModal: false,
        currentItem: {} as ScratchItem
    }

    constructor(props: ItemCardProps) {
        super(props);
        this.handleOnClickUpdateButton = this.handleOnClickUpdateButton.bind(this);
        this.handleOnClickCloseUpdateButton = this.handleOnClickCloseUpdateButton.bind(this);
        this.handleOnItemUpdated = this.handleOnItemUpdated.bind(this);
        this.handleDisLike = this.handleDisLike.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleOnClickCloseDeleteButton = this.handleOnClickCloseDeleteButton.bind(this);
        this.handleOnClickDeleteButton = this.handleOnClickDeleteButton.bind(this);
    }

    async handleLike() {
        try {
            await likeItem(this.props.auth.getIdToken(), this.state.currentItem.id, true)
            const currentItem = addInFavor(this.state.currentItem)
            this.setState({ currentItem })
            this.props.onItemUpdate(currentItem)
        } catch (e) {
            alert(`Was not posible like this scratch. Error ${e.message}`)
        }
    }

    async handleDisLike() {
        try {
            await likeItem(this.props.auth.getIdToken(), this.state.currentItem.id, false)
            const currentItem = addDisFavor(this.state.currentItem)
            this.setState({ currentItem })
            this.props.onItemUpdate(currentItem)
        } catch (e) {
            alert(`Was not posible dislike this scratch. Error ${e.message}`)
        }
    }

    handleOnClickUpdateButton() {
        this.setState({ openUpdateModal: true })
    }

    handleOnClickCloseUpdateButton() {
        this.setState({ openUpdateModal: false })
    }

    handleOnClickDeleteButton() {
        this.setState({ openDeleteModal: true })
    }

    handleOnClickCloseDeleteButton() {
        this.setState({ openDeleteModal: false })
    }

    handleOnItemUpdated(item: ScratchItem) {
        this.setState({ currentItem: item })
        this.props.onItemUpdate(item)
    }

    componentDidMount() {
        this.setState({ currentItem: this.props.item })
    }

    renderDeleteModal() {
        if (this.props.shouldEdit) {
            return (
                <DeleteScratchModal
                    auth={this.props.auth}
                    open={this.state.openDeleteModal}
                    onClose={this.handleOnClickCloseDeleteButton}
                    scratchItem={this.state.currentItem} />
            )
        }
        return null
    }

    renderUpdateModal() {
        if (this.props.shouldEdit) {
            return (<V2UpdateScratchModal
                auth={this.props.auth}
                open={this.state.openUpdateModal}
                onCancel={this.handleOnClickCloseUpdateButton}
                currentItem={this.state.currentItem}
                onItemUpdated={this.handleOnItemUpdated} />)
        }
        return (<div></div>)
    }

    renderLikeButtons() {
        if (this.props.auth.isAuthenticated() && !this.props.shouldEdit) {
            return (<Card.Content extra>
                <div className='ui'>
                    <Label as='a' color='red' onClick={this.handleDisLike}>
                        <Icon name='thumbs down' /> {this.state.currentItem.disFavor ? this.state.currentItem.disFavor : 0}
                    </Label>

                    <Label as='a' color='green' onClick={this.handleLike}>
                        <Icon name='thumbs up' /> {this.state.currentItem.inFavor ? this.state.currentItem.inFavor : 0}
                    </Label>
                </div>
            </Card.Content>)
        }
    }

    renderToolsButtons() {
        if (this.props.auth.isAuthenticated() && this.props.shouldEdit) {
            return (<Card.Content extra>
                <Button.Group fluid size="tiny">
                    <Button size="mini" color="red" onClick={this.handleOnClickDeleteButton}>
                        <Icon name='delete' />
                    </Button>
                    <Button size="mini" color="blue" onClick={this.handleOnClickUpdateButton}>
                        <Icon name='edit' />
                    </Button>
                </Button.Group>
            </Card.Content>)
        }
    }

    renderAll() {
        return (<div >
            {this.renderUpdateModal()}
            {this.renderDeleteModal()}
            <Card>
                <Image src={this.state.currentItem.attachmentUrl} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{this.state.currentItem.caption}</Card.Header>
                    <Card.Description>
                        {this.state.currentItem.text}
                    </Card.Description>
                </Card.Content>
                {this.renderLikeButtons()}
                {this.renderToolsButtons()}
            </Card>
        </div>)
    }

    render() {
        if (this.state.currentItem) {
            return this.renderAll()
        }
        return null
    }
}
