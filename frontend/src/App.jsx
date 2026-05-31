import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  FileText,
  Heart,
  ShieldCheck,
  Target,
  CheckCircle2,
} from "lucide-react";
import {
  NGO_LOGO,
  getSdgImagePath,
  impact,
  programs,
} from "./data/programs";
import AwardsCarousel from "./components/AwardsCarousel";
import HeroCarousel from "./components/HeroCarousel";
import FiveYearVision from "./components/FiveYearVision";
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import loadRazorpayScript from "./utils/loadRazorpayScript";

function Button({ children, variant = "primary", onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant === "outline" ? "btn-outline" : "btn-primary"}`}
    >
      {children}
    </button>
  );
}

function SiteHeader({ onOpenProgram, onGoHome }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const navRef = useRef(null);

  const closeAll = () => {
    setWorkOpen(false);
    setAboutOpen(false);
  };

  useEffect(() => {
    if (!workOpen && !aboutOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) closeAll();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [workOpen, aboutOpen]);

  const goToHash = (hash) => {
    onGoHome();
    setTimeout(() => { window.location.hash = hash; }, 50);
  };

  const handleOpenProgram = (slug) => {
    closeAll();
    onOpenProgram(slug);
  };

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <button onClick={() => { closeAll(); onGoHome(); }} className="brand">
          <img src={NGO_LOGO} alt="Give For Society" className="brand-logo" />
          <span className="brand-copy">
            <strong>Give For Society</strong>
            <small>Education, Health &amp; Dignity for Every Community</small>
          </span>
        </button>

        <nav className="desktop-nav" ref={navRef}>
          <button onClick={() => { closeAll(); onGoHome(); }}>Home</button>

          <span className="nav-dropdown">
            <button onClick={() => { setAboutOpen(!aboutOpen); setWorkOpen(false); }}>
              About Us <ChevronDown size={16} />
            </button>
            {aboutOpen && (
              <div className="dropdown-menu">
                <button onClick={() => { setAboutOpen(false); goToHash("#about"); }}>Who We Are</button>
                <button onClick={() => { setAboutOpen(false); goToHash("#awards"); }}>Awards &amp; Recognition</button>
                <button onClick={() => { setAboutOpen(false); goToHash("#impact"); }}>Our Impact</button>
              </div>
            )}
          </span>

          <span className="nav-dropdown">
            <button onClick={() => { setWorkOpen(!workOpen); setAboutOpen(false); }}>
              Our Projects <ChevronDown size={16} />
            </button>
            {workOpen && (
              <div className="dropdown-menu" style={{ maxHeight: 380, overflowY: "auto" }}>
                <button onClick={() => { setWorkOpen(false); goToHash("#work"); }}>All Programmes</button>
                {programs.map((p) => (
                  <button key={p.slug} onClick={() => handleOpenProgram(p.slug)}>
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </span>

          <Link to="/support-a-cause" onClick={closeAll}>Support Us</Link>
          <Link to="/team" onClick={closeAll}>Our Team</Link>
          <a href="#contact" onClick={closeAll}>Contact Us</a>
        </nav>

        <div className="desktop-actions">
          <Button variant="outline">Partner With Us</Button>
          <Link to="/support-a-cause" className="btn btn-primary" onClick={closeAll}>
            Donate Now
          </Link>
        </div>

        <button
          type="button"
          className={`mobile-menu${mobileOpen ? " is-open" : ""}`}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => { setMobileOpen(!mobileOpen); closeAll(); }}
        >
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-panel">
          <button onClick={() => { setMobileOpen(false); onGoHome(); }}>Home</button>
          <button onClick={() => { setMobileOpen(false); goToHash("#about"); }}>About Us</button>
          <button onClick={() => { setMobileOpen(false); goToHash("#work"); }}>Our Projects</button>
          {programs.map((p) => (
            <button
              key={p.slug}
              className="mobile-panel-sub"
              onClick={() => { setMobileOpen(false); onOpenProgram(p.slug); }}
            >
              {p.title}
            </button>
          ))}
          <Link to="/support-a-cause" className="mobile-panel-link" onClick={() => setMobileOpen(false)}>
            Support Us
          </Link>
          <Link className="mobile-panel-link" to="/team" onClick={() => setMobileOpen(false)}>Our Team</Link>
          <button onClick={() => { setMobileOpen(false); window.location.hash = "#contact"; }}>Contact Us</button>
          <div className="mobile-panel-actions">
            <Button variant="outline">Partner With Us</Button>
            <Link to="/support-a-cause" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Donate Now
            </Link>
          </div>
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
        <div className="impact-with-photo">
          <div className="impact-left">
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
          <div className="impact-photo-side">
            <img
              src="/images/programs/sthree-swabhiman/photo-distribution-group.jpg"
              alt="Community welfare programme"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const pillars = [
  {
    icon: Heart,
    title: "Empowerment",
    image: "/images/programs/women-youth-empowerment/youth-employability1.jpg",
    description:
      "Enabling women, youth, and communities to lead their own development through skills, awareness, and economic opportunity at the grassroots level.",
  },
  {
    icon: BookOpen,
    title: "Education & Scholarships",
    image: "/images/programs/empowering-rural-learning/classroom-infrastructure.JPG",
    description:
      "Investing in school infrastructure, learning resources, and direct scholarship support to keep rural children in school and thriving.",
  },
  {
    icon: ShieldCheck,
    title: "Holistic Approach",
    image: "/images/programs/sthree-swabhiman/photo-distribution-group.jpg",
    description:
      "Addressing education, health, hygiene, livelihood, and disaster resilience together for sustained and measurable community transformation.",
  },
];

function About() {
  return (
    <>
      <section id="about" className="content-section">
        <div className="about-with-photo">
          <div className="about-left">
            <p className="eyebrow">ABOUT GIVE FOR SOCIETY</p>
            <h2>
              A grassroots NGO creating long-term community transformation.
            </h2>
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
            <div className="about-highlights">
              <div className="about-highlight-card"><strong>Founded</strong><span>2017</span></div>
              <div className="about-highlight-card"><strong>Focus</strong><span>Rural &amp; Tribal Communities</span></div>
              <div className="about-highlight-card"><strong>Approach</strong><span>Scalable, Impact-Driven Programmes</span></div>
            </div>
          </div>
          <div className="about-photo-side">
            <img
              src="/images/programs/sthree-swabhiman/photo-workshop-speaker.jpg"
              alt="Give For Society community workshop"
            />
          </div>
        </div>
        <div className="mission-grid">
          <div className="mission-feat-card mission-feat-card--primary">
            <div className="mission-feat-icon">
              <Target size={26} />
            </div>
            <h3>Our Mission</h3>
            <ul className="mission-feat-list">
              <li>Empower rural, tribal, and underserved communities through sustainable initiatives in education, health, hygiene, women empowerment, youth skilling, and community development.</li>
              <li>Create scalable, impact-driven programmes that promote dignity, equality, self-reliance, resilience, and long-term social transformation.</li>
            </ul>
          </div>
          <div className="mission-feat-card mission-feat-card--accent">
            <div className="mission-feat-icon">
              <Heart size={26} />
            </div>
            <h3>Our Vision</h3>
            <ul className="mission-feat-list">
              <li>Build inclusive, healthy, educated, and self-reliant rural communities where every child, youth, and woman has access to dignity and opportunity.</li>
              <li>Promote community-led development, institutional sustainability, youth empowerment, women leadership, and measurable grassroots impact.</li>
            </ul>
          </div>
        </div>
        <div className="pillars-grid" aria-label="Give For Society focus tiles">
          {pillars.map((pillar, i) => (
            <article key={pillar.title} className="pillar-feat-card">
              <div className="pillar-feat-image">
                <img src={pillar.image} alt={`${pillar.title} programme`} />
                <span className="pillar-feat-num">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="pillar-feat-body">
                <div className="pillar-feat-top">
                  <div className="pillar-feat-icon">
                    <pillar.icon size={22} />
                  </div>
                  <h3>{pillar.title}</h3>
                </div>
                <p>{pillar.description}</p>
              </div>
            </article>
          ))}
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

function ProgramCard({ program, index, onOpen }) {
  const [imageError, setImageError] = useState(false);
  const kpiMetric = (program.metrics || [])[0];

  return (
    <div className="work-card" onClick={() => onOpen(program.slug)}>
      <div className="work-card-image-wrap">
        {!imageError ? (
          <img src={program.defaultImage} alt={program.title} onError={() => setImageError(true)} />
        ) : (
          <div className="work-card-image-fallback">{program.shortTitle || program.title}</div>
        )}
        <div className="work-card-overlay">
          <button
            className="work-card-overlay-btn"
            onClick={(e) => { e.stopPropagation(); onOpen(program.slug); }}
          >
            Explore Programme
          </button>
        </div>
      </div>
      <div className="work-card-body">
        <h3 className="work-card-title">{program.title}</h3>
        <p className="work-card-desc">{program.overview}</p>
        {kpiMetric && <span className="work-card-kpi">{kpiMetric}</span>}
        <button
          className="text-link work-card-link"
          onClick={(e) => { e.stopPropagation(); onOpen(program.slug); }}
        >
          Know More <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

const VISIBLE_COUNT = 6;

function Work({ onOpenProgram }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? programs : programs.slice(0, VISIBLE_COUNT);
  const hidden = programs.length - VISIBLE_COUNT;

  return (
    <section id="work" className="work-section">
      <div className="work-section-head">
        <div>
          <p className="eyebrow">OUR WORK</p>
          <h2>Core areas designed for dignity, access, resilience, and opportunity.</h2>
        </div>
        <span className="work-count-badge">{programs.length} Core Programme Areas</span>
      </div>
      <div className="work-grid">
        {visible.map((p, i) => (
          <ProgramCard key={p.slug} program={p} index={i} onOpen={onOpenProgram} />
        ))}
      </div>
      {!showAll && hidden > 0 && (
        <div className="work-show-more">
          <button className="work-show-more-btn" onClick={() => setShowAll(true)}>
            View All Programmes
            <span className="work-show-more-count">+{hidden} more</span>
          </button>
        </div>
      )}
      {showAll && (
        <div className="work-show-more">
          <button className="work-show-more-btn work-show-more-btn--collapse" onClick={() => setShowAll(false)}>
            Show Less
          </button>
        </div>
      )}
    </section>
  );
}

function SubCategorySection({ program }) {
  return (
    <section className="content-section">
      <div className="section-heading">
        <p className="eyebrow">SUB-CATEGORIES</p>
        <h2>{program.shortTitle} programmes and projects</h2>
      </div>
      <div className="subcat-grid-new">
        {(program.subCategories || []).map((item) => (
          <article key={item.title} className="subcat-card">
            <div className="subcat-card-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="subcat-card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.kpi && <span className="subcat-kpi-badge">{item.kpi}</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgramDetail({ program, onBack, onOpenProgram }) {
  return (
    <div>
      <SiteHeader onOpenProgram={onOpenProgram} onGoHome={onBack} />

      <section className="prog-hero">
        <div className="prog-hero-inner">
          <div className="prog-hero-text">
            <button className="prog-back-link" onClick={onBack}>← All Programmes</button>
            <p className="eyebrow orange">OUR WORK / CORE AREA</p>
            <h1 className="prog-hero-h1">{program.title}</h1>
            <p className="prog-hero-overview">{program.overview}</p>
            <Link to="/support-a-cause" className="btn btn-primary">Donate to This Programme</Link>
          </div>
          <div className="prog-hero-image">
            <img src={program.defaultImage} alt={program.title} />
          </div>
        </div>
      </section>

      {(program.metrics || []).length > 0 && (
        <div className="prog-kpi-strip">
          {(program.metrics || []).slice(0, 4).map((metric) => (
            <div key={metric} className="prog-kpi-item">
              <span className="prog-kpi-text">{metric}</span>
            </div>
          ))}
        </div>
      )}

      <SubCategorySection program={program} />

      <section className="gray-section">
        <div className="prog-details-grid">
          <div>
            <InfoCard icon={Target} title="Target Beneficiaries" items={program.beneficiaries} />
            <InfoCard icon={BarChart3} title="Impact Metrics" items={program.metrics} />
          </div>
          <div>
            <InfoCard icon={FileText} title="Key Activities" items={program.activities} />
            <InfoCard icon={ShieldCheck} title="Monitoring &amp; Evaluation" items={program.monitoring} />
          </div>
        </div>
      </section>

      <section className="prog-sdg-section content-section">
        <p className="eyebrow">SDG ALIGNMENT</p>
        <h2>Aligned Sustainable Development Goals</h2>
        <div className="prog-sdg-row">
          {program.sdgs.map((s) => (
            <img key={s} src={getSdgImagePath(s)} alt={`SDG ${s}`} />
          ))}
        </div>
      </section>

      <section className="prog-donate-cta">
        <h2>Make a difference today</h2>
        <p>Support the {program.title} programme and help us create lasting change in rural communities.</p>
        <Link to="/support-a-cause" className="btn btn-primary">Donate Now</Link>
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
  const donationFormRef = useRef(null);
  const [selectedCause, setSelectedCause] = useState("");
  const [donorName, setDonorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [requiresDonorCertificate, setRequiresDonorCertificate] = useState(false);
  const [panCard, setPanCard] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState({ type: "", text: "" });

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
      image: "/assets/images/programs/empowering-rural-learning/back2-school-2.jpg",
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

  const amountOptions = ["₹500", "₹1,000", "₹2,500", "₹5,000", "₹10,000"];
  const canProceedToPayment = Boolean(
    selectedCause &&
      donorName.trim() &&
      (email.trim() || phone.trim()) &&
      amount &&
      (!requiresDonorCertificate || panCard.trim())
  );

  const handleSelectCause = (causeTitle) => {
    setSelectedCause(causeTitle);
    donationFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => donationFormRef.current?.focus(), 200);
  };

  const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
  const configuredApiFallbackBaseUrl = (import.meta.env.VITE_API_FALLBACK_BASE_URL || "").trim();
  const apiBaseUrl = configuredApiBaseUrl ? configuredApiBaseUrl.replace(/\/$/, "") : "";
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

  const fallbackApiBaseUrls = [apiBaseUrl, configuredApiFallbackBaseUrl.replace(/\/$/, "")]
    .filter((baseUrl, index, arr) => baseUrl !== undefined && baseUrl !== null && arr.indexOf(baseUrl) === index);

  const postDonationApi = async (path, payload) => {
    let lastError = null;

    for (const baseUrl of fallbackApiBaseUrls) {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const shouldFallback = (response.status === 404 || response.status === 502 || response.status === 503) && baseUrl !== fallbackApiBaseUrls[fallbackApiBaseUrls.length - 1];
          if (shouldFallback) {
            lastError = new Error(data.error || `API ${path} unavailable at ${baseUrl || "same-origin"}.`);
            continue;
          }
          throw new Error(data.error || "Request failed.");
        }

        return data;
      } catch (error) {
        lastError = error;
        if (baseUrl !== fallbackApiBaseUrls[fallbackApiBaseUrls.length - 1]) continue;
      }
    }

    if (!lastError && typeof window !== "undefined" && window.location.hostname === "localhost" && !configuredApiBaseUrl && !configuredApiFallbackBaseUrl) {
      throw new Error("Donation API is not configured for local Vite. Set VITE_API_BASE_URL to your API host (for example your Vercel/hosted domain, or local API server).");
    }

    throw lastError || new Error("Unable to reach donation API.");
  };

  const handleProceedToPayment = async (event) => {
    event.preventDefault();
    if (isProcessingPayment) return;

    const parsedAmount = Number(String(amount).replace(/[^0-9.]/g, ""));
    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();
    const emailValid = !normalizedEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    const phoneValid = !normalizedPhone || /^\d{10}$/.test(normalizedPhone);

    if (!selectedCause || !donorName.trim() || (!normalizedEmail && !normalizedPhone) || !parsedAmount || parsedAmount <= 0) {
      setPaymentMessage({ type: "error", text: "Please fill all required fields with a valid amount before proceeding." });
      return;
    }

    if (!emailValid) {
      setPaymentMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (!phoneValid) {
      setPaymentMessage({ type: "error", text: "Please enter a valid 10-digit mobile number." });
      return;
    }

    const donationPayload = {
      selectedCause,
      donorName: donorName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      amount: parsedAmount,
      message: message.trim(),
      requiresDonorCertificate,
      panCard: panCard.trim().toUpperCase(),
    };

    try {
      setIsProcessingPayment(true);
      setPaymentMessage({ type: "", text: "" });

      await loadRazorpayScript();

      const createOrderData = await postDonationApi("/api/donations/create-order", donationPayload);

      const options = {
        key: razorpayKeyId || createOrderData.razorpayKeyId,
        amount: createOrderData.amount,
        currency: createOrderData.currency,
        name: "Give For Society",
        description: donationPayload.selectedCause,
        order_id: createOrderData.orderId,
        prefill: {
          name: donationPayload.donorName,
          email: donationPayload.email,
          contact: donationPayload.phone,
        },
        notes: {
          selectedCause: donationPayload.selectedCause,
          message: donationPayload.message,
        },
        handler: async (paymentResult) => {
          try {
            const verifyData = await postDonationApi("/api/donations/verify-payment", {
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_signature: paymentResult.razorpay_signature,
              donationPayload,
            });

            if (!verifyData.verified) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setPaymentMessage({ type: "success", text: "Payment successful and verified. Thank you for your donation!" });
          } catch (verifyError) {
            setPaymentMessage({ type: "error", text: verifyError.message || "Payment verification failed." });
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            setPaymentMessage({ type: "error", text: "Payment was cancelled before completion." });
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        setIsProcessingPayment(false);
        setPaymentMessage({ type: "error", text: response.error?.description || "Payment failed. Please try again." });
      });
      paymentObject.open();
    } catch (error) {
      setIsProcessingPayment(false);
      setPaymentMessage({ type: "error", text: error.message || "Unable to start payment." });
    }
  };

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
          <article key={cause.title} className={`cause-card ${selectedCause === cause.title ? "selected" : ""}`}>
            <img src={cause.image} alt={cause.title} />
            <div className="cause-content">
              <h3>{cause.title}</h3><p>{cause.description}</p><small>{cause.impact}</small>
              <button type="button" className="btn btn-outline" onClick={() => handleSelectCause(cause.title)}>Select Cause</button>
            </div>
          </article>
        ))}
      </div>
      <div className="donation-layout">
        <div>
          <div className="amount-panel">
            <h3>Select Donation Amount</h3>
            <div className="amount-options">{amountOptions.map((amountOption) => <button type="button" key={amountOption} className={amount === amountOption ? "selected" : ""} onClick={() => setAmount(amountOption)}>{amountOption}</button>)}</div>
            <input
              type="number"
              min="1"
              className="custom-amount-input"
              placeholder="Custom Amount"
              aria-label="Custom Amount"
              value={amountOptions.includes(amount) ? "" : amount}
              onChange={(event) => setAmount(event.target.value)}
            />
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
        <div className="donor-form" id="donation-form" ref={donationFormRef} tabIndex={-1}>
          <h3>Donor Details</h3>
          <form onSubmit={handleProceedToPayment}>
            {selectedCause && <p className="selected-cause-summary"><strong>Selected Cause:</strong> {selectedCause}</p>}
            {amount && <p className="selected-cause-summary"><strong>Selected Amount:</strong> {amount}</p>}
            <input placeholder="Full Name" aria-label="Full Name" value={donorName} onChange={(event) => setDonorName(event.target.value)} />
            <input placeholder="Email" aria-label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input placeholder="Mobile Number" aria-label="Mobile Number" value={phone} onChange={(event) => setPhone(event.target.value)} />
            <input placeholder="Selected Cause" aria-label="Selected Cause" value={selectedCause} readOnly />
            <input placeholder="Amount" aria-label="Amount" value={amount} readOnly />
            <label className="consent">
              <input type="checkbox" checked={requiresDonorCertificate} onChange={(event) => setRequiresDonorCertificate(event.target.checked)} />
              I need donor certificate for tax exemption (80G).
            </label>
            {requiresDonorCertificate && (
              <input
                placeholder="PAN Card Number (Required for 80G)"
                aria-label="PAN Card Number"
                value={panCard}
                onChange={(event) => setPanCard(event.target.value.toUpperCase())}
              />
            )}
            <input placeholder="Donation Message" aria-label="Donation Message" value={message} onChange={(event) => setMessage(event.target.value)} />
            <label className="consent"><input type="checkbox" /> I agree that Give For Society may contact me through phone, email, SMS, or WhatsApp regarding donation confirmation, receipts, programme updates, and impact reports.</label>
            <Button disabled={!canProceedToPayment || isProcessingPayment}>{isProcessingPayment ? "Processing..." : "Proceed to Payment"}</Button>
            {paymentMessage.text && <p className={`payment-message ${paymentMessage.type}`}>{paymentMessage.text}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const openContact = () => {
    window.location.href =
      "mailto:contact@give4society.org?subject=Contact%20Us%20-%20Give%20For%20Society";
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

function SvgFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function SvgTwitterX() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function SvgInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function SvgLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function SvgYouTube() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

const teamMembers = [
  {
    name: "Satya Rapelly",
    role: "Founder & President",
    category: "Leadership",
    image: "assets/images/teamsatya.jpeg",
    bio: "Satya brings 25 years of software-industry experience to initiatives that empower rural youth and women through technology-led education and a grounded understanding of rural socio-economic needs.",
  },
  {
    name: "Sajesh Rao Erabelli",
    role: "Project Lead – Financial Operations",
    category: "Leadership",
    image: "assets/images/teamsajesh.jpeg",
    bio: "Sajesh combines banking-sector experience in India with business and data-science expertise to support child education, upskilling, and financial operations for Give For Society.",
  },
  {
    name: "Sunitha Madhav",
    role: "Women Wing – Operations and Coordinator",
    category: "Operations",
    image: "assets/images/teamvalentina.jpeg",
    bio: "Sunitha supports women-focused programs with an education-first approach to socio-economic growth, community participation, and stronger local coordination.",
  },
  {
    name: "Balu Chedurupally",
    role: "Project Engineer, GIVE NGO, USA",
    category: "Operations",
    image: "assets/images/teambalu.jpeg",
    bio: "Balu uses his computer-science background and software experience to advance technology-enabled education and CDLC programs for rural communities.",
  },
  {
    name: "Venu Madhav Mamidoju",
    role: "Director of Onshore Operations, GIVE NGO, USA",
    category: "Leadership",
    image: "assets/images/teamvenu.jpeg",
    bio: "Venu blends IT software-development experience with insight into rural education and livelihood challenges to guide youth empowerment and CDLC innovation.",
  },
  {
    name: "Rajanish Reddy Karla",
    role: "Director, GIVE NGO, USA",
    category: "Leadership",
    image: "assets/images/teamrrk.jpg",
    bio: "Rajanish brings project-management and technical ideation experience to strategies that improve educational access and growth opportunities in rural communities.",
  },
  {
    name: "Abhishek Ganta",
    role: "Project Lead for CDLC",
    category: "CDLC Team",
    image: "assets/images/teamabhi.jpeg",
    bio: "Abhishek applies his technology background, software-industry exposure, and understanding of rural issues to design practical empowerment solutions.",
  },
  {
    name: "Chandrashekar Reddy",
    role: "Project Engineer – CDLC, GIVE NGO",
    category: "CDLC Team",
    image: "assets/images/teamchandu.jpeg",
    bio: "Chandrashekar supports farming communities and CDLC delivery with practical solutions rooted in rural agricultural needs and sustainability.",
  },
  {
    name: "Arun Kumar Pillalamarri",
    role: "General Secretary, GIVE NGO",
    category: "Leadership",
    image: "assets/images/teamarun.jpg",
    bio: "Arun leads offshore operations with strong administrative capability and long-standing involvement in education, health, hygiene, and ground-level execution.",
  },
  {
    name: "Sai Krishna Chilukuri",
    role: "Director, Operation Lead for CDLC, Telangana",
    category: "CDLC Team",
    image: "assets/images/teamsaikrishna.jpeg",
    bio: "Sai Krishna leads education programs for rural and tribal communities in Telangana, including Back to School efforts that support underprivileged students.",
  },
  {
    name: "Parshu Ram Goud",
    role: "Project Engineer for CDLC",
    category: "CDLC Team",
    image: "assets/images/teamparshu.jpg",
    bio: "Parshu Ram leverages software-engineering experience and a commitment to rural development to address social backwardness through technology-enabled initiatives.",
  },
  {
    name: "Sai Eshwar Reddy",
    role: "Project Engineer, CDLC, GIVE NGO",
    category: "CDLC Team",
    image: "assets/images/teamsai.jpeg",
    bio: "Sai Eshwar focuses on reducing the rural-urban technology gap through CDLC upskilling and pathways for opportunity among rural youth.",
  },
  {
    name: "Akhilesh Reddy Kasani",
    role: "Treasurer, GIVE NGO, Telangana",
    category: "Finance",
    image: "assets/images/teamakhilesh.jpeg",
    bio: "Akhilesh helps bring education projects to life from the ground up and supports Back to School programs for underprivileged students.",
  },
  {
    name: "Mahipal Reddy",
    role: "Project Engineer for CDLC",
    category: "CDLC Team",
    image: "assets/images/teammahipal.jpg",
    bio: "Mahipal contributes grassroots knowledge of farmer issues and introduces practical techniques that support rural farming communities.",
  },
  {
    name: "Bhanu Goud Bathini",
    role: "Project Engineer, CDLC, GIVE NGO",
    category: "CDLC Team",
    image: "assets/images/teamBhanu.jpg",
    bio: "Bhanu pairs software-engineering expertise with rural community insight to design applications for empowerment and development.",
  },
  {
    name: "Raju Mokide",
    role: "Project Engineer, CDLC, GIVE NGO",
    category: "CDLC Team",
    image: "assets/images/teamraju.jpeg",
    bio: "Raju combines software engineering with knowledge of rural socio-political landscapes to build applications and awareness initiatives for communities.",
  },
  {
    name: "Mohd Altaf Ur Rahman",
    role: "Project Engineer, GIVE NGO, USA",
    category: "CDLC Team",
    image: "assets/images/teamaltaf.jpg",
    bio: "Altaf brings IT and project-management experience to educational challenges in rural areas, creating practical solutions with a community-development focus.",
  },
  {
    name: "Mohammed Abdul Hakim",
    role: "Financial Operations Lead, CDLC, GIVE NGO",
    category: "Finance",
    image: "assets/images/teamHakim.jpg",
    bio: "Hakim brings MBA training and 15 years of social-activity experience in rural development to financial operations and youth-empowerment initiatives.",
  },
];

const socialLinks = [
  { label: "Facebook", Icon: SvgFacebook, href: "https://www.facebook.com/NgoGive" },
  { label: "Twitter / X", Icon: SvgTwitterX, href: "https://x.com/Give4Society" },
  { label: "Instagram", Icon: SvgInstagram, href: "https://www.instagram.com/ngogive/" },
  { label: "LinkedIn", Icon: SvgLinkedIn, href: "https://www.linkedin.com/company/ngogive/" },
  { label: "YouTube", Icon: SvgYouTube, href: "https://www.youtube.com/@ngoGIVE" },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <img src={NGO_LOGO} alt="Give For Society" className="footer-logo" />
            <div>
              <h3>Give For Society</h3>
            </div>
          </div>
          <p>
            Empowering rural, tribal, and underserved communities through
            education, health, hygiene, women empowerment, youth skilling,
            disaster relief, and community development.
          </p>
          <div className="footer-social">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <s.Icon />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="#about">About Us</a>
          <a href="#impact">Our Impact</a>
          <Link to="/team">Our Team</Link>
          <a href="#awards">Awards &amp; Recognition</a>
          <a href="#partners">CSR Partnerships</a>
          <a href="#contact">Contact Us</a>
        </div>
        <div>
          <h4>Our Projects</h4>
          {programs.map((p) => (
            <a key={p.slug} href="#work">
              {p.shortTitle}
            </a>
          ))}
        </div>
        <div>
          <h4>Get Involved</h4>
          <a href="#partners">Corporate CSR</a>
          <Link to="/support-a-cause">Donate Now</Link>
          <a href="#contact">Volunteer</a>
          <a href="#contact">Request Proposal</a>
          <a href="#contact">Partner With Us</a>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Flat 307, A31-Block, Samskruthi Township, Pocharam, Hyderabad – 500088</p>
          <p>Phone: +91 80089 81069</p>
          <p>Email: contact@give4society.org</p>
          <p>Website: www.give4society.org</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Give For Society. All rights reserved.
        <span>Privacy Policy • Terms of Use • Annual Reports</span>
      </div>
    </footer>
  );
}


function Home({ onOpenProgram, onOpenDonations }) {
  return (
    <>
      <SiteHeader onOpenProgram={onOpenProgram} onGoHome={() => {}} />
      <HeroCarousel />
      <ImpactStats />
      <About />
      <Work onOpenProgram={onOpenProgram} />
      <FiveYearVision />
      <SDGSection />
      <Contact />
      <Footer />
    </>
  );
}

function TeamPage() {
  const navigate = useNavigate();

  return (
    <>
      <SiteHeader onOpenProgram={(slug) => navigate(`/programs/${slug}`)} onGoHome={() => navigate("/")} />
      <section className="team-hero">
        <div className="team-hero-bg" />
        <div className="team-hero-content">
          <p className="pill">Registered NGO • Hyderabad, Telangana</p>
          <h1>Meet the people building dignity and opportunity.</h1>
          <p>
            Our leadership, operations, and program teams bring technology, education,
            finance, and field experience together for rural communities across Telangana.
          </p>
          <div className="team-hero-actions">
            <Link className="btn btn-primary" to="/support-a-cause">Support a Cause</Link>
            <Link className="btn btn-outline" to="/#work">Explore Projects</Link>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="section-heading team-intro">
          <p className="eyebrow">People behind the purpose</p>
          <h2>Meet the GIVE NGO leadership and program team</h2>
          <p>
            Our team brings together technology professionals, educators, finance leaders,
            field coordinators, and rural-development practitioners. Together, they drive
            GIVE NGO programs across education, women empowerment, CDLC, youth upskilling,
            and community development.
          </p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <article className="team-card" key={member.name}>
              <div className="team-card-image">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-card-content">
                <span>{member.category}</span>
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
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
  return (
    <ProgramDetail
      program={program}
      onBack={() => navigate("/")}
      onOpenProgram={(s) => navigate(`/programs/${s}`)}
    />
  );
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
        <Route path="/team" element={<TeamPage />} />
        <Route path="/team.html" element={<TeamPage />} />
        <Route path="/programs/:slug" element={<ProgramDetailRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
