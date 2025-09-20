import { supabase } from '../lib/supabaseClient';

export interface ResourceFromDB {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  created_at: string;
}

export interface ProcessedResource {
  id: string;
  name: string;
  displayName: string;
  fullPath: string;
  subject: string;
  type: string;
  unit?: string;
  publicUrl: string;
  size?: number;
  lastModified: string;
}

// Subject mapping from storage names to display names
const storageToSubjectMap: { [key: string]: string } = {
  // Database folder name -> Frontend display name (exact match from subjectMapping.ts)
  
  // Mathematics subjects
  'calculus 1': 'Calculus I - CAL1 (BAS 105)',
  'AM': 'Applied Mathematics - AM (BAS 101)',
  'EME': 'Elements of Mechanical Engineering - EME (BMA 106)',
  
  // Physics subjects
  'AP': 'Applied Physics - AP (BAS 102)',
  'PP': 'Programming with Python - PP (BAI 101)', // Note: PP in database might be Python, not Physics
  
  // Programming subjects
  'C': 'Programming with C - C (BCS 101)',
  'PF': 'Programming Fundamentals - PF (BAI 104)',
  'OOPS': 'Object Oriented Programming System - OOPS (BIT 102)',
  'DSA': 'Data Structures and Algorithms - DSA (BCS 103)',
  
  // Engineering subjects
  'BEE': 'Basics of Electrical and Electronics Engineering - BEE (BEC 101)',
  'EW': 'Electronics Workshop - EW (BEC 103)',
  
  // Web & IT subjects  
  'WAD': 'Web Application Development - WAD (BCS 102)',
  'ITW': 'IT Workshop - ITW (BAI 102)',
  'IDS': 'Introduction to Data Science - IDS (BAI 103)',
  'NAS': 'Network Analysis and Synthesis - NAS (BEC 104)',
  
  // Communication & Skills
  'CS': 'Communication Skills - CS (HMC 101)',
  'SSPD': 'Soft Skills and Personality Development - SSPD (HMC 102)',
  
  // Sciences
  'EVS': 'Environmental Sciences - EVS (BAS 104)',
  'PS': 'Probability and Statistics - PS (BAS 103)',
  'SS': 'Signals and Systems - SS (BEC 102)'
};

// Reverse mapping for filtering
const subjectToStorageMap: { [key: string]: string } = {};
Object.entries(storageToSubjectMap).forEach(([storage, display]) => {
  subjectToStorageMap[display] = storage;
});

class ResourcesService {
  /**
   * Get all resources from the database
   */
  async getAllResources(): Promise<ResourceFromDB[]> {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('file_name', { ascending: true });

      if (error) {
        console.error('Error fetching resources:', error);
        return [];
      }

      // Filter out placeholder files and other unwanted files
      const filteredData = (data || []).filter(resource => {
        const fileName = resource.file_name?.toLowerCase() || '';
        
        // Skip placeholder files
        if (fileName.includes('emptyfolderplaceholder')) {
          return false;
        }
        
        // Skip other common placeholder/system files
        if (fileName.includes('placeholder') || 
            fileName.includes('.ds_store') || 
            fileName.includes('thumbs.db') ||
            fileName.includes('desktop.ini')) {
          return false;
        }
        
        return true;
      });

      return filteredData;
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  }

  /**
   * Process file path to extract subject, type, and unit information
   */
  private processFilePath(filePath: string): {
    subject: string;
    type: string;
    unit?: string;
  } {
    // Remove leading slash if present
    const cleanPath = filePath.replace(/^\/+/, '');
    const pathParts = cleanPath.split('/');

    if (pathParts.length < 2) {
      return { subject: 'Unknown', type: 'Unknown' };
    }

    const storageSubject = pathParts[0];
    const type = pathParts[1];
    let unit: string | undefined;

    // Check if there's a unit folder (for notes/pyqs)
    if (pathParts.length > 3 && (type === 'notes' || type === 'pyqs')) {
      unit = pathParts[2];
    }

    // Map storage subject name to display name
    const displaySubject = storageToSubjectMap[storageSubject] || storageSubject;

    return {
      subject: displaySubject,
      type: type,
      unit: unit
    };
  }

  /**
   * Convert file name to display name (remove extension, format)
   */
  private getDisplayName(fileName: string): string {
    // Remove file extension
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    // Replace underscores and hyphens with spaces, capitalize words
    const formatted = nameWithoutExt
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    return formatted;
  }

  /**
   * Process raw database resources into frontend-compatible format
   */
  private processResources(rawResources: ResourceFromDB[]): ProcessedResource[] {
    return rawResources.map(resource => {
      const pathInfo = this.processFilePath(resource.file_path);
      
      return {
        id: resource.id,
        name: resource.file_name,
        displayName: this.getDisplayName(resource.file_name),
        fullPath: resource.file_path,
        subject: pathInfo.subject,
        type: pathInfo.type,
        unit: pathInfo.unit,
        publicUrl: resource.public_url,
        lastModified: resource.created_at
      };
    });
  }

  /**
   * Get filtered resources based on subjects, types, and search query
   */
  async getFilteredResources(filters: {
    subjects?: string[];
    types?: string[];
    searchQuery?: string;
  }): Promise<ProcessedResource[]> {
    try {
      const { subjects = [], types = [], searchQuery = '' } = filters;

      // If no subjects or types specified, return empty array
      if (subjects.length === 0 || types.length === 0) {
        return [];
      }

      // Get all resources from database
      const rawResources = await this.getAllResources();
      
      // Process them into the format expected by frontend
      const processedResources = this.processResources(rawResources);

      // Filter by subjects and types
      let filteredResources = processedResources.filter(resource => {
        const subjectMatch = subjects.includes(resource.subject);
        const typeMatch = types.includes(resource.type);
        return subjectMatch && typeMatch;
      });

      // Apply search filter if specified
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filteredResources = filteredResources.filter(resource => {
          const nameMatch = resource.name.toLowerCase().includes(query);
          const displayMatch = resource.displayName.toLowerCase().includes(query);
          const subjectMatch = resource.subject.toLowerCase().includes(query);
          const typeMatch = resource.type.toLowerCase().includes(query);
          const unitMatch = resource.unit ? resource.unit.toLowerCase().includes(query) : false;
          
          return nameMatch || displayMatch || subjectMatch || typeMatch || unitMatch;
        });
      }

      return filteredResources;

    } catch (error) {
      console.error('Error getting filtered resources:', error);
      return [];
    }
  }

  /**
   * Get resources for specific subjects and types (compatibility with old interface)
   */
  async getFilteredFiles(filters: {
    subjects?: string[];
    types?: string[];
    searchQuery?: string;
  }): Promise<ProcessedResource[]> {
    return this.getFilteredResources(filters);
  }
}

export const resourcesService = new ResourcesService();
export default resourcesService;

