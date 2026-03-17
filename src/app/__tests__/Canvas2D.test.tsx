import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Canvas2D } from '../components/Canvas2D';
import { Project, RoomConfig, LightingSettings, FurnitureItem } from '../App';

// ---------------------------------------------------------------------------
// Mock setup
// ---------------------------------------------------------------------------

// Canvas2D uses no external libraries that need mocking — but RoomConfig
// references 'L-shape' shape from App which is fine.

const MOCK_ROOM_CONFIG: RoomConfig = {
  width: 500,
  length: 400,
  height: 250,
  shape: 'Rectangle',
  wallColor: '#f3f4f6',
};

const MOCK_LIGHTING: LightingSettings = {
  ambientIntensity: 70,
  shadowSoftness: 50,
  directionalIntensity: 80,
  environmentPreset: 'Daylight',
};

const makeMockProject = (items: FurnitureItem[] = []): Project => ({
  id: 'test-proj',
  name: 'Test Project',
  lastModified: new Date().toISOString(),
  roomConfig: MOCK_ROOM_CONFIG,
  items,
  lightingSettings: MOCK_LIGHTING,
});

const makeMockItem = (): FurnitureItem => ({
  id: 'item-1',
  type: 'chair',
  name: 'Test Chair',
  x: 100,
  y: 100,
  width: 80,
  length: 80,
  rotation: 0,
  color: '#3b82f6',
  shading: 0.5,
  image: '/test-chair.png',
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Canvas2D Component', () => {
  let onSelectItem: ReturnType<typeof vi.fn>;
  let updateProject: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSelectItem = vi.fn();
    updateProject = vi.fn();
  });

  it('renders the empty-state prompt when there are no furniture items', () => {
    render(
      <Canvas2D
        project={makeMockProject([])}
        selectedItemId={null}
        onSelectItem={onSelectItem}
        updateProject={updateProject}
      />
    );
    expect(screen.getByText(/Drag furniture from the library/i)).toBeTruthy();
  });

  it('renders a furniture item footprint (not a photo) when project.items has an entry', () => {
    const item = makeMockItem();
    const { container } = render(
      <Canvas2D
        project={makeMockProject([item])}
        selectedItemId={null}
        onSelectItem={onSelectItem}
        updateProject={updateProject}
      />
    );
    // FurnitureFootprint renders an SVG — confirm SVG is present
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    // Empty state should NOT be shown when items exist
    expect(screen.queryByText(/Drag furniture from the library/i)).toBeNull();
  });

  it('calls onSelectItem with item id on mousedown on a furniture item div', () => {
    const item = makeMockItem();
    const { container } = render(
      <Canvas2D
        project={makeMockProject([item])}
        selectedItemId={null}
        onSelectItem={onSelectItem}
        updateProject={updateProject}
      />
    );
    // The furniture item is the absolute-positioned div with cursor-move
    // Find it by its style (position absolute with left/top set)
    const itemDiv = container.querySelector('div[style*="position: absolute"][style*="cursor: move"]') as HTMLElement;
    expect(itemDiv).toBeTruthy();
    fireEvent.mouseDown(itemDiv!);
    expect(onSelectItem).toHaveBeenCalledWith('item-1');
  });

  it('calls updateProject removing the item when Delete key is pressed and item is selected', () => {
    const item = makeMockItem();
    const project = makeMockProject([item]);
    render(
      <Canvas2D
        project={project}
        selectedItemId="item-1"
        onSelectItem={onSelectItem}
        updateProject={updateProject}
      />
    );
    fireEvent.keyDown(window, { key: 'Delete' });
    expect(updateProject).toHaveBeenCalledTimes(1);
    const updatedProject: Project = updateProject.mock.calls[0][0];
    expect(updatedProject.items).toHaveLength(0);
  });

  it('renders the L-shape SVG polygon when shape is L-shape', () => {
    const project = makeMockProject([]);
    project.roomConfig = { ...MOCK_ROOM_CONFIG, shape: 'L-shape' };
    const { container } = render(
      <Canvas2D
        project={project}
        selectedItemId={null}
        onSelectItem={onSelectItem}
        updateProject={updateProject}
      />
    );
    // There should be SVG polygon elements for the L-shape
    const polygons = container.querySelectorAll('polygon');
    expect(polygons.length).toBeGreaterThan(0);
    // The first polygon's points should have 6 vertices (L-shape)
    const points = polygons[0].getAttribute('points') || '';
    const vertices = points.trim().split(' ').filter(Boolean);
    expect(vertices.length).toBe(6);
  });

  it('renders the Measure button and toggles state on click', () => {
    render(
      <Canvas2D
        project={makeMockProject([])}
        selectedItemId={null}
        onSelectItem={onSelectItem}
        updateProject={updateProject}
      />
    );
    const btn = screen.getByText(/^Measure$/i);
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(screen.getByText(/Exit Measure/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Exit Measure/i));
    expect(screen.getByText(/^Measure$/i)).toBeTruthy();
  });
});
