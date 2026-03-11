"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Layers,
  Settings2,
} from "lucide-react";
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
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center"
    | "right-center"
    | "left-center";
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
  className = "",
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
    "right-center": "top-1/2 right-0 -translate-y-1/2",
    "left-center": "top-1/2 left-0 -translate-y-1/2",
  };

  if (!isVisible) {
    // For center sidebars, keep the new vertical text button even when hidden.
    if (position === "right-center" || position === "left-center") {
      const isLeft = position === "left-center";
      return (
        <div
          className={`fixed top-16 bottom-10 z-[91] flex items-center pointer-events-none ${
            isLeft ? "left-0 flex-row" : "right-0 flex-row-reverse"
          }`}
        >
          <button
            onClick={() => {
              setIsOpen(true);
              handleVisibilityToggle(true);
            }}
            title={`Show ${title}`}
            className={`
              self-center pointer-events-auto
              h-36 w-7 flex items-center justify-center
              shadow-lg transition-all duration-200 cursor-pointer
              hover:w-8 focus:outline-none
              ${isLeft ? "rounded-r-lg" : "rounded-l-lg"}
            `}
            style={{
              background:
                "linear-gradient(180deg, rgba(10,20,40,0.80) 0%, rgba(15,25,50,0.70) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.13)",
              ...(isLeft ? { borderLeft: "none" } : { borderRight: "none" }),
            }}
          >
            <span
              className="text-[9px] tracking-[0.25em] uppercase font-bold pointer-events-none select-none"
              style={{
                writingMode: "vertical-rl",
                transform: isLeft ? "rotate(180deg)" : "rotate(0deg)",
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.22em",
              }}
            >
              {title}
            </span>
          </button>
        </div>
      );
    }

    // For other positions, keep the small circular eye button.
    return (
      <div className={`fixed ${positionClasses[position]} z-[90]`}>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 bg-background/20 backdrop-blur-2xl border border-white/20 rounded-full shadow-lg text-white hover:bg-white/20"
          onClick={() => handleVisibilityToggle(true)}
          title={`Show ${title}`}
        >
          <Eye className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  const isCenterPosition =
    position === "top-center" || position === "bottom-center";
  const widthClass = isCenterPosition
    ? className.includes("!w-")
      ? ""
      : "w-[900px] max-w-[900px]"
    : "min-w-[280px] max-w-[400px]";

  // ─── Shared sidebar layout: left-center (Map Filters) & right-center (System Widget) ───
  if (position === "left-center" || position === "right-center") {
    const isLeft = position === "left-center";
    // Map Filters: full-height scrollable panel; System Widget: compact auto-height panel
    const HeaderIcon = isLeft ? Layers : Settings2;

    return (
      /*
       * Outer wrapper fixed between header (top-16) and news ticker (bottom-10).
       * Button + panel are flex siblings → they slide as a single unit.
       */
      <div
        className={`fixed top-16 bottom-10 z-[91] flex items-center pointer-events-none ${
          isLeft ? "left-0 flex-row" : "right-0 flex-row-reverse"
        }`}
      >
        {/* ── Vertical edge toggle button ── */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? `Hide ${title}` : `Show ${title}`}
          className={`
            self-center pointer-events-auto
            h-36 w-7 flex items-center justify-center
            shadow-lg transition-all duration-200 cursor-pointer
            hover:w-8 focus:outline-none
            ${isLeft ? "rounded-r-lg" : "rounded-l-lg"}
          `}
          style={{
            background: isOpen
              ? "linear-gradient(180deg, rgba(14,165,233,0.40) 0%, rgba(59,130,246,0.30) 100%)"
              : "linear-gradient(180deg, rgba(10,20,40,0.80) 0%, rgba(15,25,50,0.70) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.13)",
            ...(isLeft ? { borderLeft: "none" } : { borderRight: "none" }),
          }}
        >
          <span
            className="text-[9px] tracking-[0.25em] uppercase font-bold pointer-events-none select-none"
            style={{
              writingMode: "vertical-rl",
              transform: isLeft ? "rotate(180deg)" : "rotate(0deg)",
              color: isOpen
                ? "rgba(186,230,253,1)"
                : "rgba(255,255,255,0.50)",
              letterSpacing: "0.22em",
            }}
          >
            {title}
          </span>
        </button>

        {/* ── Sidebar panel ── */}
        {isOpen && (
          <div
            className={`
              pointer-events-auto w-[280px] flex flex-col
              ${isLeft ? "h-full" : "h-auto max-h-[calc(100vh-6.5rem)]"}
              ${isLeft ? "" : "rounded-l-xl overflow-hidden"}
            `}
            style={{
              background:
                "linear-gradient(160deg, rgba(7,14,34,0.98) 0%, rgba(11,20,46,0.96) 100%)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              borderLeft: isLeft
                ? "none"
                : "1px solid rgba(255,255,255,0.08)",
              borderRight: isLeft
                ? "1px solid rgba(255,255,255,0.08)"
                : "none",
              boxShadow: isLeft
                ? "8px 0 40px rgba(0,0,0,0.65)"
                : "-8px 0 40px rgba(0,0,0,0.65)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="h-6 w-6 rounded-md flex items-center justify-center shadow-md flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                  }}
                >
                  <HeaderIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[13px] font-semibold text-white/90 tracking-wide truncate">
                  {title}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 rounded-md flex items-center justify-center transition-all flex-shrink-0 ml-2"
                style={{ color: "rgba(148,163,184,0.6)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(255,255,255,0.9)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "rgba(148,163,184,0.6)";
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
                title="Close"
              >
                {isLeft ? (
                  <ChevronLeft className="h-4 w-4 text-sky-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-sky-400" />
                )}
              </button>
            </div>

            {/* Content */}
            <div
              className={`
                ${isLeft
                  ? "flex-1 min-h-0 flex flex-col overflow-hidden"
                  : "overflow-y-auto overscroll-contain p-4"}
              `}
              style={
                !isLeft
                  ? { scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }
                  : undefined
              }
            >
              {children}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Generic floating collapsible card (all other positions) ───
  return (
    <div className={`fixed ${positionClasses[position]} z-[90] ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={`bg-background/10 backdrop-blur-2xl border border-white/10 rounded-lg shadow-lg ${widthClass} ${className}`}
          style={
            className.includes("!w-")
              ? { width: "900px", maxWidth: "900px", overflow: "visible" }
              : undefined
          }
        >
          <div className="flex items-center justify-between px-3 py-3 border-b border-white/10">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 justify-between px-0 text-white hover:bg-white/10"
              >
                <div className="flex items-center gap-2">{icon}</div>
                {isOpen ? (
                  <ChevronLeft className="h-4 w-4 text-sky-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-sky-400" />
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

          <CollapsibleContent
            className={className.includes("!p-0") ? "overflow-visible" : ""}
          >
            <div
              className={`${className.includes("!p-0") ? "p-0" : "p-4"} ${
                className.includes("!p-2") ? "p-2" : ""
              }`}
            >
              {children}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
