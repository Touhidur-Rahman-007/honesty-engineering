// Gallery data - Images from company profile
export const galleryImages = [
  { id: 1, title: "Construction Site", category: "Construction", description: "RCC structure work in progress", src: "/assets/images/services/civil.png" },
  { id: 2, title: "Steel Framework", category: "Construction", description: "Steel structure installation", src: "/assets/images/projects/success1.png" },
  { id: 3, title: "Interior Design", category: "Interior", description: "Premium office interior", src: "/assets/images/services/interior.png" },
  { id: 4, title: "Electrical Panel", category: "Electrical", description: "Sub-station installation", src: "/assets/images/services/electrical.png" },
  { id: 5, title: "Fire Safety", category: "Safety", description: "Fire hydrant system", src: "/assets/images/services/fire.png" },
  { id: 6, title: "Factory Furniture", category: "Planning", description: "Industrial workspace setup", src: "/assets/images/services/furniture.png" },
  { id: 7, title: "Software Solutions", category: "Electrical", description: "ERP development", src: "/assets/images/services/software.png" },
  { id: 8, title: "Industrial Boiler", category: "Safety", description: "Boiler installation", src: "/assets/images/products/boiler.png" },
] as const;

export const galleryCategories = ["All", "Construction", "Interior", "Architecture", "Planning", "Electrical", "Safety"] as const;
