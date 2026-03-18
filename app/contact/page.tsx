import Link from "next/link"
import { Card } from "@/components/ui/card"

// Icons
const MailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const HeadphonesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)

const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
)

const SendIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const navigation = [
  { name: "About", href: "/about" },
  { name: "Trust Center", href: "/trust" },
  { name: "Careers", href: "/careers" },
  { name: "Help Center", href: "/help" },
  { name: "Contact Us", href: "/contact" },
  { name: "Resources", href: "/resources" },
]

const contactOptions = [
  { icon: HeadphonesIcon, title: "Technical Support", description: "Get help with technical issues", email: "support@humanwrite.com", color: "bg-[#0F4C81]" },
  { icon: MessageSquareIcon, title: "General Inquiry", description: "Questions about our product", email: "hello@humanwrite.com", color: "bg-[#28B04D]" },
  { icon: UsersIcon, title: "Sales", description: "Enterprise and team pricing", email: "sales@humanwrite.com", color: "bg-[#0F4C81]" },
  { icon: BuildingIcon, title: "Partnerships", description: "Collaborate with us", email: "partners@humanwrite.com", color: "bg-[#28B04D]" },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#0F4C81] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HW</span>
              </div>
              <span className="text-xl font-bold text-[#0F172A]">HumanWrite</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-sm font-medium text-[#475569] hover:text-[#0F4C81] transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth" className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors">Sign In</Link>
              <Link href="/pricing" className="px-4 py-2 bg-[#0F4C81] text-white text-sm font-medium rounded-lg hover:bg-[#0a3d66] transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Options & Form */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Options */}
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Contact Options</h2>
              <div className="space-y-4">
                {contactOptions.map((option, index) => (
                  <Card key={index} className="p-6 border border-[#E2E8F0] hover:border-[#0F4C81]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${option.color} rounded-xl flex items-center justify-center shrink-0`}>
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0F172A] mb-1">{option.title}</h3>
                        <p className="text-sm text-[#475569] mb-2">{option.description}</p>
                        <a href={`mailto:${option.email}`} className="text-sm text-[#0F4C81] font-medium hover:underline">
                          {option.email}
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Company Info */}
              <div className="mt-8 p-6 bg-white rounded-xl border border-[#E2E8F0]">
                <h3 className="font-semibold text-[#0F172A] mb-4">Company Information</h3>
                <div className="space-y-3 text-sm text-[#475569]">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-[#0F4C81]" />
                    <span>San Francisco, California</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-[#0F4C81]" />
                    <span>Mon-Fri, 9am-6pm PST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="p-8 border border-[#E2E8F0]">
                <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">Full Name</label>
                      <input type="text" id="name" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0F4C81]" placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">Email</label>
                      <input type="email" id="email" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0F4C81]" placeholder="john@example.com" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-[#0F172A] mb-2">Company (Optional)</label>
                    <input type="text" id="company" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0F4C81]" placeholder="Your company name" />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-[#0F172A] mb-2">Reason for Contact</label>
                    <select id="reason" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0F4C81]">
                      <option value="">Select a reason</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="partnerships">Partnerships</option>
                      <option value="media">Media</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#0F172A] mb-2">Message</label>
                    <textarea id="message" rows={5} className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0F4C81] resize-none" placeholder="Tell us how we can help..."></textarea>
                  </div>

                  <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0F4C81] text-white font-medium rounded-lg hover:bg-[#0a3d66] transition-colors">
                    <SendIcon className="w-5 h-5" />
                    Send Message
                  </button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Snippet */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What's your response time?", a: "We typically respond within 24 hours during business days." },
              { q: "Do you offer enterprise pricing?", a: "Yes! Contact our sales team for custom enterprise and team pricing." },
              { q: "Can I get a demo?", a: "Absolutely. Schedule a demo with our team to see HumanWrite in action." },
            ].map((item, index) => (
              <details key={index} className="group bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-[#0F172A]">
                  {item.q}
                  <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 text-[#475569] text-sm">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/help" className="text-[#0F4C81] font-medium hover:underline">View all FAQs</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Ready to get started?</h2>
          <p className="text-[#475569] mb-8 max-w-xl mx-auto">
            Try HumanWrite free and see how it can help you write better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/humanizer" className="inline-flex px-6 py-3 bg-[#28B04D] text-white font-medium rounded-lg hover:bg-[#229640] transition-colors">
              Try Free
            </Link>
            <Link href="/pricing" className="inline-flex px-6 py-3 bg-white text-[#0F172A] font-medium rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#28B04D] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HW</span>
                </div>
                <span className="text-xl font-bold">HumanWrite</span>
              </div>
              <p className="text-sm text-gray-400">Helping writers write better, not just faster.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/humanizer" className="hover:text-white transition-colors">Humanizer</Link></li>
                <li><Link href="/detector" className="hover:text-white transition-colors">AI Detector</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/trust" className="hover:text-white transition-colors">Trust Center</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">(c) 2024 HumanWrite. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
