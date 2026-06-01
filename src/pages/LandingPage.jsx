/* eslint-disable no-unused-vars, no-empty, no-undef */
import React, { useRef, useState } from 'react';
import { Bell, Search, User, ChevronRight, FileText, Cpu, Sparkles, EyeOff, TrendingUp, Crosshair, Users, Clock, Globe, Share2, CheckCircle2, Zap, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    navigate('/resources');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diperbolehkan.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5 MB.');
      e.target.value = '';
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Silakan login terlebih dahulu untuk mengunggah CV Anda.');
      navigate('/login');
      e.target.value = '';
      return;
    }

    setUploading(true);
    
    try {
      // 0. Check if user already has a resume
      const checkRes = await fetch('/api/resumes/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const checkData = await checkRes.json();
      if (checkData.status === 'success' && checkData.data?.resumes?.length > 0) {
        alert('Anda sudah mengunggah dan menyimpan CV sebelumnya. Harap hapus CV lama Anda di halaman Dashboard terlebih dahulu jika ingin menggantinya! ⚠️');
        setUploading(false);
        e.target.value = '';
        return;
      }

      // 1. Upload CV
      const formData = new FormData();
      formData.append('resume', file);
      
      const uploadRes = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if (uploadData.status !== 'success') {
        throw new Error(uploadData.message || 'Gagal mengunggah CV');
      }

      // 2. Generate AI Recommendations
      const aiRes = await fetch('/api/recommendations/jobs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const aiData = await aiRes.json();
      
      // We don't throw error if AI recommends already exist
      if (aiData.status !== 'success' && !(aiData.message || '').toLowerCase().includes('sudah ada')) {
         throw new Error(aiData.message || 'Gagal memproses AI');
      }

      // 3. Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('compressed') || msg.includes('format') || msg.includes('pdf') || msg.includes('mimetype')) {
         alert('File CV Anda sepertinya bermasalah atau formatnya tidak sesuai. Pastikan menggunakan file PDF standar yang tidak dipassword/dienkripsi ya! 📄');
      } else if (msg.includes('sudah') || msg.includes('exist') || msg.includes('duplicate') || msg.includes('gagal')) {
         alert('Hmm, sepertinya Anda sudah pernah mengunggah CV sebelumnya. Silakan menuju Dashboard untuk menghapus CV lama Anda terlebih dahulu jika ingin menggantinya! 🔄');
      } else if (msg.includes('unexpected token') || msg.includes('json') || msg.includes('504')) {
         alert('CV berhasil diunggah! AI sedang mengekstrak data Anda di latar belakang (mungkin butuh waktu ekstra). Silakan cek tab Dashboard Anda dalam 1-2 menit ke depan. ⏳');
         navigate('/dashboard');
      } else {
         alert('Proses upload selesai! AI kami sedang menganalisis CV Anda secara mendalam. Silakan cek hasil selengkapnya di Dashboard Anda. 🚀');
         navigate('/dashboard');
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Pelet Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="text-lg font-bold text-indigo-600 tracking-tight">Pelet</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Cari Pekerjaan</Link>
            <Link to="/resources" className="hover:text-indigo-600 transition-colors">Analisis CV AI</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userRole ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm font-medium text-white bg-indigo-600 px-5 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={() => { localStorage.removeItem('userRole'); localStorage.removeItem('accessToken'); window.location.reload(); }}
                className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/register" className="text-sm font-medium text-indigo-600 px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors">Daftar</Link>
              <Link to="/login" className="text-sm font-medium text-white bg-indigo-600 px-5 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">Masuk</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Temukan Pekerjaan<br />Yang Cocok<br />Dengan Keahlian Anda<br />Berkat AI
          </h1>
          <p className="text-lg text-slate-600 max-w-md leading-relaxed">
            Berhenti menelusuri lowongan yang tidak relevan. Mesin pencocokan cerdas kami menganalisis keahlian teknis Anda untuk menjembatani bakat Anda dengan pencapaian karier berikutnya.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleUploadClick} 
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Upload CV
            </button>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-3 mr-4">
              {["https://i.pravatar.cc/100?img=47", "https://i.pravatar.cc/100?img=32", "https://i.pravatar.cc/100?img=12"].map((img, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center overflow-hidden">
                   <img src={img} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-sm text-slate-500 font-medium">Dipercayai oleh para Pencari Kerja</span>
          </div>
        </div>
        
        {/* Hero Graphic */}
        <div className="relative rounded-2xl bg-white p-4 shadow-2xl border border-slate-100">
          <div className="absolute -top-4 -right-4 bg-white p-3 rounded-full shadow-lg border border-slate-100 z-20">
            <Sparkles className="text-indigo-500" size={24} />
          </div>
          <div className="aspect-[4/3] rounded-xl bg-slate-900 overflow-hidden relative flex items-center justify-center">
            {/* Abstract AI CV graphic */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900 z-0"></div>
            <div className="z-10 w-3/4 h-3/4 border border-indigo-500/30 rounded-lg p-6 flex flex-col relative bg-slate-900/50 backdrop-blur-sm shadow-2xl">
              <div className="w-12 h-12 bg-teal-400/20 rounded mb-4 flex items-center justify-center border border-teal-400/50 shadow-[0_0_15px_rgba(45,212,191,0.5)]">
                 <User className="text-teal-400" size={24} />
              </div>
              <div className="w-3/4 h-2 bg-indigo-500/40 rounded mb-3"></div>
              <div className="w-full h-2 bg-indigo-500/20 rounded mb-3"></div>
              <div className="w-5/6 h-2 bg-indigo-500/20 rounded mb-3"></div>
              <div className="w-full h-2 bg-indigo-500/20 rounded mb-3"></div>
              
              {/* Glowing connection lines overlay */}
              <div className="absolute top-1/2 left-0 w-full h-px bg-teal-400/50 shadow-[0_0_10px_rgba(45,212,191,0.8)]"></div>
              <div className="absolute top-1/3 left-1/4 w-px h-1/2 bg-indigo-400/50 shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
              <div className="absolute top-1/4 right-1/4 w-px h-1/2 bg-purple-400/50 shadow-[0_0_10px_rgba(192,132,252,0.8)]"></div>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
               <span className="text-sm font-medium text-slate-700">Mencocokkan Keahlian...</span>
               <span className="text-sm font-bold text-indigo-600">99% Precision</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 w-[99%] rounded-full relative">
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Cara Kerja Sistem</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Protokol penyelarasan semantik 3 langkah kami memastikan Anda hanya melihat peluang yang benar-benar menghargai keahlian spesifik yang Anda miliki.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "Unggahan Semantik", desc: "Unggah CV atau portofolio Anda. AI kami tidak sekadar membaca kata kunci; melainkan memahami konteks dan dampak riwayat kerja Anda." },
              { icon: Cpu, title: "Analisis Mendalam", desc: "Kami memetakan keterampilan Anda terhadap database berisi ribuan lowongan pekerjaan dari perusahaan teknologi kelas dunia." },
              { icon: Sparkles, title: "Jembatani Kesenjangan", desc: "Dapatkan daftar kurasi 'Kecocokan Sempurna'. Perkenalan langsung dan status lamaran jalur cepat terjamin." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Split */}
      <section className="py-24 max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
        {/* Untuk Talenta */}
        <div>
          <div className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Untuk Talenta</div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">Tingkatkan Jalur Karier Anda</h2>
          
          <div className="space-y-8">
            {[
              { icon: EyeOff, title: "Pencocokan Rahasia", desc: "Lamar dengan percaya diri. Identitas Anda dirahasiakan dari atasan saat ini hingga kecocokan dikonfirmasi." },
              { icon: TrendingUp, title: "Patokan Gaji", desc: "Wawasan berbasis AI tentang nilai pasar Anda berdasarkan data langsung dari peran yang cocok." },
              { icon: Crosshair, title: "Analisis Kesenjangan Keterampilan", desc: "Jalur pembelajaran personal untuk membantu Anda memenuhi kualifikasi peran bergaji tinggi yang Anda inginkan." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Untuk Perekrut */}
        {!userRole && (
          <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
              Untuk Perekrut
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Rekrut dengan Presisi</h2>
            
            <div className="space-y-4 mb-10">
              {[
                { icon: Users, title: "Kandidat Terseleksi", desc: "Lewati seleksi awal. AI kami memastikan kandidat memenuhi 95% persyaratan inti Anda." },
                { icon: Clock, title: "Kurangi Waktu Perekrutan", desc: "Rata-rata mengurangi waktu hingga 40% sejak lowongan diposting hingga wawancara pertama." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => navigate('/login')} className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl group">
              Masuk Portal Perekrut <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Abstract background graphics */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
             </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Siap menemukan karier yang paling cocok untuk Anda?</h2>
            <p className="text-indigo-100 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Bergabunglah dengan ribuan profesional teknologi yang menemukan peran impian mereka menggunakan Pelet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
              >
                Mulai Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg font-bold text-indigo-600 tracking-tight">Pelet</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menjembatani kesenjangan antara bakat mentah dan keunggulan perusahaan melalui kecerdasan buatan yang etis dan pemetaan presisi tinggi.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              © 2026 Pelet. Hak cipta dilindungi undang-undang.
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
