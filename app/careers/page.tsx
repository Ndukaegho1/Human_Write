import Link from "next/link"
import { Card } from "@/components/ui/card"

// Icons
const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const ZapIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const openRoles = [
  { title: "Frontend Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Backend Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "AI Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", department: "Design", location: "Remote", type: "Full-time" },
  { title: "Growth Marketer", department: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Customer Success", department: "Operations", location: "Remote", type: "Full-time" },
]

const benefits = [
  { icon: HeartIcon, title: "Health & Wellness", items: ["Medical, dental, vision", "Mental health support", "Gym stipend"] },
  { icon: ZapIcon, title: "Time Off", items: ["Unlimited PTO", "Sabbatical program", "Parental leave"] },
  { icon: GlobeIcon, title: "Remote-First", items: ["Work from anywhere", "Home office budget", "Co-working stipend"] },
  { icon: ClockIcon, title: "Growth", items: ["Learning budget", "Conference attendance", "Career development"] },
]

const values = [
  { title: "Human-Centered", description: "We build technology that serves people, not the other way around." },
  { title: "Transparent", description: "We communicate openly and honestly with each other and our users." },
  { title: "Curious", description: "We constantly learn, experiment, and improve our craft." },
  { title: "Collaborative", description: "We work together across boundaries to achieve great things." },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Join our mission to make writing more human
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-8">
            We're building tools that help people communicate more clearly and authentically. 
            Come help us shape the future of writing.
          </p>
          <a href="#open-roles" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F4C81] text-white font-medium rounded-lg hover:bg-[#0a3d66] transition-colors">
            View Open Positions
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Why Work With Us</h2>
            <p className="text-[#475569] max-w-2xl mx-auto">We offer competitive benefits and a culture that puts people first.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 border border-[#E2E8F0] text-center">
                <div className="w-12 h-12 bg-[#0F4C81]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-[#0F4C81]" />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-3">{benefit.title}</h3>
                <ul className="space-y-1 text-sm text-[#475569]">
                  {benefit.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Impact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Our Mission</h2>
              <p className="text-[#475569] mb-6">
                At HumanWrite, we believe everyone deserves tools that help them express themselves 
                more clearly and authentically. We're building the next generation of writing 
                tools—ones that enhance human creativity rather than replace it.
              </p>
              <p className="text-[#475569]">
                As a team, we're committed to responsible AI, user privacy, and building technology 
                that people can trust. If these values resonate with you, we'd love to hear from you.
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0]">
              <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Our Impact</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81] mb-1">500K+</div>
                  <div className="text-sm text-[#475569]">Writers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#28B04D] mb-1">10M+</div>
                  <div className="text-sm text-[#475569]">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#0F4C81] mb-1">99.9%</div>
                  <div className="text-sm text-[#475569]">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#28B04D] mb-1">4.9/5</div>
                  <div className="text-sm text-[#475569]">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Our Culture & Values</h2>
            <p className="text-[#475569] max-w-2xl mx-auto">The principles that guide how we work together.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-[#F8FAFC] rounded-xl p-6 border border-[#E2E8F0]">
                <h3 className="font-semibold text-[#0F172A] mb-2">{value.title}</h3>
                <p className="text-sm text-[#475569]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diversity Statement */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Diversity & Inclusion</h2>
          <p className="text-[#475569]">
            We believe diverse teams build better products. We're committed to creating an inclusive 
            environment where everyone feels welcome to contribute their unique perspective. We 
            actively seek candidates from underrepresented backgrounds and provide equal opportunities 
            for all.
          </p>
        </div>
      </section>

      {/* Remote Info */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border border-[#E2E8F0]">
            <div className="text-center mb-6">
              <GlobeIcon className="w-12 h-12 text-[#0F4C81] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Remote-First Culture</h2>
              <p className="text-[#475569]">Work from anywhere in the world.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircleIcon className="w-8 h-8 text-[#28B04D] mx-auto mb-2" />
                <p className="font-medium text-[#0F172A]">Async-First</p>
                <p className="text-sm text-[#475569]">Flexible hours, focus on outcomes</p>
              </div>
              <div className="text-center">
                <CheckCircleIcon className="w-8 h-8 text-[#28B04D] mx-auto mb-2" />
                <p className="font-medium text-[#0F172A]">Home Office</p>
                <p className="text-sm text-[#475569]">$2,000 setup budget</p>
              </div>
              <div className="text-center">
                <CheckCircleIcon className="w-8 h-8 text-[#28B04D] mx-auto mb-2" />
                <p className="font-medium text-[#0F172A]">Team Gatherings</p>
                <p className="text-sm text-[#475569]">2 in-person retreats/year</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Open Positions</h2>
            <p className="text-[#475569]">Find your next role and help us build the future of writing.</p>
          </div>
          
          {openRoles.length > 0 ? (
            <div className="space-y-4">
              {openRoles.map((role, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#0F4C81]/30 transition-colors">
                  <div>
                    <h3 className="font-semibold text-[#0F172A] text-lg">{role.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="text-sm text-[#475569]">{role.department}</span>
                      <span className="text-sm text-[#475569]">•</span>
                      <span className="text-sm text-[#475569]">{role.location}</span>
                      <span className="text-sm text-[#475569]">•</span>
                      <span className="text-sm text-[#475569]">{role.type}</span>
                    </div>
                  </div>
                  <a href={`mailto:careers@humanwrite.com?subject=Application for ${role.title}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white text-sm font-medium rounded-lg hover:bg-[#0a3d66] transition-colors shrink-0">
                    Apply Now
                    <ArrowRightIcon className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#475569] mb-4">No open positions at the moment.</p>
              <a href="mailto:careers@humanwrite.com" className="text-[#0F4C81] font-medium hover:underline">Send us your resume for future consideration</a>
            </div>
          )}
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Our Hiring Process</h2>
            <p className="text-[#475569]">What to expect when you apply.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Apply", description: "Submit your application and portfolio" },
              { step: "2", title: "Screen", description: "30-minute call with our team" },
              { step: "3", title: "Interview", description: "Technical deep-dive and culture fit" },
              { step: "4", title: "Offer", description: "Welcome to the team!" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-[#0F4C81] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-1">{item.title}</h3>
                <p className="text-sm text-[#475569]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Don't see the right role?</h2>
          <p className="text-[#475569] mb-8 max-w-xl mx-auto">
            We're always looking for talented people. Send us your resume and tell us how you'd like to contribute.
          </p>
          <a href="mailto:careers@humanwrite.com" className="inline-flex items-center gap-2 px-6 py-3 bg-[#28B04D] text-white font-medium rounded-lg hover:bg-[#229640] transition-colors">
            Get in Touch
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
