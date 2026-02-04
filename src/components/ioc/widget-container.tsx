"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  EyeOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface WidgetContainerProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  defaultVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  children: ReactNode;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  className?: string;
}

export default function WidgetContainer({ 
  title,
  icon,
  defaultOpen = true,
  defaultVisible = true,
  onVisibilityChange,
  children,
  position = "top-right",
  className = ""
}: WidgetContainerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const handleVisibilityToggle = (visible: boolean) => {
    setIsVisible(visible);
    onVisibilityChange?.(visible);
  };

  const positionClasses = {
    "top-left": "top-20 left-4",
    "top-right": "top-20 right-4",
    "top-center": "top-20 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-16 left-4",
    "bottom-right": "bottom-16 right-4",
    "bottom-center": "bottom-16 left-1/2 -translate-x-1/2",
  };

  if (!isVisible) {
    return (
      <div className={`fixed ${positionClasses[position]} z-[90]`}>
        <Button
          variant="ghost"
          className="bg-background/10 backdrop-blur-2xl border border-white/10 rounded-lg shadow-lg text-white hover:bg-white/10"
          onClick={() => handleVisibilityToggle(true)}
        >
          <EyeOff className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Show {title}</span>
        </Button>
      </div>
    );
  }

  const isCenterPosition = position === 'top-center' || position === 'bottom-center';
  // Allow custom width via className prop or default based on position
  // For center positions, use wider default width for horizontal widgets
  const widthClass = isCenterPosition 
    ? (className.includes('!w-') ? '' : 'w-[900px] max-w-[900px]') 
    : 'min-w-[280px] max-w-[400px]';

  return (
    <div className={`fixed ${positionClasses[position]} z-[90] ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className={`bg-background/10 backdrop-blur-2xl border border-white/10 rounded-lg shadow-lg ${widthClass} ${className}`} 
          style={className.includes('!w-') ? { width: '900px', maxWidth: '900px', overflow: 'visible' } : undefined}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 justify-between px-0 text-white hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="font-medium">{title}</span>
                </div>
                {isOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 ml-2"
              onClick={() => handleVisibilityToggle(false)}
              title="Hide widget"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>

          <CollapsibleContent className={className.includes('!p-0') ? 'overflow-visible' : ''}>
            <div className={`${className.includes('!p-0') ? 'p-0' : 'p-4'} ${className.includes('!p-2') ? 'p-2' : ''}`}>
              {children}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

