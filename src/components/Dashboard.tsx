import { GlassCard } from './GlassCard';
import { Book, FileText, Users, ShoppingBag, Calendar, User, Upload, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Button } from './ui/button';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { userProfile } = useAuth();
  
  // Timetable state management
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [timetableImage, setTimetableImage] = useState<string | null>(
    localStorage.getItem('campusbae_timetable') || null
  );

  const branchResources = [
    { name: 'Data Structures', semester: 'Sem 3', type: 'Notes', icon: <Book size={24} /> },
    { name: 'Computer Networks', semester: 'Sem 5', type: 'PYQs', icon: <FileText size={24} /> },
    { name: 'Database Systems', semester: 'Sem 4', type: 'Books', icon: <Book size={24} /> },
    { name: 'Operating Systems', semester: 'Sem 4', type: 'Syllabus', icon: <FileText size={24} /> }
  ];

  const societies = [
    { name: 'TechSoc IGDTUW', type: 'Technical', members: '500+' },
    { name: 'Cultural Society', type: 'Cultural', members: '300+' },
    { name: 'Literary Club', type: 'Literary', members: '200+' },
    { name: 'Sports Club', type: 'Sports', members: '400+' }
  ];

  const marketplaceItems = [
    { title: 'Data Structures Textbook', price: '₹800', seller: 'Priya S.' },
    { title: 'Scientific Calculator', price: '₹500', seller: 'Ananya K.' },
    { title: 'Lab Coat (Size M)', price: '₹300', seller: 'Shruti M.' }
  ];

  // Timetable functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTimetableImage(result);
        localStorage.setItem('campusbae_timetable', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTimetable = () => {
    setTimetableImage(null);
    localStorage.removeItem('campusbae_timetable');
  };

  const handleCloseTimetableModal = () => {
    setShowTimetableModal(false);
  };

  return (
    <div className="pt-24 pb-12 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto bg-transparent">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: '#EAEAEA' }}>
                Hey {userProfile?.name || 'Student'}, welcome back 👋
              </h1>
              <p style={{ color: '#A0AEC0' }}>
                Your campus companion is ready to help you succeed.
              </p>
            </div>
            <Button
              onClick={() => setShowTimetableModal(true)}
              className="bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border-[#00E5FF]/50 text-[#00E5FF] hover:text-[#00E5FF] flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                borderColor: 'rgba(0, 229, 255, 0.3)',
                border: '1px solid'
              }}
            >
              <Calendar size={18} />
              Timetable
            </Button>
          </div>
        </div>

        {/* Branch Resources Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold" style={{ color: '#EAEAEA' }}>
              Branch Resources
            </h2>
            <button
              onClick={() => onNavigate('resources')}
              className="text-[#00E5FF] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branchResources.map((resource, index) => (
              <GlassCard key={index} className="cursor-pointer group hover:scale-[1.02] transition-transform">
                <div className="flex items-center mb-3 text-[#00E5FF]">
                  {resource.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#EAEAEA' }}>
                  {resource.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#A0AEC0' }}>
                  {resource.semester} • {resource.type}
                </p>
                <div className="text-xs" style={{ color: '#00E5FF' }}>
                  Click to access →
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Clubs & Societies Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold" style={{ color: '#EAEAEA' }}>
              Clubs & Societies
            </h2>
            <button
              onClick={() => onNavigate('societies')}
              className="text-[#00E5FF] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {societies.map((society, index) => (
              <GlassCard key={index} className="cursor-pointer">
                <div className="flex items-center mb-3 text-[#00E5FF]">
                  <Users size={24} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#EAEAEA' }}>
                  {society.name}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#A0AEC0' }}>
                  {society.type}
                </p>
                <div className="text-xs" style={{ color: '#00E5FF' }}>
                  {society.members} members
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Marketplace Preview */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold" style={{ color: '#EAEAEA' }}>
              Marketplace
            </h2>
            <button
              onClick={() => onNavigate('marketplace')}
              className="text-[#00E5FF] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map((item, index) => (
              <GlassCard key={index} className="cursor-pointer">
                <div className="flex items-center mb-3 text-[#00E5FF]">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#EAEAEA' }}>
                  {item.title}
                </h3>
                <p className="text-lg font-semibold mb-2" style={{ color: '#00E5FF' }}>
                  {item.price}
                </p>
                <p className="text-sm" style={{ color: '#A0AEC0' }}>
                  Seller: {item.seller}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#EAEAEA' }}>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="cursor-pointer" hover={true}>
              <div 
                className="flex items-center p-4"
                onClick={() => onNavigate('profile')}
              >
                <Calendar size={32} className="text-[#00E5FF] mr-4" />
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#EAEAEA' }}>
                    Attendance Tracker
                  </h3>
                  <p style={{ color: '#A0AEC0' }}>
                    Track your attendance across all subjects
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="cursor-pointer" hover={true}>
              <div 
                className="flex items-center p-4"
                onClick={() => onNavigate('networking')}
              >
                <User size={32} className="text-[#00E5FF] mr-4" />
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#EAEAEA' }}>
                    Student Network
                  </h3>
                  <p style={{ color: '#A0AEC0' }}>
                    Connect with fellow students
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Timetable Modal Overlay */}
      {showTimetableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold" style={{ color: '#EAEAEA' }}>
                My Timetable
              </h3>
              <button
                onClick={handleCloseTimetableModal}
                className="text-gray-400 hover:text-gray-200 p-1 rounded-lg hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {!timetableImage ? (
                /* Upload Section */
                <div className="text-center py-12">
                  <Upload size={48} className="mx-auto mb-4 text-[#00E5FF]" />
                  <h4 className="text-lg font-semibold mb-2" style={{ color: '#EAEAEA' }}>
                    Upload Your Timetable
                  </h4>
                  <p className="text-sm mb-6" style={{ color: '#A0AEC0' }}>
                    Upload an image of your class timetable to keep it handy
                  </p>
                  <label htmlFor="timetable-upload" className="cursor-pointer">
                    <div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'rgba(0, 229, 255, 0.1)',
                        borderColor: 'rgba(0, 229, 255, 0.3)',
                        color: '#00E5FF'
                      }}
                    >
                      <Upload size={18} />
                      Choose Image
                    </div>
                  </label>
                  <input
                    id="timetable-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs mt-3" style={{ color: '#A0AEC0' }}>
                    Supported formats: PNG, JPG, JPEG
                  </p>
                </div>
              ) : (
                /* Display Timetable Section */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold" style={{ color: '#EAEAEA' }}>
                      Your Timetable
                    </h4>
                    <Button
                      onClick={handleRemoveTimetable}
                      className="bg-red-600/20 hover:bg-red-600/30 border-red-500/50 text-red-200 px-3 py-1 text-sm"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </Button>
                  </div>
                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <img
                      src={timetableImage}
                      alt="Student Timetable"
                      className="w-full h-auto max-h-96 object-contain"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <label htmlFor="timetable-replace" className="cursor-pointer">
                      <div 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 text-sm"
                        style={{
                          backgroundColor: 'rgba(0, 229, 255, 0.1)',
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                          color: '#00E5FF'
                        }}
                      >
                        <Upload size={16} />
                        Replace Timetable
                      </div>
                    </label>
                    <input
                      id="timetable-replace"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}