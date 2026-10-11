/* ========== 1. SETTINGS (easy to edit) ========== */
const SKILLS = {
  Languages: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css'],
  Frameworks: ['react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'next.js', 'tailwind', 'bootstrap', 'jquery'],
  'Tools & Cloud': ['git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'linux', 'figma', 'jira', 'ci/cd', 'postgresql', 'mysql', 'mongodb', 'redis', 'rest', 'graphql'],
  Professional: ['leadership', 'communication', 'project management', 'agile', 'scrum', 'teamwork', 'problem solving', 'mentoring', 'analytics', 'testing'],
};
const ACTION_VERBS = ['built', 'led', 'shipped', 'launched', 'designed', 'developed', 'created', 'improved', 'reduced', 'increased', 'automated', 'optimized', 'managed', 'delivered', 'implemented', 'migrated', 'architected', 'mentored'];
const SECTIONS = { Experience: /experience|employment|work history/i, Education: /education|university|college|degree/i, Skills: /skills|technologies|tech stack/i, Projects: /projects|portfolio/i };

const SAMPLE = `Maya Chen
maya.chen@email.com | +1 415 555 0142 | linkedin.com/in/mayachen | github.com/mayachen

EXPERIENCE
Frontend Developer, Brightloop (2022 - Present)
- Built a React and TypeScript dashboard used by 12,000 customers, cutting load time by 38%.
- Led a team of 4 engineers and shipped a Python REST API on AWS.
- Automated deployments with Docker and CI/CD, reducing release time from 2 hours to 15 minutes.

PROJECTS
- Launched an open-source Figma plugin with 1,500 GitHub stars.

EDUCATION
B.S. Computer Science, University of Washington

SKILLS
JavaScript, TypeScript, React, Node.js, Python, SQL, Git, Docker, Agile, Communication`;

/* ========== 2. GRAB PAGE ELEMENTS ========== */
const $ = (id) => document.getElementById(id);
const resumeText = $('resumeText'), jobText = $('jobText'), errorBox = $('error'), results = $('results');

/* ========== 3. NAVBAR ========== */
$('menuBtn').addEventListener('click', () => {
  const open = $('menu').classList.toggle('open');
  $('menuBtn').setAttribute('aria-expanded', open);
});
$('menu').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') { $('menu').classList.remove('open'); $('menuBtn').setAttribute('aria-expanded', false); }
});
$('year').textContent = new Date().getFullYear();

/* ========== 4. INPUT BUTTONS ========== */
$('sampleBtn').addEventListener('click', () => { resumeText.value = SAMPLE; errorBox.hidden = true; });
$('clearBtn').addEventListener('click', () => { resumeText.value = ''; jobText.value = ''; results.hidden = true; errorBox.hidden = true; });
$('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.txt')) { showError('Upload a .txt file, or paste your resume text. PDF and Word files need a server to read.'); return; }
  const reader = new FileReader();
  reader.onload = () => { resumeText.value = reader.result; errorBox.hidden = true; };
  reader.readAsText(file);
});
$('analyzeBtn').addEventListener('click', runAnalysis);

function showError(msg) { errorBox.textContent = msg; errorBox.hidden = false; }

/* ========== 5. ANALYSIS ========== */
function findSkills(text) {
  const found = {};
  for (const [group, list] of Object.entries(SKILLS)) {
    const hits = list.filter((s) => new RegExp('(^|[^a-z0-9+#])' + s.replace(/[.+/]/g, '\\$&') + '($|[^a-z0-9+#])', 'i').test(text));
    if (hits.length) found[group] = hits;
  }
  return found;
}

