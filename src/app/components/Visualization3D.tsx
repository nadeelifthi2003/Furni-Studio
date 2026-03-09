import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Project } from "../App";

interface Visualization3DProps {
  project: Project;
  cameraResetTrigger?: number;
}

export function Visualization3D({ project, cameraResetTrigger }: Visualization3DProps) {
  useEffect(() => {
    if (cameraResetTrigger && cameraResetTrigger > 0 && controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(800, 800, 800);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [cameraResetTrigger]);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f4f6);
    sceneRef.current = scene;

    // Initialize Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(800, 800, 800);
    cameraRef.current = camera;

    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Add Lights with default intensity (will be updated)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(500, 1000, 500);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -1000;
    directionalLight.shadow.camera.right = 1000;
    directionalLight.shadow.camera.top = 1000;
    directionalLight.shadow.camera.bottom = -1000;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // Add Room (Floor and Walls)
    const buildRoom = () => {
      // Clear existing room
      scene.children = scene.children.filter(child =>
        child instanceof THREE.Light || child === furnitureGroupRef.current
      );

      const { width, length, height, wallColor } = project.roomConfig;

      // Floor
      const floorGeometry = new THREE.PlaneGeometry(width, length);
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: wallColor,
        roughness: 0.8,
        metalness: 0.1
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Grid helper on floor
      const grid = new THREE.GridHelper(Math.max(width, length), Math.max(width, length) / 20, 0xcccccc, 0xeeeeee);
      grid.position.y = 0.1;
      scene.add(grid);

      // Walls
      const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColor, side: THREE.DoubleSide });

      // Back wall
      const backWallGeo = new THREE.PlaneGeometry(width, height);
      const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
      backWall.position.set(0, height / 2, -length / 2);
      backWall.receiveShadow = true;
      scene.add(backWall);

      // Left wall
      const leftWallGeo = new THREE.PlaneGeometry(length, height);
      const leftWall = new THREE.Mesh(leftWallGeo, wallMaterial);
      leftWall.position.set(-width / 2, height / 2, 0);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      // Add a small skirting board for detail
      const skirtingGeo = new THREE.BoxGeometry(width, 10, 2);
      const skirting = new THREE.Mesh(skirtingGeo, new THREE.MeshStandardMaterial({ color: 0xdddddd }));
      skirting.position.set(0, 5, -length / 2 + 1);
      scene.add(skirting);
    };

    buildRoom();

    // Furniture Group
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);
    furnitureGroupRef.current = furnitureGroup;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      // Proper cleanup
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  // Update furniture items when project changes
  useEffect(() => {
    if (!furnitureGroupRef.current) return;

    // Clear existing furniture
    while (furnitureGroupRef.current.children.length > 0) {
      const obj = furnitureGroupRef.current.children[0] as THREE.Mesh;
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => mat.dispose());
      } else {
        obj.material.dispose();
      }
      furnitureGroupRef.current.remove(obj);
    }

    // Add new furniture items
    project.items.forEach((item) => {
      const material = new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 1 - item.shading,
        metalness: item.shading * 0.5
      });

      const group = new THREE.Group();
      let mainMesh: THREE.Mesh | null = null;

      // Procedurally generate specific geometries based on `item.type`
      if (item.type === 'chair') {
        // Chair: 4 Cylinder Legs + Flat Square Seat + Curved/Straight Back
        const legGeo = new THREE.CylinderGeometry(1.5, 1, item.length / 2, 8);
        const seatGeo = new THREE.BoxGeometry(item.width, 3, item.length);
        const backGeo = new THREE.BoxGeometry(item.width, item.length / 1.5, 4);

        const seat = new THREE.Mesh(seatGeo, material);
        seat.position.y = item.length / 2;

        const back = new THREE.Mesh(backGeo, material);
        back.position.set(0, item.length / 2 + item.length / 3, -item.length / 2 + 2);

        const legs = [
          [-item.width / 2 + 3, -item.length / 2 + 3],
          [item.width / 2 - 3, -item.length / 2 + 3],
          [-item.width / 2 + 3, item.length / 2 - 3],
          [item.width / 2 - 3, item.length / 2 - 3],
        ];

        legs.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, material);
          leg.position.set(pos[0], item.length / 4, pos[1]);
          leg.castShadow = true;
          leg.receiveShadow = true;
          group.add(leg);
        });

        seat.castShadow = true;
        seat.receiveShadow = true;
        back.castShadow = true;
        back.receiveShadow = true;

        group.add(seat);
        group.add(back);

      } else if (item.type === 'table') {
        // Dining Table: Thick flat Box base + 4 thick legs
        const topGeo = new THREE.BoxGeometry(item.width, 4, item.length);
        const legGeo = new THREE.CylinderGeometry(2, 2, item.length / 1.5, 12);

        const top = new THREE.Mesh(topGeo, material);
        // Elevate tabletop
        const tableHeight = item.length / 1.5;
        top.position.y = tableHeight;

        // Four legs
        const legs = [
          [-item.width / 2 + 5, -item.length / 2 + 5],
          [item.width / 2 - 5, -item.length / 2 + 5],
          [-item.width / 2 + 5, item.length / 2 - 5],
          [item.width / 2 - 5, item.length / 2 - 5],
        ];

        legs.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, material);
          leg.position.set(pos[0], tableHeight / 2, pos[1]);
          leg.castShadow = true;
          leg.receiveShadow = true;
          group.add(leg);
        });

        top.castShadow = true;
        top.receiveShadow = true;
        group.add(top);

      } else if (item.type === 'side-table') {
        // Marble Side Table: Circular/Square top + centralized cylinder stand + circular base plate
        const topGeo = new THREE.CylinderGeometry(item.width / 2, item.width / 2, 2, 32);
        const standGeo = new THREE.CylinderGeometry(1.5, 2, item.length, 16);
        const baseGeo = new THREE.CylinderGeometry(item.width / 3, item.width / 3, 1, 32);

        const top = new THREE.Mesh(topGeo, material);
        const stand = new THREE.Mesh(standGeo, material);
        const base = new THREE.Mesh(baseGeo, material);

        top.position.y = item.length;
        stand.position.y = item.length / 2;
        base.position.y = 0.5;

        [top, stand, base].forEach(mesh => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

      } else if (item.type === 'sofa') {
        // Sofa: Large base block + 2 side armrests + 1 large back block
        const seatGeo = new THREE.BoxGeometry(item.width, item.length / 3, item.length - 10);
        const armGeo = new THREE.BoxGeometry(15, item.length / 1.8, item.length);
        const backGeo = new THREE.BoxGeometry(item.width, item.length / 1.5, 15);

        const seat = new THREE.Mesh(seatGeo, material);
        const leftArm = new THREE.Mesh(armGeo, material);
        const rightArm = new THREE.Mesh(armGeo, material);
        const back = new THREE.Mesh(backGeo, material);

        seat.position.set(0, item.length / 6, 5);
        leftArm.position.set(-item.width / 2 + 7.5, item.length / 3.6, 0);
        rightArm.position.set(item.width / 2 - 7.5, item.length / 3.6, 0);
        back.position.set(0, item.length / 3, -item.length / 2 + 7.5);

        [seat, leftArm, rightArm, back].forEach(mesh => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

      } else if (item.type === 'bed') {
        const frameGeo = new THREE.BoxGeometry(item.width, 10, item.length);
        const mattressGeo = new THREE.BoxGeometry(item.width - 10, 20, item.length - 10);
        const headboardGeo = new THREE.BoxGeometry(item.width, 50, 10);
        const pillowGeo = new THREE.BoxGeometry(item.width / 2.5, 5, 20);

        const frame = new THREE.Mesh(frameGeo, material);
        const mattress = new THREE.Mesh(mattressGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }));
        const headboard = new THREE.Mesh(headboardGeo, material);
        const pillow1 = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
        const pillow2 = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xeeeeee }));

        frame.position.y = 5;
        mattress.position.y = 20;
        headboard.position.set(0, 25, -item.length / 2 + 5);
        pillow1.position.set(-item.width / 4, 32, -item.length / 2 + 25);
        pillow2.position.set(item.width / 4, 32, -item.length / 2 + 25);

        [frame, mattress, headboard, pillow1, pillow2].forEach(mesh => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

      } else if (item.type === 'lamp') {
        const baseGeo = new THREE.CylinderGeometry(15, 15, 2, 32);
        const poleGeo = new THREE.CylinderGeometry(2, 2, item.length, 16);
        const shadeGeo = new THREE.CylinderGeometry(12, 20, 30, 32);

        const base = new THREE.Mesh(baseGeo, material);
        const pole = new THREE.Mesh(poleGeo, material);
        const shade = new THREE.Mesh(shadeGeo, new THREE.MeshStandardMaterial({ color: 0xfffee0, emissive: 0x333322 }));

        base.position.y = 1;
        pole.position.y = item.length / 2;
        shade.position.y = item.length - 15;

        [base, pole, shade].forEach(mesh => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

        // Add a point light to the lamp
        const pointLight = new THREE.PointLight(0xffddaa, 1, 300);
        pointLight.position.y = item.length - 15;
        pointLight.castShadow = true;
        group.add(pointLight);

      } else if (item.type === 'plant') {
        const potGeo = new THREE.CylinderGeometry(12, 8, 30, 32);
        const dirtGeo = new THREE.CylinderGeometry(11, 11, 2, 32);
        const pot = new THREE.Mesh(potGeo, material);
        const dirt = new THREE.Mesh(dirtGeo, new THREE.MeshStandardMaterial({ color: 0x3b2f2f })); // brown dirt

        pot.position.y = 15;
        dirt.position.y = 29;

        group.add(pot);
        group.add(dirt);
        pot.castShadow = true;
        pot.receiveShadow = true;

        // Add leaves (spheres/cones)
        const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.6 });
        for (let i = 0; i < 5; i++) {
          const leafGeo = new THREE.SphereGeometry(10 + Math.random() * 5, 16, 16);
          const leaf = new THREE.Mesh(leafGeo, leafMaterial);
          leaf.position.set(
            (Math.random() - 0.5) * 20,
            35 + Math.random() * 20,
            (Math.random() - 0.5) * 20
          );
          leaf.castShadow = true;
          leaf.receiveShadow = true;
          group.add(leaf);
        }

      } else if (item.type === 'rug') {
        const rugGeo = new THREE.BoxGeometry(item.width, 1, item.length);
        const rug = new THREE.Mesh(rugGeo, material);
        rug.position.y = 0.5;
        rug.receiveShadow = true;
        group.add(rug);

      } else {
        // Fallback generic box
        const geometry = new THREE.BoxGeometry(item.width, item.length / 2, item.length);
        mainMesh = new THREE.Mesh(geometry, material);
        mainMesh.position.y = item.length / 4;
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        group.add(mainMesh);
      }

      // Convert 2D coordinates (top-left based) to 3D coordinates (center based)
      // 2D X/Y -> 3D X/Z
      const x3d = item.x + item.width / 2 - project.roomConfig.width / 2;
      const z3d = item.y + item.length / 2 - project.roomConfig.length / 2;

      group.position.set(x3d, 0, z3d);
      group.rotation.y = -(item.rotation * Math.PI) / 180;

      furnitureGroupRef.current?.add(group);
    });
  }, [project.items, project.roomConfig.width, project.roomConfig.length]);

  // Update lighting when settings change
  useEffect(() => {
    if (!ambientLightRef.current || !directionalLightRef.current || !rendererRef.current) return;

    const lighting = project.lightingSettings;

    // Update ambient light intensity (0-100 -> 0-1.5)
    ambientLightRef.current.intensity = (lighting.ambientIntensity / 100) * 1.5;

    // Update directional light intensity (0-100 -> 0-2)
    directionalLightRef.current.intensity = (lighting.directionalIntensity / 100) * 2;

    // Update shadow softness (0-100 -> PCFShadowMap or VSMShadowMap)
    // Higher softness = softer shadows
    if (lighting.shadowSoftness > 50) {
      rendererRef.current.shadowMap.type = THREE.VSMShadowMap;
    } else {
      rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // Shadow blur radius based on softness
    directionalLightRef.current.shadow.radius = (lighting.shadowSoftness / 100) * 5;

  }, [project.lightingSettings]);

  return (
    <div className="w-full h-full relative bg-gray-200">
      <div ref={mountRef} className="w-full h-full" />

      <div className="absolute top-6 left-6 flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Navigation</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] text-gray-600">
              <span className="w-8 h-4 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-mono">LMB</span>
              <span>Rotate View</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-600">
              <span className="w-8 h-4 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-mono">RMB</span>
              <span>Pan Camera</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-600">
              <span className="w-8 h-4 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-mono">MW</span>
              <span>Zoom In/Out</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          LIVE 3D RENDER
        </div>
      </div>
    </div>
  );
}