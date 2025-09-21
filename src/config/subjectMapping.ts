export interface SubjectMapping {
  [branch: string]: {
    [semester: string]: string[];
  };
}

export const subjectMapping: SubjectMapping = {
  'CSE': {
    '1': [
      'Applied Mathematics - AM (BAS 101)',
      'Applied Physics - AP (BAS 102)',
      'Programming with C - C (BCS 101)',
      'IT Workshop - ITW (BAI 102)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Web Application Development - WAD (BCS 102)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Probability and Statistics - PS (BAS 103)',
      'Environmental Sciences - EVS (BAS 104)',
      'Data Structures and Algorithms - DSA (BCS 103)',
      'IT Workshop - ITW (BAI 102)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Mobile Application Development - MAD (BCS 104)',
      'Soft Skills and Personality Development - SSPD (HMC 102)'
    ]
  },
  'CSE-AI': {
    '1': [
      'Probability and Statistics - PS (BAS 103)',
      'Environmental Sciences - EVS (BAS 104)',
      'Programming with Python - PP (BAI 101)',
      'Web Application Development - WAD (BCS 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'IT Workshop - ITW (BAI 102)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Applied Mathematics - AM (BAS 101)',
      'Applied Physics - AP (BAS 102)',
      'Data Structures and Algorithms - DSA (BCS 103)',
      'Web Application Development - WAD (BCS 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Soft Skills and Personality Development - SSPD (HMC 102)'
    ]
  },
  'ECE': {
    '1': [
      'Applied Mathematics - AM (BAS 101)',
      'Fundamentals of Electrical Sciences - FES (BEC 105)',
      'Signals and Systems - SS (BEC 102)',
      'Programming Fundamentals - PF (BAI 104)',
      'Web Application Development - WAD (BCS 102)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Electronics Workshop - EW (BEC 103)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Environmental Sciences (BAS 104)',
      'Applied Physics (BAS 102)',
      'Network Analysis and Synthesis (BEC 104)',
      'Programming Fundamentals (BAI 104)',
      'Web Application Development (BCS 102)',
      'Introduction to Data Science (BAI 103)',
      'IT Workshop (BAI 102)',
      'Soft Skills and Personality Development (HMC 102)'
    ]
  },
  'ECE-AI': {
    '1': [
      'Applied Mathematics - AM (BAS 101)',
      'Fundamentals of Electrical Sciences - FES (BEC 105)',
      'Signals and Systems - SS (BEC 102)',
      'Programming Fundamentals - PF (BAI 104)',
      'Web Application Development - WAD (BCS 102)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Electronics Workshop - EW (BEC 103)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Environmental Sciences - EVS (BAS 104)',
      'Applied Physics - AP (BAS 102)',
      'Network Analysis and Synthesis - NAS (BEC 104)',
      'Programming Fundamentals - PF (BAI 104)',
      'Web Application Development - WAD (BCS 102)',
      'Introduction to Data Science - IDS (BAI 103)',
      'IT Workshop - ITW (BAI 102)',
      'Soft Skills and Personality Development - SSPD (HMC 102)'
    ]
  },
  'IT': {
    '1': [
      'Applied Mathematics - AM (BAS 101)',
      'Applied Physics - AP (BAS 102)',
      'Programming with Python - PP (BAI 101)',
      'IT Workshop - ITW (BAI 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Web Application Development - WAD (BCS 102)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Probability and Statistics - PS (BAS 103)',
      'Environmental Sciences - EVS (BAS 104)',
      'Object Oriented Programming System - OOPS (BIT 102)',
      'IT Workshop - ITW (BAI 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Soft Skills and Personality Development - SSPD (HMC 102)'
    ]
  },
  'AI&ML': {
    '1': [
      'Probability and Statistics - PS (BAS 103)',
      'Environmental Sciences - EVS (BAS 104)',
      'Programming with Python - PP (BAI 101)',
      'IT Workshop - ITW (BAI 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Web Application Development - WAD (BCS 102)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Applied Mathematics - AM (BAS 101)',
      'Applied Physics - AP (BAS 102)',
      'Object Oriented Programming System - OOPS (BIT 102)',
      'IT Workshop - ITW (BAI 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Soft Skills and Personality Development - SSPD (HMC 102)'
    ]
  },
  'MAE/DMAM': {
    '1': [
      'Applied Mathematics - AM (BAS 101)',
      'Applied Physics - AP (BAS 102)',
      'Elements of Mechanical Engineering - EME (BMA 106)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Programming Fundamentals - PF (BAI 104)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Web Application Development - WAD (BCS 102)',
      'Workshop Practice - WP (BMA 107)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Probability and Statistics - PS (BAS 103)',
      'Environmental Sciences - EVS (BAS 104)',
      'Engineering Mechanics - EM (BMA 103)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Programming Fundamentals - PF (BAI 104)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Web Application Development - WAD (BCS 102)',
      'Soft Skills and Personality Development - SSPD (HMC 102)'
    ]
  },
  'MAC': {
    '1': [
      'Calculus I - CAL1 (BAS 105)',
      'Environmental Sciences - EVS (BAS 104)',
      'Programming with C - C (BCS 101)',
      'IT Workshop - ITW (BAI 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Web Application Development - WAD (BCS 102)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Communication Skills - CS (HMC 101)'
    ],
    '2': [
      'Calculus II - CAL2 (BAS 106)',
      'Applied Physics - AP (BAS 102)',
      'Linear Algebra - LA (BAS 107)',
      'IT Workshop - ITW (BAI 102)',
      'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
      'Web Application Development - WAD (BCS 102)',
      'Introduction to Data Science - IDS (BAI 103)',
      'Programming Tools for Mathematics - PTM (BAS 108)',
      'Soft Skills and Personality Development - SSPD (HMC 102)'
    ]
  }
};

export const branches = ['CSE', 'CSE-AI', 'ECE', 'ECE-AI', 'IT', 'AI&ML', 'MAE/DMAM', 'MAC'];
export const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
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
