import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { ScratchItem } from '../../domain/ScratchItem'
import { deleteItem } from '../../api/scratchApi'
import Auth from '../../infra/auth/Auth'
import { Subject } from 'rxjs'

// The Main Subject/Stream to be listened on.
export const onDeleteItemSubject = new Subject<ScratchItem>()

// This function is used to publish data to the Subject via next().
export const publish = (data: ScratchItem) => onDeleteItemSubject.next(data)

interface DeleteProps {
    scratchItem: ScratchItem
    auth: Auth
    open: boolean
    onClose: () => void
}

interface DeleteState {
    loading: boolean
}

class DeleteScratchModal extends Component<DeleteProps, DeleteState> {
    state = {
        loading: false,
    }

    constructor(props: DeleteProps) {
        super(props)
    }

    onClose = () => {
        this.setState({ loading: false })
        this.props.onClose()
    }

    render() {
        return (
            <Modal
                open={this.props.open}
                closeOnDimmerClick>
                <Modal.Header>Delete Your Scratch</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete your scratch</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.onClose} negative>
                        No
                    </Button>
                    <Button
                        onClick={this.onDelete}
                        positive
                        labelPosition='right'
                        icon='checkmark'
                        content='Yes'
                        loading={this.state.loading}
                    />
                </Modal.Actions>
            </Modal>

        )
    }

    onDelete = async () => {
        this.setState({ loading: true })
        const currentItem = this.props.scratchItem
        try {
            await deleteItem(this.props.auth.getIdToken(), currentItem.id)
            publish(currentItem)
        } catch (e) {
            alert(e)
        }

        this.onClose()
    }
}

export default DeleteScratchModal