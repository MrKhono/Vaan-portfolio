"use client"

import { projects, testimonials, services, categories } from "./data"
import type { Project, Testimonial, Service, BlogPost } from "./data"

// Types for admin data
export interface Admin {
  id: string
  name: string
  email: string
  password: string
  role: "super_admin" | "admin"
  avatar?: string
  createdAt: string
}

export interface HeroContent {
  title: string
  subtitle: string
  image: string
  ctaText: string
  ctaLink: string
}

export interface AboutContent {
  title: string
  subtitle: string
  description: string
  image: string
  stats: { value: string; label: string }[]
  values: { icon: string; title: string; description: string }[]
}

export interface CategoryItem {
  id: string
  value: string
  label: string
  image: string
  description: string
}

export interface Experience {
  id: string
  year: string
  title: string
  description: string
}

export interface Partner {
  id: string
  name: string
  logo: string
  website?: string
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  socialLinks: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
    pinterest?: string
  }
}

// Booking System Types
export interface TimeSlot {
  start: string // "09:00"
  end: string   // "10:00"
}

export interface Availability {
  id: string
  date: string // "2024-03-15" format
  slots: TimeSlot[]
  isRecurring?: boolean
  dayOfWeek?: number // 0-6, 0 = Sunday
}

export interface Appointment {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  timeSlot: TimeSlot
  serviceType: string
  message?: string
  status: "pending" | "confirmed" | "rejected" | "cancelled"
  createdAt: string
  updatedAt: string
  adminNotes?: string
}

export interface EmailNotification {
  id: string
  type: "new_appointment" | "appointment_confirmed" | "appointment_rejected"
  to: string
  subject: string
  body: string
  sentAt: string
  read: boolean
}

// Default data
const defaultAdmins: Admin[] = [
  {
    id: "1",
    name: "Alexandre Dubois",
    email: "admin@alexandre-photo.fr",
    password: "admin123",
    role: "super_admin",
    avatar: "/images/photographer.jpg",
    createdAt: new Date().toISOString(),
  },
]

const defaultHero: HeroContent = {
  title: "Alexandre Dubois",
  subtitle: "Photographe professionnel specialise dans l'art du portrait et de l'evenementiel. Je capture vos moments les plus precieux avec elegance et emotion.",
  image: "/images/hero.jpg",
  ctaText: "Decouvrir mon travail",
  ctaLink: "/portfolio",
}

const defaultAbout: AboutContent = {
  title: "Alexandre Dubois",
  subtitle: "Photographe depuis plus de 10 ans",
  description: "Passionne par la lumiere et l'emotion, je me consacre a capturer les moments qui comptent. Mon approche allie technique maitrisee et sensibilite artistique pour creer des images intemporelles qui racontent votre histoire.",
  image: "/images/photographer.jpg",
  stats: [
    { value: "500+", label: "Projets realises" },
    { value: "10+", label: "Annees d'experience" },
    { value: "50+", label: "Prix & distinctions" },
  ],
  values: [
    { icon: "Camera", title: "Excellence", description: "Un engagement constant vers la qualite et la perfection dans chaque cliche." },
    { icon: "Heart", title: "Emotion", description: "Capturer l'essence des moments, les sentiments authentiques." },
    { icon: "Sparkles", title: "Creativite", description: "Une vision artistique unique pour des images memorables." },
  ],
}

const defaultCategories: CategoryItem[] = [
  { id: "1", value: "mariage", label: "Mariage", image: "/images/wedding-1.jpg", description: "Immortalisez le plus beau jour de votre vie" },
  { id: "2", value: "portrait", label: "Portrait", image: "/images/portrait-1.jpg", description: "Revelons ensemble votre personnalite" },
  { id: "3", value: "mode", label: "Mode", image: "/images/fashion-1.jpg", description: "Sublimez vos collections" },
  { id: "4", value: "evenementiel", label: "Evenementiel", image: "/images/event-1.jpg", description: "Capturez vos evenements" },
]

