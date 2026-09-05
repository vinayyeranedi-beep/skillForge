# SkillForge — Student Technical Skill & Placement Portfolio Tracker

SkillForge is a centralized, responsive, and open-source web application designed for engineering students to track technical skills, record engineering projects, manage learning goals, monitor development progress, and generate clean, print-ready portfolio summaries for campus placements and internships.

---

## 1. Problem Statement

College students learn multiple technical and soft skills, complete academic and capstone projects, and set milestones. However, this information is usually scattered across notebooks, resumes, repositories, and notes.

Students need a centralized platform where they can:
1. Record and calibrate technical skills and proficiency levels.
2. Track engineering projects and link relevant skills acquired.
3. Establish learning goals with enforceable target dates.
4. Monitor overall skill growth and placement readiness.
5. Generate a professional portfolio summary for recruiter interviews and placement drives.

**SkillForge solves this with a lightweight, browser-persisted student MVP.**

---

## 2. Core Features (5 Out of 5 Implemented)

### Feature 1: Skill Management
- Add, edit, delete, and view technical skills.
- Assign proficiency levels: **Beginner**, **Intermediate**, **Advanced**.
- Organize by disciplines: CAD & 3D Modeling, Programming & Software, Simulation & CAE, Core Engineering, Electronics & Hardware, Tools & Methods, and Soft Skills.
- Search, filter by proficiency level, sort by recently updated or highest competence.
- Tracks months of experience, notes, and project associations.

### Feature 2: Project Tracking
- Record academic capstones, hackathon builds, and personal projects.
- Associate multiple technical skills directly with each project.
- Track project status: **Completed**, **In Progress**, **Planned**.
- Log start/end dates, engineering highlights, and external repository (GitHub) or live CAD demo links.

### Feature 3: Learning Goals
- Create milestone goals with target dates.
- Filter by **All**, **Active**, and **Completed**.
- 1-click completion toggle with visual celebration and timestamp recording.
- Target date urgency indicators (e.g. *Due Today*, *Overdue*, *Due in X days*).
- Interactive progress percentage slider.

### Feature 4: Progress Dashboard
- 4 primary measurable metric indicators:
  - Total skills & level breakdown (Advanced, Intermediate, Beginner)
  - Total projects & completion rate
  - Active vs completed learning goals
  - Placement Readiness Score (%)
- Segmented proficiency distribution bar.
- Category representation pills.
- High-priority active goals quick-checklist.
- Recent projects showcase.

### Feature 5: Portfolio Summary
- Structured, placement-ready student portfolio.
- Student profile (Name, degree, institution, target role, contact details, LinkedIn, GitHub, summary).
- Technical competencies grouped by category with proficiency tags.
- Detailed engineering projects with outcomes and linked skills.
- Certifications, competitions, and awards ledger.
- Print-ready design (`@media print` supported for instant PDF export).
- One-click **Copy as Markdown** to paste into resumes or emails.

### Bonus AI Feature: AI Skill-Gap Analyzer
- Rule-based, 100% free career gap analysis.
- Matches student inventory against benchmark roles (e.g., Mechanical Design Engineer, Robotics Engineer, Simulation Analyst, Embedded Systems, Full-Stack Developer).
- Computes Career Fit Score (%) and highlights qualified vs missing skills.
- 1-click actions: "+ Add Skill" or "+ Set Target Goal".
- Designed with decoupled architecture for future Gemini API integration.

---

## 3. Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Persistence**: Browser LocalStorage (`localStorage`)
- **Cost**: $0.00 (Zero paid APIs, zero subscriptions, zero credit cards)

---

## 4. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/your-username/skillforge.git
cd skillforge

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

---

## 5. Data Storage & Privacy

- SkillForge uses **browser-native LocalStorage**.
- No server database setup or cloud account is required.
- Data persists automatically between browser refreshes.
- Built-in data backup:
  - **Export JSON**: Download your entire portfolio data to a file.
  - **Import JSON**: Restore or transfer portfolio data anytime.
  - **Reset to Sample Data**: Reload default engineering sample records anytime.

---

## 6. How to Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: SkillForge Student MVP"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/skillforge.git
git push -u origin main
```

---

## 7. How to Deploy to Vercel

1. Push your code to GitHub as shown above.
2. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
3. Click **"Add New Project"** and select your `skillforge` repository.
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your app will be live on a free `.vercel.app` domain in under 60 seconds!

---

## 8. License

Open-source and free for all students. Distributed under the Apache-2.0 License.
