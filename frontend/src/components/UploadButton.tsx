import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../infra/auth/Auth'
import { getUploadUrl, uploadFile } from '../api/scratchApi'

enum UploadState {
    NoUpload,
    FetchingPresignedUrl,
    UploadingFile,
}

interface UploadButtonProps {
    id: string
    auth: Auth
    onFileUploaded: (finalUrl: string) => void
}

interface UploadButtonState {
    file: any
    uploadState: UploadState
}

export class UploadButton extends React.PureComponent<UploadButtonProps, UploadButtonState> {
    state: UploadButtonState = {
        file: undefined,
        uploadState: UploadState.NoUpload
    }

    handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        this.setState({
            file: files[0]
        })
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        try {
            if (!this.state.file) {
                alert('File should be selected')
                return
            }

            this.setUploadState(UploadState.FetchingPresignedUrl)
            const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.id)
            this.setUploadState(UploadState.UploadingFile)
            await uploadFile(uploadUrl, this.state.file)
            this.props.onFileUploaded(uploadUrl)

        } catch (e) {
            alert('Could not upload a file: ' + e.message)
        } finally {
            this.setUploadState(UploadState.NoUpload)
        }
    }

    setUploadState(uploadState: UploadState) {
        this.setState({
            uploadState
        })
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>File</label>
                        <input
                            type="file"
                            accept="image/*"
                            placeholder="Image to upload"
                            onChange={this.handleFileChange}
                        />
                    </Form.Field>
                    {this.renderButton()}
                </Form>
            </div>
        )
    }

    renderButton() {

        return (
            <div>
                {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
                {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
                <Button loading={this.state.uploadState !== UploadState.NoUpload} type="submit">
                    Upload
                </Button>
            </div>
        )
    }
}
