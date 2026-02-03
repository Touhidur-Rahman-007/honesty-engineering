// Services data - Extracted from company profile for reusability
export const servicesData = {
  electrical: {
    title: "Electrical Works",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500",
    items: [
      "Sub-Station Supply & Installation",
      "PFI, MDB, SDB Supply & Standard Earthing & Boring",
      "Thermography, Earthing & Insulation Testing",
      "Automation & Instrumentation",
      "All Kinds of Electrical Wiring",
    ],
  },
  civil: {
    title: "Civil Construction",
    icon: "🏗️",
    color: "from-blue-400 to-blue-600",
    items: [
      "RCC & Steel Structure Works as per RSC & BNBC",
      "Architecture, Structural Design & Drawing",
    ],
  },
  electricalDesign: {
    title: "Electrical Design",
    icon: "📐",
    color: "from-purple-400 to-purple-600",
    items: [
      "Electrical Single Line Diagram (SLD)",
      "Electrical Layout Design (ELD)",
      "Lighting Protection System (LPS)",
      "Sub-Station & Earthing Layout Design (BNBC, RSC, BS-7671 & IEC)",
      "PA System Layout & Design",
      "Air & Steam Distribution Line Design",
      "Industrial Production Machine Layout Design",
    ],
  },
  fireSafety: {
    title: "Fire Safety",
    icon: "🔥",
    color: "from-red-400 to-red-600",
    items: [
      "Fire Detection & Alarm System",
      "Fire Hydrant & Sprinkler System",
      "Fire Door & Fire Separation",
      "Automatic Gas Suspension System",
    ],
  },
  factory: {
    title: "Factory Furniture",
    icon: "🏭",
    color: "from-gray-400 to-gray-600",
    items: [
      "QC Table",
      "Swing Table",
      "Operator Chair",
      "Line Table",
      "Industrial Rack",
      "Cutting Table",
      "Finishing Table",
    ],
  },
  interior: {
    title: "Interior Works",
    icon: "🎨",
    color: "from-pink-400 to-pink-600",
    items: [
      "Residential Interior Design",
      "Commercial Interior Design",
      "Corporate Interior Design",
      "Architectural Support",
    ],
  },
  software: {
    title: "Software Solutions",
    icon: "💻",
    color: "from-green-400 to-teal-500",
    items: [
      "ERP Systems (Enterprise Resource Planning)",
      "SaaS Products",
      "Web / Desktop Application Development",
      "Custom Software Solutions",
    ],
  },
  other: {
    title: "Other Services",
    icon: "🔧",
    color: "from-indigo-400 to-indigo-600",
    items: [
      "Bus-bar Supply & Installation",
      "Generator Installation Works",
      "Boiler Installation Works",
      "Steam Line & Air Compressor Pipe Line Works",
      "Landscape",
      "Carpeting",
      "Consultation",
    ],
  },
} as const;

export type ServiceKey = keyof typeof servicesData;

// Service icons grid for alternative display
export const serviceIconsGrid = [
  { name: "RCC & Steel Structure", icon: "🏗️" },
  { name: "Electrical & Mechanical", icon: "⚡" },
  { name: "Factory Furniture", icon: "🏭" },
  { name: "Interior Works", icon: "🎨" },
  { name: "Fire Safety", icon: "🔥" },
  { name: "Software Solutions", icon: "💻" },
] as const;
