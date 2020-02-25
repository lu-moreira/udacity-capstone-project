import Auth from "../../infra/auth/Auth";
import * as React from 'react'
import { UpdateScratchModal } from './UpdateScratch'
import { ScratchItem, addInFavor, addDisFavor } from '../../domain/ScratchItem'
import { Card, Image, Icon, Label } from "semantic-ui-react";
import { likeItem } from "../../api/scratchApi";

interface ItemCardProps {
    item: ScratchItem
    auth: Auth
    shouldEdit: boolean
    onItemUpdate: (item: ScratchItem) => void
}

interface ItemCardState {
    openModal: boolean
    currentItem: ScratchItem
}

export class ItemCard extends React.PureComponent<ItemCardProps, ItemCardState> {
    state = {
        openModal: false,
        currentItem: {} as ScratchItem
    }

    constructor(props: ItemCardProps) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOnItemUpdated = this.handleOnItemUpdated.bind(this);
        this.handleDisLike = this.handleDisLike.bind(this);
        this.handleLike = this.handleLike.bind(this);
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

    handleItemClick() {
        this.setState({ openModal: true })
    }

    handleCloseModal() {
        this.setState({ openModal: false })
    }

    handleOnItemUpdated(item: ScratchItem) {
        this.setState({ currentItem: item })
        this.props.onItemUpdate(item)
    }

    componentDidMount() {
        this.setState({ currentItem: this.props.item })
    }

    renderUpdateModal() {
        if (this.props.shouldEdit) {
            return (<UpdateScratchModal
                auth={this.props.auth}
                open={this.state.openModal}
                onCancel={this.handleCloseModal}
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

    renderAll() {
        return (<div>{this.renderUpdateModal()}
            <Card onClick={this.handleItemClick}>
                <Image src={this.state.currentItem.attachmentUrl} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{this.state.currentItem.caption}</Card.Header>
                    <Card.Description>
                        {this.state.currentItem.text}
                    </Card.Description>
                </Card.Content>
                {this.renderLikeButtons()}
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
