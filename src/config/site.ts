// Site configuration constants
export const siteConfig = {
  name: "Honesty Engineering",
  tagline: "GOVT. APPROVED 1st CLASS CONTRACTOR",
  description:
    "A multidisciplinary engineering consultancy firm established in 2018. We provide comprehensive services in electrical works, civil construction, fire safety, interior works, and software solutions.",
  url: "https://www.honestyengineeringbd.com",
  email: "info@honestyengineeringbd.com",
  phone: "+880 1976 57 34 48",
  address: {
    street: "Road # 18, House # 14 (Lift 4)",
    sector: "Sector # 10",
    area: "Uttara",
    city: "Dhaka",
    postalCode: "1230",
    country: "Bangladesh",
  },
  credentials: {
    tradeLicense: "004737",
    tin: "817588536183",
    vat: "002418684-0403",
    bepza: "DEPZCHA062",
  },
  social: {
    facebook: "#",
    linkedin: "#",
    whatsapp: "#",
  },
  founding: {
    year: 2018,
  },
} as const;

// Navigation links
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
] as const;

// CEO information
export const ceoInfo = {
  name: "Engr. Md. Anwarul Islam Raton",
  education: "BSc (EEE), MSc (ECE)",
  designation: "Proprietor & CEO",
  phone: "+880 1716 57 34 48",
  image: "/assets/images/team/ceo.png",
} as const;

// Manager information
export const managerInfo = {
  name: "Engr. Md. Abdul Malek",
  designation: "Manager",
  phone: "+880 1327 41 28 51",
} as const;

// Footer configuration
export const footerConfig = {
  poweredBy: {
    name: "Zyrotech Bangladesh",
    url: "https://zyrotech.io",
  },
} as const;

// Theme colors
export const themeColors = {
  primary: {
    50: "#f1f8e9",
    100: "#dcedc8",
    200: "#c5e1a5",
    300: "#aed581",
    400: "#9ccc65",
    500: "#8bc34a",
    600: "#7cb342",
    700: "#689f38",
    800: "#558b2f",
    900: "#33691e",
  },
  secondary: {
    50: "#e1f5fe",
    100: "#b3e5fc",
    200: "#81d4fa",
    300: "#4fc3f7",
    400: "#29b6f6",
    500: "#03a9f4",
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
  },
  accent: {
    50: "#fffde7",
    100: "#fff9c4",
    200: "#fff59d",
    300: "#fff176",
    400: "#ffee58",
    500: "#ffeb3b",
    600: "#fdd835",
    700: "#fbc02d",
    800: "#f9a825",
    900: "#f57f17",
  },
} as const;
