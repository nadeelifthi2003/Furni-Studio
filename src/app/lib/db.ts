import { supabase } from './supabase';
import { Project } from '../App';
import { User } from '../types';

export const AuthService = {
  async signIn(email: string, role: 'designer' | 'admin'): Promise<{ user: User | null; error: Error | null }> {
    // In a full implementation, this uses supabase.auth.signInWithPassword
    // For this prototype, we'll simulate it but write to Supabase if we want
    try {
      if (email === "designer@furnihome.com" && role === "designer") {
        return { user: { email, role: 'designer', name: 'Pro Designer' }, error: null };
      }
      if (email === "admin@furnihome.com" && role === "admin") {
        return { user: { email, role: 'admin', name: 'System Admin' }, error: null };
      }
      return { user: null, error: new Error('Invalid credentials') };
    } catch (error: any) {
      return { user: null, error };
    }
  },

  async signUp(email: string, name: string, role: 'designer' | 'admin'): Promise<{ user: User | null; error: Error | null }> {
    // In a full implementation, this uses supabase.auth.signUp
    try {
      if (!email || !name) {
        return { user: null, error: new Error('Email and Name are required.') };
      }
      // Simulate successful registration
      return { user: { email, role, name }, error: null };
    } catch (error: any) {
      return { user: null, error };
    }
  },

  async signOut() {
    // await supabase.auth.signOut();
  }
};

export const ProjectService = {
  async getProjects(): Promise<{ projects: Project[]; error: Error | null }> {
    try {
      // In a real app: const { data, error } = await supabase.from('projects').select('*');
      // For fallback/prototype, fetching from localStorage until DB is fully seeded
      const stored = localStorage.getItem("furni_studio_projects");
      const projects: Project[] = stored ? JSON.parse(stored) : [];
      return { projects, error: null };
    } catch (error: any) {
      return { projects: [], error };
    }
  },

  async saveProject(project: Project): Promise<{ error: Error | null }> {
    try {
      // In a real app: const { error } = await supabase.from('projects').upsert(project);
      
      const stored = localStorage.getItem("furni_studio_projects");
      const projects: Project[] = stored ? JSON.parse(stored) : [];
      const existingIdx = projects.findIndex(p => p.id === project.id);
      
      if (existingIdx >= 0) {
        projects[existingIdx] = project;
      } else {
        projects.push(project);
      }
      localStorage.setItem("furni_studio_projects", JSON.stringify(projects));
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },
  
  async deleteProject(id: string): Promise<{ error: Error | null }> {
    try {
      // In a real app: const { error } = await supabase.from('projects').delete().eq('id', id);
      const stored = localStorage.getItem("furni_studio_projects");
      let projects: Project[] = stored ? JSON.parse(stored) : [];
      projects = projects.filter(p => p.id !== id);
      localStorage.setItem("furni_studio_projects", JSON.stringify(projects));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }
};
