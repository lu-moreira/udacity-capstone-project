import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Image, Input, Radio, Form, Divider, CheckboxProps } from 'semantic-ui-react'
import { ScratchItem } from '../../domain/ScratchItem'
import { createItem } from '../../api/scratchApi'
import Auth from '../../infra/auth/Auth'
import {Subject} from 'rxjs'

// The Main Subject/Stream to be listened on.
export const onCreateItemSubject = new Subject<ScratchItem>()

// This function is used to publish data to the Subject via next().
export const publish = (data: ScratchItem) => onCreateItemSubject.next(data)

interface CreateProps {
    auth: Auth
    onItemCreated: (newItem : ScratchItem) => void
}
interface CreateState {
    modalOpen: boolean,
    newCaption: string
    newText: string
    newAvailable: boolean
    loading: boolean
    disableCancel: boolean
}
export class CreateScratchModal extends Component<CreateProps, CreateState> {
    state = {
        modalOpen: false,
        newCaption: "",
        newText: "",
        newAvailable: false,
        loading: false,
        disableCancel: false
    }

    handleOpen = () => this.setState({ modalOpen: true, disableCancel: false })

    handleClose = () => {
        // reset state
        this.setState({ modalOpen: false, newCaption: "", newText: "", newAvailable: false, loading: false, disableCancel: false });
    }

    handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newCaption: event.target.value })
    }
    handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newText: event.target.value })
    }
    handleAvailableChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        if (data.checked) {
            this.setState({ newAvailable: true })
            return
        }
        this.setState({ newAvailable: false })
    }

    onCreate = async () => {
        this.setState({ loading: true, disableCancel: true })
        try {
            const item = await createItem(this.props.auth.getIdToken(), {
                available: this.state.newAvailable,
                caption: this.state.newCaption,
                attachmentUrl: "https://via.placeholder.com/300",
                text: this.state.newText
            })
            publish(item)
            this.props.onItemCreated(item)
        } catch (e) {
            alert(e)
        }

        this.handleClose()
    }

    render() {
        return (
            <Modal
                trigger={<Button primary onClick={this.handleOpen}>Create new Scratch</Button>}
                open={this.state.modalOpen}
                centered={false}>

                <Modal.Content image>
                    <Modal.Description>
                        <Header>New Scratch</Header>
                        <p>
                            Here you can create your own scratch. Please make it beautiful.
                        </p>
                        <Divider />
                        <Form>
                            <Form.Input
                                fluid
                                label='Title'
                                placeholder='Scratch title'
                                id='form-input-caption'
                                onChange={this.handleCaptionChange}
                            />
                            <Form.Input
                                fluid
                                label='Text'
                                placeholder='Write a litle more about this scratch'
                                onChange={this.handleTextChange}
                            />
                            {/* <Form.Checkbox
                                label='Available'
                                value='this'
                                onChange={this.handleAvailableChange}
                            /> */}
                        </Form>

                    </Modal.Description>

                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.handleClose} disabled={this.state.disableCancel} >
                        Cancel <Icon name='chevron right' />
                    </Button>
                    <Button primary onClick={this.onCreate} loading={this.state.loading} >
                        Create Now <Icon name='chevron right' />
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
