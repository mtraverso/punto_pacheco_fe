import {StoreType} from "./StoreType";

export interface Store {
    id: number
    price: number
    type: StoreType
    key: number
    is_available: boolean
}

