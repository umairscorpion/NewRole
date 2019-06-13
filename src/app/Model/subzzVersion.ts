import { Entity } from "./entity";

export class SubzzVersion extends Entity {
  id: number;
  version: string;
  features: string;
  contentDetails: string;
}
