import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import SubpageHero from '../components/SubpageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { defaultImages } from '../config/env.js'
import { StaggerContainer, StaggerItem } from '../components/ui/Stagger.jsx'

export default function CookiePolicy() {
    useDocumentTitle('Cookie Policy')

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="full-bleed -mt-8">
                <SubpageHero
                    title="Cookie Policy"
                    subtitle="Understanding how and why we use cookies on our platform."
                    backgroundImage={defaultImages.aboutHero}
                    height="medium"
                    overlayIntensity="medium"
                />
            </div>

            {/* Main Content */}
            <section className="container mx-auto px-4 pb-20">
                <StaggerContainer className="space-y-10">
                    <StaggerItem className="space-y-4">
                        <SectionHeading
                            badge="Transparency"
                            title="Cookies & Tracking Technologies"
                            centered={false}
                        />
                        <p className="text-lg text-text/80 leading-relaxed">
                            EcoTrack uses cookies to enhance your experience, analyze site usage, and support our
                            sustainability initiatives. This policy explains what cookies are and how you can
                            control them.
                        </p>
                    </StaggerItem>

                    <div className="grid gap-8 md:grid-cols-1">
                        <StaggerItem className="space-y-4 p-8 bg-primary/5 rounded-2xl border border-primary/10">
                            <h3 className="text-2xl font-bold text-text">1. What are Cookies?</h3>
                            <p className="text-text/70 leading-relaxed">
                                Cookies are small text files stored on your device when you visit a website. They
                                help us remember your preferences and provide a smoother browsing experience.
                            </p>
                        </StaggerItem>

                        <StaggerItem className="space-y-4 p-8 bg-surface rounded-2xl border border-border">
                            <h3 className="text-2xl font-bold text-text">2. Types of Cookies We Use</h3>
                            <ul className="list-disc pl-5 space-y-2 text-text/70 leading-relaxed">
                                <li><strong>Essential Cookies:</strong> Required for the site to function properly.</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the site.</li>
                                <li><strong>Preference Cookies:</strong> Remember your settings and choices.</li>
                            </ul>
                        </StaggerItem>

                        <StaggerItem className="space-y-4 p-8 bg-surface rounded-2xl border border-border">
                            <h3 className="text-2xl font-bold text-text">3. Managing Your Choices</h3>
                            <p className="text-text/70 leading-relaxed">
                                You can adjust your browser settings to refuse cookies or alert you when they are being
                                sent. Please note that some parts of the site may not function correctly without cookies.
                            </p>
                        </StaggerItem>
                    </div>
                </StaggerContainer>
            </section>
        </div>
    )
}
