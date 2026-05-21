import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  FileText,
  Heart,
  Menu,
  ShieldCheck,
  Target,
  X,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";
import {
  NGO_LOGO,
  getSdgImagePath,
  impact,
  programs,
} from "./data/programs";
import AwardsCarousel from "./components/AwardsCarousel";
import InstitutionalRecognition from "./components/InstitutionalRecognition";
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

function Button({ children, variant = "primary", onClick }) {
  return (
    <button
      onClick={onClick}
      className={`btn ${variant === "outline" ? "btn-outline" : "btn-primary"}`}
    >
      {children}
    </button>
  );
}

function SiteHeader({ onOpenProgram, onGoHome }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <button onClick={onGoHome} className="brand">
          <img src={NGO_LOGO} alt="Give For Society" className="brand-logo" />
          <span>
            <strong>Give For Society</strong>
            <small>Empowering Rural Telangana</small>
          </span>
        </button>
        <nav className="desktop-nav">
          <button onClick={onGoHome}>Home</button>
          <a href="#about">About</a>
          <span className="nav-dropdown">
            <button onClick={() => setWorkOpen(!workOpen)}>
              Our Work <ChevronDown size={16} />
            </button>
            {workOpen && (
              <div className="dropdown-menu">
                <button
                  onClick={() => {
                    setWorkOpen(false);
                    onGoHome();
                    window.location.hash = "#work";
                  }}
                >
                  Core Areas
                </button>
                {programs.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => {
                      setWorkOpen(false);
                      onOpenProgram(p.slug);
                    }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </span>
          <a href="#partners">CSR Partners</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="desktop-actions">
          <Button variant="outline">Partner With Us</Button>
          <Link to="/support-a-cause" className="btn btn-primary">Donate</Link>
        </div>
        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
      {mobileOpen && (
        <div className="mobile-panel">
          {programs.map((p) => (
            <button
              key={p.slug}
              onClick={() => {
                setMobileOpen(false);
                onOpenProgram(p.slug);
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero({ onOpenDonations }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="pill">Registered NGO • Hyderabad, Telangana</p>
          <h1>
            Building dignity, education, health, and opportunity for rural
            communities.
          </h1>
          <p className="hero-text">
            Give For Society works with communities, government institutions,
            and CSR partners to create practical, scalable development
            programmes across Telangana.
          </p>
          <div className="hero-actions">
            <Button onClick={onOpenDonations}>
              Support a Cause <ArrowRight size={16} />
            </Button>
            <a className="btn btn-outline" href="#work">Explore Projects</a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hero-card"
        >
          <div className="section-icon">
            <ShieldCheck />
          </div>
          <h2>Flagship Focus</h2>
          <p>Rural Youth & Women Development</p>
          <ul>
            <li><a className="hero-focus-link" href="#work">Education & School Infrastructure</a></li>
            <li><a className="hero-focus-link" href="#work">Menstrual Hygiene & Girls Dignity</a></li>
            <li><a className="hero-focus-link" href="#work">Women & Youth Empowerment</a></li>
            <li><a className="hero-focus-link" href="#work">Integrated Learning Centers</a></li>
            <li><a className="hero-focus-link" href="#work">Health & Community Well-being</a></li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function ImpactStats() {
  return (
    <section id="impact" className="impact-band">
      <div className="impact-wrap">
        <div className="impact-header">
          <p className="eyebrow">OUR IMPACT</p>
          <h2>Transforming lives at scale through sustained grassroots action.</h2>
          <p>
            Inspired by high-credibility NGO storytelling, this section highlights
            measurable outcomes delivered through programmes in menstrual hygiene,
            school development, and community health.
          </p>
        </div>
        <div className="impact-grid">
          {impact.map((item) => (
            <article className="metric-card" key={item.number + item.label}>
              <h3>{item.number}</h3>
              <h4>{item.label}</h4>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <>
      <section id="about" className="content-section">
        <div className="two-col about-grid">
          <div className="about-intro">
            <p className="eyebrow">ABOUT GIVE FOR SOCIETY</p>
            <h2>
              A grassroots NGO creating long-term community transformation.
            </h2>
          </div>
          <div className="body-text about-body">
            <p>
              Founded in 2017, Give For Society is a grassroots non-profit
              organization committed to empowering underserved rural and tribal
              communities across Telangana through sustainable development
              initiatives in education, health, women empowerment, youth
              skilling, hygiene, disaster relief, and community well-being.
            </p>
            <p>
              The organization works closely with government institutions,
              schools, CSR partners, and local communities to design practical,
              scalable, and impact-driven programmes.
            </p>
          </div>
        </div>
        <div className="about-highlights">
          <div className="about-highlight-card"><strong>Founded</strong><span>2017</span></div>
          <div className="about-highlight-card"><strong>Focus</strong><span>Rural & Tribal Communities</span></div>
          <div className="about-highlight-card"><strong>Approach</strong><span>Scalable, Impact-Driven Programmes</span></div>
        </div>
        <div className="mission-grid">
          <InfoCard
            icon={Target}
            title="Our Mission"
            items={[
              "Empower rural, tribal, and underserved communities through sustainable initiatives in education, health, hygiene, women empowerment, youth skilling, and community development.",
              "Create scalable, impact-driven programmes that promote dignity, equality, self-reliance, resilience, and long-term social transformation.",
            ]}
          />
          <InfoCard
            icon={Heart}
            title="Our Vision"
            items={[
              "Build inclusive, healthy, educated, and self-reliant rural communities where every child, youth, and woman has access to dignity and opportunity.",
              "Promote community-led development, institutional sustainability, youth empowerment, women leadership, and measurable grassroots impact.",
            ]}
          />
        </div>
      </section>
      <Awards />
    </>
  );
}

function Awards() {
  return (
    <section id="awards" className="gray-section">
      <div className="section-heading">
        <p className="eyebrow">AWARDS & ACCREDITATIONS</p>
        <h2>Recognition records with photo evidence.</h2>
        <p>
          Explore awards and institutional recognition highlights of Give For
          Society.
        </p>
      </div>
      <div className="two-card-grid">
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <AwardsCarousel />
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, items }) {
  return (
    <div className="card">
      <h3>
        <Icon /> {title}
      </h3>
      <ul className="nice-list">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

function ProgramCard({ program, onOpen }) {
  const subCategories = (program.subCategories || []).slice(0, 3);
  const [imageError, setImageError] = useState(false);
  return (
    <div className="program-card">
      <div className="program-image-wrap" aria-hidden={imageError}>
        {!imageError ? (
          <img
            src={program.defaultImage}
            alt={program.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="program-image-fallback" role="img" aria-label={`${program.title} image placeholder`}>
            <span>{program.shortTitle || program.title}</span>
          </div>
        )}
      </div>
      <div className="program-body">
        <h3 className="program-title">{program.title}</h3>
        <p className="program-description">{program.overview}</p>
        <p className="subcat-title">Sub-categories of work</p>
        <ul className="subcat-list">
          {subCategories.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>
        <button className="text-link program-button" onClick={() => onOpen(program.slug)}>
          Know More <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function Work({ onOpenProgram }) {
  return (
    <section id="work" className="gray-section">
      <div className="section-heading">
        <p className="eyebrow">OUR WORK</p>
        <h2>
          Core areas designed for dignity, access, resilience, and opportunity.
        </h2>
      </div>
      <div className="program-grid">
        {programs.map((p) => (
          <ProgramCard key={p.slug} program={p} onOpen={onOpenProgram} />
        ))}
      </div>
    </section>
  );
}

function SubCategorySection({ program }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">SUB-CATEGORIES</p>
        <h2>{program.shortTitle} programs and projects</h2>
      </div>
      <div className="subcat-grid">
        {(program.subCategories || []).map((item) => (
          <article key={item.title} className="subcat-tile">
            <div className="subcat-image-wrap">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="subcat-tile-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.kpiTag && (
                <span className="subcat-kpi-tag">{item.kpiTag}</span>
              )}
              {item.knowMoreLink && (
                <a className="text-link" href={item.knowMoreLink}>
                  Know More <ArrowRight size={14} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgramDetail({ program, onBack }) {
  return (
    <div>
      <SiteHeader onOpenProgram={() => {}} onGoHome={onBack} />
      <section className="detail-hero">
        <div className="detail-grid">
          <div>
            <button className="back-link" onClick={onBack}>
              ← Back to Our Work
            </button>
            <p className="eyebrow orange">OUR WORK / CORE AREA</p>
            <h1>{program.title}</h1>
            <p>{program.overview}</p>
          </div>
          <div className="hero-card">
            <h3>Program Snapshot</h3>
            <p>
              {program.shortTitle} at a glance with one featured image and key
              workstreams.
            </p>
            <img
              className="detail-featured-image"
              src={program.defaultImage}
              alt={`${program.title} featured`}
            />
          </div>
        </div>
      </section>
      <SubCategorySection program={program} />
      <section className="gray-section">
        <div className="three-col">
          <InfoCard
            icon={Target}
            title="Target Beneficiaries"
            items={program.beneficiaries}
          />
          <InfoCard
            icon={BarChart3}
            title="Impact Metrics"
            items={program.metrics}
          />
          <InfoCard icon={ClipboardCheck} title="KPIs" items={program.kpis} />
        </div>
      </section>
      <section className="content-section two-card-grid">
        <InfoCard
          icon={FileText}
          title="Key Activities"
          items={program.activities}
        />
        <InfoCard
          icon={ShieldCheck}
          title="Monitoring & Evaluation"
          items={program.monitoring}
        />
      </section>
      <section className="sdg-section">
        <p className="eyebrow">SDG ALIGNMENT</p>
        <h2>Aligned Sustainable Development Goals</h2>
        <div className="big-sdgs">
          {program.sdgs.map((s) => (
            <img key={s} src={getSdgImagePath(s)} alt={`SDG ${s}`} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function SDGSection() {
  return (
    <section className="content-section">
      <div className="sdg-panel">
        <div>
          <p className="eyebrow orange">SUSTAINABLE DEVELOPMENT GOALS</p>
          <h2>Aligned with national priorities and global goals.</h2>
          <p>Your SDG images are loaded from: /assets/images/sdg/sdg-NN.jpg</p>
        </div>
        <div className="sdg-row large">
          {[1, 2, 3, 4, 5, 6, 8, 10, 11, 13, 17].map((s) => (
            <img key={s} src={getSdgImagePath(s)} alt={`SDG ${s}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section id="partners" className="orange-section">
      <div className="two-col">
        <div>
          <p className="eyebrow">CSR PARTNERSHIPS</p>
          <h2>Partner with us to create measurable grassroots impact.</h2>
          <p>
            We provide structured proposals, implementation planning, monitoring
            reports, utilization documentation, and field visibility for CSR
            partners.
          </p>
          <div className="hero-actions">
            <Button>Request Proposal</Button>
            <Button variant="outline">Download Profile</Button>
          </div>
        </div>
        <div className="card">
          <ul className="nice-list">
            <li>
              Focused implementation in Telangana’s rural, tribal, and
              underserved districts.
            </li>
            <li>
              Transparent monitoring, reporting, and compliance-oriented project
              delivery.
            </li>
            <li>
              Community-centered model with government and institutional
              collaboration.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}



function SupportCauseSection() {
  const causes = [
    {
      title: "Sthree Swabhiman – Menstrual Hygiene & Girls Dignity",
      description: "Support dignity-led menstrual health education and safe hygiene access for adolescent girls in schools and hostels.",
      impact: "Impact: safer periods, improved attendance, stronger confidence.",
      image: "/assets/images/programs/sthree-swabhiman/photo-distribution-group.jpg",
    },
    {
      title: "Education & School Infrastructure",
      description: "Enable classrooms, school essentials, learning kits, and child-friendly spaces for government school students.",
      impact: "Impact: better learning conditions and school retention.",
      image: "/assets/images/programs/empowering-rural-learning/IMG_4802.JPG",
    },
    {
      title: "Health & Community Well-being",
      description: "Contribute to preventive camps, health awareness, and community outreach for vulnerable families.",
      impact: "Impact: early care, awareness, and healthier communities.",
      image: "/assets/images/programs/sthree-swabhiman/photo-iec-poster.jpg",
    },
    {
      title: "Disaster Relief & Humanitarian Response",
      description: "Help deliver emergency food, hygiene, and basic support during floods, heatwaves, and local crises.",
      impact: "Impact: timely relief and protection for affected families.",
      image: "/assets/images/programs/sthree-swabhiman/photo-group-poster.jpg",
    },
    {
      title: "Women & Youth Empowerment",
      description: "Back skills, entrepreneurship, and livelihoods that improve economic resilience for women and young people.",
      impact: "Impact: enhanced livelihoods and self-reliance.",
      image: "/assets/images/programs/sthree-swabhiman/photo-workshop-speaker.jpg",
    },
    { title: "Integrated Learning Centers", description: "Strengthen rural learning hubs that combine libraries, digital support, guidance, and local development services.", impact: "Impact: inclusive access to knowledge and opportunities.", image: "/assets/images/programs/empowering-rural-learning/IMG_4753.JPG" },
    { title: "Farmer Empowerment & Sustainable Agriculture", description: "Support training, farmer groups, and livelihood recovery for small and marginal farmers.", impact: "Impact: climate-resilient agriculture and income stability.", image: "/assets/images/programs/empowering-rural-learning/IMG_4732.JPG" },
    { title: "Community Awareness & Social Action", description: "Fuel blood donation drives, social campaigns, and civic participation across Telangana communities.", impact: "Impact: stronger social responsibility and local action.", image: "/assets/images/programs/sthree-swabhiman/photo-marathon-awareness.jpg" },
  ];

  const trustItems = ["Registered NGO since 2017", "CSR-1 Registered", "Darpan Registered", "12A & 80G Certified", "Field implementation reports", "Photo documentation and utilization certificates"];

  return (
    <section className="support-cause-section">
      <div className="support-hero">
        <p className="eyebrow orange">GIVE FOR SOCIETY DONATIONS</p>
        <h2>Support a Cause</h2>
        <p>Your contribution helps Give For Society strengthen education, health, dignity, livelihoods, disaster relief, and rural transformation across underserved communities in Telangana.</p>
        <Button>Donate Now</Button>
      </div>
      <div className="cause-grid">
        {causes.map((cause) => (
          <article key={cause.title} className="cause-card">
            <img src={cause.image} alt={cause.title} />
            <div className="cause-content">
              <h3>{cause.title}</h3><p>{cause.description}</p><small>{cause.impact}</small>
              <Link to="/support-a-cause" className="btn btn-outline">Select Cause</Link>
            </div>
          </article>
        ))}
      </div>
      <div className="donation-layout">
        <div>
          <div className="amount-panel">
            <h3>Select Donation Amount</h3>
            <div className="amount-options">{["₹500", "₹1,000", "₹2,500", "₹5,000", "₹10,000", "Custom Amount"].map((amount) => <button key={amount}>{amount}</button>)}</div>
          </div>
          <div className="tax-box">
            <h4>80G Tax Benefit</h4><p>Your contribution may be eligible for tax benefits under Section 80G as per applicable Income Tax rules. Donation receipt and 80G certificate will be shared after successful contribution and verification.</p>
            <p><strong>PAN:</strong> AADAG7386BF</p><p><strong>80G Registration:</strong> AADAG7386BF20231</p><p><strong>12A Registration:</strong> AADAG7386BE20231</p>
          </div>
          <div className="bank-box">
            <h4>Bank Transfer / Direct Donation</h4>
            <p><strong>Account Name:</strong> Give For Society</p><p><strong>Bank:</strong> HDFC</p><p><strong>Account Number:</strong> 50200085716044</p><p><strong>IFSC:</strong> HDFC0004854</p><p><strong>Branch:</strong> Pragathi Nagar</p>
          </div>
          <div className="trust-grid">{trustItems.map((item) => <div key={item} className="trust-card"><CheckCircle2 size={18} /> {item}</div>)}</div>
          <div className="impact-list"><h4>Donation Impact Examples</h4><ul><li>₹500 can support awareness materials for school girls</li><li>₹1,000 can support hygiene education and student materials</li><li>₹2,500 can support school kit or health camp outreach</li><li>₹5,000 can support community awareness or relief assistance</li><li>₹10,000 can support infrastructure, kits, or field implementation</li></ul></div>
          <div className="impact-list"><h4>Important Notes</h4><ul><li>Receipts will be issued after verification</li><li>PAN is required for 80G receipt</li><li>Donations are used for selected cause or similar urgent need</li><li>For CSR partnerships, contact Give For Society directly</li></ul></div>
        </div>
        <div className="donor-form" id="donation-form">
          <h3>Donor Details</h3>
          <form>
            {["Full Name","Email","Mobile Number","PAN Number","Address","City","State","Pincode","Donation Purpose","Amount"].map((field) => <input key={field} placeholder={field} aria-label={field} />)}
            <label className="consent"><input type="checkbox" /> I agree that Give For Society may contact me through phone, email, SMS, or WhatsApp regarding donation confirmation, receipts, programme updates, and impact reports.</label>
            <Button>Submit Donation Interest</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const openContact = () => {
    window.location.href =
      "mailto:giveforsociety@gmail.com?subject=Contact%20Us%20-%20Give%20For%20Society";
  };
  return (
    <section id="contact" className="content-section">
      <div className="cta">
        <h2>Let’s build stronger rural communities together.</h2>
        <p>
          For CSR partnerships, donations, volunteering, project collaboration,
          and field implementation support, reach out to Give For Society.
        </p>
        <Button onClick={openContact}>Contact Us</Button>
      </div>
    </section>
  );
}

function Footer() {
  const footerOurWork = programs;
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <img src={NGO_LOGO} />
            <div>
              <h3>Give For Society</h3>
              <small>NGOGIVE</small>
            </div>
          </div>
          <p>
            Empowering rural, tribal, and underserved communities through
            education, health, hygiene, women empowerment, youth skilling,
            disaster relief, and community development.
          </p>
        </div>
        <div>
          <h4>About Us</h4>
          <a href="#about">About</a>
          <a href="#impact">Impact</a>
          <a href="#awards">Awards & Accreditations</a>
          <a href="#institutional-recognition">MoUs & Recognition</a>
          <a href="#partners">CSR Partnerships</a>
        </div>
        <div>
          <h4>Our Work</h4>
          {footerOurWork.map((p) => (
            <a key={p.slug} href="#work">
              {p.shortTitle}
            </a>
          ))}
        </div>
        <div>
          <h4>Get Involved</h4>
          <a>Corporate CSR</a>
          <a>Donate</a>
          <a>Volunteer</a>
          <a>Request Proposal</a>
        </div>
        <div>
          <h4>Contact</h4>
          <p>A31 Flat 307, Samskruthi Township, Pocharam, Hyderabad - 500088</p>
          <p>Phone: +91 98854 23560</p>
          <p>Email: giveforsociety@gmail.com</p>
          <p>Website: www.give4society.org</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Give For Society. All rights reserved.{" "}
        <span>Privacy Policy • Terms of Use • Annual Reports</span>
      </div>
    </footer>
  );
}

function Home({ onOpenProgram, onOpenDonations }) {
  return (
    <>
      <SiteHeader onOpenProgram={onOpenProgram} onGoHome={() => {}} />
      <Hero onOpenDonations={onOpenDonations} />
      <ImpactStats />
      <About />
      <Work onOpenProgram={onOpenProgram} />
      <InstitutionalRecognition />
      <SDGSection />
      <Partners />
            <Contact />
      <Footer />
    </>
  );
}

function HomePageRoute() {
  const navigate = useNavigate();
  return <Home onOpenProgram={(slug) => navigate(`/programs/${slug}`)} onOpenDonations={() => navigate("/support-a-cause")} />;
}

function ProgramDetailRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const program = useMemo(() => programs.find((p) => p.slug === slug), [slug]);
  if (!program) return <HomePageRoute />;
  return <ProgramDetail program={program} onBack={() => navigate("/")} />;
}

function SupportCausePage() {
  const navigate = useNavigate();
  return (
    <>
      <SiteHeader onOpenProgram={(slug) => navigate(`/programs/${slug}`)} onGoHome={() => navigate("/")} />
      <SupportCauseSection />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePageRoute />} />
        <Route path="/support-a-cause" element={<SupportCausePage />} />
        <Route path="/programs/:slug" element={<ProgramDetailRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
