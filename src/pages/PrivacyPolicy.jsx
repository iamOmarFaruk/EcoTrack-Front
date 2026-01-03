import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import SubpageHero from '../components/SubpageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { defaultImages } from '../config/env.js'
import { StaggerContainer, StaggerItem } from '../components/ui/Stagger.jsx'

export default function PrivacyPolicy() {
    useDocumentTitle('Privacy Policy')

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="full-bleed -mt-8">
                <SubpageHero
                    title="Privacy Policy"
                    subtitle="Your privacy is important to us. Learn how we handle your data and protect your information."
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
                            badge="Security"
                            title="Data Protection & Privacy"
                            centered={false}
                        />
                        <p className="text-lg text-text/80 leading-relaxed">
                            At EcoTrack, we are committed to protecting your privacy and ensuring any personal information
                            is handled securely and responsibly. This policy outlines how we collect, use, and safeguard
                            your data when you use our platform.
                        </p>
                    </StaggerItem>

                    <div className="grid gap-8 md:grid-cols-1">
                        <StaggerItem className="space-y-4 p-8 bg-primary/5 rounded-2xl border border-primary/10">
                            <h3 className="text-2xl font-bold text-text">1. Information Collection</h3>
                            <p className="text-text/70 leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account,
                                participate in challenges, or contact our support team. This may include your name,
                                email address, and activity data.
                            </p>
                        </StaggerItem>

                        <StaggerItem className="space-y-4 p-8 bg-surface rounded-2xl border border-border">
                            <h3 className="text-2xl font-bold text-text">2. How We Use Data</h3>
                            <p className="text-text/70 leading-relaxed">
                                Your data is used to personalize your experience, track your environmental impact,
                                and provide updates on challenges and events. We do not sell your personal
                                information to third parties.
                            </p>
                        </StaggerItem>

                        <StaggerItem className="space-y-4 p-8 bg-surface rounded-2xl border border-border">
                            <h3 className="text-2xl font-bold text-text">3. Data Security</h3>
                            <p className="text-text/70 leading-relaxed">
                                We implement robust security measures to protect your information from unauthorized
                                access, alteration, or disclosure. Our platform uses industry-standard encryption
                                and security protocols.
                            </p>
                        </StaggerItem>
                    </div>
                </StaggerContainer>
            </section>
        </div>
    )
}
