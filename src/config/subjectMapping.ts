export interface SubjectMapping {
  [branch: string]: {
    [semester: string]: string[];
  };
}

export const subjectMapping: SubjectMapping = {
  'CSE': {
    '1': ['C', 'CS', 'ITW', 'IDS', 'WAD'],
    '2': ['DS', 'ITW', 'IDS', 'WAD', 'SSPD', 'EVS', 'PS']
  },
  'CSE-AI': {
    '1': ['PS', 'EVS', 'PP', 'ITW', 'WAD', 'CS'],
    '2': ['C', 'DS', 'ITW', 'IDS', 'WAD', 'SSPD', 'EVS']
  },
  'ECE': {
    '1': ['SS', 'PF', 'IDS', 'WAD', 'EW', 'CS'],
    '2': ['NAS', 'PF', 'IDS', 'WAD', 'ITW', 'SSPD', 'EVS', 'CS']
  },
  'ECE-AI': {
    '1': ['SS', 'PF', 'IDS', 'WAD', 'EW', 'CS'],
    '2': ['NAS', 'PF', 'IDS', 'WAD', 'ITW', 'SSPD', 'EVS', 'CS']
  },
  'IT': {
    '1': ['PP', 'ITW', 'WAD', 'CS'],
    '2': ['OOPS', 'IDS', 'ITW', 'WAD', 'SSPD', 'EVS', 'PS', 'CS']
  },
  'AI&ML': {
    '1': ['PS', 'EVS', 'PP', 'ITW', 'WAD', 'CS'],
    '2': ['C', 'OOPS', 'ITW', 'IDS', 'WAD', 'SSPD', 'EVS', 'CS']
  },
  'MAE/DMAM': {
    '1': ['PF', 'IDS', 'WAD', 'CS'],
    '2': ['PF', 'EG', 'IDS', 'WAD', 'SSPD', 'EVS', 'PS', 'CS']
  }
};

export const branches = ['CSE', 'CSE-AI', 'ECE', 'ECE-AI', 'IT', 'AI&ML', 'MAE/DMAM'];
export const semesters = ['1', '2'];
export const types = ['notes', 'pyqs', 'syllab', 'book'];

// Get subjects for a specific branch and semester
export const getSubjectsForBranchSemester = (branch: string, semester: string): string[] => {
  return subjectMapping[branch]?.[semester] || [];
};

// Get all unique subjects across all branches and semesters
export const getAllSubjects = (): string[] => {
  const allSubjects = new Set<string>();
  Object.values(subjectMapping).forEach(semesters => {
    Object.values(semesters).forEach(subjects => {
      subjects.forEach(subject => allSubjects.add(subject));
    });
  });
  return Array.from(allSubjects).sort();
};