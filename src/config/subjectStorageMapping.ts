// Map between display names and storage folder names
export const subjectToStorageMap: { [key: string]: string } = {
  'Applied Mathematics - AM (BAS 101)': 'AM',
  'Applied Physics - AP (BAS 102)': 'AP',
  'Programming with C - C (BCS 101)': 'C',
  'IT Workshop - ITW (BAI 102)': 'ITW',
  'Introduction to Data Science - IDS (BAI 103)': 'IDS',
  'Basics of Electrical and Electronics Engineering - BEE (BEC 101)': 'BEE',
  'Web Application Development - WAD (BCS 102)': 'WAD',
  'Communication Skills - CS (HMC 101)': 'CS',
  'Analog Communication Systems (ACS)': 'ACS',
  'Probability and Statistics - PS (BAS 103)': 'PS',
  'Environmental Sciences - EVS (BAS 104)': 'EVS',
  'Data Structures and Algorithms - DSA (BCS 103)': 'DSA',
  'Mobile Application Development - MAD (BCS 104)': 'MAD',
  'Soft Skills and Personality Development - SSPD (HMC 102)': 'SSPD',
  'Programming with Python - PP (BAI 101)': 'PP',
  'Fundamentals of Electrical Sciences - FES (BEC 105)': 'FES',
  'Signals and Systems - SS (BEC 102)': 'SS',
  'Programming Fundamentals - PF (BAI 104)': 'PF',
  'Electronics Workshop - EW (BEC 103)': 'EW',
  'Network Analysis and Synthesis - NAS (BEC 104)': 'NAS',
  'Object Oriented Programming System - OOPS (BIT 102)': 'OOPS',
  'Elements of Mechanical Engineering - EME (BMA 106)': 'EME',
  'Workshop Practice - WP (BMA 107)': 'WP',
  'Production Technology - I (PT1)': 'PT-1',
  'Engineering Graphics - EG (BMA 102)': 'EG',
  'Engineering Mechanics - EM (BMA 103)': 'EM',
  'Calculus I - CAL1 (BAS 105)': 'calculus_1',
  'Calculus II - CAL2 (BAS 106)': 'calculus_2',
  'Linear Algebra - LA (BAS 107)': 'LA',
  'Programming Tools for Mathematics - PTM (BAS 108)': 'PTM',
  'IKS/UHV': 'IKS&UHV',
  'Design and Analysis of Algorithms (DAA)': 'DAA',
  'Operating Systems (OS)': 'OS',
  'Fundamentals of Devops (FD)': 'Devops',
  'Computer Aided Engineering': 'CAE',
  'Engineering Materials (EM)': 'EMATERIAL',
  'Software Engineering (SE)': 'SWE',
  'Digital System Design (DSD)': 'DSD',
  'Introduction to Robotics and Automation': 'Robotics',
  'Cyber Security Awareness': 'CyberSec',

  // 5th Semester Subjects
  // MAE/DMAM
  'Machine Design (BMA 301)': 'MD',
  'Automobile Engineering (BMA 302)': 'AutoE',
  'Applied Measurement & Industrial Metrology (BMA 303)': 'AMIM',
  'Artificial Intelligence in MAE (BMA 304)': 'AIMA',
  'Mechanical Vibrations (BMA 305)': 'MV',
  'Automation in Manufacturing (BMA 306)': 'AutoM',
  'Production Planning, Costing and Control (BMA 307)': 'PPCC',
  'Disaster Management/NCC (AEC 301)': 'AEC301',
  'Elements of CNC and Robotics (BMA 308)': 'ECRP',
  'Internship (BMA 350)': 'BMA350',

  // ECE / ECE-AI
  'Digital Signal Processing (BEC 301)': 'BEC301',
  'Hardware Modeling using Verilog (BEC 302)': 'HMV',
  'Microwave Theory and Techniques (BEC 303)': 'MTT',
  'Machine Learning (BAI 301)': 'BAI301',
  'IC Fabrication (BEC 304)': 'ICF',
  'Computer Architecture (BEC 305)': 'CA',
  'Data Communication and Computer Networks (BIT 301)': 'DCCN',
  'Embedded Systems (BEC 306)': 'BEC306',
  'Internship (BEC 350)': 'BEC350',

  // AI&ML / IT
  'Java Programming (BIT 302)': 'JP',
  'Software Engineering (BIT 205)': 'BIT205',
  'Theory of Computation (BCS 301)': 'TOC',
  'Blockchain Technologies (BIT 303)': 'BT',
  'Social Network and Mining (BIT 304)': 'SNM',
  'Quantum Computing (BIT 305)': 'QC',
  'Digital Forensics (BIT 306)': 'DF',
  'Competitive Coding (BIT 307)': 'BIT307',
  'Internship (BAM 350)': 'BAM350',
  'Artificial Intelligence (BAI 202)': 'AI',
  'Internship (BIT 350)': 'BIT350',

  // CSE / CSE-AI
  'Object Oriented Programming (BIT 202)': 'OOPS',
  'Data Analytics Models and Algorithms (BCS 302)': 'DAMA',
  'Human Computer Interaction (BCS 303)': 'HCI',
  'Cryptography (BIT 319)': 'CRPYT',
  'Cloud Computing Systems and Applications (BCS 304)': 'CCSA',
  'Internship (BCS 350)': 'BCS350',
  'Digital Image Processing (BEC 310)': 'DIP',
  'Recommender Systems (BAI 302)': 'RS',
  'Information Retrieval (BIT 317)': 'IR',
  'Internship (BAI 350)': 'BAI350'
};

