import { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter } from 'lucide-react';
import { ResourcesList } from './ResourcesList';
import { branches, semesters, types, getSubjectsForBranchSemester } from '../config/subjectMapping';

export function BranchResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // Available subjects based on branch and semester
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  // Update available subjects when branch or semester changes
  useEffect(() => {
    if (selectedBranch && selectedSemester) {
      const subjects = getSubjectsForBranchSemester(selectedBranch, selectedSemester);
      setAvailableSubjects(subjects);
      // Reset selected subjects when branch/semester changes
      setSelectedSubjects([]);
    } else {
      setAvailableSubjects([]);
      setSelectedSubjects([]);
    }
  }, [selectedBranch, selectedSemester]);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subject)) {
        return prev.filter(s => s !== subject);
      } else {
        return [...prev, subject];
      }
    });
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const selectAllSubjects = () => {
    setSelectedSubjects([...availableSubjects]);
  };

  const clearAllSubjects = () => {
    setSelectedSubjects([]);
  };

  const selectAllTypes = () => {
    setSelectedTypes([...types]);
  };

  const clearAllTypes = () => {
    setSelectedTypes([]);
  };


  return (
    <div className="pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#EAEAEA' }}>
            Branch Resources
          </h1>
          <p style={{ color: '#A0AEC0' }}>
            Access notes, previous year questions, books, and syllabus for all subjects
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-6 mb-8">
          {/* Primary Filters */}
          <GlassCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0AEC0]" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#EAEAEA'
                  }}
                />
              </div>

              {/* Branch Filter */}
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#EAEAEA' }}>
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Semester Filter */}
              <Select 
                value={selectedSemester} 
                onValueChange={setSelectedSemester}
                disabled={!selectedBranch}
              >
                <SelectTrigger style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#EAEAEA' }}>
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </GlassCard>

          {/* Subject Selection */}
          {availableSubjects.length > 0 && (
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>Subjects</h3>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllSubjects}
                    className="text-xs px-3 py-1 rounded-full transition-colors"
                    style={{ backgroundColor: 'rgba(0, 229, 255, 0.2)', color: '#00E5FF' }}
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearAllSubjects}
                    className="text-xs px-3 py-1 rounded-full transition-colors"
                    style={{ backgroundColor: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {availableSubjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    className={`text-sm px-3 py-2 rounded-lg transition-all ${
                      selectedSubjects.includes(subject) 
                        ? 'scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: selectedSubjects.includes(subject)
                        ? 'rgba(0, 229, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: selectedSubjects.includes(subject) ? '#00E5FF' : '#EAEAEA',
                      border: `1px solid ${selectedSubjects.includes(subject) 
                        ? 'rgba(0, 229, 255, 0.5)' 
                        : 'rgba(255, 255, 255, 0.1)'}`
                    }}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Type Selection */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#EAEAEA' }}>Resource Types</h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAllTypes}
                  className="text-xs px-3 py-1 rounded-full transition-colors"
                  style={{ backgroundColor: 'rgba(0, 229, 255, 0.2)', color: '#00E5FF' }}
                >
                  Select All
                </button>
                <button
                  onClick={clearAllTypes}
                  className="text-xs px-3 py-1 rounded-full transition-colors"
                  style={{ backgroundColor: 'rgba(255, 107, 107, 0.2)', color: '#FF6B6B' }}
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`text-sm px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    selectedTypes.includes(type) 
                      ? 'scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: selectedTypes.includes(type)
                      ? 'rgba(156, 39, 176, 0.3)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: selectedTypes.includes(type) ? '#9C27B0' : '#EAEAEA',
                    border: `1px solid ${selectedTypes.includes(type) 
                      ? 'rgba(156, 39, 176, 0.5)' 
                      : 'rgba(255, 255, 255, 0.1)'}`
                  }}
                >
                  <Filter size={16} />
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Resources List */}
        <ResourcesList
          selectedBranch={selectedBranch}
          selectedSemester={selectedSemester}
          selectedSubjects={selectedSubjects}
          selectedTypes={selectedTypes}
          searchQuery={searchQuery}
        />

        {/* Upload Note */}
        <GlassCard className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#EAEAEA' }}>
            Can't find what you're looking for?
          </h3>
          <p className="mb-4" style={{ color: '#A0AEC0' }}>
            Help your fellow students by uploading resources you have!
          </p>
          <p className="text-sm" style={{ color: '#00E5FF' }}>
            Upload feature coming soon...
          </p>
        </GlassCard>
      </div>
    </div>
  );
}