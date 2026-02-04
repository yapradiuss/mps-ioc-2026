"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Activity, Lightbulb, Building2, Receipt, Box, Camera, Car, Users, Save, Check } from "lucide-react";
import WidgetContainer from "../widget-container";

interface ExampleWidgetProps {
  onVisibilityChange?: (visible: boolean) => void;
  defaultVisible?: boolean;
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
  vehicleCountingVisible?: boolean;
  onVehicleCountingVisibilityChange?: (visible: boolean) => void;
  humanCountingVisible?: boolean;
  onHumanCountingVisibilityChange?: (visible: boolean) => void;
  onSavePreferences?: () => void;
}

export default function ExampleWidget({ 
  onVisibilityChange,
  defaultVisible = true,
  streetlightVisible = true,
  onStreetlightVisibilityChange,
  compoundVisible = true,
  onCompoundVisibilityChange,
  taxVisible = true,
  onTaxVisibilityChange,
  aiboxVisible = true,
  onAiboxVisibilityChange,
  cctvVisible = true,
  onCctvVisibilityChange,
  vehicleCountingVisible = true,
  onVehicleCountingVisibilityChange,
  humanCountingVisible = true,
  onHumanCountingVisibilityChange,
  onSavePreferences,
}: ExampleWidgetProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    onSavePreferences?.();
    
    // Show saving state briefly, then show success
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setShowSaved(false);
      }, 2000);
    }, 500);
  };

  return (
    <WidgetContainer
      title="System Widget"
      icon={<Activity className="h-4 w-4" />}
      defaultOpen={true}
      defaultVisible={defaultVisible}
      onVisibilityChange={onVisibilityChange}
      position="top-right"
    >
      <div className="space-y-3">
        {/* Widget Visibility Controls */}
        <div>
          <div className="text-xs text-white/70 mb-2 font-medium">Widget Visibility</div>
          <div className="space-y-2">
            {/* Streetlight */}
            <div className="flex items-center justify-between p-2 bg-background/10 rounded-lg border border-white/5 hover:bg-background/20 transition-colors">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white">Streetlight</span>
              </div>
              <Checkbox
                checked={streetlightVisible}
                onCheckedChange={(checked) => onStreetlightVisibilityChange?.(checked === true)}
                className="border-white/30 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
            </div>

            {/* Compound */}
            <div className="flex items-center justify-between p-2 bg-background/10 rounded-lg border border-white/5 hover:bg-background/20 transition-colors">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">Compound</span>
              </div>
              <Checkbox
                checked={compoundVisible}
                onCheckedChange={(checked) => onCompoundVisibilityChange?.(checked === true)}
                className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between p-2 bg-background/10 rounded-lg border border-white/5 hover:bg-background/20 transition-colors">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white">Tax</span>
              </div>
              <Checkbox
                checked={taxVisible}
                onCheckedChange={(checked) => onTaxVisibilityChange?.(checked === true)}
                className="border-white/30 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
            </div>

            {/* AIBox */}
            <div className="flex items-center justify-between p-2 bg-background/10 rounded-lg border border-white/5 hover:bg-background/20 transition-colors">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">AIBox</span>
              </div>
              <Checkbox
                checked={aiboxVisible}
                onCheckedChange={(checked) => onAiboxVisibilityChange?.(checked === true)}
                className="border-white/30 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
            </div>

            {/* CCTV */}
            <div className="flex items-center justify-between p-2 bg-background/10 rounded-lg border border-white/5 hover:bg-background/20 transition-colors">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white">CCTV</span>
              </div>
              <Checkbox
                checked={cctvVisible}
                onCheckedChange={(checked) => onCctvVisibilityChange?.(checked === true)}
                className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
            </div>

            {/* Vehicle Counting */}
            <div className="flex items-center justify-between p-2 bg-background/10 rounded-lg border border-white/5 hover:bg-background/20 transition-colors">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-cyan-400" />
                <span className="text-sm text-white">Vehicle Count</span>
              </div>
              <Checkbox
                checked={vehicleCountingVisible}
                onCheckedChange={(checked) => onVehicleCountingVisibilityChange?.(checked === true)}
                className="border-white/30 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
              />
            </div>

            {/* Human Counting */}
            <div className="flex items-center justify-between p-2 bg-background/10 rounded-lg border border-white/5 hover:bg-background/20 transition-colors">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-pink-400" />
                <span className="text-sm text-white">Human Count</span>
              </div>
              <Checkbox
                checked={humanCountingVisible}
                onCheckedChange={(checked) => onHumanCountingVisibilityChange?.(checked === true)}
                className="border-white/30 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 border-t border-white/10">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full ${
              showSaved 
                ? 'bg-green-600 hover:bg-green-600' 
                : 'bg-primary hover:bg-primary/90'
            } text-white transition-colors`}
            size="sm"
          >
            {isSaving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : showSaved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </>
            )}
          </Button>
          <p className="text-[10px] text-white/50 text-center mt-1">
            Save widget positions & visibility
          </p>
        </div>
      </div>
    </WidgetContainer>
  );
}

