// Products data - Extracted from company profile for reusability
export const products = [
  { name: "Industrial Boilers", image: "/assets/images/products/boiler.png", category: "Equipment" },
  { name: "Bus-bars", image: "/assets/images/products/busbar.png", category: "Electrical" },
  { name: "KSB Submersible Pumps", image: "/assets/images/products/boiler.png", category: "Pumps" },
  { name: "Industrial Generators", image: "/assets/images/products/generator.png", category: "Power" },
  { name: "Fire Suppression Systems", image: "/assets/images/services/fire.png", category: "Safety" },
  { name: "Centrifugal Pumps", image: "/assets/images/products/boiler.png", category: "Pumps" },
  { name: "Electric Motors", image: "/assets/images/services/electrical.png", category: "Electrical" },
  { name: "Control Panels", image: "/assets/images/services/electrical.png", category: "Electrical" },
] as const;

export const productCategories = ["All", "Equipment", "Electrical", "Pumps", "Power", "Safety"] as const;
