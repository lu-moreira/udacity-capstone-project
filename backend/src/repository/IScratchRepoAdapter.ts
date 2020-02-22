import {ScratchItem} from '../domain/scratch/ScratchItem'

export interface IScratchRepoAdapter {
    post(item: ScratchItem) : void
    delete(id: string) : void
    getById(id: string): Promise<ScratchItem>
    patch(id: string, item: ScratchItem) : void
    getAllByUserId(userId: string): Promise<ScratchItem[]> 
    getAllAvailables(): Promise<ScratchItem[]>
}