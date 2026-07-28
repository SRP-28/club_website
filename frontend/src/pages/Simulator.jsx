import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import './Simulator.css';

/* ─────────────────────────── Joystick ─────────────────────────── */
const Joystick = ({ label, description, color, onValue }) => {
  const outerRef = useRef(null);
  const knobRef  = useRef(null);
  const active   = useRef(false);
  const center   = useRef({ x: 0, y: 0 });
  const RADIUS   = 46;

  const getXY = (e) => {
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX, y: src.clientY };
  };

  const onStart = useCallback((e) => {
    e.preventDefault();
    active.current = true;
    const r = outerRef.current.getBoundingClientRect();
    center.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, []);

  const onMove = useCallback((e) => {
    if (!active.current) return;
    e.preventDefault();
    const { x, y }  = getXY(e);
    const dx = x - center.current.x;
    const dy = y - center.current.y;
    const dist   = Math.sqrt(dx * dx + dy * dy);
    const factor = dist > RADIUS ? RADIUS / dist : 1;
    const cx = dx * factor;
    const cy = dy * factor;
    if (knobRef.current) {
      knobRef.current.style.transition = 'none';
      knobRef.current.style.transform  = `translate(${cx}px,${cy}px)`;
    }
    onValue(cx / RADIUS, -cy / RADIUS);
  }, [onValue]);

  const onEnd = useCallback(() => {
    active.current = false;
    if (knobRef.current) {
      knobRef.current.style.transition = 'transform 0.25s cubic-bezier(0.22,1,0.36,1)';
      knobRef.current.style.transform  = 'translate(0px,0px)';
    }
    onValue(0, 0);
  }, [onValue]);

  useEffect(() => {
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onEnd);
    window.addEventListener('touchmove',  onMove, { passive: false });
    window.addEventListener('touchend',   onEnd);
    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onEnd);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('touchend',   onEnd);
    };
  }, [onMove, onEnd]);

  return (
    <div className="joy-wrapper">
      <div className="joy-label" style={{ color }}>{label}</div>
      <div
        ref={outerRef}
        className="joy-outer"
        style={{ '--joy-color': color }}
        onMouseDown={onStart}
        onTouchStart={onStart}
      >
        {/* cross-hair guides */}
        <span className="joy-line joy-h" />
        <span className="joy-line joy-v" />
        {/* knob */}
        <div ref={knobRef} className="joy-knob" style={{ background: color }} />
      </div>
      <p className="joy-desc">{description}</p>
    </div>
  );
};

