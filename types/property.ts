import { Types } from "mongoose";

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export interface IRates {
  weekly?: number;
  monthly?: number;
  nightly?: number;
}

export interface ISellerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface IProperty {
  _id: Types.ObjectId;
  owner: Types.ObjectId;     // ref: "User"
  name: string;
  type: string;
  description?: string;
  location: IAddress;
  beds: number;
  baths: number;
  square_feet?: number;
  amenities: string[];
  images: string[];
  rates: IRates;
  seller_info: ISellerInfo;
  createdAt?: Date;
  updatedAt?: Date;
}


/**
 * Plain object used in UI after `.lean()` and serializer.
 * If serializer stringifies ObjectIds, keep both as string.
 */
export type PropertyEntity = Omit<IProperty, "_id" | "owner"> & {
  _id: string;
  owner: string;
};


