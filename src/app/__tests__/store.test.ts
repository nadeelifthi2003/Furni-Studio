import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';
import { Project, RoomConfig, LightingSettings } from '../App';

const MOCK_CONFIG: RoomConfig = { width: 400, length: 400, height: 250, shape: "Rectangle", wallColor: "#fff" };
const MOCK_LIGHTS: LightingSettings = { ambientIntensity: 50, shadowSoftness: 50, directionalIntensity: 50, environmentPreset: "Daylight" };

const createMockProject = (id: string, name: string): Project => ({
  id,
  name,
  lastModified: new Date().toISOString(),
  roomConfig: MOCK_CONFIG,
  items: [],
  lightingSettings: MOCK_LIGHTS,
});

describe('Zustand Global Store', () => {
  beforeEach(() => {
    useStore.setState({
      history: { past: [], present: createMockProject('proj-1', 'Initial'), future: [] },
      project: createMockProject('proj-1', 'Initial'),
      currentUser: null,
      viewMode: '2d'
    });
  });

  it('should initialize with correct default values', () => {
    const state = useStore.getState();
    expect(state.project.name).toBe('Initial');
    expect(state.history.past.length).toBe(0);
    expect(state.viewMode).toBe('2d');
  });

  it('should update project and correctly push to history', () => {
    const nextProject = createMockProject('proj-1', 'Updated Name');
    useStore.getState().updateProject(nextProject);

    const state = useStore.getState();
    expect(state.project.name).toBe('Updated Name');
    expect(state.history.past.length).toBe(1);
    expect(state.history.past[0].name).toBe('Initial');
  });

  it('should skip history if skipHistory flag is true', () => {
    const nextProject = createMockProject('proj-1', 'Silent Update');
    useStore.getState().updateProject(nextProject, true);

    const state = useStore.getState();
    expect(state.project.name).toBe('Silent Update');
    expect(state.history.past.length).toBe(0); // History did not grow
  });

  it('should correctly undo and redo states', () => {
    const state1 = createMockProject('proj-1', 'State 1');
    const state2 = createMockProject('proj-1', 'State 2');

    useStore.getState().updateProject(state1);
    useStore.getState().updateProject(state2);

    expect(useStore.getState().project.name).toBe('State 2');
    
    useStore.getState().undo();
    expect(useStore.getState().project.name).toBe('State 1');
    expect(useStore.getState().history.future.length).toBe(1);

    useStore.getState().redo();
    expect(useStore.getState().project.name).toBe('State 2');
    expect(useStore.getState().history.future.length).toBe(0);
  });
});
