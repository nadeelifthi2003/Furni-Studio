import { supabase } from './supabase';
import { Project } from '../App';
import { User } from '../types';

// ---------------------------------------------------------------------------
// Helper: Checks whether Supabase env vars are configured.
// If not, prints a warning and the caller should fall back to localStorage.
// ---------------------------------------------------------------------------
function hasSupabaseConfig(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('[Furni-Studio] Supabase env vars not set — falling back to localStorage.');
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Auth Service (prototype — mocked credentials, ready for real auth upgrade)
// ---------------------------------------------------------------------------
export const AuthService = {
  async signIn(email: string, role: 'designer' | 'admin'): Promise<{ user: User | null; error: Error | null }> {
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
    try {
      if (!email || !name) {
        return { user: null, error: new Error('Email and Name are required.') };
      }
      return { user: { email, role, name }, error: null };
    } catch (error: any) {
      return { user: null, error };
    }
  },

  async signOut() {
    // await supabase.auth.signOut();
  }
};

// ---------------------------------------------------------------------------
// Project Service — Real Supabase calls with localStorage fallback
// ---------------------------------------------------------------------------
export const ProjectService = {
  async getProjects(): Promise<{ projects: Project[]; error: Error | null; source: 'supabase' | 'localStorage' }> {
    if (hasSupabaseConfig()) {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('last_modified', { ascending: false });
        if (error) throw new Error(error.message);
        // Supabase returns snake_case — map to Project interface
        const projects: Project[] = (data || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          lastModified: row.last_modified,
          roomConfig: row.room_config,
          items: row.items,
          lightingSettings: row.lighting_settings,
        }));
        return { projects, error: null, source: 'supabase' };
      } catch (error: any) {
        console.error('[Furni-Studio] Supabase getProjects failed, falling back to localStorage:', error.message);
      }
    }
    // localStorage fallback
    const stored = localStorage.getItem("furni_studio_projects");
    const projects: Project[] = stored ? JSON.parse(stored) : [];
    return { projects, error: null, source: 'localStorage' };
  },

  async saveProject(project: Project): Promise<{ error: Error | null; source: 'supabase' | 'localStorage' }> {
    if (hasSupabaseConfig()) {
      try {
        const row = {
          id: project.id,
          name: project.name,
          last_modified: project.lastModified,
          room_config: project.roomConfig,
          items: project.items,
          lighting_settings: project.lightingSettings,
        };
        const { error } = await supabase.from('projects').upsert(row, { onConflict: 'id' });
        if (error) throw new Error(error.message);
        return { error: null, source: 'supabase' };
      } catch (error: any) {
        console.error('[Furni-Studio] Supabase saveProject failed, falling back to localStorage:', error.message);
      }
    }
    // localStorage fallback
    const stored = localStorage.getItem("furni_studio_projects");
    const projects: Project[] = stored ? JSON.parse(stored) : [];
    const existingIdx = projects.findIndex(p => p.id === project.id);
    if (existingIdx >= 0) {
      projects[existingIdx] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem("furni_studio_projects", JSON.stringify(projects));
    return { error: null, source: 'localStorage' };
  },

  async deleteProject(id: string): Promise<{ error: Error | null; source: 'supabase' | 'localStorage' }> {
    if (hasSupabaseConfig()) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw new Error(error.message);
        return { error: null, source: 'supabase' };
      } catch (error: any) {
        console.error('[Furni-Studio] Supabase deleteProject failed, falling back to localStorage:', error.message);
      }
    }
    // localStorage fallback
    const stored = localStorage.getItem("furni_studio_projects");
    let projects: Project[] = stored ? JSON.parse(stored) : [];
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem("furni_studio_projects", JSON.stringify(projects));
    return { error: null, source: 'localStorage' };
  }
};
