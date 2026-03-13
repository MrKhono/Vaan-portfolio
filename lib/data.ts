export type Category = "mariage" | "portrait" | "mode" | "evenementiel"

export interface Project {
  id: string
  title: string
  category: Category
  coverImage: string
  images: string[]
  description: string
  date: string
  location: string
  client?: string
  camera?: string
  lens?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  date: string
  readTime: string
  category: string
}

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  price: string
  image: string
}

export const categories: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "mariage", label: "Mariage" },
  { value: "portrait", label: "Portrait" },
  { value: "mode", label: "Mode" },
  { value: "evenementiel", label: "Evenementiel" },
]

export const projects: Project[] = [
  {
    id: "mariage-sophie-thomas",
    title: "Sophie & Thomas",
    category: "mariage",
    coverImage: "/images/wedding-1.jpg",
    images: ["/images/wedding-1.jpg", "/images/wedding-2.jpg", "/images/hero.jpg"],
    description:
      "Un mariage intime et elegant dans les jardins d'un chateau bordelais. Sophie et Thomas ont choisi un cadre bucolique pour celebrer leur union, entourees de leurs proches. La lumiere doree du coucher de soleil a offert des moments photographiques exceptionnels.",
    date: "Juin 2025",
    location: "Chateau Margaux, Bordeaux",
    client: "Sophie & Thomas",
    camera: "Canon EOS R5",
    lens: "RF 28-70mm f/2L USM",
  },
  {
    id: "portrait-clara",
    title: "Clara - Editorial",
    category: "portrait",
    coverImage: "/images/portrait-1.jpg",
    images: ["/images/portrait-1.jpg", "/images/portrait-2.jpg"],
    description:
      "Seance portrait editorial avec Clara, mettant en valeur sa personnalite unique a travers un jeu de lumieres et d'ombres en studio. Un travail sur l'emotion brute et l'authenticite.",
    date: "Mars 2025",
    location: "Studio Paris 11e",
    client: "Clara Martin",
    camera: "Sony A7R V",
    lens: "85mm f/1.4 GM",
  },
  {
    id: "mode-collection-hiver",
    title: "Collection Hiver",
    category: "mode",
    coverImage: "/images/fashion-1.jpg",
    images: ["/images/fashion-1.jpg", "/images/fashion-2.jpg"],
    description:
      "Shooting pour la collection automne-hiver d'une maison de couture parisienne. Un travail sur les textures, les couleurs sombres et la lumiere dramatique pour mettre en valeur chaque piece de la collection.",
    date: "Fevrier 2025",
    location: "Palais Royal, Paris",
    client: "Maison Elysee",
    camera: "Phase One XF IQ4",
    lens: "Schneider 80mm f/2.8",
  },
  {
    id: "gala-fondation",
    title: "Gala Annuel",
    category: "evenementiel",
    coverImage: "/images/event-1.jpg",
    images: ["/images/event-1.jpg", "/images/hero.jpg"],
    description:
      "Couverture photographique du gala annuel de la Fondation des Arts. Une soiree prestigieuse reunissant artistes, mecenes et personnalites du monde culturel dans un cadre somptueux.",
    date: "Janvier 2025",
    location: "Grand Palais, Paris",
    client: "Fondation des Arts",
    camera: "Canon EOS R3",
    lens: "RF 24-70mm f/2.8L IS USM",
  },
  {
    id: "mariage-lea-marc",
    title: "Lea & Marc",
    category: "mariage",
    coverImage: "/images/wedding-2.jpg",
    images: ["/images/wedding-2.jpg", "/images/wedding-1.jpg"],
    description:
      "Un mariage champetre en Provence, au milieu des champs de lavande. Une journee remplie d'amour et de couleurs chaudes, sous le soleil du sud de la France.",
    date: "Juillet 2025",
    location: "Domaine de Fontenille, Provence",
    client: "Lea & Marc",
    camera: "Canon EOS R5",
    lens: "RF 50mm f/1.2L USM",
  },
  {
    id: "portrait-antoine",
    title: "Antoine - Corporate",
    category: "portrait",
    coverImage: "/images/portrait-2.jpg",
    images: ["/images/portrait-2.jpg", "/images/portrait-1.jpg"],
    description:
      "Portrait corporate pour un dirigeant d'entreprise. Un equilibre entre professionnalisme et humanite, avec un eclairage cinematographique.",
    date: "Avril 2025",
    location: "La Defense, Paris",
    client: "Antoine Lefevre",
    camera: "Sony A7R V",
    lens: "135mm f/1.8 GM",
  },
  {
    id: "portrait-david",
    title: "Antoine - Corporate",
    category: "portrait",
    coverImage: "/images/portrait-2.jpg",
    images: ["/images/portrait-2.jpg", "/images/portrait-1.jpg"],
    description:
      "Portrait corporate pour un dirigeant d'entreprise. Un equilibre entre professionnalisme et humanite, avec un eclairage cinematographique.",
    date: "Avril 2025",
    location: "La Defense, Paris",
    client: "Antoine Lefevre",
    camera: "Sony A7R V",
    lens: "135mm f/1.8 GM",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sophie Beaumont",
    role: "Mariee",
    content:
      "Alexandre a su capturer chaque emotion de notre mariage avec une sensibilite rare. Ses photos sont de veritables oeuvres d'art que nous cherirons toute notre vie.",
    rating: 5,
  },
  {
    id: "2",
    name: "Marie Laurent",
    role: "Directrice Artistique, Maison Elysee",
    content:
      "Un oeil exceptionnel et un professionnalisme sans faille. Alexandre comprend parfaitement la mode et sait mettre en valeur chaque piece avec elegance.",
    rating: 5,
  },
  {
    id: "3",
    name: "Pierre Moreau",
    role: "PDG, Fondation des Arts",
    content:
      "Nous faisons appel a Alexandre pour tous nos evenements depuis 5 ans. Sa discretion, sa reactivite et la qualite de son travail sont incomparables.",
    rating: 5,
  },
]



