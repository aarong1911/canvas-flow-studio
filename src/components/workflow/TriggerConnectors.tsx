import React, { useEffect, useRef, useState } from "react";
import { TriggerData } from "./types";

interface TriggerConnectorsProps {
  triggers: TriggerData[];
  triggerRowRef: React.RefObject<HTMLDivElement>;
  sidebarWidth: number;
}

export const TriggerConnectors: React.FC<TriggerConnectorsProps> = ({
  triggers,
  triggerRowRef,
  sidebarWidth,
}) => {
  const [positions, setPositions] = useState<{ x: number; width: number }[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  // Get configured triggers
  const configuredTriggers = triggers.filter(t => t.isConfigured);

  useEffect(() => {
    const updatePositions = () => {
      if (!triggerRowRef.current) return;

      const cards = triggerRowRef.current.querySelectorAll('[data-trigger-card="true"]');
      const containerRect = triggerRowRef.current.getBoundingClientRect();
      
      const newPositions: { x: number; width: number }[] = [];
      
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Get center X position relative to the canvas (excluding sidebar)
        const centerX = rect.left + rect.width / 2;
        newPositions.push({ x: centerX, width: rect.width });
      });

      setPositions(newPositions);
      setContainerWidth(window.innerWidth - sidebarWidth);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    
    // Also update when triggers change
    const timeout = setTimeout(updatePositions, 100);
    
    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(timeout);
    };
  }, [triggers, triggerRowRef, sidebarWidth]);

  if (configuredTriggers.length === 0) return null;

  // Calculate merge point (center of canvas)
  const canvasCenter = containerWidth / 2;
  
  // Top of SVG starts at bottom of trigger cards (approximately 96px from top)
  const triggerCardHeight = 72;
  const triggerRowTop = 24;
  const svgTop = triggerRowTop + triggerCardHeight;
  
  // Height for the connector area
  const connectorHeight = 80;
  
  // Vertical line from trigger to curve point
  const lineDropLength = 30;
  
  // Curve control point offset
  const curveOffset = 20;

  return (
    <svg 
      className="absolute left-0 right-0 z-[5] pointer-events-none"
      style={{ 
        top: svgTop, 
        height: connectorHeight,
        width: containerWidth 
      }}
    >
      {/* Lines from each configured trigger to the merge point */}
      {positions.slice(0, configuredTriggers.length).map((pos, index) => {
        const startX = pos.x;
        const endX = canvasCenter;
        
        // Create path: vertical drop, then curve to center, then vertical to merge point
        const path = configuredTriggers.length === 1
          ? `M ${startX} 0 L ${startX} ${connectorHeight}` // Single trigger: straight line
          : `M ${startX} 0 
             L ${startX} ${lineDropLength} 
             Q ${startX} ${lineDropLength + curveOffset} ${(startX + endX) / 2} ${lineDropLength + curveOffset + 10}
             Q ${endX} ${lineDropLength + curveOffset + 20} ${endX} ${connectorHeight - 10}
             L ${endX} ${connectorHeight}`;

        return (
          <path
            key={configuredTriggers[index]?.id || index}
            d={path}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      
      {/* Merge point indicator (small dot) */}
      {configuredTriggers.length > 1 && (
        <circle
          cx={canvasCenter}
          cy={connectorHeight - 5}
          r="3"
          fill="hsl(var(--border))"
        />
      )}
    </svg>
  );
};