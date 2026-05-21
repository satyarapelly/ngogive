import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, ChevronDown, ClipboardCheck, FileText, Heart, Image as ImageIcon, Menu, ShieldCheck, Target, X } from 'lucide-react'
import { NGO_LOGO, accreditations, awardGallery, awards, getSdgImagePath, impact, mouMoc, programs } from './data/programs'

function Button({ children, variant = 'primary', onClick }) {
  return <button onClick={onClick} className={`btn ${variant === 'outline' ? 'btn-outline' : 'btn-primary'}`}>{children}</button>
}

function SiteHeader({ onOpenProgram, onGoHome }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)

  return <header className="site-header">
    <div className="nav-wrap">
      <button onClick={onGoHome} className="brand">
        <img src={NGO_LOGO} alt="Give For Society" className="brand-logo" />
        <span><strong>Give For Society</strong><small>Empowering Rural Telangana</small></span>
      </button>
      <nav className="desktop-nav">
        <button onClick={onGoHome}>Home</button><a href="#about">About</a>
        <span className="nav-dropdown">
          <button onClick={() => setWorkOpen(!workOpen)}>Our Work <ChevronDown size={16}/></button>
          {workOpen && <div className="dropdown-menu">{programs.map(p => <button key={p.slug} onClick={() => {setWorkOpen(false); onOpenProgram(p.slug)}}>{p.title}</button>)}</div>}
        </span>
        <a href="#awards">Awards</a><a href="#partners">CSR Partners</a><a href="#contact">Contact</a>
      </nav>
      <div className="desktop-actions"><Button variant="outline">Partner With Us</Button><Button>Donate</Button></div>
      <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
    </div>
    {mobileOpen && <div className="mobile-panel">{programs.map(p => <button key={p.slug} onClick={() => {setMobileOpen(false); onOpenProgram(p.slug)}}>{p.title}</button>)}</div>}
  </header>
}

function Hero() {
  return <section className="hero">
    <div className="hero-bg" />
    <div className="hero-grid">
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
        <p className="pill">Registered NGO • Hyderabad, Telangana</p>
        <h1>Building dignity, education, health, and opportunity for rural communities.</h1>
        <p className="hero-text">Give For Society works with communities, government institutions, and CSR partners to create practical, scalable development programmes across Telangana.</p>
        <div className="hero-actions"><Button>Support a Cause <ArrowRight size={16}/></Button><Button variant="outline">Explore Projects</Button></div>
      </motion.div>
      <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.6,delay:.1}} className="hero-card">
        <div className="section-icon"><ShieldCheck/></div><h2>Flagship Focus</h2><p>Rural Youth & Women Development</p>
        <ul><li>Menstrual Hygiene & Dignity Initiative</li><li>Integrated Learning Centers</li><li>School infrastructure, STEM labs, sanitation</li><li>Health outreach and fluorosis awareness</li><li>Disaster relief, blood donation, social action</li></ul>
      </motion.div>
    </div>
  </section>
}

function ImpactStats(){ return <section id="impact" className="impact-band"><div className="impact-grid">{impact.map(([n,l])=><div className="metric-card" key={n}><h3>{n}</h3><p>{l}</p></div>)}</div></section> }

function About(){ return <><section id="about" className="content-section"><div className="two-col"><div><p className="eyebrow">ABOUT GIVE FOR SOCIETY</p><h2>A grassroots NGO creating long-term community transformation.</h2></div><div className="body-text"><p>Founded in 2017, Give For Society is a grassroots non-profit organization committed to empowering underserved rural and tribal communities across Telangana through sustainable development initiatives in education, health, women empowerment, youth skilling, hygiene, disaster relief, and community well-being.</p><p>The organization works closely with government institutions, schools, CSR partners, and local communities to design practical, scalable, and impact-driven programmes.</p></div></div><div className="mission-grid"><InfoCard icon={Target} title="Our Mission" items={["Empower rural, tribal, and underserved communities through sustainable initiatives in education, health, hygiene, women empowerment, youth skilling, and community development.","Create scalable, impact-driven programmes that promote dignity, equality, self-reliance, resilience, and long-term social transformation."]}/><InfoCard icon={Heart} title="Our Vision" items={["Build inclusive, healthy, educated, and self-reliant rural communities where every child, youth, and woman has access to dignity and opportunity.","Promote community-led development, institutional sustainability, youth empowerment, women leadership, and measurable grassroots impact."]}/></div></section><Awards /></> }

