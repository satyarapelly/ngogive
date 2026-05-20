export const NGO_LOGO = '/images/GiveForSociety_logo.jpg'

export const awards = [
  { title: 'Telangana Governor’s Excellence Award 2025', organization: 'Telangana State Governor', year: '2026' },
  { title: 'Best NGO in Telangana', organization: 'TDF', year: '2020' },
  { title: 'Indian Charity Awards', organization: 'TS - Government', year: '2021' },
  { title: 'Best Women Empowerment Award', organization: 'PURE', year: '2018' },
]

export const accreditations = [
  'Registered Society under Societies Registration Act, Reg. No. 1255/2017',
  'CSR-1 Registered: CSR00059346',
  'Darpan ID: TS/2020/0250789',
  '12A Income Tax Registration',
  '80G Income Tax Registration',
  'FCRA application submitted and pending',
]

export const impact = [
  ['1,23,000+', 'Girls targeted through menstrual hygiene initiative'],
  ['275', 'Residential institutions proposed for MHM support'],
  ['8', 'Core development areas across rural Telangana'],
  ['2017', 'Established as a registered grassroots NGO'],
]

export function getSdgImagePath(number) {
  return `/assets/images/sdg/sdg-${String(number).padStart(2, '0')}.jpg`
}

export const programs = [
  {
    title: 'Education & School Infrastructure', shortTitle: 'Education', slug: 'empowering-rural-learning', icon: 'BookOpen',
    folder: '/assets/images/programs/core-area/empowering-rural-learning/',
    defaultImage: '/assets/images/programs/core-area/empowering-rural-learning/logos/empowering-rural-learning-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg', '/assets/images/programs/core-area/empowering-rural-learning/logos/empowering-rural-learning-logo.jpg'],
    sdgs: [3,4,6,10,17],
    overview: 'Strengthening government schools through classrooms, benches, STEM labs, digital learning, libraries, safe drinking water, toilets, and Back to School support.',
    beneficiaries: ['Government school students in rural and tribal areas','Adolescent girls requiring school health and hygiene support','Teachers, school administrators, and local education systems'],
    metrics: ['20+ schools proposed/upgraded','2,000+ dual desk benches','STEM labs, computer labs, libraries, RO plants, and toilets','Back to School support for vulnerable children'],
    kpis: ['Number of schools upgraded','Infrastructure units installed','Student attendance and retention improvement','Science lab and digital lab utilization','Sanitation and drinking water access improvement'],
    monitoring: ['School-wise baseline and completion checklist','Photographic evidence before/after installation','Headmaster/teacher confirmation reports','Student attendance tracking','Quarterly infrastructure functionality review'],
    activities: ['Dual desk bench distribution','Science lab and STEM setup','Computer lab and digital learning support','Library setup','RO water plants and sanitation support','Back to School kits']
  },
  {
    title: 'Menstrual Hygiene & Girls Dignity', shortTitle: 'Sthree Swabhiman', slug: 'sthree-swabhiman', icon: 'Heart',
    folder: '/assets/images/programs/core-area/sthree-swabhiman/',
    defaultImage: '/assets/images/programs/core-area/sthree-swabhiman/logos/sthree-swabhiman-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/core-area/sthree-swabhiman/logos/sthree-swabhiman-logo.jpg','/assets/images/programs/core-area/sthree-swabhiman/logos/MJPTBCWREIS_logo.jpg'],
    sdgs: [3,4,5,6,10],
    overview: 'Sthree Swabhiman promotes menstrual health, dignity, awareness, starter kits, safe disposal infrastructure, and institutional self-reliance for adolescent girls.',
    beneficiaries: ['Adolescent girls in residential schools and junior colleges','BC, SC, ST, and minority girls from underserved communities','Lady wardens, teachers, peer mentors, and school communities'],
    metrics: ['1,23,000 girls reached annually','275 institutions covered','550 incinerators proposed/installed','88,000 starter kits annually','825+ staff and peer mentors trained'],
    kpis: ['Girls reached through awareness sessions','Starter kits distributed','Incinerators installed and functional','Staff and peer mentors trained','Reduction in menstruation-related absenteeism'],
    monitoring: ['Institution-wise attendance records','Distribution registers and photo documentation','Incinerator usage logs','Baseline and follow-up surveys','Quarterly CSR progress reports'],
    activities: ['MHM awareness sessions','Sanitary napkin starter kit distribution','Incinerator installation','Warden and peer mentor training','IEC materials','Quarterly monitoring']
  },
  {
    title: 'Health & Community Well-being', shortTitle: 'Health', slug: 'health-community-wellbeing', icon: 'Stethoscope',
    folder: '/assets/images/programs/core-area/health-community-wellbeing/',
    defaultImage: '/assets/images/programs/core-area/health-community-wellbeing/logos/health-community-wellbeing-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/core-area/health-community-wellbeing/logos/arogyasetu-logo.jpg'],
    sdgs: [3,5,6,10,17],
    overview: 'Preventive healthcare, mobile medical outreach, anemia prevention, fluorosis awareness, telemedicine, and rural health education.',
    beneficiaries: ['Tribal and rural families','Pregnant and lactating women','School children and adolescent girls','Communities affected by fluorosis'],
    metrics: ['Mobile health outreach','Health camps and diagnostics','Anemia prevention support','Fluorosis awareness campaigns','Telemedicine and referral support'],
    kpis: ['People screened','Health camps conducted','Referrals completed','Women and children reached','Awareness participants'],
    monitoring: ['Camp registration records','Doctor consultation sheets','Follow-up calls','Village-wise outreach dashboard','Monthly reporting'],
    activities: ['Mobile health van services','Health and diagnostic camps','Anemia prevention','Fluorosis awareness','Telemedicine','Nutrition education']
  },
  {
    title: 'Disaster Relief & Humanitarian Response', shortTitle: 'Relief', slug: 'disaster-relief-humanitarian', icon: 'ShieldCheck',
    folder: '/assets/images/programs/core-area/disaster-relief-humanitarian/', defaultImage: '/assets/images/programs/core-area/disaster-relief-humanitarian/logos/disaster-relief-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/core-area/disaster-relief-humanitarian/logos/disaster-relief-logo.jpg'], sdgs: [1,2,3,10,17],
    overview: 'Emergency response during COVID, floods, and local crises through food, medicines, hygiene support, and community relief camps.',
    beneficiaries: ['Families affected by COVID-19','Flood-affected communities','Daily wage families','Children and elderly people'], metrics: ['COVID relief support','Flood relief camps','Food and emergency kits','Medicine support','Volunteer mobilization'],
    kpis: ['Relief kits distributed','Families supported','Relief camps conducted','Volunteers mobilized','Emergency response coverage'], monitoring: ['Beneficiary records','Photo documentation','Local confirmation','Volunteer records','Post-relief assessment'], activities: ['COVID relief','Flood relief camps','Ration distribution','Mask and sanitizer support','Emergency assistance','Rapid response']
  },
  {
    title: 'Women & Youth Empowerment', shortTitle: 'Empowerment', slug: 'women-youth-empowerment', icon: 'Users',
    folder: '/assets/images/programs/core-area/women-youth-empowerment/', defaultImage: '/assets/images/programs/core-area/women-youth-empowerment/logos/women-youth-empowerment-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/core-area/women-youth-empowerment/logos/women-youth-empowerment-logo.jpg'], sdgs: [4,5,8,10,17],
    overview: 'Building livelihoods through entrepreneurship, SHG support, vocational skills, digital skills, AI/ML learning, and youth employability.',
    beneficiaries: ['Rural women and SHGs','Unemployed youth','Young graduates','Women entrepreneurs'], metrics: ['Women entrepreneurship','Livelihood units','Youth skill development','AI/ML skilling','Career readiness'],
    kpis: ['Women trained','Youth certified','Microenterprises started','Placement outcomes','Income improvement'], monitoring: ['Training attendance','Skill assessments','Placement tracking','Enterprise follow-up','Quarterly livelihood reports'], activities: ['Tailoring training','SHG support','Employability workshops','Digital literacy','Career counseling','Leadership sessions']
  },
  {
    title: 'Integrated Learning Centers', shortTitle: 'ILCs', slug: 'integrated-learning-centers', icon: 'GraduationCap',
    folder: '/assets/images/programs/core-area/integrated-learning-centers/', defaultImage: '/assets/images/programs/core-area/integrated-learning-centers/logos/integrated-learning-centers-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/core-area/integrated-learning-centers/logos/integrated-learning-centers-logo.jpg'], sdgs: [3,4,5,8,10,11,17],
    overview: 'Rural transformation hubs combining library access, digital learning, youth skilling, women empowerment, health awareness, agriculture support, and community services.',
    beneficiaries: ['Students and aspirants','Rural youth and women','Farmers and adult learners','Families in surrounding villages'], metrics: ['5 pilot centers','50,000+ direct beneficiaries','25,000+ digital literacy learners','10,000+ youth skilled','5,000+ women empowered'],
    kpis: ['Center footfall','Library memberships','Digital literacy completions','Training participation','Community satisfaction'], monitoring: ['Monthly dashboard','Library registers','Training certificates','Community surveys','Annual reports'], activities: ['Library access','Digital kiosk services','Career guidance','Women empowerment','Health awareness','Agriculture support']
  },
  {
    title: 'Sports, Leadership & Youth Development', shortTitle: 'Sports', slug: 'sports-youth-development', icon: 'MapPin',
    folder: '/assets/images/programs/core-area/sports-youth-development/', defaultImage: '/assets/images/programs/core-area/sports-youth-development/logos/sports-youth-development-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/core-area/sports-youth-development/logos/sports-youth-development-logo.jpg'], sdgs: [3,4,5,10,17],
    overview: 'Promoting physical fitness, confidence, teamwork, leadership, and talent identification through rural sports and school-level sports support.',
    beneficiaries: ['Government school children','Rural and tribal youth','Young girls and boys','School teams and coaches'], metrics: ['Sports kits','School tournaments','Rural coaching','Youth clubs','Talent identification'],
    kpis: ['Schools covered','Students participating','Kits distributed','Coaches engaged','Tournaments conducted'], monitoring: ['Participation records','Kit distribution reports','Coach logs','Student progress cards','Event documentation'], activities: ['Sports kits','School sports events','Kabaddi/Kho-Kho/Athletics','Coaching','Mini sports centers','Progress tracking']
  },
  {
    title: 'Community Awareness & Social Action', shortTitle: 'Social Action', slug: 'community-awareness-social-action', icon: 'HandHeart',
    folder: '/assets/images/programs/core-area/community-awareness-social-action/', defaultImage: '/assets/images/programs/core-area/community-awareness-social-action/logos/community-awareness-social-action-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/core-area/community-awareness-social-action/logos/community-awareness-social-action-logo.jpg'], sdgs: [3,6,10,11,13,17],
    overview: 'Blood donation camps, awareness drives, Swachh Bharat activities, environmental campaigns, volunteerism, and local social action.',
    beneficiaries: ['Local communities','Youth volunteers and donors','Schools and villages','Awareness campaign participants'], metrics: ['Blood donation camps','Public awareness drives','Swachh Bharat campaigns','Volunteer mobilization','Village social action'],
    kpis: ['Camps conducted','Donors participated','Volunteers mobilized','People reached','Community partnerships'], monitoring: ['Camp records','Volunteer hours','Photo documentation','Partner confirmations','Feedback tracking'], activities: ['Blood donation camps','Awareness campaigns','Cleanliness drives','Volunteer engagement','Village events','Civic awareness']
  }
]
