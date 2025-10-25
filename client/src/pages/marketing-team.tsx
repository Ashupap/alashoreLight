import { motion } from "framer-motion";
import { useState } from "react";
import ContactFormModal from "@/components/contact-form-modal";
import {
  Mail,
  Phone,
  Linkedin,
  Sparkles,
  TrendingUp,
  Globe2,
  Target,
  Building2,
} from "lucide-react";
import { Link } from "wouter";

const marketingTeam = [
  {
    name: "Rashmi Kanta Panda",
    title: "Head of Global Marketing",
    photo: "",
    email: "alashoremarine@gmail.com",
    phone: "+91 7381050536",
    linkedin: "",
  },
  {
    name: "Pravas Chandra Mohanty",
    title: "Export Marketing Manager",
    photo: "",
    email: "pravas@alashoremarine.com",
    phone: "+91 7978940218",
    linkedin: "https://www.linkedin.com/in/pravas-chandra-mohanty-810057ab",
  },
  {
    name: "Narendra Behera",
    title: "Export Marketing Manager",
    photo: "",
    email: "n.behera@alashoremarine.com",
    phone: "+91 7381050535",
    linkedin: "https://www.linkedin.com/in/narendrabehera",
  },
  {
    name: "Dr. Siddhartha Pati",
    title: "VP, Business Development & Marketing",
    photo: "",
    email: "directorpati@gmail.com",
    phone: "+91 8895577750",
    linkedin: "https://www.linkedin.com/in/dr-siddhartha-pati",
  },
  {
    name: "Satya Ranjan Mishra",
    title: "VP, Business Development & Marketing",
    photo: "",
    email: "alashoremarineexp@gmail.com",
    phone: "+91 6372764669",
    linkedin: "",
  },
];

const companyHighlights = [
  {
    icon: Globe2,
    label: "Global Trust",
    value: "90+ customers",
    description:
      "Trusted by importers, hospitality groups, and retailers worldwide with consistent on-time deliveries.",
  },
  {
    icon: Target,
    label: "Growth Thesis",
    value: "Demand-led expansion",
    description:
      "Insights-powered launch playbooks, sustainability storytelling, and revenue orchestration at every buyer touchpoint.",
  },
  {
    icon: Building2,
    label: "Headquarters",
    value: "Odisha · India",
    description:
      "Command centre connecting hatcheries, processing, cold-chain logistics, and global buyer ecosystems.",
  },
];

