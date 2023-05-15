import {Tenant} from "./Tenant";
import {Store} from "./Store";
import dayjs from "dayjs";

export interface Contract{
    id: number
    tenant: Tenant
    store: Store
    start_date: string
    renovation_date: string
    deposit: number
    paid_key: boolean
    price: number
}