export const services: Service[] = [
  {
    id: "mariage",
    title: "Mariage",
    description:
      "Une couverture complete de votre journee, du preparatif a la soiree dansante. Je capture chaque emotion, chaque detail, pour creer un recit photographique unique de votre union.",
    features: [
      "Reportage complet (8-12h)",
      "Seance engagement offerte",
      "600+ photos retouchees",
      "Galerie en ligne privee",
      "Album premium sur mesure",
    ],
    price: "A partir de 2 800",
    image: "/images/wedding-1.jpg",
  },
  {
    id: "portrait",
    title: "Portrait",
    description:
      "Seances portrait en studio ou en exterieur, adaptees a vos besoins. Portraits individuels, couples, famille ou corporate.",
    features: [
      "Seance 1h-2h",
      "Direction artistique",
      "30+ photos retouchees",
      "Galerie en ligne privee",
      "Tirages fine art disponibles",
    ],
    price: "A partir de 350",
    image: "/images/portrait-1.jpg",
  },
  {
    id: "mode",
    title: "Mode & Editorial",
    description:
      "Shootings pour marques, designers et magazines. Un regard creatif et contemporain pour sublimer vos collections.",
    features: [
      "Concept & direction artistique",
      "Shooting demi-journee ou journee",
      "Retouche haute qualite",
      "Fichiers haute resolution",
      "Droits d'utilisation inclus",
    ],
    price: "A partir de 1 500",
    image: "/images/fashion-1.jpg",
  },
  {
    id: "evenementiel",
    title: "Evenementiel",
    description:
      "Couverture d'evenements corporate, galas, conferences et soirees privees avec discretion et professionnalisme.",
    features: [
      "Couverture complete",
      "Photos livrables sous 48h",
      "200+ photos retouchees",
      "Galerie en ligne",
      "Formats adaptes print & web",
    ],
    price: "A partir de 800",
    image: "/images/event-1.jpg",
  },
]
