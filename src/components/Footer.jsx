import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SiGithub, SiX, SiInstagram, SiLinkedin } from 'react-icons/si'
import { RiMailLine, RiSendPlaneFill, RiMapPinLine, RiPhoneLine, RiPlantLine, RiLightbulbLine, RiCalendarEventLine } from 'react-icons/ri'
import Logo from './Logo.jsx'
import { useSiteContent } from '../hooks/queries'

const defaultFooter = {
  brand: {
    title: 'EcoTrack',
    description: 'Empowering individuals to track their environmental impact and build a sustainable future through community-driven action.'
  },
  exploreLinks: [
    { label: 'Challenges', path: '/challenges', icon: 'plant' },
    { label: 'Impact Tips', path: '/tips', icon: 'bulb' },
    { label: 'Local Events', path: '/events', icon: 'calendar' },
  ],
  resourceLinks: [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Sustainability Guide', path: '/guide' },
  ],
  legalLinks: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
  ],
  contact: {
    address: 'Green District, Eco Avenue 42, Earth',
    phone: '+1 (555) ECO-TRACK',
    email: 'hello@ecotrack.com'
  },
  socialLinks: [
    { label: 'GitHub', href: '#', icon: 'github' },
    { label: 'X (Twitter)', href: '#', icon: 'x' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  ],
  newsletter: {
    title: 'Stay Updated',
    subtitle: 'Get monthly sustainability tips and community updates directly.'
  },
  credits: {
    author: 'Omar Faruk',
    authorUrl: 'https://github.com/iamOmarFaruk'
  }
}

const exploreIcons = {
  plant: RiPlantLine,
  bulb: RiLightbulbLine,
  calendar: RiCalendarEventLine
}

const socialIcons = {
  github: SiGithub,
  x: SiX,
  instagram: SiInstagram,
  linkedin: SiLinkedin
}

export default function Footer() {
  const { data } = useSiteContent()
  const footer = {
    ...defaultFooter,
    ...(data?.footer || {}),
    exploreLinks: data?.footer?.exploreLinks?.length ? data.footer.exploreLinks : defaultFooter.exploreLinks,
    resourceLinks: data?.footer?.resourceLinks?.length ? data.footer.resourceLinks : defaultFooter.resourceLinks,
    legalLinks: data?.footer?.legalLinks?.length ? data.footer.legalLinks : defaultFooter.legalLinks,
    socialLinks: data?.footer?.socialLinks?.length ? data.footer.socialLinks : defaultFooter.socialLinks,
    contact: { ...defaultFooter.contact, ...(data?.footer?.contact || {}) },
    newsletter: { ...defaultFooter.newsletter, ...(data?.footer?.newsletter || {}) },
    credits: { ...defaultFooter.credits, ...(data?.footer?.credits || {}) },
    brand: { ...defaultFooter.brand, ...(data?.footer?.brand || {}) }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <footer className="relative overflow-hidden bg-[#05110d] pt-16 pb-8 text-white/70">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" />

      <motion.div
        className="container relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo className="h-9 w-9" />
              <span className="text-xl font-heading font-bold tracking-tight text-white">{footer.brand.title}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {footer.brand.description}
            </p>
            <div className="flex items-center gap-4">
              {footer.socialLinks.map((social, index) => {
                const Icon = socialIcons[social.icon] || SiGithub
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-full bg-white/5 text-white/60 hover:bg-primary hover:text-white transition-all duration-300"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Explore Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
            <ul className="space-y-3">
              {footer.exploreLinks.map((link, index) => {
                const Icon = exploreIcons[link.icon] || RiPlantLine
                return (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-sm transition-colors hover:text-white group"
                    >
                      <Icon className="text-primary shrink-0" size={18} />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <RiMapPinLine className="mt-1 text-primary shrink-0" />
                <span>{footer.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <RiPhoneLine className="text-primary shrink-0" />
                <span>{footer.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2 pt-2">
                <RiMailLine className="text-primary shrink-0" />
                <a href={`mailto:${footer.contact.email}`} className="hover:text-white transition-colors">{footer.contact.email}</a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">{footer.newsletter.title}</h3>
            <p className="text-sm leading-relaxed">
              {footer.newsletter.subtitle}
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-lg bg-white/5 border border-white/10 py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all duration-300 group-hover:border-white/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 p-2 rounded-md bg-primary text-white hover:bg-primary-darker transition-colors duration-300"
                aria-label="Subscribe"
              >
                <RiSendPlaneFill size={16} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <span>© {new Date().getFullYear()} EcoTrack. All rights reserved.</span>
              <div className="flex gap-4">
                {footer.legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="opacity-60">Built with ❤️ by</span>
              <a
                href={footer.credits.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-white/90 hover:text-primary transition-colors duration-300"
              >
                <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[10px] uppercase tracking-tighter group-hover:bg-primary group-hover:text-white transition-colors">Dev</span>
                <span className="font-bold underline decoration-primary/20 underline-offset-4 group-hover:decoration-primary">{footer.credits.author}</span>
                <SiGithub className="text-[12px] opacity-50 group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