/* ─────────────────────────── Simulator ─────────────────────────── */
const Simulator = () => {
  const mountRef  = useRef(null);
  const rollRef   = useRef(0); // target roll  (Z)
  const pitchRef  = useRef(0); // target pitch (X)
  const yawSpd    = useRef(0); // continuous yaw speed
  const curYaw    = useRef(0);

  useEffect(() => {
    const mount  = mountRef.current;
    const W      = mount.clientWidth;
    const H      = mount.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene = new THREE.Scene();
    scene.fog   = new THREE.FogExp2(0x06070f, 0.05);

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 3.5, 7);
    camera.lookAt(0, 0, 0);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x1a1a3a, 6));

    const sun = new THREE.DirectionalLight(0xffffff, 5);
    sun.position.set(6, 10, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0xf7c275, 2);
    rim.position.set(-5, 2, -5);
    scene.add(rim);

    const fill = new THREE.PointLight(0x4488ff, 1.5, 10);
    fill.position.set(0, -3, 0);
    scene.add(fill);

    /* ── Ground grid ── */
    const grid = new THREE.GridHelper(30, 30, 0x2a2a4a, 0x1a1a2e);
    grid.position.y = -3;
    scene.add(grid);

    /* ── Materials ── */
    const bodyMat  = new THREE.MeshStandardMaterial({ color: 0x12121f, metalness: 0.85, roughness: 0.15 });
    const armMat   = new THREE.MeshStandardMaterial({ color: 0x800000, metalness: 0.7,  roughness: 0.3  });
    const motorMat = new THREE.MeshStandardMaterial({ color: 0xf7c275, metalness: 0.95, roughness: 0.05 });
    const propMat  = [
      new THREE.MeshStandardMaterial({ color: 0xccccdd, metalness: 0.4, roughness: 0.5, transparent: true, opacity: 0.80, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: 0xaaaacc, metalness: 0.4, roughness: 0.5, transparent: true, opacity: 0.80, side: THREE.DoubleSide }),
    ];
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88bbff, metalness: 0.1, roughness: 0, transparent: true, opacity: 0.65 });
    const gearMat  = new THREE.MeshStandardMaterial({ color: 0x2a2a44, metalness: 0.5, roughness: 0.5 });

    /* ── Drone group ── */
    const drone = new THREE.Group();

    // Main body plate
    drone.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.9), bodyMat), { castShadow: true }));

    // FC dome
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.27, 0.13, 16), bodyMat);
    dome.position.y = 0.13;
    drone.add(dome);

    // Camera sphere (front)
    const cam = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), glassMat);
    cam.position.set(0, 0.04, 0.46);
    drone.add(cam);

    // 4 arms + motors + propellers
    const armPos = [
      {x:  1.05, z:  1.05, rot: -Math.PI / 4},
      {x: -1.05, z:  1.05, rot:  Math.PI / 4},
      {x: -1.05, z: -1.05, rot: -Math.PI / 4},
      {x:  1.05, z: -1.05, rot:  Math.PI / 4},
    ];

    const propMeshes = [];

    armPos.forEach(({ x, z, rot }, i) => {
      // Arm
      const armLen = Math.sqrt(2) * 1.05;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, armLen), armMat);
      arm.position.set(x / 2, 0, z / 2);
      arm.rotation.y = rot;
      arm.castShadow = true;
      drone.add(arm);

      // Motor cylinder
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.13, 14), motorMat);
      motor.position.set(x, 0.07, z);
      motor.castShadow = true;
      drone.add(motor);

      // Propeller disc (thin hexagonal)
      const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.02, 8), propMat[i % 2]);
      prop.position.set(x, 0.15, z);
      drone.add(prop);
      propMeshes.push({ mesh: prop, dir: i % 2 === 0 ? 1 : -1 });

      // Blur ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.015, 6, 40),
        new THREE.MeshStandardMaterial({ color: 0x999999, transparent: true, opacity: 0.2 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 0.15, z);
      drone.add(ring);
    });

    // Landing legs
    const legPositions = [[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]];
    legPositions.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.4, 6), gearMat);
      leg.position.set(lx, -0.22, lz);
      drone.add(leg);
    });

    scene.add(drone);

    /* ── FPV attitude indicator overlay ── */
    // (handled via CSS HUD elements)

    /* ── Animation loop ── */
    let t = 0;
    let camAngle = 0;
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t       += 0.004;
      camAngle += 0.004;

      // Slow camera orbit
      camera.position.x = Math.sin(camAngle) * 7;
      camera.position.z = Math.cos(camAngle) * 7;
      camera.position.y = 3.5 + Math.sin(t * 0.6) * 0.2;
      camera.lookAt(0, 0, 0);

      // Spin props
      propMeshes.forEach(({ mesh, dir }) => { mesh.rotation.y += dir * 0.3; });

      // Smooth lerp drone rotations
      drone.rotation.z = THREE.MathUtils.lerp(drone.rotation.z, rollRef.current, 0.07);
      drone.rotation.x = THREE.MathUtils.lerp(drone.rotation.x, pitchRef.current, 0.07);
      curYaw.current   += yawSpd.current * 0.03;
      drone.rotation.y  = curYaw.current;

      // Hover float
      drone.position.y = Math.sin(t * 1.4) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ── */
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  const onRoll  = useCallback((x) => { rollRef.current  = -x * (Math.PI / 5); }, []);
  const onPitch = useCallback((x, y) => { pitchRef.current = -y * (Math.PI / 5); }, []);
  const onYaw   = useCallback((x) => { yawSpd.current   =  x; }, []);

  return (
    <div className="sim-page">

      {/* ── Header ── */}
      <div className="sim-header">
        <h1 className="sim-title">🚁 Drone Flight Simulator</h1>
        <p className="sim-subtitle">Drag the joysticks below to control the drone. Learn the 3 fundamental axes of flight.</p>
      </div>

      {/* ── 3D Canvas ── */}
      <div className="sim-canvas-wrap" ref={mountRef} />

      {/* ── Axis info bar ── */}
      <div className="sim-axis-bar">
        <div className="sim-axis-item">
          <span className="axis-dot" style={{ background: '#f7c275', boxShadow: '0 0 8px #f7c275' }} />
          <div>
            <strong style={{ color: '#f7c275' }}>ROLL</strong>
            <span> — Tilts left / right (Z axis)</span>
          </div>
        </div>
        <div className="sim-axis-item">
          <span className="axis-dot" style={{ background: '#7dd3fc', boxShadow: '0 0 8px #7dd3fc' }} />
          <div>
            <strong style={{ color: '#7dd3fc' }}>PITCH</strong>
            <span> — Tilts forward / backward (X axis)</span>
          </div>
        </div>
        <div className="sim-axis-item">
          <span className="axis-dot" style={{ background: '#c084fc', boxShadow: '0 0 8px #c084fc' }} />
          <div>
            <strong style={{ color: '#c084fc' }}>YAW</strong>
            <span> — Rotates heading (Y axis)</span>
          </div>
        </div>
      </div>

      {/* ── Joysticks ── */}
      <div className="sim-joysticks">
        <Joystick
          label="ROLL"
          description="Drag left or right"
          color="#f7c275"
          onValue={(x, y) => onRoll(x)}
        />
        <Joystick
          label="PITCH"
          description="Drag up or down"
          color="#7dd3fc"
          onValue={(x, y) => onPitch(x, y)}
        />
        <Joystick
          label="YAW"
          description="Drag left or right"
          color="#c084fc"
          onValue={(x, y) => onYaw(x)}
        />
      </div>

      {/* ── Tips ── */}
      <div className="sim-tips">
        <div className="tip-card">
          <div className="tip-icon">🎮</div>
          <p>Works with mouse drag and touch on mobile</p>
        </div>
        <div className="tip-card">
          <div className="tip-icon">👀</div>
          <p>Camera auto-orbits for a 360° view</p>
        </div>
        <div className="tip-card">
          <div className="tip-icon">⚡</div>
          <p>Release joystick to return to hover</p>
        </div>
      </div>

    </div>
  );
};

export default Simulator;
