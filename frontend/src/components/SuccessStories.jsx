const stories = [
  {
    name: "Priya Devi",
    age: 16,
    location: "Medchal, Telangana",
    program: "Sthree Swabhiman",
    category: "Menstrual Hygiene & Girls Dignity",
    achievement: "From silent shame to school hygiene ambassador",
    quote:
      "I used to miss 4-5 days of school every month. Now I lead hygiene awareness sessions for my entire class.",
    image: "/assets/images/programs/sthree-swabhiman/photo-distribution-group.jpg",
  },
  {
    name: "Ramya Reddy",
    age: 14,
    location: "Sangareddy, Telangana",
    program: "Education Support",
    category: "Education & School Infrastructure",
    achievement: "State merit scholarship winner after accessing learning lab",
    quote:
      "The learning center gave me access to computers and books I never had at home. I qualified for the state merit scholarship this year.",
    image: "/assets/images/programs/empowering-rural-learning/back2-school-2.jpg",
  },
  {
    name: "Surekha Bai",
    age: 29,
    location: "Nalgonda, Telangana",
    program: "Women Empowerment",
    category: "Women & Youth Empowerment",
    achievement: "Founded her village's first women's self-help group",
    quote:
      "Give For Society showed us we have the skills. I now run a group of 18 women and we manage our own savings fund.",
    image: "/assets/images/programs/sthree-swabhiman/photo-workshop-speaker.jpg",
  },
  {
    name: "Venkat Rao",
    age: 18,
    location: "Rangareddy, Telangana",
    program: "Integrated Learning",
    category: "Integrated Learning Centers",
    achievement: "First in his village to secure an engineering college seat",
    quote:
      "Two years at the ILC — digital skills training and mentorship helped me crack the engineering entrance exam.",
    image: "/assets/images/programs/empowering-rural-learning/IMG_4753.JPG",
  },
  {
    name: "Govind Kumar",
    age: 47,
    location: "Mahaboobnagar, Telangana",
    program: "Farmer Empowerment",
    category: "Farmer Empowerment & Sustainable Agriculture",
    achievement: "Doubled crop yield with climate-smart farming techniques",
    quote:
      "I was about to abandon farming after two failed harvests. Training on soil health and crop rotation changed everything.",
    image: "/assets/images/programs/empowering-rural-learning/IMG_4732.JPG",
  },
  {
    name: "Anitha",
    age: 24,
    location: "Nizamabad, Telangana",
    program: "Community Health",
    category: "Health & Community Well-being",
    achievement: "Trained health volunteer now reaching 200+ families",
    quote:
      "The health camp at my village changed my understanding of preventive care. Now I volunteer monthly to spread awareness in my area.",
    image: "/assets/images/programs/sthree-swabhiman/photo-marathon-awareness.jpg",
  },
];

export default function SuccessStories() {
  return (
    <section id="success-stories" className="gray-section">
      <div className="ss-wrap">
        <div className="section-heading">
          <p className="eyebrow">SUCCESS STORIES</p>
          <h2>Real lives, real change — meet the people we serve.</h2>
          <p>
            Every number in our impact reports has a face, a story, and a
            transformed future. Here are a few of the lives touched through
            sustained grassroots action.
          </p>
        </div>
        <div className="stories-grid">
          {stories.map((story) => (
            <article key={story.name} className="story-card">
              <div className="story-image-wrap">
                <img
                  src={story.image}
                  alt={story.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="story-category-badge">{story.program}</div>
              </div>
              <div className="story-body">
                <div className="story-meta">
                  <strong>{story.name}</strong>
                  <span>
                    {story.age} yrs · {story.location}
                  </span>
                </div>
                <h3 className="story-achievement">{story.achievement}</h3>
                <blockquote className="story-quote">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <p className="story-program-tag">{story.category}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}