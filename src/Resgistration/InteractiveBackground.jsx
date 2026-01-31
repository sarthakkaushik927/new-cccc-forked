import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const InteractiveBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000510, 0.002); 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 120; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

   

   
    const group = new THREE.Group();
    scene.add(group);

    
    const planetGeo = new THREE.SphereGeometry(60, 32, 32);
    const planetMat = new THREE.MeshBasicMaterial({ 
      color: 0x0044aa, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.3 
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(50, -50, -50);
    group.add(planet);

    
    const starGeo = new THREE.SphereGeometry(10, 32, 32);
    const starMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const neutronStar = new THREE.Mesh(starGeo, starMat);
    neutronStar.position.set(-80, 50, -100);
    group.add(neutronStar);

    
    const starLight = new THREE.PointLight(0x00aaff, 2, 500);
    starLight.position.set(-80, 50, -100);
    scene.add(starLight);

    
    const ringGeo = new THREE.TorusGeometry(18, 0.5, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.6 });
    const starRing = new THREE.Mesh(ringGeo, ringMat);
    starRing.position.set(-80, 50, -100);
    starRing.rotation.x = Math.PI / 1.5;
    group.add(starRing);

   
    const asteroids = [];
    const asteroidGeo = new THREE.IcosahedronGeometry(1, 0);
    const asteroidMat = new THREE.MeshPhongMaterial({ 
        color: 0x111111, 
        specular: 0x00aaff, 
        shininess: 100, 
        flatShading: true 
    });

    for(let i=0; i<60; i++) {
        const mesh = new THREE.Mesh(asteroidGeo, asteroidMat);
        mesh.position.set(
            (Math.random() - 0.5) * 450,
            (Math.random() - 0.5) * 450,
            (Math.random() - 0.5) * 450
        );
        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.02,
            rotY: (Math.random() - 0.5) * 0.02
        };
        mesh.scale.setScalar(Math.random() * 2 + 1);
        group.add(mesh);
        asteroids.push(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    
    const particleCount = 200;
    const particlesData = [];
    const pPositions = new Float32Array(particleCount * 3);
    const pGeometry = new THREE.BufferGeometry();
    const r = 450; 

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * r - r / 2;
      const y = Math.random() * r - r / 2;
      const z = Math.random() * r - r / 2;

      pPositions[i * 3] = x;
      pPositions[i * 3 + 1] = y;
      pPositions[i * 3 + 2] = z;

      particlesData.push({
        velocity: new THREE.Vector3(
            -0.3 + Math.random() * 0.6, 
            -0.3 + Math.random() * 0.6, 
            -0.3 + Math.random() * 0.6
        ),
        numConnections: 0
      });
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0x00aaff,
      size: 2.5,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9
    });

    const pointCloud = new THREE.Points(pGeometry, pMaterial);
    group.add(pointCloud);

    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    group.add(linesMesh);

    

    let mouseX = 0;
    let mouseY = 0;
    const connectionDist = 75;

    
    const onMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.002; 
      mouseY = (event.clientY - window.innerHeight / 2) * 0.002;
    };

    const animate = () => {
      requestAnimationFrame(animate);

      
      const targetRotX = mouseY * 1.5; 
      const targetRotY = mouseX * 1.5;

      
      group.rotation.x += 0.05 * (targetRotX - group.rotation.x);
      group.rotation.y += 0.05 * (targetRotY - group.rotation.y);


     
      planet.rotation.y += 0.002;
      planet.rotation.z += 0.001;

      neutronStar.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1); 
      starRing.rotation.x += 0.02;
      starRing.rotation.y += 0.02;

      asteroids.forEach(rock => {
          rock.rotation.x += rock.userData.rotX;
          rock.rotation.y += rock.userData.rotY;
      });

      
      let vertexpos = 0;
      for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0;

      for (let i = 0; i < particleCount; i++) {
        const pData = particlesData[i];
        
        
        pPositions[i*3] += pData.velocity.x;
        pPositions[i*3+1] += pData.velocity.y;
        pPositions[i*3+2] += pData.velocity.z;

      
        if (pPositions[i*3] < -r/2 || pPositions[i*3] > r/2) pData.velocity.x *= -1;
        if (pPositions[i*3+1] < -r/2 || pPositions[i*3+1] > r/2) pData.velocity.y *= -1;
        if (pPositions[i*3+2] < -r/2 || pPositions[i*3+2] > r/2) pData.velocity.z *= -1;

      
        if (pData.numConnections >= 3) continue;

        for (let j = i + 1; j < particleCount; j++) {
            const pDataB = particlesData[j];
            if (pDataB.numConnections >= 3) continue;

            const dx = pPositions[i*3] - pPositions[j*3];
            const dy = pPositions[i*3+1] - pPositions[j*3+1];
            const dz = pPositions[i*3+2] - pPositions[j*3+2];
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

            if (dist < connectionDist) {
                pData.numConnections++;
                pDataB.numConnections++;
                
                linePositions[vertexpos++] = pPositions[i*3];
                linePositions[vertexpos++] = pPositions[i*3+1];
                linePositions[vertexpos++] = pPositions[i*3+2];
                linePositions[vertexpos++] = pPositions[j*3];
                linePositions[vertexpos++] = pPositions[j*3+1];
                linePositions[vertexpos++] = pPositions[j*3+2];
            }
        }
      }
      
      linesMesh.geometry.setDrawRange(0, vertexpos / 3);
      linesMesh.geometry.attributes.position.needsUpdate = true;
      pointCloud.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', onMouseMove);

    animate();

    return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('mousemove', onMouseMove);
        mount.removeChild(renderer.domElement);
        
        planetGeo.dispose();
        starGeo.dispose();
        ringGeo.dispose();
        asteroidGeo.dispose();
        pGeometry.dispose();
        linesGeometry.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 bg-black pointer-events-none"
    />
  );
};

