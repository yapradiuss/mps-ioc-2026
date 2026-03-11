"use client";

import { useState } from "react";
import {
  Activity,
  Lightbulb,
  Building2,
  Receipt,
  Box,
  Camera,
  Car,
  Users,
  Save,
  Check,
  Loader2,
} from "lucide-react";
import WidgetContainer from "../widget-container";

interface ExampleWidgetProps {
  onVisibilityChange?: (visible: boolean) => void;
  defaultVisible?: boolean;
  weatherVisible?: boolean;
  onWeatherVisibilityChange?: (visible: boolean) => void;
  streetlightVisible?: boolean;
  onStreetlightVisibilityChange?: (visible: boolean) => void;
  compoundVisible?: boolean;
  onCompoundVisibilityChange?: (visible: boolean) => void;
  taxVisible?: boolean;
  onTaxVisibilityChange?: (visible: boolean) => void;
  aiboxVisible?: boolean;
  onAiboxVisibilityChange?: (visible: boolean) => void;
  cctvVisible?: boolean;
  onCctvVisibilityChange?: (visible: boolean) => void;
  carbonEmissionVisible?: boolean;
  onCarbonEmissionVisibilityChange?: (visible: boolean) => void;
  vehicleCountingVisible?: boolean;
  onVehicleCountingVisibilityChange?: (visible: boolean) => void;
  humanCountingVisible?: boolean;
  onHumanCountingVisibilityChange?: (visible: boolean) => void;
  onSavePreferences?: () => void;
}

interface WidgetToggleProps {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  accent: string;        // tailwind bg colour token, e.g. "bg-cyan-500"
  accentHex: string;     // hex used for the glow / indicator
  onChange: (v: boolean) => void;
}

function WidgetToggle({
  icon,
  label,
  enabled,
  accent,
  accentHex,
  onChange,
}: WidgetToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 focus:outline-none group text-left"
      style={{
        background: enabled
          ? `rgba(${hexToRgb(accentHex)}, 0.10)`
          : "rgba(255,255,255,0.03)",
        border: enabled
          ? `1px solid rgba(${hexToRgb(accentHex)}, 0.25)`
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Icon badge */}
      <div
        className="h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-150"
        style={{
          background: enabled
            ? `rgba(${hexToRgb(accentHex)}, 0.22)`
            : "rgba(255,255,255,0.06)",
          border: enabled
            ? `1px solid rgba(${hexToRgb(accentHex)}, 0.35)`
            : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          className="transition-colors duration-150"
          style={{
            color: enabled ? accentHex : "rgba(255,255,255,0.35)",
          }}
        >
          {icon}
        </span>
      </div>

      {/* Label */}
      <span
        className="flex-1 text-[13px] font-medium transition-colors duration-150 truncate"
        style={{
          color: enabled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </span>

      {/* Toggle pill */}
      <div
        className="relative flex-shrink-0 h-5 w-9 rounded-full transition-all duration-200"
        style={{
          background: enabled
            ? `rgba(${hexToRgb(accentHex)}, 0.80)`
            : "rgba(255,255,255,0.10)",
          boxShadow: enabled
            ? `0 0 8px rgba(${hexToRgb(accentHex)}, 0.40)`
            : "none",
        }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200"
          style={{
            left: enabled ? "calc(100% - 18px)" : "2px",
          }}
        />
      </div>
    </button>
  );
}

/** Convert #rrggbb to "r,g,b" for use inside rgba(). */
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

const WIDGETS: {
  key: keyof ExampleWidgetProps;
  onChange: keyof ExampleWidgetProps;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  accentHex: string;
}[] = [
  { key: "weatherVisible",          onChange: "onWeatherVisibilityChange",         label: "Weather",        Icon: Activity,  accentHex: "#22d3ee" },
  { key: "streetlightVisible",      onChange: "onStreetlightVisibilityChange",     label: "Streetlight",    Icon: Lightbulb, accentHex: "#facc15" },
  { key: "compoundVisible",         onChange: "onCompoundVisibilityChange",        label: "Compound",       Icon: Building2, accentHex: "#60a5fa" },
  { key: "taxVisible",              onChange: "onTaxVisibilityChange",             label: "Tax",            Icon: Receipt,   accentHex: "#4ade80" },
  { key: "aiboxVisible",            onChange: "onAiboxVisibilityChange",           label: "AIBox",          Icon: Box,       accentHex: "#818cf8" },
  { key: "cctvVisible",             onChange: "onCctvVisibilityChange",            label: "CCTV",           Icon: Camera,    accentHex: "#c084fc" },
  { key: "carbonEmissionVisible",   onChange: "onCarbonEmissionVisibilityChange",  label: "Carbon Emission",Icon: Activity,  accentHex: "#22c55e" },
  { key: "vehicleCountingVisible",  onChange: "onVehicleCountingVisibilityChange", label: "Vehicle Count",  Icon: Car,       accentHex: "#38bdf8" },
  { key: "humanCountingVisible",    onChange: "onHumanCountingVisibilityChange",   label: "Human Count",    Icon: Users,     accentHex: "#f472b6" },
];

export default function ExampleWidget(props: ExampleWidgetProps) {
  const {
    onVisibilityChange,
    defaultVisible = true,
    onSavePreferences,
  } = props;

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = () => {
    setSaveState("saving");
    onSavePreferences?.();
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 500);
  };

  const activeCount = WIDGETS.filter((w) => props[w.key] as boolean).length;

  return (
    <WidgetContainer
      title="System Widget"
      icon={null}
      defaultOpen={true}
      defaultVisible={defaultVisible}
      onVisibilityChange={onVisibilityChange}
      position="right-center"
    >
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Widgets
        </span>
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
          style={{
            background: "rgba(14,165,233,0.15)",
            color: "rgba(125,211,252,0.9)",
            border: "1px solid rgba(14,165,233,0.20)",
          }}
        >
          {activeCount}/{WIDGETS.length} on
        </span>
      </div>

      {/* Toggle list */}
      <div className="flex flex-col gap-1.5">
        {WIDGETS.map((w) => (
          <WidgetToggle
            key={w.key}
            icon={<w.Icon className="h-3.5 w-3.5" />}
            label={w.label}
            enabled={(props[w.key] as boolean) ?? true}
            accent=""
            accentHex={w.accentHex}
            onChange={(v) =>
              (props[w.onChange] as ((v: boolean) => void) | undefined)?.(v)
            }
          />
        ))}
      </div>

      {/* Divider */}
      <div
        className="my-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      />

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saveState === "saving"}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 focus:outline-none disabled:opacity-60"
        style={
          saveState === "saved"
            ? {
                background: "linear-gradient(135deg,#16a34a,#15803d)",
                color: "#fff",
                boxShadow: "0 2px 12px rgba(22,163,74,0.35)",
              }
            : {
                background: "linear-gradient(135deg,#0ea5e9,#2563eb)",
                color: "#fff",
                boxShadow: "0 2px 12px rgba(14,165,233,0.30)",
              }
        }
      >
        {saveState === "saving" ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving…
          </>
        ) : saveState === "saved" ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Saved!
          </>
        ) : (
          <>
            <Save className="h-3.5 w-3.5" />
            Save Layout
          </>
        )}
      </button>

      <p className="text-[10px] text-center mt-1.5" style={{ color: "rgba(255,255,255,0.28)" }}>
        Saves widget positions &amp; visibility
      </p>
    </WidgetContainer>
  );
}
