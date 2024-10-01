import { Store, StoreTable } from "../models/store.model";

export const fetchStore = async (storeId : string):Promise<Store | null>  =>{
    return StoreTable.createQueryBuilder('store')
    .where('store.storeId = :storeId',{storeId: storeId })
    .getOne();
}