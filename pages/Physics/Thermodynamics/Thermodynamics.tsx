import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CylinderSystem } from './components/CylinderSystem';
import { Dashboard } from './components/Dashboard';
import { Particle, HeatSourceType, CONSTANTS } from './types';

// Initial constants
const INIT_TEMP = 300; // Kelvin
const INIT_HEIGHT = 100; // Arbitrary height units

const Thermodynamics: React.FC = () => {
  // --- State ---
  // Physics State
  const [temperature, setTemperature] = useState(INIT_TEMP);
  const [pistonHeight, setPistonHeight] = useState(INIT_HEIGHT);
  const [heatSource, setHeatSource] = useState<HeatSourceType>('none');
  
  // Thermodynamic ACCUMULATORS
  const [totalWork, setTotalWork] = useState(0); // A (cumulative)
  const [totalHeat, setTotalHeat] = useState(0); // Q (cumulative)
  
  // Instantaneous values for Visual Arrows only
  const [instantWork, setInstantWork] = useState(0); 
  const [instantHeat, setInstantHeat] = useState(0);

  const [deltaUDisplay, setDeltaUDisplay] = useState(0);

  // Particles
  const [particles, setParticles] = useState<Particle[]>([]);

  // Refs for physics loop
  const physicsRef = useRef({
    pistonHeight: INIT_HEIGHT,
    heatSource: 'none' as HeatSourceType,
    lastTime: 0,
    accWork: 0,
    accHeat: 0,
  });

  // --- Initialization ---
  useEffect(() => {
    const initParticles: Particle[] = [];
    for (let i = 0; i < CONSTANTS.PARTICLE_COUNT; i++) {
      initParticles.push({
        id: i,
        x: Math.random() * (CONSTANTS.CYLINDER_WIDTH - 20) + 10,
        y: Math.random() * INIT_HEIGHT,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    setParticles(initParticles);
  }, []);

  // --- Physics Engine ---
  const animate = useCallback((time: number) => {
    if (physicsRef.current.lastTime === 0) {
        physicsRef.current.lastTime = time;
    }
    const dt = Math.min((time - physicsRef.current.lastTime) / 16, 2); // Normalize to ~1 frame, clamp at 2x
    physicsRef.current.lastTime = time;

    const state = physicsRef.current;
    
    // --- 1. Calculate Heat Transfer (dQ) ---
    let heatStep = 0;
    if (state.heatSource === 'fire') {
      heatStep = 1.0 * dt; // Adding energy
    } else if (state.heatSource === 'ice') {
      heatStep = -1.0 * dt; // Removing energy
    }

    if (heatStep !== 0) {
        state.accHeat += heatStep;
    }

    // --- 2. Auto Expansion (Physics) ---
    // T_current = INIT_TEMP + accWork + accHeat
    let currentTemp = INIT_TEMP + state.accWork + state.accHeat;
    
    // Safety clamp
    if (currentTemp < 50) {
        currentTemp = 50;
        state.accHeat = 50 - INIT_TEMP - state.accWork; 
    }
    if (currentTemp > 1500) {
        currentTemp = 1500;
        state.accHeat = 1500 - INIT_TEMP - state.accWork;
    }

    // Pressure Calculation: P = k * T / V
    const pressure = (currentTemp / Math.max(state.pistonHeight, 10)) * 33.3; 
    
    let autoWorkStep = 0;
    // Simple Expansion logic: If P > threshold, piston moves up
    if (pressure > 300 && state.pistonHeight < CONSTANTS.MAX_HEIGHT) {
        const moveUp = 0.5 * dt;
        state.pistonHeight += moveUp;
        const workChange = -moveUp * 1.0; 
        state.accWork += workChange;
        autoWorkStep = workChange;
    }

    // --- 3. Update Particles ---
    const speedFactor = Math.sqrt(currentTemp) * 0.15;
    
    // Create new array only if we need to update state (optimization: could be done better but React ref approach needs setState to trigger re-render)
    setParticles(prevParticles => prevParticles.map(p => {
      let { x, y, vx, vy } = p;
      x += vx * speedFactor * dt;
      y += vy * speedFactor * dt;
      if (x <= 5 || x >= CONSTANTS.CYLINDER_WIDTH - 5) vx = -vx;
      if (y <= 5) vy = Math.abs(vy);
      if (y >= state.pistonHeight - 5) {
        y = state.pistonHeight - 5;
        vy = -Math.abs(vy);
      }
      return { ...p, x, y, vx, vy };
    }));

    // --- 4. Sync to React State ---
    setTemperature(currentTemp);
    setPistonHeight(state.pistonHeight);
    
    setTotalWork(state.accWork);
    setTotalHeat(state.accHeat);
    setDeltaUDisplay(state.accWork + state.accHeat);

    // Update Instant Arrows
    if (Math.abs(heatStep) > 0.01) {
        setInstantHeat(heatStep * 50);
    } else {
        setInstantHeat(0);
    }
    
    if (Math.abs(autoWorkStep) > 0.01) {
        setInstantWork(autoWorkStep * 50);
    }

    // Loop continues in useEffect via requestAnimationFrame
  }, []);

  const requestRef = useRef<number>(0);

  useEffect(() => {
    const loop = (time: number) => {
        animate(time);
        requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // --- Handlers ---
  const handlePistonDrag = (deltaY: number) => {
    // deltaY > 0: Mouse Down -> Compression -> V decreases
    const newHeight = physicsRef.current.pistonHeight - deltaY;
    
    if (newHeight >= CONSTANTS.MIN_HEIGHT && newHeight <= CONSTANTS.MAX_HEIGHT) {
        physicsRef.current.pistonHeight = newHeight;
        
        // Work Calculation: Compression = Positive Work
        const workChange = deltaY * 1.5; 
        physicsRef.current.accWork += workChange;
        
        setInstantWork(workChange * 10); 
    }
  };

  const handleDragEnd = () => {
    setInstantWork(0);
  };

  const handleSetHeatSource = (source: HeatSourceType) => {
    physicsRef.current.heatSource = source;
    setHeatSource(source);
  };

  const handleReset = () => {
    physicsRef.current.pistonHeight = INIT_HEIGHT;
    physicsRef.current.heatSource = 'none';
    physicsRef.current.accWork = 0;
    physicsRef.current.accHeat = 0;
    
    setHeatSource('none');
    setTemperature(INIT_TEMP);
    setPistonHeight(INIT_HEIGHT);
    
    setTotalWork(0);
    setTotalHeat(0);
    setDeltaUDisplay(0);
    setInstantWork(0);
    setInstantHeat(0);
  };

  const currentPressure = (temperature / Math.max(pistonHeight, 1)) * 33.3;

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
       <div className="mb-4 flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Nhiệt Động Lực Học</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Định luật I: Sự bảo toàn và chuyển hóa năng lượng</p>
         </div>
      </div>

      <div className="flex-grow w-full max-w-7xl mx-auto min-h-[600px] h-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Left: Simulation */}
        <div className="flex-grow relative bg-slate-50 dark:bg-slate-950 p-8 flex flex-col items-center justify-center transition-colors">
          <div className="w-full h-full flex items-center justify-center min-h-[400px]">
            <CylinderSystem 
                height={pistonHeight}
                particles={particles}
                temperature={temperature}
                heatSource={heatSource}
                workDone={instantWork} 
                heatExchange={instantHeat} 
                onPistonDrag={handlePistonDrag}
                onDragEnd={handleDragEnd}
            />
          </div>
        </div>

        {/* Right: Dashboard */}
        <div className="w-full lg:w-[450px] flex-shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-10 transition-colors overflow-y-auto">
          <Dashboard 
            temperature={temperature}
            pressure={currentPressure}
            volume={pistonHeight}
            deltaU={deltaUDisplay}
            workDone={totalWork} 
            heatExchange={totalHeat} 
            heatSource={heatSource}
            onSetHeatSource={handleSetHeatSource}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default Thermodynamics;