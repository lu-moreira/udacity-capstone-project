import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Image, Input, Radio, Form, Divider, CheckboxProps, Item } from 'semantic-ui-react'
import { ScratchItem, isAvailable, setAvailable } from '../../domain/ScratchItem'
import { createItem, patchItem } from '../../api/scratchApi'
import Auth from '../../infra/auth/Auth'
import { UploadButton } from '../UploadButton'
interface UpdateProps {
    auth: Auth
    open: boolean
    onCancel: () => void
    currentItem: ScratchItem
    onItemUpdated: (item: ScratchItem) => void
}
interface UpdateState {
    modalOpen: boolean,
    loading: boolean
    disableCancel: boolean
    item: ScratchItem
}
export class UpdateScratchModal extends Component<UpdateProps, UpdateState> {
    state = {
        modalOpen: false,
        loading: false,
        disableCancel: false,
        item: {} as ScratchItem
    }

    componentDidMount() {
        console.log(`Update did mount: ${JSON.stringify(this.props.currentItem)}`)
        this.setState({ item: this.props.currentItem })
    }

    handleOpen = () => this.setState({ modalOpen: true, disableCancel: false })

    handleClose = () => {
        // reset state
        this.setState({ modalOpen: false, loading: false, disableCancel: false });
        this.props.onCancel()
    }

    handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = this.state.item
        item.caption = event.target.value
        this.setState({ item })
    }

    handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = this.state.item
        item.text = event.target.value
        this.setState({ item })
    }

    handleAvailableChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        const item = this.state.item
        if (data.checked) {
            item.available = setAvailable(true)
        } else {
            item.available = setAvailable(false)
        }
        this.setState({ item })
    }

    handleOnUploadFinished = (url: string) => {
        const item = this.state.item
        item.attachmentUrl = this.removeQueryParams(url)
        this.setState({ item })
    }

    removeQueryParams(u: string): string {
        if (u.indexOf("?") > -1) {
            return u.split("?")[0]
        }
        return u
    }

    onUpdate = async () => {
        this.setState({ loading: true, disableCancel: true })
        const currentItem = this.state.item
        try {
            console.log(currentItem)
            const item = await patchItem(this.props.auth.getIdToken(), currentItem.id, {
                available: isAvailable(currentItem.available),
                caption: currentItem.caption,
                text: currentItem.text,
                attachmentUrl: currentItem.attachmentUrl,
                disFavor: currentItem.disFavor,
                inFavor: currentItem.inFavor
            })
            this.props.onItemUpdated(currentItem)
        } catch (e) {
            alert(e)
        }

        this.handleClose()
    }

    render() {
        return (
            <Modal
                open={this.props.open}
                centered={false}>

                <Modal.Content image>
                    <Image wrapped size='medium' src={this.state.item.attachmentUrl} />
                    <Modal.Description>
                        <Header>Update Scratch</Header>
                        <p>
                            Here you can update your own scratch. Please make it beautiful.
                        </p>
                        <Divider />
                        <Form>
                            <Form.Input
                                fluid
                                label='Title'
                                value={this.state.item.caption}
                                onChange={this.handleCaptionChange}
                            />
                            <Form.Input
                                fluid
                                label='Text'
                                value={this.state.item.text}
                                onChange={this.handleTextChange}
                            />
                            <Form.Checkbox
                                label='Available'
                                value='this'
                                checked={isAvailable(this.state.item.available)}
                                onChange={this.handleAvailableChange}
                            />
                        </Form>
                        <Divider />
                        <UploadButton auth={this.props.auth} id={this.state.item.id} onFileUploaded={this.handleOnUploadFinished} />
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.handleClose} disabled={this.state.disableCancel} >
                        Cancel <Icon name='chevron right' />
                    </Button>
                    <Button primary onClick={this.onUpdate} loading={this.state.loading} >
                        Update Now <Icon name='chevron right' />
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
