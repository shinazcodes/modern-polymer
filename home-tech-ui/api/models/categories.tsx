export interface Image {
  id: number;
  image_loaction: string;
}

export interface ItemsInside {
  itemId: number;
  itemName: string;
  weight: number;
  price: number;
  images?: any;
}

export interface Image2 {
  id: number;
  image_loaction: string;
}

export interface CategoryBundel {
  bundle_id: number;
  bundle_name: string;
  weight: number;
  price: number;
  itemsInside: ItemsInside[];
  image: Image2;
}

export interface CategoriesResponse {
  image: Image;
  category_id: number;
  category_name: string;
  category_bundels: CategoryBundel[];
}