// static
// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';

// export const InteractiveBackground = () => {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     const mount = mountRef.current;

//     // --- 1. SCENE SETUP ---
//     const scene = new THREE.Scene();
//     // Darker, cleaner fog for professional look
//     scene.fog = new THREE.FogExp2(0x000000, 0.0012);

//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
//     // Move camera back slightly for better framing
//     camera.position.z = 120; 

//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     mount.appendChild(renderer.domElement);

//     // --- 2. OBJECTS ---

//     // A. FIXED CYBER PLANET (Behind the Form - Right Side)
//     // We do NOT add this to a rotating group. It stands alone.
//     const planetGeo = new THREE.SphereGeometry(70, 64, 64); // Smoother sphere
//     const planetMat = new THREE.MeshBasicMaterial({ 
//       color: 0x0033aa, // Darker, professional blue
//       wireframe: true, 
//       transparent: true, 
//       opacity: 0.15 // Subtle
//     });
//     const planet = new THREE.Mesh(planetGeo, planetMat);
//     // Position: X=60 (Right), Y=-30 (Lower), Z=-50 (Behind)
//     planet.position.set(60, -30, -50);
//     scene.add(planet);

//     // B. BACKGROUND PARTICLES (Plexus)
//     // These will drift slowly
//     const particleCount = 150; // Cleaner, less clutter
//     const group = new THREE.Group(); // Only for particles
//     scene.add(group);

//     const pGeometry = new THREE.BufferGeometry();
//     const pPositions = new Float32Array(particleCount * 3);
//     const particlesData = [];
//     const r = 400; // Spread radius

//     for (let i = 0; i < particleCount; i++) {
//       const x = Math.random() * r - r / 2;
//       const y = Math.random() * r - r / 2;
//       const z = Math.random() * r - r / 2;

//       pPositions[i * 3] = x;
//       pPositions[i * 3 + 1] = y;
//       pPositions[i * 3 + 2] = z;

