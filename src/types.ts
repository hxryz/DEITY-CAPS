export interface Material {
  id: string;
  name: string;
  description: string;
  specs: string[];
  textureUrl: string;
  hex: string;
}

export interface ManufacturingStage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  techSpec: string;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  materials: string[];
  colors: { name: string; hex: string }[];
  image: string;
  features: string[];
  isPremium?: boolean;
}

export interface StatItem {
  id: string;
  number: number;
  suffix: string;
  label: string;
  description: string;
}

export interface ClientWork {
  id: string;
  brandName: string;
  logo: string;
  role: string;
  year: string;
  deliverable: string;
  image: string;
}

export interface QuoteRequest {
  name: string;
  email: string;
  companyName: string;
  volume: string;
  style: string;
  materials: string[];
  notes: string;
}
