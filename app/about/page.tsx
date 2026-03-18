import Link from "next/link"
import { Card } from "@/components/ui/card"

// Icons as inline SVGs
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const WriteIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const BrainIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
)

const HeartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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

const LightbulbIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
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

export default function AboutPage() {
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
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-[#475569] hover:text-[#0F4C81] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 bg-[#0F4C81] text-white text-sm font-medium rounded-lg hover:bg-[#0a3d66] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Helping writers write better,<br />not just faster
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto">
            We believe technology should enhance human creativity, not replace it. 
            HumanWrite helps people communicate more naturally, clearly, and authentically.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Our Mission</h2>
              <p className="text-[#475569] leading-relaxed mb-6">
                At HumanWrite, we're on a mission to make writing more human. We believe 
                everyone deserves tools that help them express themselves more clearly and 
                authentically, whether they're crafting a business proposal, writing academic 
                content, or communicating with customers.
              </p>
              <p className="text-[#475569] leading-relaxed">
                Our platform doesn't aim to replace human creativity. Instead, we help 
                writers refine their voice, remove awkward phrasing, and communicate with 
                confidence. We call this "human-centered AI." It is technology that serves 
                people, not the other way around.
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0]">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#0F4C81] mb-2">500K+</div>
                  <div className="text-sm text-[#475569]">Writers Served</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#28B04D] mb-2">10M+</div>
                  <div className="text-sm text-[#475569]">Documents Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#0F4C81] mb-2">99.9%</div>
                  <div className="text-sm text-[#475569]">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#28B04D] mb-2">4.9/5</div>
                  <div className="text-sm text-[#475569]">User Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">What Makes Us Different</h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              We don't just build AI tools. We build tools that put human writers first.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border border-[#E2E8F0] bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#0F4C81]/10 rounded-xl flex items-center justify-center mb-4">
                <WriteIcon className="w-6 h-6 text-[#0F4C81]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Enhance, Don't Replace</h3>
              <p className="text-[#475569] text-sm">
                Our tools help you improve your writing, not generate it for you. 
                You maintain full control and ownership of your content.
              </p>
            </Card>
            <Card className="p-6 border border-[#E2E8F0] bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#28B04D]/10 rounded-xl flex items-center justify-center mb-4">
                <ShieldIcon className="w-6 h-6 text-[#28B04D]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Privacy by Design</h3>
              <p className="text-[#475569] text-sm">
                Your content stays yours. We don't train our models on your data, 
                and we offer complete control over what you share.
              </p>
            </Card>
            <Card className="p-6 border border-[#E2E8F0] bg-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#0F4C81]/10 rounded-xl flex items-center justify-center mb-4">
                <BrainIcon className="w-6 h-6 text-[#0F4C81]" />
              </div>
              <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Responsible AI</h3>
              <p className="text-[#475569] text-sm">
                We're transparent about what our AI can and cannot do. 
                Our detector scores are clearly labeled as estimates, not proof.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Our Values</h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              The principles that guide everything we build.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: HeartIcon, title: "Human-Centered", desc: "Technology that serves people" },
              { icon: ShieldIcon, title: "Trust & Transparency", desc: "Open about what we build" },
              { icon: LightbulbIcon, title: "Continuous Learning", desc: "Always improving" },
              { icon: UsersIcon, title: "Community", desc: "Writers helping writers" },
            ].map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-14 h-14 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
                  <value.icon className="w-7 h-7 text-[#0F4C81]" />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-2">{value.title}</h3>
                <p className="text-sm text-[#475569]">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">How HumanWrite Works</h2>
            <p className="text-[#475569] max-w-2xl mx-auto">
              Three powerful tools to enhance your writing.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] h-full">
                <div className="w-10 h-10 bg-[#28B04D] text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Humanize Your Text</h3>
                <p className="text-[#475569] text-sm mb-4">
                  Paste any text and choose a tone. Our AI rewrites it to sound more 
                  natural while preserving your original meaning.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircleIcon className="w-4 h-4 text-[#28B04D]" /> 5 tone options
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircleIcon className="w-4 h-4 text-[#28B04D]" /> Adjustable strength
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] h-full">
                <div className="w-10 h-10 bg-[#0F4C81] text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Detect AI Content</h3>
                <p className="text-[#475569] text-sm mb-4">
                  Check if your text might sound AI-generated. Get percentage scores 
                  and specific suggestions for improvement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircleIcon className="w-4 h-4 text-[#28B04D]" /> AI% vs Human% scores
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircleIcon className="w-4 h-4 text-[#28B04D]" /> Sentence highlighting
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] h-full">
                <div className="w-10 h-10 bg-[#0F4C81] text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">Build Your Voice</h3>
                <p className="text-[#475569] text-sm mb-4">
                  Upload writing samples to teach HumanWrite your unique style. 
                  Future suggestions match your personal voice.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircleIcon className="w-4 h-4 text-[#28B04D]" /> Custom voice profiles
                  </li>
                  <li className="flex items-center gap-2 text-sm text-[#475569]">
                    <CheckCircleIcon className="w-4 h-4 text-[#28B04D]" /> Consistent style
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Responsibility */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Trust & Responsibility</h2>
            <p className="text-[#475569]">
              We take our responsibility seriously.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <ShieldIcon className="w-6 h-6 text-[#28B04D] shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-2">We Don't Support Deception</h3>
                <p className="text-[#475569] text-sm">
                  HumanWrite is designed for legitimate writing enhancement, helping people communicate 
                  more clearly, not helping anyone mislead others. We actively work to prevent misuse 
                  of our platform.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <BrainIcon className="w-6 h-6 text-[#0F4C81] shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-2">Transparent AI Detection</h3>
                <p className="text-[#475569] text-sm">
                  Our AI detector provides estimates, not definitive answers. We clearly communicate 
                  that scores are probabilistic and should not be used as proof of anything. 
                  AI detection is an imperfect science, and we're honest about that.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <HeartIcon className="w-6 h-6 text-[#28B04D] shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-2">Your Data, Your Control</h3>
                <p className="text-[#475569] text-sm">
                  We never train our models on your content without explicit consent. You can delete 
                  your data at any time, and we offer granular controls over what you share.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Ready to write better?</h2>
          <p className="text-[#475569] mb-8 max-w-xl mx-auto">
            Join hundreds of thousands of writers who use HumanWrite to communicate 
            more naturally and effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/humanizer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#28B04D] text-white font-medium rounded-lg hover:bg-[#229640] transition-colors"
            >
              Try Humanizer Free
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#0F172A] font-medium rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
