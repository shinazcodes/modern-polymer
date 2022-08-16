export interface Catagory {
  category_id: number;
  category_name: string;
}

export interface ItemsInside {
  itemId: number;
  itemName?: string;
  weight?: number;
  price?: number;
  images?: any;
}

export interface Image {
  id: number;
  image_loaction: string;
}

export interface BundleResponse {
  catagories: Catagory[];
  bundle_id: number;
  bundle_name: string;
  weight: number;
  price: number;
  itemsInside: ItemsInside[];
  image: Image;
}
