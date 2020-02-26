import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../infra/auth/Auth'
import { getUploadUrl, uploadFile } from '../api/scratchApi'

export enum UploadState {
    NoUpload,
    FetchingPresignedUrl,
    UploadingFile,
}

interface UploadButtonProps {
    id: string
    auth: Auth
    onFileSelected: (files: FileList) => void
}

interface UploadButtonState {
    file: any
    uploadState: UploadState
}

export class UploadV2 extends React.PureComponent<UploadButtonProps, UploadButtonState> {
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

        this.props.onFileSelected(files)
    }


    render() {
        return (
            <div>
                <Form>
                    <Form.Field>
                        <label>File</label>
                        <input
                            type="file"
                            accept="image/*"
                            placeholder="Image to upload"
                            onChange={this.handleFileChange}
                        />
                    </Form.Field>
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