// A Drive folder can serve multiple curriculum display names. Resolve against
// the selected subjects rather than letting a reverse map pick one semester.
const subjectStorageAliases: Record<string, string[]> = {
  'IKS/UHV': ['IKS', 'UHV', 'UH', 'IKS/UHV', 'IKS/UH', 'IKS&UHV', 'IKS&UH'],
  'Software Engineering (SE)': ['SE', 'SWE'],
  'Software Engineering (BIT 205)': ['SE', 'SWE', 'BIT205'],
  'Production Technology - I (PT1)': ['PT', 'PT1', 'PT-1'],
  'Engineering Materials (EM)': ['EMat', 'EMATERIAL'],
  'Engineering Mechanics - EM (BMA 103)': ['EMECH', 'EMech', 'EM'],
  'Object Oriented Programming (BIT 202)': ['OOPS', 'OOP', 'BIT202'],
  'Artificial Intelligence (BAI 202)': ['AI', 'BAI202'],
  'Artificial Intelligence (AI)': ['AI', 'BAI202'],
  'Theory of Computation (BCS 301)': ['TOC', 'BCS301'],
  'Data Communication and Computer Networks (BIT 301)': ['DCCN', 'BIT301'],
  'Cryptography (BIT 319)': ['CRPYT', 'CRYPT', 'CRYPTO', 'BIT319'],
  'Cloud Computing Systems and Applications (BCS 304)': ['CCSA', 'CSSA', 'BCS304'],
};

export const normalizeStorageSubject = (value: string): string =>
  value.trim().toLowerCase().replace(/[\s_-]+/g, '');

export const matchesStorageSubject = (subject: string, folder: string): boolean => {
  const aliases = [subject, subjectToStorageMap[subject], ...(subjectStorageAliases[subject] || [])];
  return aliases.some(alias => alias && normalizeStorageSubject(alias) === normalizeStorageSubject(folder));
};

// Reverse mapping for display names
export const storageToSubjectMap: { [key: string]: string } = 
  Object.entries(subjectToStorageMap).reduce((acc, [display, storage]) => {
    acc[storage] = display;
    return acc;
  }, {} as { [key: string]: string });
