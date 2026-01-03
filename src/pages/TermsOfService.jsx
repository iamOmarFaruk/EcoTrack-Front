import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import SubpageHero from '../components/SubpageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { defaultImages } from '../config/env.js'

export default function TermsOfService() {
    useDocumentTitle('Terms of Service')

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="full-bleed -mt-8">
                <SubpageHero
                    title="Terms of Service"
                    subtitle="Please read these terms carefully before using EcoTrack."
                    backgroundImage={defaultImages.aboutHero}
                    height="medium"
                    overlayIntensity="medium"
                />
            </div>

            {/* Main Content */}
            <section className="container mx-auto px-4 max-w-4xl pb-20">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <SectionHeading
                            badge="Agreement"
                            title="Standard Terms & Conditions"
                            centered={false}
                        />
                        <p className="text-lg text-text/80 leading-relaxed">
                            By accessing and using EcoTrack, you agree to comply with and be bound by the following
                            terms and conditions of use. Our goal is to maintain a positive and productive environment
                            for all community members.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-1">
                        <div className="space-y-4 p-8 bg-primary/5 rounded-2xl border border-primary/10">
                            <h3 className="text-2xl font-bold text-text">1. Use of Service</h3>
                            <p className="text-text/70 leading-relaxed">
                                You agree to use EcoTrack only for lawful purposes and in a way that does not infringe
                                on the rights of others or restrict their use and enjoyment of the platform.
                            </p>
                        </div>

                        <div className="space-y-4 p-8 bg-surface rounded-2xl border border-border">
                            <h3 className="text-2xl font-bold text-text">2. Account Responsibility</h3>
                            <p className="text-text/70 leading-relaxed">
                                You are responsible for maintaining the confidentiality of your account credentials
                                and for all activities that occur under your account. Please notify us immediately
                                of any unauthorized access.
                            </p>
                        </div>

                        <div className="space-y-4 p-8 bg-surface rounded-2xl border border-border">
                            <h3 className="text-2xl font-bold text-text">3. Community Conduct</h3>
                            <p className="text-text/70 leading-relaxed">
                                We expect all members to treat others with respect. Harassment, abusive language,
                                or any form of discrimination will not be tolerated and may result in account termination.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