function analyze(text, job) {
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).length;
  const email = (text.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [])[0];
  const phone = (text.match(/\+?\d[\d\s().-]{8,}\d/) || [])[0];
  const linkedin = /linkedin\.com\/in\//i.test(text);
  const github = /github\.com\//i.test(text);
  const sections = Object.fromEntries(Object.entries(SECTIONS).map(([k, re]) => [k, re.test(text)]));
  const skills = findSkills(text);
  const skillCount = Object.values(skills).flat().length;
  const verbs = ACTION_VERBS.filter((v) => new RegExp('\\b' + v + '\\b').test(lower));
  const metrics = (text.match(/\d[\d,.]*\s?(%|k\b|x\b|\+)?/g) || []).filter((m) => /%|k|x|\+|\d{2,}/.test(m)).length;

  // Each category is scored 0-100, then averaged with weights.
  const contact = Math.round(([email, phone, linkedin, github].filter(Boolean).length / 4) * 100);
  const structure = Math.round((Object.values(sections).filter(Boolean).length / 4) * 100);
  const skillScore = Math.min(100, skillCount * 10);
  const impact = Math.min(100, metrics * 14 + verbs.length * 6);
  const length = words >= 250 && words <= 800 ? 100 : words >= 120 ? 60 : 25;
  const total = Math.round(contact * 0.2 + structure * 0.2 + skillScore * 0.25 + impact * 0.25 + length * 0.1);

  const tips = [];
  if (!email) tips.push('Add a professional email address at the top of your resume.');
  if (!phone) tips.push('Add a phone number so recruiters can reach you quickly.');
  if (!linkedin) tips.push('Add your LinkedIn profile link.');
  if (!github && (skills.Languages || skills.Frameworks)) tips.push('Add your GitHub link so reviewers can see your code.');
  Object.entries(sections).forEach(([name, ok]) => { if (!ok) tips.push(`Add a clear "${name}" heading so applicant tracking systems can find it.`); });
  if (metrics < 3) tips.push('Add numbers to your bullets, such as users, revenue, time saved or percentages.');
  if (verbs.length < 4) tips.push('Start more bullets with strong verbs like built, led, shipped or reduced.');
  if (skillCount < 6) tips.push('List more relevant skills. Aim for at least 8 that match the jobs you want.');
  if (words < 250) tips.push(`Your resume is short (${words} words). Add detail about what you achieved in each role.`);
  if (words > 800) tips.push(`Your resume is long (${words} words). Trim it to one or two pages.`);
  if (!tips.length) tips.push('Great work. Tailor your top three bullets to each job you apply for.');

  // Optional job description match
  let match = null;
  if (job.trim()) {
    const allSkills = Object.values(SKILLS).flat();
    const wanted = allSkills.filter((s) => Object.values(findSkills(job)).flat().includes(s));
    const have = wanted.filter((s) => Object.values(skills).flat().includes(s));
    match = { wanted, have, missing: wanted.filter((s) => !have.includes(s)) };
  }

  return { total, words, email, phone, linkedin, github, sections, skills, tips, match,
    bars: [['Contact details', contact], ['Resume structure', structure], ['Skills', skillScore], ['Impact and action verbs', impact], ['Length', length]] };
}

/* ========== 6. SHOW RESULTS ========== */
// textContent is used everywhere so pasted text can never inject HTML.
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }

function renderChips(box, list, cls) { box.replaceChildren(...list.map((s) => el('span', 'chip ' + (cls || ''), s))); }

function runAnalysis() {
  const text = resumeText.value;
  if (text.trim().split(/\s+/).length < 30) { showError('Paste at least a few lines of your resume (30 words or more) to get a useful analysis.'); return; }
  errorBox.hidden = true;
  const r = analyze(text, jobText.value);

  $('scoreNum').textContent = r.total;
  $('scoreRing').style.setProperty('--p', r.total);
  const label = r.total >= 80 ? 'Strong resume' : r.total >= 60 ? 'Good start' : 'Needs work';
  $('scoreTitle').textContent = label;
  $('scoreText').textContent = `${r.words} words analyzed. ${r.tips.length} suggestion${r.tips.length === 1 ? '' : 's'} below.`;

  // Breakdown bars
  $('bars').replaceChildren(...r.bars.map(([name, pct]) => {
    const row = el('div', 'bar-row'), top = el('div', 'bar-label'), bar = el('div', 'bar'), fill = document.createElement('i');
    top.append(el('span', '', name), el('strong', '', pct + '%'));
    bar.append(fill); row.append(top, bar);
    requestAnimationFrame(() => (fill.style.width = pct + '%'));
    return row;
  }));

  // Contact list
  const rows = [['Email', r.email], ['Phone', r.phone], ['LinkedIn', r.linkedin && 'Found'], ['GitHub', r.github && 'Found']];
  $('contact').replaceChildren(...rows.map(([k, v]) => {
    const li = el('li'); li.append(el('span', '', k), el('span', v ? 'ok' : 'miss', v || 'Missing')); return li;
  }));

  // Skills
  const groups = Object.entries(r.skills);
  const skillBox = $('skills');
  skillBox.replaceChildren();
  if (!groups.length) skillBox.append(el('p', 'muted', 'No known skills detected. Add a Skills section.'));
  groups.forEach(([g, list]) => { const wrap = el('div', 'skill-group'); const c = el('div', 'chips'); renderChips(c, list); wrap.append(el('p', 'muted', g), c); skillBox.append(wrap); });

  // Job match
  $('matchCard').hidden = !r.match;
  if (r.match) {
    const { wanted, have, missing } = r.match;
    $('matchText').textContent = wanted.length ? `You match ${have.length} of ${wanted.length} skills in this job.` + (missing.length ? ' Missing skills:' : ' Nothing missing.') : 'No known skills were found in the job description.';
    renderChips($('matchChips'), missing, 'gap');
  }

  $('tips').replaceChildren(...r.tips.map((t) => el('li', '', t)));
  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}