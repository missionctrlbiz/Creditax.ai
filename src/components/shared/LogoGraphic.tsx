'use client';

export function LogoGraphic({ className = "max-w-[450px] mx-auto" }: { className?: string }) {
  // Coordinates for the 12 nodes forming the letter "C"
  const nodes = [
    { id: 'p1', cx: 105, cy: 30, color: 'green', glowClass: 'glow-1' },
    { id: 'p2', cx: 52,  cy: 48, color: 'teal',  glowClass: 'glow-2' },
    { id: 'p3', cx: 105, cy: 55, color: 'teal',  glowClass: 'glow-3' },
    { id: 'p4', cx: 132, cy: 62, color: 'teal',  glowClass: 'glow-4' },
    { id: 'p5', cx: 160, cy: 50, color: 'green', glowClass: 'glow-1' },
    { id: 'p6', cx: 35,  cy: 95, color: 'teal',  glowClass: 'glow-2' },
    { id: 'p7', cx: 70,  cy: 95, color: 'green', glowClass: 'glow-3' },
    { id: 'p8', cx: 80,  cy: 115, color: 'teal',  glowClass: 'glow-4' },
    { id: 'p9', cx: 52,  cy: 142, color: 'teal',  glowClass: 'glow-1' },
    { id: 'p10', cx: 105, cy: 165, color: 'teal',  glowClass: 'glow-2' },
    { id: 'p11', cx: 135, cy: 120, color: 'green', glowClass: 'glow-3' },
    { id: 'p12', cx: 165, cy: 145, color: 'green', glowClass: 'glow-4' },
  ];

  // Connections between nodes
  const connections = [
    { from: 'p1', to: 'p2' },
    { from: 'p1', to: 'p3' },
    { from: 'p1', to: 'p4' },
    { from: 'p1', to: 'p5' },
    { from: 'p5', to: 'p4' },
    { from: 'p5', to: 'p3' },
    { from: 'p4', to: 'p3' },
    { from: 'p3', to: 'p2' },
    { from: 'p3', to: 'p7' },
    { from: 'p2', to: 'p6' },
    { from: 'p2', to: 'p7' },
    { from: 'p6', to: 'p7' },
    { from: 'p6', to: 'p8' },
    { from: 'p6', to: 'p9' },
    { from: 'p7', to: 'p8' },
    { from: 'p8', to: 'p9' },
    { from: 'p8', to: 'p10' },
    { from: 'p9', to: 'p10' },
    { from: 'p9', to: 'p11' },
    { from: 'p10', to: 'p11' },
    { from: 'p10', to: 'p12' },
    { from: 'p11', to: 'p12' },
  ];

  const getNodeCoords = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.cx, y: node.cy } : { x: 0, y: 0 };
  };

  return (
    <div className={`relative w-full aspect-square select-none ${className}`}>

      <svg 
        viewBox="-20 -20 240 240" 
        className="w-full h-full relative z-10 filter drop-shadow-[0_4px_20px_rgba(13,115,119,0.15)]"
      >
        <defs>
          {/* Glowing filters */}
          <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>{`
          @keyframes glowPulse {
            0%, 100% {
              opacity: 0.35;
              stroke-width: 0.6px;
            }
            50% {
              opacity: 0.85;
              stroke-width: 1px;
            }
          }
          @keyframes dotPulse {
            0%, 100% {
              transform: scale(0.9);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
          .net-line {
            stroke: var(--color-brand-primary);
            opacity: 0.25;
            animation: glowPulse 6s infinite ease-in-out;
          }
          .net-node-group {
            animation: dotPulse 4s infinite ease-in-out;
          }
          .net-node {
            transition: all 0.3s ease;
          }
          .node-teal {
            fill: var(--color-brand-primary);
          }
          .node-green {
            fill: var(--color-brand-action);
          }
        `}</style>

        {/* Connection Lines */}
        {connections.map((conn, idx) => {
          const fromCoords = getNodeCoords(conn.from);
          const toCoords = getNodeCoords(conn.to);
          return (
            <line
              key={idx}
              x1={fromCoords.x}
              y1={fromCoords.y}
              x2={toCoords.x}
              y2={toCoords.y}
              className="net-line"
              strokeLinecap="round"
            />
          );
        })}

        {/* Connection Accent Highlights (slanted helper lines in screenshots) */}
        <line x1="148" y1="56" x2="155" y2="53" stroke="var(--color-brand-primary)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 1" />
        <line x1="82" y1="36" x2="90" y2="33" stroke="var(--color-brand-primary)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 1" />
        <line x1="148" y1="135" x2="155" y2="132" stroke="var(--color-brand-primary)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 1" />
        <line x1="58" y1="108" x2="65" y2="105" stroke="var(--color-brand-primary)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 1" />

        {/* Nodes (Circles) */}
        {nodes.map((node, index) => {
          const isGreen = node.color === 'green';
          // Shuffled stagger order to pulse from different sides organically
          const staggerOrder = [0, 8, 3, 9, 5, 1, 10, 4, 6, 7, 11, 2];
          const delay = `${staggerOrder[index % staggerOrder.length] * 0.3}s`;
          return (
            <g 
              key={node.id} 
              className="net-node-group"
              style={{ 
                transformOrigin: `${node.cx}px ${node.cy}px`,
                animationDelay: delay
              }}
            >
              {/* Outer Glow Ring (SVG Circle with opacity) */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isGreen ? 9 : 7}
                fill={isGreen ? 'var(--color-brand-action)' : 'var(--color-brand-primary)'}
                opacity="0.25"
                filter={isGreen ? 'url(#glow-green)' : 'url(#glow-teal)'}
              />
              {/* Solid Core Circle */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={isGreen ? 4.5 : 3.5}
                className={`net-node ${isGreen ? 'node-green' : 'node-teal'}`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
