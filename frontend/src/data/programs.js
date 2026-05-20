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



const makeSubCategory = (programSlug, slug, title, description, kpi) => ({
  title,
  image: `/assets/images/programs/${programSlug}/${slug}.jpg`,
  description,
  kpi,
})

export function getSdgImagePath(number) {
  return `/assets/images/sdg/sdg-${String(number).padStart(2, '0')}.jpg`
}

export const programs = [
  {
    title: 'Education & School Infrastructure', shortTitle: 'Education', slug: 'empowering-rural-learning', icon: 'BookOpen',
    folder: '/assets/images/programs/empowering-rural-learning/',
    defaultImage: '/assets/images/programs/empowering-rural-learning/logos/empowering-rural-learning-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg', '/assets/images/programs/empowering-rural-learning/logos/empowering-rural-learning-logo.jpg'],
    sdgs: [3,4,6,10,17],
    subCategories: [
      makeSubCategory('empowering-rural-learning', 'classroom-infrastructure', 'Classroom Infrastructure', 'Upgrading school spaces with desks, repairs, and essentials for safe learning.', '20+ schools upgraded'),
      makeSubCategory('empowering-rural-learning', 'stem-labs', 'STEM & Science Labs', 'Hands-on science and STEM lab support to improve practical learning outcomes.', 'Lab utilization improved'),
      makeSubCategory('empowering-rural-learning', 'digital-learning', 'Digital Learning', 'Digital tools and computer access to build modern learning skills.', '2,000+ students supported'),
      makeSubCategory('empowering-rural-learning', 'school-wash', 'School WASH', 'Clean water, toilets, and hygiene facilities to support attendance and dignity.', 'Safe WASH facilities added'),
      makeSubCategory('empowering-rural-learning', 'back-to-school', 'Back to School', 'Learning kits and support that help vulnerable children return to school.', 'Return-to-school support delivered'),
      {
        title: 'School Sports Kits',
        image: '/assets/images/programs/empowering-rural-learning/school-sports-kits.jpg',
        description: 'Equipment support that enables regular sports participation in schools.',
      },
      {
        title: 'Rural Sports Training',
        image: '/assets/images/programs/empowering-rural-learning/rural-sports-training.jpg',
        description: 'Structured rural coaching to build fitness, skills, and confidence.',
      },
      {
        title: 'School Tournaments',
        image: '/assets/images/programs/empowering-rural-learning/school-tournaments.jpg',
        description: 'Inter-school tournaments that encourage participation and talent identification.',
      },
      {
        title: 'Student Leadership & Fitness',
        image: '/assets/images/programs/empowering-rural-learning/student-leadership-fitness.jpg',
        description: 'Leadership-building activities through sports and teamwork to improve student confidence and wellbeing.',
      },
    ],
    overview: 'Strengthening government schools through classrooms, benches, STEM labs, digital learning, libraries, safe drinking water, toilets, and Back to School support.',
    beneficiaries: ['Government school students in rural and tribal areas','Adolescent girls requiring school health and hygiene support','Teachers, school administrators, and local education systems'],
    metrics: ['20+ schools proposed/upgraded','2,000+ dual desk benches','STEM labs, computer labs, libraries, RO plants, and toilets','Back to School support for vulnerable children'],
    kpis: ['Number of schools upgraded','Infrastructure units installed','Student attendance and retention improvement','Science lab and digital lab utilization','Sanitation and drinking water access improvement'],
    monitoring: ['School-wise baseline and completion checklist','Photographic evidence before/after installation','Headmaster/teacher confirmation reports','Student attendance tracking','Quarterly infrastructure functionality review'],
    activities: ['Dual desk bench distribution','Science lab and STEM setup','Computer lab and digital learning support','Library setup','RO water plants and sanitation support','Back to School kits']
  },
  {
    title: 'Menstrual Hygiene & Girls Dignity', shortTitle: 'Sthree Swabhiman', slug: 'sthree-swabhiman', icon: 'Heart',
    folder: '/assets/images/programs/sthree-swabhiman/',
    defaultImage: '/assets/images/programs/sthree-swabhiman/logos/sthree-swabhiman-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/sthree-swabhiman/logos/sthree-swabhiman-logo.jpg','/assets/images/programs/sthree-swabhiman/logos/MJPTBCWREIS_logo.jpg'],
    sdgs: [3,4,5,6,10],
    subCategories: [
      makeSubCategory('sthree-swabhiman', 'awareness-sessions', 'Awareness Sessions', 'Menstrual health education for adolescent girls, wardens, and school communities.', '1,23,000 girls reached'),
      makeSubCategory('sthree-swabhiman', 'starter-kit-distribution', 'Starter Kit Distribution', 'Distribution of sanitary starter kits to ensure safe and dignified menstrual care.', '88,000 kits distributed'),
      makeSubCategory('sthree-swabhiman', 'safe-disposal-infrastructure', 'Safe Disposal Infrastructure', 'Incinerator and disposal-system support for hygienic menstrual waste management.', '550 incinerators proposed'),
      makeSubCategory('sthree-swabhiman', 'peer-mentor-training', 'Peer Mentor Training', 'Training peer mentors to sustain awareness and support inside institutions.', '825+ mentors trained'),
    ],
    overview: 'Sthree Swabhiman promotes menstrual health, dignity, awareness, starter kits, safe disposal infrastructure, and institutional self-reliance for adolescent girls.',
    beneficiaries: ['Adolescent girls in residential schools and junior colleges','BC, SC, ST, and minority girls from underserved communities','Lady wardens, teachers, peer mentors, and school communities'],
    metrics: ['1,23,000 girls reached annually','275 institutions covered','550 incinerators proposed/installed','88,000 starter kits annually','825+ staff and peer mentors trained'],
    kpis: ['Girls reached through awareness sessions','Starter kits distributed','Incinerators installed and functional','Staff and peer mentors trained','Reduction in menstruation-related absenteeism'],
    monitoring: ['Institution-wise attendance records','Distribution registers and photo documentation','Incinerator usage logs','Baseline and follow-up surveys','Quarterly CSR progress reports'],
    activities: ['MHM awareness sessions','Sanitary napkin starter kit distribution','Incinerator installation','Warden and peer mentor training','IEC materials','Quarterly monitoring']
  },
  {
    title: 'Health & Community Well-being', shortTitle: 'Health', slug: 'health-community-wellbeing', icon: 'Stethoscope',
    folder: '/assets/images/programs/health-community-wellbeing/',
    defaultImage: '/assets/images/programs/health-community-wellbeing/logos/health-community-wellbeing-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/health-community-wellbeing/logos/arogyasetu-logo.jpg'],
    sdgs: [3,5,6,10,17],
    subCategories: [
      makeSubCategory('health-community-wellbeing', 'mobile-health-outreach', 'Mobile Health Outreach', 'Doorstep preventive health services for remote rural and tribal communities.'),
      makeSubCategory('health-community-wellbeing', 'health-camps', 'Health Camps', 'Medical screening camps with diagnostics, consultation, and referral support.'),
      makeSubCategory('health-community-wellbeing', 'anemia-maternal-health', 'Anemia & Maternal Health', 'Focused support for women and girls through anemia and maternal-health interventions.'),
      makeSubCategory('health-community-wellbeing', 'fluorosis-awareness', 'Fluorosis Awareness', 'Community education and guidance to reduce fluorosis-related health risks.'),
    ],
    overview: 'Preventive healthcare, mobile medical outreach, anemia prevention, fluorosis awareness, telemedicine, and rural health education.',
    beneficiaries: ['Tribal and rural families','Pregnant and lactating women','School children and adolescent girls','Communities affected by fluorosis'],
    metrics: ['Mobile health outreach','Health camps and diagnostics','Anemia prevention support','Fluorosis awareness campaigns','Telemedicine and referral support'],
    kpis: ['People screened','Health camps conducted','Referrals completed','Women and children reached','Awareness participants'],
    monitoring: ['Camp registration records','Doctor consultation sheets','Follow-up calls','Village-wise outreach dashboard','Monthly reporting'],
    activities: ['Mobile health van services','Health and diagnostic camps','Anemia prevention','Fluorosis awareness','Telemedicine','Nutrition education']
  },
  {
    title: 'Disaster Relief & Humanitarian Response', shortTitle: 'Relief', slug: 'disaster-relief-humanitarian', icon: 'ShieldCheck',
    folder: '/assets/images/programs/disaster-relief-humanitarian/', defaultImage: '/assets/images/programs/disaster-relief-humanitarian/logos/disaster-relief-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/disaster-relief-humanitarian/logos/disaster-relief-logo.jpg'], sdgs: [1,2,3,10,17],
    subCategories: [
      makeSubCategory('disaster-relief-humanitarian', 'covid-relief', 'COVID Relief', 'Rapid support with essentials and care during pandemic-related disruptions.'),
      makeSubCategory('disaster-relief-humanitarian', 'flood-relief-camps', 'Flood Relief Camps', 'Organized relief camps for families affected by floods and displacement.'),
      makeSubCategory('disaster-relief-humanitarian', 'emergency-food-support', 'Emergency Food Support', 'Immediate food and ration support for vulnerable families during crises.'),
      makeSubCategory('disaster-relief-humanitarian', 'volunteer-response', 'Volunteer Response', 'Mobilized local volunteers for quick, coordinated humanitarian response.'),
    ],
    overview: 'Emergency response during COVID, floods, and local crises through food, medicines, hygiene support, and community relief camps.',
    beneficiaries: ['Families affected by COVID-19','Flood-affected communities','Daily wage families','Children and elderly people'], metrics: ['COVID relief support','Flood relief camps','Food and emergency kits','Medicine support','Volunteer mobilization'],
    kpis: ['Relief kits distributed','Families supported','Relief camps conducted','Volunteers mobilized','Emergency response coverage'], monitoring: ['Beneficiary records','Photo documentation','Local confirmation','Volunteer records','Post-relief assessment'], activities: ['COVID relief','Flood relief camps','Ration distribution','Mask and sanitizer support','Emergency assistance','Rapid response']
  },
  {
    title: 'Women & Youth Empowerment', shortTitle: 'Empowerment', slug: 'women-youth-empowerment', icon: 'Users',
    folder: '/assets/images/programs/women-youth-empowerment/', defaultImage: '/assets/images/programs/women-youth-empowerment/logos/women-youth-empowerment-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/women-youth-empowerment/logos/women-youth-empowerment-logo.jpg'], sdgs: [4,5,8,10,17],
    subCategories: [
      makeSubCategory('women-youth-empowerment', 'women-entrepreneurship', 'Women Entrepreneurship', 'Entrepreneurship support to help women build income-generating livelihoods.'),
      makeSubCategory('women-youth-empowerment', 'youth-skilling', 'Youth Skilling', 'Industry-relevant skilling programs to improve youth employability.'),
      makeSubCategory('women-youth-empowerment', 'ai-data-science-training', 'AI & Data Science Training', 'Emerging-technology training that prepares youth for future careers.'),
      makeSubCategory('women-youth-empowerment', 'livelihood-units', 'Livelihood Units', 'Practical livelihood units that support local income and self-reliance.'),
    ],
    overview: 'Building livelihoods through entrepreneurship, SHG support, vocational skills, digital skills, AI/ML learning, and youth employability.',
    beneficiaries: ['Rural women and SHGs','Unemployed youth','Young graduates','Women entrepreneurs'], metrics: ['Women entrepreneurship','Livelihood units','Youth skill development','AI/ML skilling','Career readiness'],
    kpis: ['Women trained','Youth certified','Microenterprises started','Placement outcomes','Income improvement'], monitoring: ['Training attendance','Skill assessments','Placement tracking','Enterprise follow-up','Quarterly livelihood reports'], activities: ['Tailoring training','SHG support','Employability workshops','Digital literacy','Career counseling','Leadership sessions']
  },
  {
    title: 'Integrated Learning Centers', shortTitle: 'ILCs', slug: 'integrated-learning-centers', icon: 'GraduationCap',
    folder: '/assets/images/programs/integrated-learning-centers/', defaultImage: '/assets/images/programs/integrated-learning-centers/logos/integrated-learning-centers-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/integrated-learning-centers/logos/integrated-learning-centers-logo.jpg'], sdgs: [3,4,5,8,10,11,17],
    subCategories: [
      makeSubCategory('integrated-learning-centers', 'community-libraries', 'Community Libraries', 'Accessible local libraries to promote reading, learning, and aspiration.'),
      makeSubCategory('integrated-learning-centers', 'digital-kiosk-labs', 'Digital Kiosk Labs', 'Digital access points for learning, services, and skill development.'),
      makeSubCategory('integrated-learning-centers', 'career-guidance', 'Career Guidance', 'Career counseling and pathways for students and rural youth.'),
      makeSubCategory('integrated-learning-centers', 'community-development-hub', 'Community Development Hub', 'A shared center for education, skilling, and local development services.'),
    ],
    overview: 'Rural transformation hubs combining library access, digital learning, youth skilling, women empowerment, health awareness, agriculture support, and community services.',
    beneficiaries: ['Students and aspirants','Rural youth and women','Farmers and adult learners','Families in surrounding villages'], metrics: ['5 pilot centers','50,000+ direct beneficiaries','25,000+ digital literacy learners','10,000+ youth skilled','5,000+ women empowered'],
    kpis: ['Center footfall','Library memberships','Digital literacy completions','Training participation','Community satisfaction'], monitoring: ['Monthly dashboard','Library registers','Training certificates','Community surveys','Annual reports'], activities: ['Library access','Digital kiosk services','Career guidance','Women empowerment','Health awareness','Agriculture support']
  },
  {
    title: 'Farmer Empowerment & Sustainable Agriculture', shortTitle: 'Farmer Empowerment', slug: 'farmer-empowerment-sustainable-agriculture', icon: 'Sprout',
    folder: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/',
    defaultImage: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/cover.jpg',
    logos: ['/images/GiveForSociety_logo.jpg'], sdgs: [1,2,5,8,10,12,13,17],
    problemStatement: 'Small and marginal farmers face crop failure, debt burden, borewell failure, lack of formal credit access, weak market linkages, limited technical guidance, and income insecurity. Farmer families affected by distress need livelihood support and long-term resilience-building.',
    objectives: [
      'Promote sustainable and climate-resilient farming practices.',
      'Support farmer families facing distress through livelihood recovery.',
      'Strengthen FPOs, farmer groups, and women cooperatives.',
      'Improve access to training, market linkages, and government schemes.',
      'Build awareness on soil health, water conservation, crop planning, and financial literacy.',
      'Support income diversification through livestock, small enterprises, and value-added livelihoods.',
    ],
    subCategories: [
      {
        title: 'Sustainable Farming Awareness',
        image: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/sustainable-farming.jpg',
        description: 'Training on soil health, water conservation, crop planning, organic/natural farming, and climate-resilient agriculture.',
      },
      {
        title: 'Farmer Livelihood Recovery',
        image: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/livelihood-recovery.jpg',
        description: 'Livelihood support for vulnerable farmer families through goats, dairy, small shops, tailoring, food carts, or other income-generating assets.',
      },
      {
        title: 'FPO & Farmer Group Support',
        image: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/fpo-support.jpg',
        description: 'Capacity building for farmer producer organizations, farmer groups, collective procurement, aggregation, and market-based interventions.',
      },
      {
        title: 'Women Farmer Cooperatives',
        image: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/women-cooperatives.jpg',
        description: 'Supporting women-led cooperatives, SHGs, agri-livelihood groups, and rural women’s participation in income generation.',
      },
      {
        title: 'Market Linkages & Value Addition',
        image: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/market-linkages.jpg',
        description: 'Connecting farmers to better markets, buyers, processing opportunities, branding, and value-added local products.',
      },
      {
        title: 'Farmer Awareness Camps',
        image: '/assets/images/programs/farmer-empowerment-sustainable-agriculture/farmer-awareness-camps.jpg',
        description: 'Camps on crop insurance, formal credit, government schemes, tenant farmer support, financial literacy, and distress prevention.',
      },
    ],
    overview: 'Supporting small and marginal farmers, tenant farmers, farmer families, women cooperatives, and rural agriculture-based livelihoods through awareness, training, sustainable farming practices, FPO support, market linkages, and livelihood recovery assistance.',
    beneficiaries: ['Small and marginal farmers','Tenant farmers','Farmer families affected by distress','Women farmers and SHG members','FPOs and farmer collectives','Tribal and rain-fed farming communities'],
    metrics: ['Farmers trained','Farmer families supported','FPOs/farmer groups strengthened','Women farmers/cooperatives supported','Livelihood assets distributed','Market linkage partnerships created','Awareness camps conducted'],
    kpis: ['Number of farmers attending training','Number of livelihood recovery cases supported','Increase in farmer group participation','Number of women farmers enrolled','Number of FPOs supported','Market linkage outcomes','Follow-up visits completed'],
    monitoring: ['Farmer baseline profile','Training attendance records','Livelihood asset distribution records','Follow-up income tracking','FPO/group meeting records','Market linkage documentation','Quarterly field monitoring reports','Photo and case study documentation'],
    activities: ['Sustainable farming awareness sessions','Livelihood recovery support','FPO and farmer group capacity building','Women cooperative strengthening','Market linkage facilitation','Farmer awareness camps']
  },
  {
    title: 'Community Awareness & Social Action', shortTitle: 'Social Action', slug: 'community-awareness-social-action', icon: 'HandHeart',
    folder: '/assets/images/programs/community-awareness-social-action/', defaultImage: '/assets/images/programs/community-awareness-social-action/logos/community-awareness-social-action-logo.jpg',
    logos: ['/images/GiveForSociety_logo.jpg','/assets/images/programs/community-awareness-social-action/logos/community-awareness-social-action-logo.jpg'], sdgs: [3,6,10,11,13,17],
    subCategories: [
      makeSubCategory('community-awareness-social-action', 'blood-donation-camps', 'Blood Donation Camps', 'Voluntary blood-donation drives to strengthen emergency health support.'),
      makeSubCategory('community-awareness-social-action', 'public-awareness-drives', 'Public Awareness Drives', 'Public campaigns on health, civic responsibility, and social well-being.'),
      makeSubCategory('community-awareness-social-action', 'swachh-bharat-environment', 'Swachh Bharat & Environment', 'Cleanliness and environmental action in villages and public spaces.'),
      makeSubCategory('community-awareness-social-action', 'volunteer-mobilization', 'Volunteer Mobilization', 'Community volunteer engagement for sustained local social action.'),
    ],
    overview: 'Blood donation camps, awareness drives, Swachh Bharat activities, environmental campaigns, volunteerism, and local social action.',
    beneficiaries: ['Local communities','Youth volunteers and donors','Schools and villages','Awareness campaign participants'], metrics: ['Blood donation camps','Public awareness drives','Swachh Bharat campaigns','Volunteer mobilization','Village social action'],
    kpis: ['Camps conducted','Donors participated','Volunteers mobilized','People reached','Community partnerships'], monitoring: ['Camp records','Volunteer hours','Photo documentation','Partner confirmations','Feedback tracking'], activities: ['Blood donation camps','Awareness campaigns','Cleanliness drives','Volunteer engagement','Village events','Civic awareness']
  }
].map((program) => ({
  ...program,
  problemStatement: program.problemStatement || `Communities served by ${program.shortTitle} continue to face access and quality gaps that limit equitable development outcomes.`,
  objectives: program.objectives || [
    `Expand reach and quality of ${program.shortTitle.toLowerCase()} interventions in underserved locations.`,
    'Improve access, inclusion, and continuity of essential services.',
    'Build local ownership through institutions, community actors, and partnerships.',
  ],
  gallery: program.gallery || (program.subCategories?.map((item) => item.image).filter(Boolean).slice(0, 8) ?? []),
  downloads: program.downloads || [],
}))
