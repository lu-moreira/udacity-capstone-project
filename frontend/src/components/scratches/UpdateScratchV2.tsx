import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Image, Divider } from 'semantic-ui-react'
import { ScratchItem, isAvailable } from '../../domain/ScratchItem'
import { patchItem, getUploadUrl, uploadFile } from '../../api/scratchApi'
import Auth from '../../infra/auth/Auth'
import { UploadV2, UploadState } from '../UploadV2'

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
    file: any
    uploadState: UploadState
}
export class V2UpdateScratchModal extends Component<UpdateProps, UpdateState> {
    state = {
        modalOpen: false,
        loading: false,
        disableCancel: false,
        item: {} as ScratchItem,
        file: undefined as unknown as Buffer,
        uploadState: UploadState.NoUpload
    }

    constructor(props: UpdateProps) {
        super(props)
    }

    componentDidMount() {
        this.setState({ item: this.props.currentItem })
    }

    componentDidUpdate(prevProps: Readonly<UpdateProps>, prevState: Readonly<UpdateState>) {
        // force update, possibly bug 
        let currentItemState = this.state.item
        if (currentItemState.id != prevProps.currentItem.id) {
            this.setState({ item: this.props.currentItem })
        }
    }

    setUploadState(uploadState: UploadState) {
        this.setState({
            uploadState
        })
    }

    handleOnFileSelected = (files: FileList) => {
        this.setState({ file: files[0] })
    }

    handleOpen = () => this.setState({ modalOpen: true, disableCancel: false })

    handleClose = () => {
        // reset state
        this.setState({ modalOpen: false, loading: false, disableCancel: false });
        this.props.onCancel()
    }

    removeQueryParams(u: string): string {
        if (u.indexOf("?") > -1) {
            return u.split("?")[0]
        }
        return u
    }

    onUpdate = async (currentItem: ScratchItem) => {
        await patchItem(this.props.auth.getIdToken(), currentItem.id, {
            available: isAvailable(currentItem.available),
            caption: currentItem.caption,
            text: currentItem.text,
            attachmentUrl: currentItem.attachmentUrl,
            disFavor: currentItem.disFavor,
            inFavor: currentItem.inFavor
        })
        this.props.onItemUpdated(currentItem)
    }

    onSubmitFile = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        try {
            if (!this.state.file) {
                alert('File should be selected')
                return
            }
            this.setState({ loading: true, disableCancel: true })
            const currentItem = this.state.item
            this.setUploadState(UploadState.FetchingPresignedUrl)
            const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), currentItem.id)
            this.setUploadState(UploadState.UploadingFile)
            await uploadFile(uploadUrl, this.state.file)
            currentItem.attachmentUrl = this.removeQueryParams(uploadUrl)
            await this.onUpdate(currentItem)
            this.handleClose()
        } catch (e) {
            alert(`Could not complete de update ${e}`)
        } finally {
            this.setUploadState(UploadState.NoUpload)
        }
    }

    render() {
        return (
            <Modal
                open={this.props.open}
                centered={false}>

                <Modal.Content image>
                    <Modal.Description>
                        <Header>Update Scratch</Header>
                        <p>
                            Here you can set the image for your scratch. Please make it beautiful.
                        </p>
                        <Divider />
                        <UploadV2
                            auth={this.props.auth}
                            id={this.state.item.id}
                            onFileSelected={this.handleOnFileSelected}
                        />
                        {this.state.uploadState === UploadState.FetchingPresignedUrl && <div><Divider />Uploading image metadata</div>}
                        {this.state.uploadState === UploadState.UploadingFile && <div><Divider />Uploading file</div>}

                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.handleClose} disabled={this.state.disableCancel} >
                        Cancel <Icon name='chevron right' />
                    </Button>
                    <Button primary onClick={this.onSubmitFile} loading={this.state.loading} >
                        Update Now <Icon name='chevron right' />
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