export default function MarketingTeamPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[26rem] w-[26rem] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <main className="relative">
        {/* Hero: company overview */}
        <section className="px-6 sm:px-10 lg:px-20 pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium tracking-wide uppercase">
              <Sparkles size={16} className="text-cyan-300" />
              Alashore Marine Exports · Brand Studio
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
              Crafting global trust for <span className="text-cyan-300">sustainably sourced seafood</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              From ocean-to-plate storytelling to data-driven buyer journeys, our marketing organisation amplifies the reliability and
              responsibility that Alashore Marine delivers worldwide. Scan the QR distributed at our events or media kits to reconnect with
              the team below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
          >
            {companyHighlights.map((highlight) => (
              <motion.div
                key={highlight.label}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <highlight.icon className="h-10 w-10 rounded-full bg-cyan-500/15 text-cyan-300 p-2" />
                  <div className="text-left">
                    <p className="text-[11px] uppercase tracking-widest text-slate-300">{highlight.label}</p>
                    <p className="text-lg font-semibold text-white">{highlight.value}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{highlight.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Team roster */}
        <section className="px-6 sm:px-10 lg:px-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12 space-y-4"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-cyan-300">
              Meet the Growth Architects
            </p>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-white">
              Strategists, storytellers, analysts, and partner catalysts
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Tap or hover on each card to reveal contact actions. We respond across time zones within 12 hours.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {marketingTeam.map((member, index) => {
              const photoSrc = member.photo && member.photo.trim().length > 0
                ? member.photo
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0F172A&color=F8FAFC&size=256`;
              const phoneHref = `tel:${member.phone.replace(/\s+/g, "")}`;
              const hasLinkedIn = Boolean(member.linkedin && member.linkedin.trim().length > 0);

              return (
                <motion.div
                  key={member.email}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-5 sm:p-6"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/15 via-emerald-500/10 to-slate-900/40" />
                  <div className="relative space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-2 border-white/15 shadow-lg">
                        <img
                          src={photoSrc}
                          alt={member.name}
                          loading="lazy"
                          className="h-full w-full object-cover no-aspect"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <h3 className="text-2xl font-heading font-semibold text-white">{member.name}</h3>
                        <p className="text-sm font-medium text-cyan-200">{member.title}</p>
                      </div>
                    </div>
                    <div className="pt-5 border-t border-white/5 space-y-4 text-sm text-slate-200">
                      <div className="grid grid-cols-3 gap-2">
                        <a
                          href={`mailto:${member.email}`}
                          className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/90 via-rose-500/70 to-orange-400/80 text-white py-3 transition-all hover:from-rose-500 hover:via-rose-500 hover:to-orange-400 shadow-lg shadow-rose-900/30"
                        >
                          <Mail size={18} className="text-white" />
                          <span className="mt-1 text-[11px] font-medium text-white/90">Email</span>
                        </a>
                        <a
                          href={phoneHref}
                          className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/90 via-emerald-500/70 to-lime-400/80 text-white py-3 transition-all hover:from-emerald-500 hover:via-emerald-500 hover:to-lime-400 shadow-lg shadow-emerald-900/30"
                        >
                          <Phone size={18} className="text-white" />
                          <span className="mt-1 text-[11px] font-medium text-white/90">Call</span>
                        </a>
                        {hasLinkedIn ? (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/90 via-sky-500/70 to-indigo-500/80 text-white py-3 transition-all hover:from-sky-500 hover:via-sky-500 hover:to-indigo-500 shadow-lg shadow-slate-900/30"
                          >
                            <Linkedin size={18} className="text-white" />
                            <span className="mt-1 text-[11px] font-medium text-white/90">Connect</span>
                          </a>
                        ) : (
                          <span className="flex flex-col items-center justify-center rounded-2xl bg-slate-700/40 text-slate-200/70 py-3 cursor-not-allowed">
                            <Linkedin size={18} className="text-slate-200/70" />
                            <span className="mt-1 text-[11px] font-medium">N/A</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Brand promise & showcase */}
        <section className="px-6 sm:px-10 lg:px-20 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 backdrop-blur"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-10">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-3 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                  <TrendingUp size={18} />
                  Our Brand Philosophy
                </div>
                <h2 className="text-3xl font-heading font-semibold text-white">
                  Seamless buyer journeys from hatcheries to hospitality
                </h2>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  The multidisciplinary marketing team ensures every stakeholder—importers, retailers, chefs, and end-diners—experiences
                  the same assurance of quality. Strategy sprints, content pods, and analytics cells align weekly to nurture global demand
                  and deliver traceable success stories.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-cyan-300 font-semibold text-sm">Campaign Velocity</p>
                    <p>18 simultaneous vertical plays with shared asset libraries and localised messaging.</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-cyan-300 font-semibold text-sm">Sustainability Lens</p>
                    <p>Certified narratives that highlight responsible farming, cold-chain integrity, and community uplift.</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full mx-auto lg:mx-0 flex items-center justify-center">
                <div className="relative w-full max-w-xl h-[22rem] sm:h-[24rem] lg:h-full rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
                  <img
                    src="/attached_assets/marketing-team/Website.png"
                    alt="Alashore Marine Website Preview"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href="https://alashoremarine.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-2 shadow-lg transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Closing CTA */}
        <section className="px-6 sm:px-10 lg:px-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-8 py-10 text-center"
          >
            <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-white mb-4">
              Co-create your next seafood success story with us
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Whether it’s private label development, menu collaborations, or omnichannel roll-outs, our marketing team is ready to
              collaborate. Connect for media kits, sustainability dashboards, or co-branded campaigns tailored to your market.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold px-6 py-2 shadow-lg transition-colors"
              >
                Send an Enquiry
              </button>
            </div>
          </motion.div>
        </section>
      </main>
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
