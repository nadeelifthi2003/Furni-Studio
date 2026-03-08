import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Project } from "../App";

interface Visualization3DProps {
  project: Project;
}

export function Visualization3D({ project }: Visualization3DProps) {
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
      // We represent furniture as boxes for stability in this demo environment
      // In a real app, these would be GLTF models
      const geometry = new THREE.BoxGeometry(item.width, item.length / 2, item.length);
      const material = new THREE.MeshStandardMaterial({ 
        color: item.color,
        roughness: 1 - item.shading,
        metalness: item.shading * 0.5
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Convert 2D coordinates (top-left based) to 3D coordinates (center based)
      // 2D X/Y -> 3D X/Z
      const x3d = item.x + item.width / 2 - project.roomConfig.width / 2;
      const z3d = item.y + item.length / 2 - project.roomConfig.length / 2;
      
      mesh.position.set(x3d, item.length / 4, z3d);
      mesh.rotation.y = -(item.rotation * Math.PI) / 180;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Add a simple label or detail to make it look like furniture
      if (item.type === 'sofa') {
        const backGeo = new THREE.BoxGeometry(item.width, item.length, 10);
        const back = new THREE.Mesh(backGeo, material);
        back.position.set(0, item.length / 4, -item.length / 2 + 5);
        mesh.add(back);
      }

      furnitureGroupRef.current?.add(mesh);
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