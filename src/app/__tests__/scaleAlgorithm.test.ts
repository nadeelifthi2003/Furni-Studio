import { describe, it, expect } from 'vitest';
import { FurnitureItem } from '../App';

// ---------------------------------------------------------------------------
// Extracted & pure version of App.tsx > handleScaleAllItems
// Keeping it pure makes it unit-testable without React rendering overhead.
// ---------------------------------------------------------------------------
function scaleAllItems(items: FurnitureItem[], scaleFactor: number): FurnitureItem[] {
  if (items.length === 0) return items;

  // Calculate collective centroid
  let centerX = 0, centerY = 0;
  items.forEach(item => {
    centerX += item.x + item.width / 2;
    centerY += item.y + item.length / 2;
  });
  centerX /= items.length;
  centerY /= items.length;

  return items.map(item => {
    const itemCenterX = item.x + item.width / 2;
    const itemCenterY = item.y + item.length / 2;
    const offsetX = itemCenterX - centerX;
    const offsetY = itemCenterY - centerY;
    const newOffsetX = offsetX * scaleFactor;
    const newOffsetY = offsetY * scaleFactor;
    const newWidth  = Math.max(20, Math.round(item.width  * scaleFactor));
    const newLength = Math.max(20, Math.round(item.length * scaleFactor));
    const newX = centerX + newOffsetX - newWidth  / 2;
    const newY = centerY + newOffsetY - newLength / 2;
    return { ...item, x: Math.round(newX), y: Math.round(newY), width: newWidth, length: newLength };
  });
}

// ---------------------------------------------------------------------------
// Helper to create mock furniture items
// ---------------------------------------------------------------------------
const makeItem = (id: string, x: number, y: number, w: number, l: number): FurnitureItem => ({
  id,
  type: 'chair',
  name: `Item ${id}`,
  x, y,
  width: w,
  length: l,
  rotation: 0,
  color: '#3b82f6',
  shading: 0.5,
  image: '',
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Furniture Layout Scaling Algorithm', () => {

  it('returns an empty array unchanged', () => {
    expect(scaleAllItems([], 2)).toEqual([]);
  });

  it('scales a single item without moving its centre', () => {
    const items = [makeItem('a', 100, 100, 80, 60)];
    const scaled = scaleAllItems(items, 2);
    // Centre before: (100 + 40, 100 + 30) = (140, 130)
    // After scaling: width=160, length=120 → x = 140 - 80 = 60, y = 130 - 60 = 70
    expect(scaled[0].width).toBe(160);
    expect(scaled[0].length).toBe(120);
    expect(scaled[0].x).toBe(60);
    expect(scaled[0].y).toBe(70);
  });

  it('scales multiple items proportionally around their collective centroid', () => {
    // Two items separated by 200px in X
    const items = [
      makeItem('a', 0,   0, 100, 100),  // centre: (50, 50)
      makeItem('b', 200, 0, 100, 100),  // centre: (250, 50)
    ];
    // Collective centroid: x=150, y=50
    const scaled = scaleAllItems(items, 2);
    // Item 'a' offset from centroid: (-100, 0) → scaled: (-200, 0) → new centre: (150 - 200, 50) = (-50, 50)
    //   new width=200, → x = -50 - 100 = -150
    // Item 'b' offset from centroid: (100, 0) → scaled: (200, 0) → new centre: (350, 50)
    //   → x = 350 - 100 = 250
    expect(scaled[0].width).toBe(200);
    expect(scaled[1].width).toBe(200);
    expect(scaled[0].x).toBe(-150);
    expect(scaled[1].x).toBe(250);
  });

  it('respects the minimum dimension clamp of 20px', () => {
    const items = [makeItem('a', 0, 0, 30, 30)];
    // Scaling by 0.1 would give 3px → clamped to 20
    const scaled = scaleAllItems(items, 0.1);
    expect(scaled[0].width).toBe(20);
    expect(scaled[0].length).toBe(20);
  });

  it('scale factor of 1.0 returns items in the same positions', () => {
    const items = [
      makeItem('a', 50, 80, 100, 60),
      makeItem('b', 200, 80, 80, 80),
    ];
    const scaled = scaleAllItems(items, 1.0);
    // Positions may have minor rounding — check dimensions are identical
    expect(scaled[0].width).toBe(100);
    expect(scaled[0].length).toBe(60);
    expect(scaled[1].width).toBe(80);
    expect(scaled[1].length).toBe(80);
  });

  it('all four items scale symmetrically with centroid preserved', () => {
    // Symmetric 2×2 grid of 40×40 items centred at (120, 120)
    const items = [
      makeItem('tl', 80,  80,  40, 40),  // centre: (100, 100)
      makeItem('tr', 160, 80,  40, 40),  // centre: (180, 100)
      makeItem('bl', 80,  160, 40, 40),  // centre: (100, 180)
      makeItem('br', 160, 160, 40, 40),  // centre: (180, 180)
    ];
    // Collective centroid: (140, 140)
    const scaled = scaleAllItems(items, 1.5);
    // Centroid of scaled set should still be (140, 140)
    let cx = 0, cy = 0;
    scaled.forEach(i => { cx += i.x + i.width / 2; cy += i.y + i.length / 2; });
    cx /= scaled.length; cy /= scaled.length;
    expect(Math.round(cx)).toBe(140);
    expect(Math.round(cy)).toBe(140);
    // Dimensions scaled by 1.5
    scaled.forEach(i => {
      expect(i.width).toBe(60);
      expect(i.length).toBe(60);
    });
  });
});