const defaultExperiences: Experience[] = [
  { id: "1", year: "2024", title: "Prix du meilleur photographe de mariage - France", description: "Recompense par le jury des Wedding Awards France" },
  { id: "2", year: "2022", title: "Exposition 'Lumieres de Paris' - Galerie Vivienne", description: "Premiere exposition solo presentant 30 oeuvres" },
  { id: "3", year: "2020", title: "Collaboration avec Vogue France", description: "Shooting editorial pour le numero de septembre" },
  { id: "4", year: "2018", title: "Creation du studio Alexandre Dubois", description: "Ouverture du studio a Paris 11e" },
  { id: "5", year: "2015", title: "Debut de carriere professionnelle", description: "Premiers contrats en tant que photographe independant" },
]

const defaultPartners: Partner[] = [
  { id: "1", name: "Vogue France", logo: "/images/partners/vogue.svg", website: "https://vogue.fr" },
  { id: "2", name: "Maison Elysee", logo: "/images/partners/elysee.svg", website: "https://maisonelysee.fr" },
  { id: "3", name: "Canon France", logo: "/images/partners/canon.svg", website: "https://canon.fr" },
]

const defaultSettings: SiteSettings = {
  siteName: "Alexandre Dubois Photographie",
  siteDescription: "Photographe professionnel a Paris - Mariage, Portrait, Mode, Evenementiel",
  contactEmail: "contact@alexandre-photo.fr",
  contactPhone: "+33 6 12 34 56 78",
  address: "12 Rue de la Roquette, 75011 Paris",
  socialLinks: {
    instagram: "https://instagram.com/alexandredubois",
    facebook: "https://facebook.com/alexandredubois",
    pinterest: "https://pinterest.com/alexandredubois",
  },
}

// Storage keys
const STORAGE_KEYS = {
  admins: "admin_admins",
  hero: "admin_hero",
  about: "admin_about",
  categories: "admin_categories",
  projects: "admin_projects",
  testimonials: "admin_testimonials",
  experiences: "admin_experiences",
  partners: "admin_partners",
  services: "admin_services",
  blogPosts: "admin_blog_posts",
  settings: "admin_settings",
  currentUser: "admin_current_user",
  availabilities: "admin_availabilities",
  appointments: "admin_appointments",
  emailNotifications: "admin_email_notifications",
}

// Helper to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(key, value)
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },
}

// Generic CRUD functions
function getData<T>(key: string, defaultData: T): T {
  const stored = safeLocalStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored) as T
    } catch {
      return defaultData
    }
  }
  return defaultData
}

function setData<T>(key: string, data: T): void {
  safeLocalStorage.setItem(key, JSON.stringify(data))
}

// Admin functions
export function getAdmins(): Admin[] {
  return getData(STORAGE_KEYS.admins, defaultAdmins)
}

export function setAdmins(admins: Admin[]): void {
  setData(STORAGE_KEYS.admins, admins)
}

export function addAdmin(admin: Omit<Admin, "id" | "createdAt">): Admin {
  const admins = getAdmins()
  const newAdmin: Admin = {
    ...admin,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  admins.push(newAdmin)
  setAdmins(admins)
  return newAdmin
}

export function updateAdmin(id: string, updates: Partial<Admin>): Admin | null {
  const admins = getAdmins()
  const index = admins.findIndex((a) => a.id === id)
  if (index === -1) return null
  admins[index] = { ...admins[index], ...updates }
  setAdmins(admins)
  return admins[index]
}

export function deleteAdmin(id: string): boolean {
  const admins = getAdmins()
  const filtered = admins.filter((a) => a.id !== id)
  if (filtered.length === admins.length) return false
  setAdmins(filtered)
  return true
}

// Authentication
export function login(email: string, password: string): Admin | null {
  const admins = getAdmins()
  const admin = admins.find((a) => a.email === email && a.password === password)
  if (admin) {
    safeLocalStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(admin))
    return admin
  }
  return null
}

export function logout(): void {
  safeLocalStorage.removeItem(STORAGE_KEYS.currentUser)
}

export function getCurrentUser(): Admin | null {
  const stored = safeLocalStorage.getItem(STORAGE_KEYS.currentUser)
  if (stored) {
    try {
      return JSON.parse(stored) as Admin
    } catch {
      return null
    }
  }
  return null
}

// Hero functions
export function getHero(): HeroContent {
  return getData(STORAGE_KEYS.hero, defaultHero)
}

export function setHero(hero: HeroContent): void {
  setData(STORAGE_KEYS.hero, hero)
}

