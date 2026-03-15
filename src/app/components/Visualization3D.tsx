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
  const buildRoomRef = useRef<(() => void) | null>(null);

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
    
    // Store buildRoom function in a ref to be used by another useEffect
    buildRoomRef.current = buildRoom;

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

  // Update room when dimensions change
  useEffect(() => {
    if (buildRoomRef.current) {
        buildRoomRef.current();
    }
  }, [project.roomConfig.width, project.roomConfig.length, project.roomConfig.height, project.roomConfig.wallColor]);

  // Update furniture items when project changes
  useEffect(() => {
    if (!furnitureGroupRef.current) return;

    // Clear existing furniture
    while (furnitureGroupRef.current.children.length > 0) {
      const obj = furnitureGroupRef.current.children[0];
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
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

      if (item.type === 'chair') {
        // Chair: Tapered legs, rounded seat, curved backrest
        const legGeo = new THREE.CylinderGeometry(1.2, 0.8, item.length / 2, 12);
        const seatGeo = new THREE.BoxGeometry(item.width, 4, item.length);
        const backGeo = new THREE.BoxGeometry(item.width, item.length / 1.5, 3);
        
        // Add minimal bevels or keep simple boxes but positioned nicely
        const seat = new THREE.Mesh(seatGeo, material);
        seat.position.y = item.length / 2;

        const back = new THREE.Mesh(backGeo, material);
        back.position.set(0, item.length / 2 + item.length / 3, -item.length / 2 + 1.5);

        // Angle the back slightly for comfort look
        back.rotation.x = -0.1;

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
        // Dining Table: Thinner flat Box base + 4 thinner tapered legs
        const topGeo = new THREE.CylinderGeometry(item.width / 2, item.width / 2, 3, 32); 
        // Or if rectangle: BoxGeometry(item.width, 3, item.length);
        // Let's use a Box with slightly rounded appearance or just a precise box
        const topRectGeo = new THREE.BoxGeometry(item.width, 3, item.length);
        const legGeo = new THREE.CylinderGeometry(1.5, 1, item.length / 1.5, 16);

        // Choose shape based on proportions (if it's perfectly square, maybe make it round, else rectangular)
        const isRound = Math.abs(item.width - item.length) < 5;
        const top = new THREE.Mesh(isRound ? topGeo : topRectGeo, material);
        
        const tableHeight = item.length / 1.5;
        top.position.y = tableHeight;

        // Four legs for rectangular, maybe center pedestal for round? Let's stick to 4 for now
        const insetX = isRound ? item.width / 3 : item.width / 2 - 8;
        const insetZ = isRound ? item.length / 3 : item.length / 2 - 8;
        const legs = [
          [-insetX, -insetZ],
          [insetX, -insetZ],
          [-insetX, insetZ],
          [insetX, insetZ],
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
        // Marble/Modern Side Table: Thin Circular top + elegant stand + base
        const topGeo = new THREE.CylinderGeometry(item.width / 2, item.width / 2, 1.5, 32);
        const standGeo = new THREE.CylinderGeometry(0.8, 1.2, item.length, 16);
        const baseGeo = new THREE.CylinderGeometry(item.width / 2.5, item.width / 2.5, 1, 32);

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
        // Sofa: Rounded cushions for a softer look
        const seatGeo = new THREE.BoxGeometry(item.width - 20, item.length / 4, item.length - 15);
        const armGeo = new THREE.BoxGeometry(10, item.length / 1.8, item.length - 5);
        const backGeo = new THREE.BoxGeometry(item.width, item.length / 1.6, 15);
        
        // Use a slightly rougher fabric material specifically for the sofa
        const fabricMaterial = new THREE.MeshStandardMaterial({ 
          color: item.color, 
          roughness: 0.9, 
          metalness: 0.1 
        });

        const seat = new THREE.Mesh(seatGeo, fabricMaterial);
        const leftArm = new THREE.Mesh(armGeo, fabricMaterial);
        const rightArm = new THREE.Mesh(armGeo, fabricMaterial);
        const back = new THREE.Mesh(backGeo, fabricMaterial);

        // Little feet
        const legGeo = new THREE.CylinderGeometry(1.5, 1, 5, 8);
        const footMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
        const feetPositions = [
          [-item.width / 2 + 8, -item.length / 2 + 8],
          [item.width / 2 - 8, -item.length / 2 + 8],
          [-item.width / 2 + 8, item.length / 2 - 8],
          [item.width / 2 - 8, item.length / 2 - 8]
        ];

        feetPositions.forEach(pos => {
          const foot = new THREE.Mesh(legGeo, footMat);
          foot.position.set(pos[0], 2.5, pos[1]);
          group.add(foot);
        });

        seat.position.set(0, 5 + item.length / 8, 2.5);
        leftArm.position.set(-item.width / 2 + 5, 5 + item.length / 3.6, -2.5);
        rightArm.position.set(item.width / 2 - 5, 5 + item.length / 3.6, -2.5);
        back.position.set(0, 5 + item.length / 3.2, -item.length / 2 + 7.5);

        // Angled backrest
        back.rotation.x = -0.05;

        [seat, leftArm, rightArm, back].forEach(mesh => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

      } else if (item.type === 'bed') {
        // Bed: Add legs to the frame, softer pillows
        const frameGeo = new THREE.BoxGeometry(item.width, 8, item.length);
        const mattressGeo = new THREE.BoxGeometry(item.width - 6, 18, item.length - 6);
        const headboardGeo = new THREE.BoxGeometry(item.width, 45, 8);
        const pillowGeo = new THREE.CapsuleGeometry(8, item.width / 3 - 8, 8, 16); 
        const legGeo = new THREE.CylinderGeometry(2, 1.5, 10, 8);

        const frame = new THREE.Mesh(frameGeo, material);
        const mattress = new THREE.Mesh(mattressGeo, new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.9 }));
        const headboard = new THREE.Mesh(headboardGeo, material);
        
        const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 1.0 });
        const pillow1 = new THREE.Mesh(pillowGeo, pillowMat);
        const pillow2 = new THREE.Mesh(pillowGeo, pillowMat);

        // Add 4 legs
        const feetPositions = [
          [-item.width / 2 + 5, -item.length / 2 + 5],
          [item.width / 2 - 5, -item.length / 2 + 5],
          [-item.width / 2 + 5, item.length / 2 - 5],
          [item.width / 2 - 5, item.length / 2 - 5]
        ];
        
        feetPositions.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, material);
          leg.position.set(pos[0], 5, pos[1]);
          leg.castShadow = true;
          group.add(leg);
        });

        frame.position.y = 10;
        mattress.position.y = 23;
        headboard.position.set(0, 30, -item.length / 2 + 4);
        
        // Pillows rotated to lay flat
        pillow1.rotation.z = Math.PI / 2;
        pillow2.rotation.z = Math.PI / 2;
        pillow1.position.set(-item.width / 4, 34, -item.length / 2 + 25);
        pillow2.position.set(item.width / 4, 34, -item.length / 2 + 25);

        [frame, mattress, headboard, pillow1, pillow2].forEach(mesh => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

      } else if (item.type === 'lamp') {
        const baseGeo = new THREE.CylinderGeometry(15, 15, 2, 32);
        const poleGeo = new THREE.CylinderGeometry(1.5, 2, item.length, 16);
        // Tapered shade: Top radius 10, bottom radius 18
        const shadeGeo = new THREE.CylinderGeometry(10, 18, 25, 32);

        const base = new THREE.Mesh(baseGeo, material);
        const pole = new THREE.Mesh(poleGeo, material);
        const shade = new THREE.Mesh(shadeGeo, new THREE.MeshStandardMaterial({ 
          color: 0xfffcf0, 
          emissive: 0x444433,
          roughness: 0.4
        }));

        base.position.y = 1;
        pole.position.y = item.length / 2;
        shade.position.y = item.length - 15;

        [base, pole, shade].forEach(mesh => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          group.add(mesh);
        });

        // Add a point light to the lamp
        const pointLight = new THREE.PointLight(0xffeedd, 1.2, 250);
        pointLight.position.y = item.length - 20;
        pointLight.castShadow = true;
        group.add(pointLight);

      } else if (item.type === 'plant') {
        const potGeo = new THREE.CylinderGeometry(14, 10, 32, 32);
        const dirtGeo = new THREE.CylinderGeometry(13, 13, 2, 32);
        const pot = new THREE.Mesh(potGeo, material);
        const dirt = new THREE.Mesh(dirtGeo, new THREE.MeshStandardMaterial({ color: 0x2b1e19 })); // rich brown dirt

        pot.position.y = 16;
        dirt.position.y = 31;

        group.add(pot);
        group.add(dirt);
        pot.castShadow = true;
        pot.receiveShadow = true;

        // Add leaves (capsules simulating large fronds)
        const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x3d7a33, roughness: 0.5 });
        for (let i = 0; i < 8; i++) {
          const leafScale = 8 + Math.random() * 6;
          // Thin flat capsules for leaves
          const leafGeo = new THREE.CapsuleGeometry(2, leafScale, 4, 8);
          const leaf = new THREE.Mesh(leafGeo, leafMaterial);
          
          // Spread them out from center
          const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5);
          const radius = 5 + Math.random() * 8;
          
          leaf.position.set(
            Math.cos(angle) * radius,
            35 + Math.random() * 15,
            Math.sin(angle) * radius
          );
          
          // Bend leaves outwards
          leaf.rotation.x = Math.random() * 0.5;
          leaf.rotation.z = Math.random() * 0.5;
          leaf.rotation.y = angle; // Point outwards

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