function Awards(){ return <section id="awards" className="gray-section"><div className="section-heading"><p className="eyebrow">AWARDS, CERTIFICATIONS & ACCREDITATIONS</p><h2>Recognition and compliance records with photo evidence.</h2><p>Explore awards, certification details, and institutional compliance highlights of Give For Society.</p></div><div className="two-card-grid"><div className="card"><h3><ImageIcon/> Awards & Recognition Photos</h3><div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:'10px',borderBottom:'1px solid #e2e8f0'}}>Photo</th><th style={{textAlign:'left',padding:'10px',borderBottom:'1px solid #e2e8f0'}}>Type</th><th style={{textAlign:'left',padding:'10px',borderBottom:'1px solid #e2e8f0'}}>Title</th><th style={{textAlign:'left',padding:'10px',borderBottom:'1px solid #e2e8f0'}}>Organization</th><th style={{textAlign:'left',padding:'10px',borderBottom:'1px solid #e2e8f0'}}>Year</th></tr></thead><tbody>{(awardGallery || []).map((item)=><tr key={item.title}><td style={{padding:'10px',borderBottom:'1px solid #f1f5f9'}}><img src={item.image} alt={item.title} style={{height:'56px',width:'56px',objectFit:'cover',borderRadius:'8px'}} /></td><td style={{padding:'10px',borderBottom:'1px solid #f1f5f9'}}>{item.type}</td><td style={{padding:'10px',borderBottom:'1px solid #f1f5f9'}}>{item.title}</td><td style={{padding:'10px',borderBottom:'1px solid #f1f5f9'}}>{item.organization}</td><td style={{padding:'10px',borderBottom:'1px solid #f1f5f9'}}>{item.year}</td></tr>)}</tbody></table></div>{(awards || []).map(a=><div className="award" key={a.title}><strong>{a.title}</strong><span>{a.organization} • {a.year}</span></div>)}</div><div className="card"><h3><ClipboardCheck/> Certifications & Compliance</h3><ul className="nice-list">{(accreditations || []).map(x=><li key={x}>{x}</li>)}</ul></div></div><div className="two-card-grid" style={{marginTop:'24px'}}><div className="card"><h3><FileText/> MoU / MoC</h3><ul className="nice-list">{(mouMoc || []).map((item)=><li key={item}>{item}</li>)}</ul></div><div className="card"><h3><ShieldCheck/> Institutional Recognition</h3><p className="body-text">State and district collaborations, recognition events, and statutory compliance records are maintained for transparent NGO operations.</p></div></div></section> }

function InfoCard({ icon: Icon, title, items }) { return <div className="card"><h3><Icon/> {title}</h3><ul className="nice-list">{items.map(i=><li key={i}>{i}</li>)}</ul></div> }

function ProgramCard({ program, onOpen }){
  const subCategories = (program.subCategories || []).slice(0, 3)
  return <div className="program-card"><div className="program-image-wrap"><img src={program.defaultImage} alt={program.title} /></div><div className="program-body"><h3>{program.title}</h3><p>{program.overview}</p><p className="subcat-title">Sub-categories of work</p><ul className="subcat-list">{subCategories.map(item => <li key={item.title}>{item.title}</li>)}</ul><div className="sdg-row">{program.sdgs.slice(0,4).map(s=><img key={s} src={getSdgImagePath(s)} alt={`SDG ${s}`} />)}</div><button className="text-link" onClick={()=>onOpen(program.slug)}>Know More <ArrowRight size={15}/></button></div></div>
}

function Work({ onOpenProgram }){ return <section id="work" className="gray-section"><div className="section-heading"><p className="eyebrow">OUR WORK</p><h2>Core areas designed for dignity, access, resilience, and opportunity.</h2></div><div className="program-grid">{programs.map(p=><ProgramCard key={p.slug} program={p} onOpen={onOpenProgram}/>)}</div></section> }

function SubCategorySection({ program }){ return <section className="content-section"><div className="section-heading"><p className="eyebrow">SUB-CATEGORIES</p><h2>{program.shortTitle} programs and projects</h2></div><div className="subcat-grid">{(program.subCategories || []).map((item) => <article key={item.title} className="subcat-tile"><div className="subcat-image-wrap"><img src={item.image} alt={item.title} /></div><div className="subcat-tile-body"><h3>{item.title}</h3><p>{item.description}</p>{item.kpiTag && <span className="subcat-kpi-tag">{item.kpiTag}</span>}{item.knowMoreLink && <a className="text-link" href={item.knowMoreLink}>Know More <ArrowRight size={14}/></a>}</div></article>)}</div></section> }

