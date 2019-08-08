import { SubstituteList } from "./SubstituteList";

export class SubstituteListCategory {
    categoryId: number;
    title: string;
    organizationId: string;
    districtId: number;
    createdDate: Date | string;
    modifiedDate: Date | string;
    isDeleted: boolean;
    substituteList: SubstituteList[];
}