// About functions
export function getAbout(): AboutContent {
  return getData(STORAGE_KEYS.about, defaultAbout)
}

export function setAbout(about: AboutContent): void {
  setData(STORAGE_KEYS.about, about)
}

// Categories functions
export function getCategories(): CategoryItem[] {
  return getData(STORAGE_KEYS.categories, defaultCategories)
}

export function setCategories(categories: CategoryItem[]): void {
  setData(STORAGE_KEYS.categories, categories)
}

export function addCategory(category: Omit<CategoryItem, "id">): CategoryItem {
  const categories = getCategories()
  const newCategory: CategoryItem = { ...category, id: Date.now().toString() }
  categories.push(newCategory)
  setCategories(categories)
  return newCategory
}

export function updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
  const categories = getCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return null
  categories[index] = { ...categories[index], ...updates }
  setCategories(categories)
  return categories[index]
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const filtered = categories.filter((c) => c.id !== id)
  if (filtered.length === categories.length) return false
  setCategories(filtered)
  return true
}

// Projects functions
export function getProjects(): Project[] {
  return getData(STORAGE_KEYS.projects, projects)
}

export function setProjects(projectsList: Project[]): void {
  setData(STORAGE_KEYS.projects, projectsList)
}

export function addProject(project: Omit<Project, "id">): Project {
  const projectsList = getProjects()
  const newProject: Project = { 
    ...project, 
    id: project.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now() 
  }
  projectsList.push(newProject)
  setProjects(projectsList)
  return newProject
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const projectsList = getProjects()
  const index = projectsList.findIndex((p) => p.id === id)
  if (index === -1) return null
  projectsList[index] = { ...projectsList[index], ...updates }
  setProjects(projectsList)
  return projectsList[index]
}

export function deleteProject(id: string): boolean {
  const projectsList = getProjects()
  const filtered = projectsList.filter((p) => p.id !== id)
  if (filtered.length === projectsList.length) return false
  setProjects(filtered)
  return true
}

// Testimonials functions
export function getTestimonials(): Testimonial[] {
  return getData(STORAGE_KEYS.testimonials, testimonials)
}

export function setTestimonials(testimonialsList: Testimonial[]): void {
  setData(STORAGE_KEYS.testimonials, testimonialsList)
}

export function addTestimonial(testimonial: Omit<Testimonial, "id">): Testimonial {
  const testimonialsList = getTestimonials()
  const newTestimonial: Testimonial = { ...testimonial, id: Date.now().toString() }
  testimonialsList.push(newTestimonial)
  setTestimonials(testimonialsList)
  return newTestimonial
}

export function updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
  const testimonialsList = getTestimonials()
  const index = testimonialsList.findIndex((t) => t.id === id)
  if (index === -1) return null
  testimonialsList[index] = { ...testimonialsList[index], ...updates }
  setTestimonials(testimonialsList)
  return testimonialsList[index]
}

export function deleteTestimonial(id: string): boolean {
  const testimonialsList = getTestimonials()
  const filtered = testimonialsList.filter((t) => t.id !== id)
  if (filtered.length === testimonialsList.length) return false
  setTestimonials(filtered)
  return true
}

// Experience functions
export function getExperiences(): Experience[] {
  return getData(STORAGE_KEYS.experiences, defaultExperiences)
}

export function setExperiences(experiencesList: Experience[]): void {
  setData(STORAGE_KEYS.experiences, experiencesList)
}

export function addExperience(experience: Omit<Experience, "id">): Experience {
  const experiencesList = getExperiences()
  const newExperience: Experience = { ...experience, id: Date.now().toString() }
  experiencesList.push(newExperience)
  setExperiences(experiencesList)
  return newExperience
}

export function updateExperience(id: string, updates: Partial<Experience>): Experience | null {
  const experiencesList = getExperiences()
  const index = experiencesList.findIndex((e) => e.id === id)
  if (index === -1) return null
  experiencesList[index] = { ...experiencesList[index], ...updates }
  setExperiences(experiencesList)
  return experiencesList[index]
}

export function deleteExperience(id: string): boolean {
  const experiencesList = getExperiences()
  const filtered = experiencesList.filter((e) => e.id !== id)
  if (filtered.length === experiencesList.length) return false
  setExperiences(filtered)
  return true
}

