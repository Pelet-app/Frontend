const fs = require('fs');
let content = fs.readFileSync('src/pages/JobSeekerDashboard.jsx', 'utf8');

// 1. Add activeView logic for all_jobs
content = content.replace(
  /else if \(location\.pathname\.includes\('\/applications'\)\) activeView = 'applications';/,
  `else if (location.pathname.includes('/applications')) activeView = 'applications';
  else if (location.pathname.includes('/all_jobs')) activeView = 'all_jobs';`
);

// 2. Add allJobs state
content = content.replace(
  /const \[matches, setMatches\] = useState\(\[\]\);/,
  `const [matches, setMatches] = useState([]);\n  const [allJobs, setAllJobs] = useState([]);`
);

// 3. Extract validJobs and setAllJobs outside of the rawRecs if block
// In the current file (which was reverted), it looks like:
// let rawRecs = Array.isArray(recsData.data) ? recsData.data : (recsData.data?.recommendations);
// rawRecs = Array.isArray(rawRecs) ? rawRecs.slice().reverse() : [];
// let realMatches = [];
// let cleanTopUnits = [];
// let cleanGapUnits = [];
// if (rawRecs.length > 0) {
content = content.replace(
  /let cleanGapUnits = \[\];\s*if \(rawRecs\.length > 0\) \{/,
  `let cleanGapUnits = [];
        let validJobs = [];
        if (jobsData && jobsData.status === 'success') {
          validJobs = jobsData.data?.jobs || jobsData.data || [];
        }
        setAllJobs(validJobs);
        
        if (rawRecs.length > 0) {`
);

// 4. Remove validJobs inside the rawRecs if block
content = content.replace(
  /let validJobs = \[\];\s*if \(jobsData\.status === 'success'\) \{\s*validJobs = jobsData\.data\?\.jobs \|\| jobsData\.data \|\| \[\];\s*\}/,
  ``
);

// 5. Add "All Jobs" sidebar link
content = content.replace(
  /<Link to="\/dashboard\/applications"/,
  `<Link to="/dashboard/all_jobs" className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors \${(activeView === 'all_jobs') ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'}\`}>
            <Search size={18} />
            All Jobs
          </Link>
          <Link to="/dashboard/applications"`
);

// 6. Add "All Jobs" Tab UI
const newTabContent = `
        {activeView === 'all_jobs' && (
          <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-medium text-slate-900 mb-2">All Jobs</h1>
              <p className="text-slate-500">Explore <span className="text-indigo-600 font-bold">{allJobs.length} opportunities</span> available across all categories.</p>
            </div>
            
            {loading ? (
              <div className="text-center py-20 text-slate-500">Memuat data...</div>
            ) : allJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                Tidak ada pekerjaan yang tersedia.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allJobs.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-start gap-5 mb-5">
                        <div className="flex-shrink-0 bg-slate-50 text-slate-500 w-16 h-16 rounded-3xl flex items-center justify-center font-extrabold shadow-sm border border-slate-100">
                          <Briefcase size={24} />
                        </div>
                        <div className="pt-1 flex-1">
                          <h3 className="font-bold text-xl text-slate-900 mb-1.5 leading-tight">{job.title}</h3>
                          {job.company_name && (
                            <div className="text-sm text-slate-500 font-medium mb-3 flex items-center gap-2"><Building2 size={14} className="text-indigo-500"/> {job.company_name}</div>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold capitalize">{job.location_type}</span>
                            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold capitalize">{job.job_type}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-6 line-clamp-3">
                        {job.description || 'Tidak ada deskripsi yang disediakan.'}
                      </p>
                    </div>
                    <button onClick={() => handleViewJobDetail(job)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
`;

content = content.replace(/\{activeView === 'job_detail' && \(/, newTabContent + "\n        {activeView === 'job_detail' && (");

fs.writeFileSync('src/pages/JobSeekerDashboard.jsx', content);