//       particlesData.push({
//         velocity: new THREE.Vector3(
//             -0.1 + Math.random() * 0.2, // Very slow drift
//             -0.1 + Math.random() * 0.2, 
//             -0.1 + Math.random() * 0.2
//         ),
//         numConnections: 0
//       });
//     }

//     pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
//     const pMaterial = new THREE.PointsMaterial({
//       color: 0x00aaff,
//       size: 2,
//       blending: THREE.AdditiveBlending,
//       transparent: true,
//       opacity: 0.6
//     });

//     const pointCloud = new THREE.Points(pGeometry, pMaterial);
//     group.add(pointCloud);

//     // Lines
//     const linesGeometry = new THREE.BufferGeometry();
//     const linePositions = new Float32Array(particleCount * particleCount * 3);
//     linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
//     const linesMaterial = new THREE.LineBasicMaterial({
//       color: 0x00aaff,
//       transparent: true,
//       opacity: 0.15, // Very subtle lines
//       blending: THREE.AdditiveBlending
//     });
//     const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
//     group.add(linesMesh);

//     // --- 3. ANIMATION ---

//     const animate = () => {
//       requestAnimationFrame(animate);

//       // 1. ROTATE PLANET (Locally only)
//       planet.rotation.y += 0.0015; // Slow spin
//       planet.rotation.z += 0.0005; 

//       // 2. UPDATE PARTICLES (Slow Drift)
//       let vertexpos = 0;
//       for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0;

//       for (let i = 0; i < particleCount; i++) {
//         const pData = particlesData[i];
        
//         pPositions[i*3] += pData.velocity.x;
//         pPositions[i*3+1] += pData.velocity.y;
//         pPositions[i*3+2] += pData.velocity.z;

//         // Bounce within bounds
//         if (pPositions[i*3] < -r/2 || pPositions[i*3] > r/2) pData.velocity.x *= -1;
//         if (pPositions[i*3+1] < -r/2 || pPositions[i*3+1] > r/2) pData.velocity.y *= -1;
//         if (pPositions[i*3+2] < -r/2 || pPositions[i*3+2] > r/2) pData.velocity.z *= -1;

//         // Draw Lines
//         if (pData.numConnections >= 3) continue;

//         for (let j = i + 1; j < particleCount; j++) {
//             const pDataB = particlesData[j];
//             if (pDataB.numConnections >= 3) continue;

//             const dx = pPositions[i*3] - pPositions[j*3];
//             const dy = pPositions[i*3+1] - pPositions[j*3+1];
//             const dz = pPositions[i*3+2] - pPositions[j*3+2];
//             const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

//             if (dist < 80) { // Connection distance
//                 pData.numConnections++;
//                 pDataB.numConnections++;
                
//                 linePositions[vertexpos++] = pPositions[i*3];
//                 linePositions[vertexpos++] = pPositions[i*3+1];
//                 linePositions[vertexpos++] = pPositions[i*3+2];
//                 linePositions[vertexpos++] = pPositions[j*3];
//                 linePositions[vertexpos++] = pPositions[j*3+1];
//                 linePositions[vertexpos++] = pPositions[j*3+2];
//             }
//         }
//       }
      
//       linesMesh.geometry.setDrawRange(0, vertexpos / 3);
//       linesMesh.geometry.attributes.position.needsUpdate = true;
//       pointCloud.geometry.attributes.position.needsUpdate = true;

//       // 3. WHOLE GROUP ROTATION (Extremely subtle constant drift, NO MOUSE)
//       group.rotation.y += 0.0003; 

//       renderer.render(scene, camera);
//     };

//     const handleResize = () => {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     animate();

//     return () => {
//         window.removeEventListener('resize', handleResize);
//         mount.removeChild(renderer.domElement);
//         planetGeo.dispose();
//         pGeometry.dispose();
//         linesGeometry.dispose();
//     };
//   }, []);

//   return (
//     <div 
//       ref={mountRef} 
//       className="fixed inset-0 z-0 bg-black pointer-events-none"
//     />
//   );
// };