// Partners functions
export function getPartners(): Partner[] {
  return getData(STORAGE_KEYS.partners, defaultPartners)
}

export function setPartners(partnersList: Partner[]): void {
  setData(STORAGE_KEYS.partners, partnersList)
}

export function addPartner(partner: Omit<Partner, "id">): Partner {
  const partnersList = getPartners()
  const newPartner: Partner = { ...partner, id: Date.now().toString() }
  partnersList.push(newPartner)
  setPartners(partnersList)
  return newPartner
}

export function updatePartner(id: string, updates: Partial<Partner>): Partner | null {
  const partnersList = getPartners()
  const index = partnersList.findIndex((p) => p.id === id)
  if (index === -1) return null
  partnersList[index] = { ...partnersList[index], ...updates }
  setPartners(partnersList)
  return partnersList[index]
}

export function deletePartner(id: string): boolean {
  const partnersList = getPartners()
  const filtered = partnersList.filter((p) => p.id !== id)
  if (filtered.length === partnersList.length) return false
  setPartners(filtered)
  return true
}

// Services functions
export function getServices(): Service[] {
  return getData(STORAGE_KEYS.services, services)
}

export function setServices(servicesList: Service[]): void {
  setData(STORAGE_KEYS.services, servicesList)
}

export function addService(service: Omit<Service, "id">): Service {
  const servicesList = getServices()
  const newService: Service = { ...service, id: Date.now().toString() }
  servicesList.push(newService)
  setServices(servicesList)
  return newService
}

export function updateService(id: string, updates: Partial<Service>): Service | null {
  const servicesList = getServices()
  const index = servicesList.findIndex((s) => s.id === id)
  if (index === -1) return null
  servicesList[index] = { ...servicesList[index], ...updates }
  setServices(servicesList)
  return servicesList[index]
}

export function deleteService(id: string): boolean {
  const servicesList = getServices()
  const filtered = servicesList.filter((s) => s.id !== id)
  if (filtered.length === servicesList.length) return false
  setServices(filtered)
  return true
}

// Blog posts functions
// export function getBlogPosts(): BlogPost[] {
//   return getData(STORAGE_KEYS.blogPosts, blogPosts)
// }

export function setBlogPosts(blogPostsList: BlogPost[]): void {
  setData(STORAGE_KEYS.blogPosts, blogPostsList)
}

// export function addBlogPost(blogPost: Omit<BlogPost, "id">): BlogPost {
//   const blogPostsList = getBlogPosts()
//   const newBlogPost: BlogPost = { 
//     ...blogPost, 
//     id: blogPost.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now() 
//   }
//   blogPostsList.push(newBlogPost)
//   setBlogPosts(blogPostsList)
//   return newBlogPost
// }

// export function updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
//   const blogPostsList = getBlogPosts()
//   const index = blogPostsList.findIndex((b) => b.id === id)
//   if (index === -1) return null
//   blogPostsList[index] = { ...blogPostsList[index], ...updates }
//   setBlogPosts(blogPostsList)
//   return blogPostsList[index]
// }

// export function deleteBlogPost(id: string): boolean {
//   const blogPostsList = getBlogPosts()
//   const filtered = blogPostsList.filter((b) => b.id !== id)
//   if (filtered.length === blogPostsList.length) return false
//   setBlogPosts(filtered)
//   return true
// }

// Settings functions
export function getSettings(): SiteSettings {
  return getData(STORAGE_KEYS.settings, defaultSettings)
}

export function setSettings(settings: SiteSettings): void {
  setData(STORAGE_KEYS.settings, settings)
}

// ============================================
// BOOKING SYSTEM FUNCTIONS
// ============================================

