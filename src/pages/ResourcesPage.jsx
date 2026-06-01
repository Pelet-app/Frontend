/* eslint-disable no-unused-vars, no-empty, no-undef */
import React, { useState, useRef } from 'react';
import { Bell, User, CloudUpload, Sparkles, Lock, CheckCircle2, Circle, Zap, Cpu, TrendingUp, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ResourcesPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (!userRole) {
      navigate('/login');
      return;
    }
    if (userRole !== 'user') {
      alert('Hanya Job Seeker yang dapat mengunggah CV.');
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diperbolehkan.');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 10 MB.');
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

    setIsUploading(true);
    setProgress(10);
    localStorage.setItem('isAnalyzing', 'true');
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 80) return prev;
        return prev + 5;
      });
    }, 500);

    try {
      const checkRes = await fetch('/api/resumes/mine', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const checkData = await checkRes.json();
      if (checkData.status === 'success' && checkData.data?.resumes?.length > 0) {
        clearInterval(progressInterval);
        setIsUploading(false);
        setProgress(0);
        alert('Anda sudah mengunggah dan menyimpan CV sebelumnya. Harap hapus CV lama Anda di halaman Dasbor terlebih dahulu jika ingin menggantinya! ⚠️');
        e.target.value = '';
        return;
      }

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

      setProgress(85);
      const aiRes = await fetch('/api/recommendations/jobs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const aiData = await aiRes.json();
      
      if (aiData.status !== 'success' && !(aiData.message || '').toLowerCase().includes('sudah ada')) {
         throw new Error(aiData.message || 'Gagal memproses AI');
      }

      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 800);

    } catch (err) {
      clearInterval(progressInterval);
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('compressed') || msg.includes('format') || msg.includes('pdf') || msg.includes('mimetype')) {
         alert('File CV Anda sepertinya bermasalah atau formatnya tidak sesuai. Pastikan menggunakan file PDF standar yang tidak dipassword/dienkripsi ya! 📄');
      } else if (msg.includes('sudah') || msg.includes('exist') || msg.includes('duplicate') || msg.includes('gagal')) {
         alert('Hmm, sepertinya Anda sudah pernah mengunggah CV sebelumnya. Silakan menuju Dasbor untuk menghapus CV lama Anda terlebih dahulu jika ingin menggantinya! 🔄');
      } else if (msg.includes('unexpected token') || msg.includes('json') || msg.includes('504')) {
         alert('CV berhasil diunggah! AI sedang mengekstrak data Anda di latar belakang (mungkin butuh waktu ekstra). Silakan cek tab Dasbor Anda dalam 1-2 menit ke depan. ⏳');
         navigate('/dashboard');
      } else {
         alert('Proses upload selesai! AI kami sedang menganalisis CV Anda secara mendalam. Silakan cek hasil selengkapnya di Dasbor Anda. 🚀');
         navigate('/dashboard');
      }
      setIsUploading(false);
      setProgress(0);
    } finally {
      localStorage.removeItem('isAnalyzing');
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
            <Link to="/" className="hover:text-indigo-600 transition-colors">Cari Pekerjaan</Link>
            <Link to="/resources" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Analisis CV AI</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {userRole ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-sm font-medium text-white bg-indigo-600 px-5 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={() => { localStorage.removeItem('userRole'); window.location.reload(); }}
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
      <section className="px-8 py-20 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Buka kunci<br />
            <span className="text-indigo-600">jalur karier</span> dengan<br />
            presisi AI.
          </h1>
          <p className="text-lg text-slate-600 max-w-md leading-relaxed">
            Unggah CV Anda dan biarkan mesin Pelet kami memetakan keahlian Anda ke berbagai peluang global. Tidak perlu lagi input data manual.
          </p>
          
          <div className="flex gap-4">
            <div className="bg-indigo-50/50 rounded-xl p-4 flex-1 border border-indigo-100">
              <div className="text-indigo-600 font-bold text-xl mb-1">98%</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Akurasi Kecocokan</div>
            </div>
            
          </div>
        </div>
        
        {/* Upload Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Unggah CV Anda (PDF)</h3>
          <p className="text-sm text-slate-500 mb-6">Tarik dan lepas resume profesional Anda</p>
          
          <div 
            onClick={handleUploadClick}
            className="border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors p-10 text-center cursor-pointer mb-6 group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <CloudUpload size={24} className="text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Klik untuk mengunggah atau tarik & lepas</p>
            <p className="text-xs text-slate-400">Ukuran file maksimum: 10MB</p>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            className="hidden" 
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-medium rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mb-4"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : null}
            {isUploading ? 'Menganalisis CV...' : 'Analisis CV'} {isUploading ? '' : <Sparkles size={18} />}
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
            <Lock size={12} />
            <span>TERENKRIPSI & AMAN</span>
          </div>
        </div>
      </section>

      {/* Analysis Process Section (Only show if uploading) */}
      {isUploading && (
        <section className="py-12 bg-slate-100/50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-8">
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Cpu size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Menganalisis CV Anda...</h2>
              <p className="text-slate-500 text-sm mb-10 max-w-md mx-auto">
                Extracting skills, experience, and matching your profile to 50,000+ active roles.
              </p>
              
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                     {progress < 40 ? 'Parsing PDF...' : progress < 80 ? 'Scanning Keywords...' : 'Matching Roles...'}
                   </span>
                   <span className="text-xs font-bold text-indigo-600">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center px-4 md:px-12">
                <div className="flex flex-col items-center gap-2">
                  {progress >= 30 ? <CheckCircle2 className="text-indigo-600" size={24} /> : <Circle className="text-slate-300" size={24} />}
                  <span className="text-xs font-bold text-slate-700">Membaca PDF</span>
                </div>
                <div className="flex-1 h-px bg-slate-200 mx-4"></div>
                <div className="flex flex-col items-center gap-2">
                  {progress >= 70 ? <CheckCircle2 className="text-indigo-600" size={24} /> : <Circle className="text-slate-300" size={24} />}
                  <span className="text-xs font-bold text-slate-700">Pemetaan Keahlian</span>
                </div>
                <div className="flex-1 h-px bg-slate-200 mx-4"></div>
                <div className="flex flex-col items-center gap-2">
                  {progress >= 100 ? <CheckCircle2 className="text-indigo-600" size={24} /> : <Circle className="text-slate-300" size={24} />}
                  <span className="text-xs font-bold text-slate-400">Kecocokan Pasar</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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

export default ResourcesPage;