function ProgramDetail({ program, onBack }){ return <div><SiteHeader onOpenProgram={()=>{}} onGoHome={onBack}/><section className="detail-hero"><div className="detail-grid"><div><button className="back-link" onClick={onBack}>← Back to Our Work</button><p className="eyebrow orange">OUR WORK / CORE AREA</p><h1>{program.title}</h1><p>{program.overview}</p></div><div className="hero-card"><h3>Program Snapshot</h3><p>{program.shortTitle} at a glance with one featured image and key workstreams.</p><img className="detail-featured-image" src={program.defaultImage} alt={`${program.title} featured`} /></div></div></section><SubCategorySection program={program}/><section className="gray-section"><div className="three-col"><InfoCard icon={Target} title="Target Beneficiaries" items={program.beneficiaries}/><InfoCard icon={BarChart3} title="Impact Metrics" items={program.metrics}/><InfoCard icon={ClipboardCheck} title="KPIs" items={program.kpis}/></div></section><section className="content-section two-card-grid"><InfoCard icon={FileText} title="Key Activities" items={program.activities}/><InfoCard icon={ShieldCheck} title="Monitoring & Evaluation" items={program.monitoring}/></section><section className="sdg-section"><p className="eyebrow">SDG ALIGNMENT</p><h2>Aligned Sustainable Development Goals</h2><div className="big-sdgs">{program.sdgs.map(s=><img key={s} src={getSdgImagePath(s)} alt={`SDG ${s}`}/>)}</div></section><Footer/></div> }

function SDGSection(){ return <section className="content-section"><div className="sdg-panel"><div><p className="eyebrow orange">SUSTAINABLE DEVELOPMENT GOALS</p><h2>Aligned with national priorities and global goals.</h2><p>Your SDG images are loaded from: /assets/images/sdg/sdg-NN.jpg</p></div><div className="sdg-row large">{[1,2,3,4,5,6,8,10,11,13,17].map(s=><img key={s} src={getSdgImagePath(s)} alt={`SDG ${s}`}/>)}</div></div></section> }

function Partners(){ return <section id="partners" className="orange-section"><div className="two-col"><div><p className="eyebrow">CSR PARTNERSHIPS</p><h2>Partner with us to create measurable grassroots impact.</h2><p>We provide structured proposals, implementation planning, monitoring reports, utilization documentation, and field visibility for CSR partners.</p><div className="hero-actions"><Button>Request Proposal</Button><Button variant="outline">Download Profile</Button></div></div><div className="card"><ul className="nice-list"><li>Focused implementation in Telangana’s rural, tribal, and underserved districts.</li><li>Transparent monitoring, reporting, and compliance-oriented project delivery.</li><li>Community-centered model with government and institutional collaboration.</li></ul></div></div></section> }

function Contact(){
  const openContact = () => {
    window.location.href = 'mailto:giveforsociety@gmail.com?subject=Contact%20Us%20-%20Give%20For%20Society'
  }
  return <section id="contact" className="content-section"><div className="cta"><h2>Let’s build stronger rural communities together.</h2><p>For CSR partnerships, donations, volunteering, project collaboration, and field implementation support, reach out to Give For Society.</p><Button onClick={openContact}>Contact Us</Button></div></section>
}

function Footer(){ const footerOurWork=programs.slice(0,6); return <footer className="footer"><div className="footer-grid"><div><div className="footer-brand"><img src={NGO_LOGO}/><div><h3>Give For Society</h3><small>NGOGIVE</small></div></div><p>Empowering rural, tribal, and underserved communities through education, health, hygiene, women empowerment, youth skilling, disaster relief, and community development.</p></div><div><h4>About Us</h4><a href="#about">About</a><a href="#impact">Impact</a><a href="#awards">Awards & Accreditations</a><a href="#partners">CSR Partnerships</a></div><div><h4>Our Work</h4>{footerOurWork.map(p=><a key={p.slug} href="#work">{p.shortTitle}</a>)}</div><div><h4>Get Involved</h4><a>Corporate CSR</a><a>Donate</a><a>Volunteer</a><a>Request Proposal</a></div><div><h4>Contact</h4><p>A31 Flat 307, Samskruthi Township, Pocharam, Hyderabad - 500088</p><p>Phone: +91 98854 23560</p><p>Email: giveforsociety@gmail.com</p><p>Website: www.give4society.org</p></div></div><div className="footer-bottom">© 2026 Give For Society. All rights reserved. <span>Privacy Policy • Terms of Use • Annual Reports</span></div></footer> }

function Home({ onOpenProgram }){ return <><SiteHeader onOpenProgram={onOpenProgram} onGoHome={()=>{}}/><Hero/><ImpactStats/><About/><Work onOpenProgram={onOpenProgram}/><SDGSection/><Partners/><Contact/><Footer/></> }

export default function App(){ const [activeSlug,setActiveSlug]=useState(null); const activeProgram=useMemo(()=>programs.find(p=>p.slug===activeSlug),[activeSlug]); return activeProgram ? <ProgramDetail program={activeProgram} onBack={()=>setActiveSlug(null)}/> : <Home onOpenProgram={setActiveSlug}/> }