// Email simulation function
export function simulateEmail(
  type: EmailNotification["type"],
  to: string,
  appointment: Appointment
): EmailNotification {
  const settings = getSettings()
  let subject = ""
  let body = ""
  
  const dateFormatted = new Date(appointment.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  
  switch (type) {
    case "new_appointment":
      subject = `Nouvelle demande de rendez-vous - ${appointment.clientName}`
      body = `
Bonjour,

Vous avez recu une nouvelle demande de rendez-vous:

Client: ${appointment.clientName}
Email: ${appointment.clientEmail}
Telephone: ${appointment.clientPhone}
Date: ${dateFormatted}
Horaire: ${appointment.timeSlot.start} - ${appointment.timeSlot.end}
Type de service: ${appointment.serviceType}
${appointment.message ? `Message: ${appointment.message}` : ""}

Connectez-vous a votre espace admin pour confirmer ou refuser ce rendez-vous.

Cordialement,
${settings.siteName}
      `.trim()
      break
      
    case "appointment_confirmed":
      subject = `Votre rendez-vous est confirme - ${settings.siteName}`
      body = `
Bonjour ${appointment.clientName},

Nous avons le plaisir de vous confirmer votre rendez-vous:

Date: ${dateFormatted}
Horaire: ${appointment.timeSlot.start} - ${appointment.timeSlot.end}
Type de service: ${appointment.serviceType}

Adresse: ${settings.address}

Si vous avez des questions, n'hesitez pas a nous contacter:
Email: ${settings.contactEmail}
Telephone: ${settings.contactPhone}

A bientot!

${settings.siteName}
      `.trim()
      break
      
    case "appointment_rejected":
      subject = `Information concernant votre demande de rendez-vous - ${settings.siteName}`
      body = `
Bonjour ${appointment.clientName},

Nous sommes au regret de vous informer que votre demande de rendez-vous pour le ${dateFormatted} a ${appointment.timeSlot.start} n'a pas pu etre acceptee.

${appointment.adminNotes ? `Motif: ${appointment.adminNotes}` : ""}

Nous vous invitons a choisir une autre date disponible sur notre site.

Pour toute question, contactez-nous:
Email: ${settings.contactEmail}
Telephone: ${settings.contactPhone}

Cordialement,
${settings.siteName}
      `.trim()
      break
  }
  
  const notification: EmailNotification = {
    id: Date.now().toString(),
    type,
    to,
    subject,
    body,
    sentAt: new Date().toISOString(),
    read: false,
  }
  
  // Log to console (simulation)
  console.log("\n========================================")
  console.log("EMAIL SIMULE")
  console.log("========================================")
  console.log(`A: ${to}`)
  console.log(`Sujet: ${subject}`)
  console.log("----------------------------------------")
  console.log(body)
  console.log("========================================\n")
  
  // Save notification
  const notifications = getEmailNotifications()
  notifications.unshift(notification)
  setEmailNotifications(notifications)
  
  return notification
}

// Availability functions
export function getAvailabilities(): Availability[] {
  return getData(STORAGE_KEYS.availabilities, [])
}

export function setAvailabilities(availabilities: Availability[]): void {
  setData(STORAGE_KEYS.availabilities, availabilities)
}

export function addAvailability(availability: Omit<Availability, "id">): Availability {
  const availabilities = getAvailabilities()
  const newAvailability: Availability = { ...availability, id: Date.now().toString() }
  availabilities.push(newAvailability)
  setAvailabilities(availabilities)
  return newAvailability
}

export function updateAvailability(id: string, updates: Partial<Availability>): Availability | null {
  const availabilities = getAvailabilities()
  const index = availabilities.findIndex((a) => a.id === id)
  if (index === -1) return null
  availabilities[index] = { ...availabilities[index], ...updates }
  setAvailabilities(availabilities)
  return availabilities[index]
}

export function deleteAvailability(id: string): boolean {
  const availabilities = getAvailabilities()
  const filtered = availabilities.filter((a) => a.id !== id)
  if (filtered.length === availabilities.length) return false
  setAvailabilities(filtered)
  return true
}

export function getAvailabilityForDate(date: string): Availability | undefined {
  const availabilities = getAvailabilities()
  return availabilities.find((a) => a.date === date)
}

export function getAvailableSlotsForDate(date: string): TimeSlot[] {
  const availability = getAvailabilityForDate(date)
  if (!availability) return []
  
  const appointments = getAppointments()
  const bookedSlots = appointments
    .filter((a) => a.date === date && (a.status === "pending" || a.status === "confirmed"))
    .map((a) => a.timeSlot)
  
  return availability.slots.filter(
    (slot) => !bookedSlots.some((booked) => booked.start === slot.start && booked.end === slot.end)
  )
}

// Appointment functions
export function getAppointments(): Appointment[] {
  return getData(STORAGE_KEYS.appointments, [])
}

export function setAppointments(appointments: Appointment[]): void {
  setData(STORAGE_KEYS.appointments, appointments)
}

export function addAppointment(appointment: Omit<Appointment, "id" | "status" | "createdAt" | "updatedAt">): Appointment {
  const appointments = getAppointments()
  const settings = getSettings()
  
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  appointments.push(newAppointment)
  setAppointments(appointments)
  
  // Send email notification to admin
  simulateEmail("new_appointment", settings.contactEmail, newAppointment)
  
  return newAppointment
}

export function updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
  const appointments = getAppointments()
  const index = appointments.findIndex((a) => a.id === id)
  if (index === -1) return null
  
  appointments[index] = {
    ...appointments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  setAppointments(appointments)
  return appointments[index]
}

export function confirmAppointment(id: string): Appointment | null {
  const appointments = getAppointments()
  const appointment = appointments.find((a) => a.id === id)
  if (!appointment) return null
  
  const updated = updateAppointment(id, { status: "confirmed" })
  if (updated) {
    simulateEmail("appointment_confirmed", updated.clientEmail, updated)
  }
  return updated
}

export function rejectAppointment(id: string, adminNotes?: string): Appointment | null {
  const appointments = getAppointments()
  const appointment = appointments.find((a) => a.id === id)
  if (!appointment) return null
  
  const updated = updateAppointment(id, { status: "rejected", adminNotes })
  if (updated) {
    simulateEmail("appointment_rejected", updated.clientEmail, updated)
  }
  return updated
}

export function cancelAppointment(id: string): Appointment | null {
  return updateAppointment(id, { status: "cancelled" })
}

export function deleteAppointment(id: string): boolean {
  const appointments = getAppointments()
  const filtered = appointments.filter((a) => a.id !== id)
  if (filtered.length === appointments.length) return false
  setAppointments(filtered)
  return true
}

export function getPendingAppointmentsCount(): number {
  return getAppointments().filter((a) => a.status === "pending").length
}

// Email notifications functions
export function getEmailNotifications(): EmailNotification[] {
  return getData(STORAGE_KEYS.emailNotifications, [])
}

export function setEmailNotifications(notifications: EmailNotification[]): void {
  setData(STORAGE_KEYS.emailNotifications, notifications)
}

export function markNotificationAsRead(id: string): void {
  const notifications = getEmailNotifications()
  const index = notifications.findIndex((n) => n.id === id)
  if (index !== -1) {
    notifications[index].read = true
    setEmailNotifications(notifications)
  }
}

export function markAllNotificationsAsRead(): void {
  const notifications = getEmailNotifications()
  notifications.forEach((n) => (n.read = true))
  setEmailNotifications(notifications)
}

export function getUnreadNotificationsCount(): number {
  return getEmailNotifications().filter((n) => !n.read).length
}

export function deleteNotification(id: string): boolean {
  const notifications = getEmailNotifications()
  const filtered = notifications.filter((n) => n.id !== id)
  if (filtered.length === notifications.length) return false
  setEmailNotifications(filtered)
  return true
}

// Initialize store with default data if empty
export function initializeStore(): void {
  if (!safeLocalStorage.getItem(STORAGE_KEYS.admins)) {
    setAdmins(defaultAdmins)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.hero)) {
    setHero(defaultHero)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.about)) {
    setAbout(defaultAbout)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.categories)) {
    setCategories(defaultCategories)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.projects)) {
    setProjects(projects)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.testimonials)) {
    setTestimonials(testimonials)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.experiences)) {
    setExperiences(defaultExperiences)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.partners)) {
    setPartners(defaultPartners)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.services)) {
    setServices(services)
  }
  // if (!safeLocalStorage.getItem(STORAGE_KEYS.blogPosts)) {
  //   setBlogPosts(blogPosts)
  // }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.settings)) {
    setSettings(defaultSettings)
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.availabilities)) {
    setAvailabilities([])
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.appointments)) {
    setAppointments([])
  }
  if (!safeLocalStorage.getItem(STORAGE_KEYS.emailNotifications)) {
    setEmailNotifications([])
  }
}
