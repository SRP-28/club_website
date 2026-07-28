import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import './Simulator.css';

/* ══════════════════════════════════════════════════════
   Joystick Component
   springBack=false  → throttle behaviour (knob stays)
   springBack=true   → pitch/roll behaviour (snaps centre)
══════════════════════════════════════════════════════ */
const Joystick = ({ color = '#f7c275', onValue, springBack = true }) => {
  const outerRef   = useRef(null);
  const knobRef    = useRef(null);
  const isActive   = useRef(false);
  const padCenter  = useRef({ x: 0, y: 0 });
  const RADIUS     = 50;

  const clamp = (dx, dy) => {
    const d = Math.sqrt(dx * dx + dy * dy);
    const f = d > RADIUS ? RADIUS / d : 1;
    return { x: dx * f, y: dy * f };
  };

  const apply = useCallback((cx, cy) => {
    if (knobRef.current) {
      knobRef.current.style.transition = 'none';
      knobRef.current.style.transform  = `translate(${cx}px,${cy}px)`;
    }
    onValue(cx / RADIUS, -(cy / RADIUS));
  }, [onValue]);

  const getXY = (e) => {
    const s = e.touches ? e.touches[0] : e;
    return { x: s.clientX, y: s.clientY };
  };

  const onStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    isActive.current = true;
    const r = outerRef.current.getBoundingClientRect();
    padCenter.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    const { x, y } = getXY(e);
    const { x: cx, y: cy } = clamp(x - padCenter.current.x, y - padCenter.current.y);
    apply(cx, cy);
  }, [apply]);

  const onMove = useCallback((e) => {
    if (!isActive.current) return;
    const { x, y } = getXY(e);
    const { x: cx, y: cy } = clamp(x - padCenter.current.x, y - padCenter.current.y);
    apply(cx, cy);
  }, [apply]);

  const onEnd = useCallback(() => {
    if (!isActive.current) return;
    isActive.current = false;
    if (springBack) {
      if (knobRef.current) {
        knobRef.current.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
        knobRef.current.style.transform  = 'translate(0px,0px)';
      }
      onValue(0, 0);
    }
    // throttle mode: knob and value stay put
  }, [springBack, onValue]);

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend',  onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend',  onEnd);
    };
  }, [onMove, onEnd]);

  return (
    <div
      ref={outerRef}
      className="tx-stick-pad"
      style={{ '--sc': color }}
      onMouseDown={onStart}
      onTouchStart={onStart}
    >
      <span className="s-guide s-guide-h" />
      <span className="s-guide s-guide-v" />
      <span className="s-ring s-ring-outer" />
      <span className="s-ring s-ring-inner" />
      <div
        ref={knobRef}
        className="s-knob"
        style={{
          background: `radial-gradient(circle at 38% 33%,
            color-mix(in srgb, ${color} 50%, #fff),
            ${color} 55%,
            color-mix(in srgb, ${color} 60%, #000))`
        }}
      />
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   Main Simulator Page
══════════════════════════════════════════════════════ */
const Simulator = () => {
  const mountRef = useRef(null);

  /* Joystick live values (refs → no re-render in RAF) */
  const lx = useRef(0);   // Yaw
  const ly = useRef(0);   // Throttle (0..1)
  const rx = useRef(0);   // Roll
  const ry = useRef(0);   // Pitch

  /* Drone derived state */
  const droneAlt   = useRef(0);
  const droneYaw   = useRef(0);

  /* Camera orbit */
  const azimuth    = useRef(0.5);
  const elevation  = useRef(0.55);
  const camDrag    = useRef(false);
  const camPrev    = useRef({ x: 0, y: 0 });

  /* LCD display state (80 ms poll) */
  const [lcd, setLcd] = useState({ thr: 0, yaw: 0, ptch: 0, roll: 0 });

  /* ARM / DISARM */
  const [isArmed, setIsArmed] = useState(false);
  const isArmedRef = useRef(false); // ref so RAF can read it without stale closure

  const toggleArm = useCallback(() => {
    setIsArmed(prev => {
      const next = !prev;
      isArmedRef.current = next;
      return next;
    });
  }, []);

  /* ── Three.js setup ── */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let rafId, lcdTimer;
    let cleanupFns = [];

    // Defer init by one frame so the DOM has real layout dimensions
    const initId = requestAnimationFrame(() => {
      const W = mount.clientWidth  || 920;
      const H = mount.clientHeight || 420;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x06080c, 1);   // solid dark bg — no transparent black
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
      mount.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.fog   = new THREE.FogExp2(0x060810, 0.038);

    // Camera
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 100);

    // Lights
    scene.add(new THREE.AmbientLight(0x1a1a3a, 7));

    const sun = new THREE.DirectionalLight(0xffffff, 5);
    sun.position.set(5, 10, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0xf7c275, 2.5);
    rim.position.set(-5, 3, -5);
    scene.add(rim);

      const fill = new THREE.PointLight(0x4488ff, 1.5, 12);
      fill.position.set(0, -4, 0);
      scene.add(fill);

    // Grid ground
    const grid = new THREE.GridHelper(28, 28, 0x2a2a4a, 0x191928);
    grid.position.y = -3.8;
    scene.add(grid);

    /* ── Drone Materials ── */
    const mBody  = new THREE.MeshStandardMaterial({ color: 0x12121f, metalness: 0.85, roughness: 0.15 });
    const mArm   = new THREE.MeshStandardMaterial({ color: 0x8b0000, metalness: 0.7,  roughness: 0.3  });
    const mMotor = new THREE.MeshStandardMaterial({ color: 0xf7c275, metalness: 0.95, roughness: 0.05 });
    const mProp  = [
      new THREE.MeshStandardMaterial({ color: 0xccccdd, transparent: true, opacity: 0.82, side: THREE.DoubleSide }),
      new THREE.MeshStandardMaterial({ color: 0xaaaacc, transparent: true, opacity: 0.82, side: THREE.DoubleSide }),
    ];
    const mGlass = new THREE.MeshStandardMaterial({ color: 0x88bbff, transparent: true, opacity: 0.65 });
    const mGear  = new THREE.MeshStandardMaterial({ color: 0x2a2a44, metalness: 0.5, roughness: 0.5 });
    const mRing  = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.18 });

    /* ── Drone Geometry ── */
    const drone = new THREE.Group();

      // Body plate
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 0.9), mBody);
      body.castShadow = true;
      drone.add(body);

    // FC dome
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.27, 0.14, 16), mBody);
    dome.position.y = 0.13;
    drone.add(dome);

    // Camera eye
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), mGlass);
    eye.position.set(0, 0.04, 0.46);
    drone.add(eye);

    // 4 arms + motors + props
    const ARM_DIST = 1.1;
    const armDefs  = [
      { x:  ARM_DIST, z:  ARM_DIST },
      { x: -ARM_DIST, z:  ARM_DIST },
      { x: -ARM_DIST, z: -ARM_DIST },
      { x:  ARM_DIST, z: -ARM_DIST },
    ];
    const propMeshes = [];

    armDefs.forEach(({ x, z }, i) => {
      // Arm
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.055, Math.sqrt(2) * ARM_DIST),
        mArm
      );
      arm.position.set(x / 2, 0, z / 2);
      arm.rotation.y = Math.atan2(x, z);
      arm.castShadow = true;
      drone.add(arm);

      // Motor
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.115, 0.14, 14), mMotor);
      motor.position.set(x, 0.08, z);
      drone.add(motor);

      // Prop disc
      const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.022, 8), mProp[i % 2]);
      prop.position.set(x, 0.16, z);
      drone.add(prop);
      propMeshes.push({ mesh: prop, dir: i % 2 === 0 ? 1 : -1 });

      // Blur ring
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.013, 6, 44), mRing);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 0.16, z);
      drone.add(ring);
    });

    // Landing legs
    [[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.42, 6), mGear);
      leg.position.set(lx, -0.23, lz);
      drone.add(leg);
    });

    scene.add(drone);

    /* ── Canvas drag → camera orbit ── */
    const onMD  = (e) => { camDrag.current = true;  camPrev.current = { x: e.clientX, y: e.clientY }; };
    const onMM  = (e) => {
      if (!camDrag.current) return;
      azimuth.current   += (e.clientX - camPrev.current.x) * 0.007;
      elevation.current  = Math.max(0.08, Math.min(1.45, elevation.current - (e.clientY - camPrev.current.y) * 0.007));
      camPrev.current    = { x: e.clientX, y: e.clientY };
    };
    const onMU  = () => { camDrag.current = false; };

    mount.addEventListener('mousedown', onMD);
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup',   onMU);

    /* ── Animation loop ── */
    let t = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.004;

      // Spin propellers — stop when disarmed
      if (isArmedRef.current) {
        const spd = 0.22 + Math.max(0, ly.current) * 0.18;
        propMeshes.forEach(({ mesh, dir }) => { mesh.rotation.y += dir * spd; });
      } else {
        // Slowly decelerate to a stop
        propMeshes.forEach(({ mesh, dir }) => { mesh.rotation.y += dir * 0.01; });
      }

      // Camera
      const R = 7;
      camera.position.set(
        Math.sin(azimuth.current)  * Math.cos(elevation.current) * R,
        Math.sin(elevation.current) * R,
        Math.cos(azimuth.current)  * Math.cos(elevation.current) * R
      );
      camera.lookAt(0, drone.position.y, 0);

      // Drone rotations — only when armed
      if (isArmedRef.current) {
        drone.rotation.z = THREE.MathUtils.lerp(drone.rotation.z, -rx.current * (Math.PI / 5.5), 0.08);
        drone.rotation.x = THREE.MathUtils.lerp(drone.rotation.x, -ry.current * (Math.PI / 5.5), 0.08);
        droneYaw.current += lx.current * 0.028;
        drone.rotation.y  = droneYaw.current;

        // Throttle altitude + hover bob
        droneAlt.current = THREE.MathUtils.lerp(droneAlt.current, Math.max(0, ly.current) * 1.8, 0.04);
        const bob = ly.current > 0.05 ? Math.sin(t * 1.5) * 0.07 : 0;
        drone.position.y = THREE.MathUtils.lerp(drone.position.y, droneAlt.current + bob, 0.05);
      } else {
        // Return to level & land when disarmed
        drone.rotation.z = THREE.MathUtils.lerp(drone.rotation.z, 0, 0.05);
        drone.rotation.x = THREE.MathUtils.lerp(drone.rotation.x, 0, 0.05);
        droneAlt.current = THREE.MathUtils.lerp(droneAlt.current, 0, 0.03);
        drone.position.y = THREE.MathUtils.lerp(drone.position.y, 0, 0.03);
      }

      renderer.render(scene, camera);
    };
    animate();

    // LCD poll
    lcdTimer = setInterval(() => {
      setLcd({
        thr:  Math.round(Math.max(0, ly.current) * 100),
        yaw:  Math.round(lx.current  * 100),
        ptch: Math.round(ry.current  * 100),
        roll: Math.round(rx.current  * 100),
      });
    }, 80);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth  || mount.offsetWidth;
      const h = mount.clientHeight || mount.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    cleanupFns = [
      () => { cancelAnimationFrame(rafId); },
      () => { clearInterval(lcdTimer); },
      () => { window.removeEventListener('resize',     onResize); },
      () => { window.removeEventListener('mousemove',  onMM); },
      () => { window.removeEventListener('mouseup',    onMU); },
      () => { mount.removeEventListener('mousedown',   onMD); },
      () => { renderer.dispose(); },
      () => { if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); },
    ];
    }); // end requestAnimationFrame

    return () => {
      cancelAnimationFrame(initId);
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  const onLeft  = useCallback((x, y) => {
    if (!isArmedRef.current) return; // ignore controls when disarmed
    lx.current = x; ly.current = y;
  }, []);
  const onRight = useCallback((x, y) => {
    if (!isArmedRef.current) return;
    rx.current = x; ry.current = y;
  }, []);

  /* ── Render ── */
  return (
    <div className="sim-page">
      <div className="sim-hdr">
        <h1 className="sim-title">Drone Flight Simulator</h1>
        <p className="sim-sub">Drag the transmitter sticks to fly · Drag the 3D view to orbit</p>
      </div>

      {/* 3D canvas */}
      <div className="sim-canvas" ref={mountRef} />

      {/* ══ RC Transmitter ══ */}
      <div className="tx-perspective">
        <div className="tx-body">

          {/* Antennas + brand strip */}
          <div className="tx-top-strip">
            <div className="tx-ant tx-ant-l"><div className="ant-base" /></div>
            <div className="tx-brand-strip">
              <span className="tx-brand-name">TEAM VAJRA</span>
              <span className="tx-brand-model">FPV·TX·V2</span>
            </div>
            <div className="tx-ant tx-ant-r"><div className="ant-base" /></div>
          </div>

          {/* Main stick panel */}
          <div className="tx-panel">

            {/* LEFT STICK — Throttle / Yaw */}
            <div className="tx-stick-zone">
              <div className="tx-axis-label tx-axis-top">THROTTLE ↑↓</div>
              <Joystick color="#f7c275" onValue={onLeft} springBack={false} />
              <div className="tx-axis-label tx-axis-bot">← YAW →</div>
            </div>

            {/* CENTER — LCD + switches */}
            <div className="tx-center-col">
              {/* LCD screen */}
              <div className="tx-lcd-frame">
                <div className="tx-lcd-bezel">
                  <div className="lcd-header">
                    <span className="lcd-title-text">FLIGHT DATA</span>
                    <div className="lcd-sig">
                      <span className="sig-bar h1" /><span className="sig-bar h2" />
                      <span className="sig-bar h3" /><span className="sig-bar h4" />
                    </div>
                  </div>
                  <div className="lcd-rows">
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#f7c275' }}>THR</span>
                      <div className="lcd-bar-wrap">
                        <div className="lcd-bar" style={{ width: `${lcd.thr}%`, background: '#f7c275' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#f7c275' }}>{lcd.thr}%</span>
                    </div>
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#f7c275' }}>YAW</span>
                      <div className="lcd-bar-wrap lcd-bar-center">
                        <div className="lcd-bar lcd-bar-signed" style={{ width: `${Math.abs(lcd.yaw)}%`, left: lcd.yaw >= 0 ? '50%' : `${50 - Math.abs(lcd.yaw)}%`, background: '#f7c275' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#f7c275' }}>{lcd.yaw > 0 ? '+' : ''}{lcd.yaw}%</span>
                    </div>
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#7dd3fc' }}>PCH</span>
                      <div className="lcd-bar-wrap lcd-bar-center">
                        <div className="lcd-bar lcd-bar-signed" style={{ width: `${Math.abs(lcd.ptch)}%`, left: lcd.ptch >= 0 ? '50%' : `${50 - Math.abs(lcd.ptch)}%`, background: '#7dd3fc' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#7dd3fc' }}>{lcd.ptch > 0 ? '+' : ''}{lcd.ptch}%</span>
                    </div>
                    <div className="lcd-row">
                      <span className="lcd-k" style={{ color: '#7dd3fc' }}>ROL</span>
                      <div className="lcd-bar-wrap lcd-bar-center">
                        <div className="lcd-bar lcd-bar-signed" style={{ width: `${Math.abs(lcd.roll)}%`, left: lcd.roll >= 0 ? '50%' : `${50 - Math.abs(lcd.roll)}%`, background: '#7dd3fc' }} />
                      </div>
                      <span className="lcd-v" style={{ color: '#7dd3fc' }}>{lcd.roll > 0 ? '+' : ''}{lcd.roll}%</span>
                    </div>
                  </div>
                  <div className="lcd-footer">
                    <span className={isArmed ? 'lcd-linked' : 'lcd-disarmed'}>
                      {isArmed ? '● ARMED' : '○ DISARMED'}
                    </span>
                    <span className="lcd-mode">MODE 2</span>
                  </div>
                </div>
              </div>

              {/* Aux toggle switches */}
              <div className="tx-switches">
                <div className="tx-sw">
                  <div className="sw-label">SWA</div>
                  <div className="sw-body"><div className="sw-lever" /></div>
                </div>
                <div className="tx-sw" onClick={toggleArm} style={{ cursor: 'pointer' }} title="Click to ARM / DISARM">
                  <div className="sw-label" style={{ color: isArmed ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>ARM</div>
                  <div className={`sw-body ${isArmed ? 'sw-body--on' : ''}`}>
                    <div className={`sw-lever ${isArmed ? 'sw-lever--on' : ''}`} />
                  </div>
                </div>
                <div className="tx-sw">
                  <div className="sw-label">RTH</div>
                  <div className="sw-body"><div className="sw-lever" /></div>
                </div>
              </div>
            </div>

            {/* RIGHT STICK — Pitch / Roll */}
            <div className="tx-stick-zone">
              <div className="tx-axis-label tx-axis-top">PITCH ↑↓</div>
              <Joystick color="#7dd3fc" onValue={onRight} springBack={true} />
              <div className="tx-axis-label tx-axis-bot">← ROLL →</div>
            </div>

          </div>{/* /tx-panel */}

          {/* Grip section */}
          <div className="tx-grips">
            <div className="tx-grip tx-grip-l">
              <div className="grip-tex" />
              <div className="grip-accent" />
            </div>
            <div className="tx-bottom-bar">
              <div className="tx-bottom-btn" />
              <div className="tx-bottom-btn tx-bottom-btn--led" />
              <div className="tx-bottom-btn" />
            </div>
            <div className="tx-grip tx-grip-r">
              <div className="grip-tex" />
              <div className="grip-accent" />
            </div>
          </div>

        </div>{/* /tx-body */}
      </div>{/* /tx-perspective */}

      {/* Mode legend */}
      <div className="sim-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f7c275' }} />
          <span><strong>Left stick</strong> — Throttle (hold) + Yaw</span>
        </div>
        <div className="legend-sep" />
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#7dd3fc' }} />
          <span><strong>Right stick</strong> — Pitch + Roll (self-centres)</span>
        </div>
        <div className="legend-sep" />
        <div className="legend-item">
          <span className="legend-dot" style={{ background: isArmed ? '#4ade80' : '#ef4444' }} />
          <span><strong>ARM switch</strong> — Click to {isArmed ? 'disarm (stops drone)' : 'arm (enables controls)'}</span>
        </div>
      </div>

    </div>
  );
};

export default Simulator;
