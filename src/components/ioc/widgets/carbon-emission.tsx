"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";

type VehicleKind = "motor" | "car" | "mpv" | "bus" | "light" | "heavy";
type Mode = "day" | "year";

// Map Malay labels in JSON to internal vehicle kinds (case-insensitive via normalised lookup)
const VEHICLE_LABEL_TO_KIND_RAW: Record<string, VehicleKind> = {
  motorsikal: "motor",
  kereta: "car",
  mpv: "mpv",
  bas: "bus",
  "lori dan van 2 gandar": "light",
  "lori 3 gandar": "heavy",
};

function labelToKind(label: string): VehicleKind | null {
  return VEHICLE_LABEL_TO_KIND_RAW[label.toLowerCase().trim()] ?? null;
}

// The JSON only marks "Arah 1" / "Arah 2" on the FIRST row of each direction block.
// All subsequent vehicle rows in that block have "" set to "".
// This helper walks every row in order and tags each row with its inferred direction.
interface TaggedRow extends ApecRow {
  _dir: "Arah 1" | "Arah 2" | "";
}

function tagRowsWithDirection(rawRows: ApecRow[]): TaggedRow[] {
  let currentDir: "Arah 1" | "Arah 2" | "" = "";
  return rawRows
    .map((row) => {
      if (row[""] === "Arah 1" || row[""] === "Arah 2") currentDir = row[""];
      return { ...row, _dir: currentDir };
    })
    .filter(
      (row) =>
        (row._dir === "Arah 1" || row._dir === "Arah 2") &&
        row.__1 && row.__1 !== "" &&     // skip total/jumlah rows
        row.datetime !== "Jumlah"
    );
}

// Emission factors from HTML LCC 2030 calculator (g CO2e/km)
const EMISSION_FACTOR_G_PER_KM: Record<VehicleKind, number> = {
  motor: 116.4,
  car: 216.2,
  mpv: 324.7,
  bus: 781.1,
  light: 290.4,
  heavy: 792.1,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApecRow = Record<string, any>;

interface ChartPoint {
  dateLabel: string;
  arah1: number;
  arah2: number;
}

interface SummaryRow {
  kind: VehicleKind;
  label: string;
  arah1Annual: number;
  arah2Annual: number;
  totalAnnual: number;
}

interface CarbonEmissionProps {
  disableInternalPositioning?: boolean;
  initialSize?: { width: number; height: number };
}

const VEHICLE_OPTIONS: { kind: VehicleKind; label: string }[] = [
  { kind: "motor", label: "Motorcycle" },
  { kind: "car", label: "Car" },
  { kind: "mpv", label: "MPV" },
  { kind: "bus", label: "Bus" },
  { kind: "light", label: "Light Truck" },
  { kind: "heavy", label: "Heavy Truck" },
];

const SITE_OPTIONS: { id: string; label: string; file: string }[] = [
  { id: "apec-bomba", label: "APEC Bomba", file: "apec-bomba" },
  { id: "hospital-cyberjaya", label: "Hospital Cyberjaya", file: "hospital-cyberjaya" },
  { id: "persiaran-semarak-api", label: "Persiaran Semarak API", file: "persiaran-semarak-api" },
  { id: "radius-cyberjaya", label: "Radius Cyberjaya", file: "radius-cyberjaya" },
  { id: "setia-ecoglades", label: "Setia Eco Glades", file: "setia-ecoglades" },
  { id: "station-mrt-cyberjaya", label: "Station MRT Cyberjaya", file: "station-mrt-cyberjaya" },
];

// Preload all site data at module level so no async loading is needed
import apecBomba from "@/carbon-emission/apec-bomba.json";
import hospitalCyberjaya from "@/carbon-emission/hospital-cyberjaya.json";
import persiaran from "@/carbon-emission/persiaran-semarak-api.json";
import radiusCyberjaya from "@/carbon-emission/radius-cyberjaya.json";
import setiaEcoglades from "@/carbon-emission/setia-ecoglades.json";
import stationMrt from "@/carbon-emission/station-mrt-cyberjaya.json";

const SITE_DATA: Record<string, ApecRow[]> = {
  "apec-bomba": apecBomba as ApecRow[],
  "hospital-cyberjaya": hospitalCyberjaya as ApecRow[],
  "persiaran-semarak-api": persiaran as ApecRow[],
  "radius-cyberjaya": radiusCyberjaya as ApecRow[],
  "setia-ecoglades": setiaEcoglades as ApecRow[],
  "station-mrt-cyberjaya": stationMrt as ApecRow[],
};

export default function CarbonEmissionWidget({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disableInternalPositioning = false,
}: CarbonEmissionProps) {
  const [selectedSite, setSelectedSite] = useState<string>("apec-bomba");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleKind>("car");
  const [mode, setMode] = useState<Mode>("day");

  const chartData: ChartPoint[] = useMemo(() => {
    const rows = tagRowsWithDirection(SITE_DATA[selectedSite] ?? []);
    if (!rows.length) return [];

    const dateKeys = Object.keys(rows[0]).filter(
      (k) => k !== "" && k !== "__1" && k !== "datetime" && k !== "_dir"
    );
    const sortedDateKeys = [...dateKeys].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const ef = EMISSION_FACTOR_G_PER_KM[selectedVehicle];
    const factor = mode === "day" ? 1 : 365;

    return sortedDateKeys.map((dateStr) => {
      let volArah1 = 0;
      let volArah2 = 0;

      rows.forEach((row) => {
        if (labelToKind(row.__1) !== selectedVehicle) return;
        const v = Number(row[dateStr] ?? 0) || 0;
        if (row._dir === "Arah 1") volArah1 += v;
        else if (row._dir === "Arah 2") volArah2 += v;
      });

      // VKT = volume × 1 km constant → tCO₂e = VKT × EF / 1_000_000
      return {
        dateLabel: dateStr,
        arah1: Number(((volArah1 * ef) / 1_000_000 * factor).toFixed(3)),
        arah2: Number(((volArah2 * ef) / 1_000_000 * factor).toFixed(3)),
      };
    });
  }, [selectedSite, selectedVehicle, mode]);

  // Annual summary across ALL vehicle types (always annual regardless of mode selector)
  const summaryData: SummaryRow[] = useMemo(() => {
    const rows = tagRowsWithDirection(SITE_DATA[selectedSite] ?? []);
    if (!rows.length) return [];

    const dateKeys = Object.keys(rows[0]).filter(
      (k) => k !== "" && k !== "__1" && k !== "datetime" && k !== "_dir"
    );
    const numDays = dateKeys.length || 1;

    return VEHICLE_OPTIONS.map(({ kind, label }) => {
      const ef = EMISSION_FACTOR_G_PER_KM[kind];
      let totalVolArah1 = 0;
      let totalVolArah2 = 0;

      rows.forEach((row) => {
        if (labelToKind(row.__1) !== kind) return;
        const v = dateKeys.reduce((sum, dk) => sum + (Number(row[dk] ?? 0) || 0), 0);
        if (row._dir === "Arah 1") totalVolArah1 += v;
        else if (row._dir === "Arah 2") totalVolArah2 += v;
      });

      // Average daily volume × 365 × 1 km × EF → tCO₂e/year
      const arah1Annual = (totalVolArah1 / numDays) * 365 * ef / 1_000_000;
      const arah2Annual = (totalVolArah2 / numDays) * 365 * ef / 1_000_000;

      return {
        kind,
        label,
        arah1Annual: Number(arah1Annual.toFixed(2)),
        arah2Annual: Number(arah2Annual.toFixed(2)),
        totalAnnual: Number((arah1Annual + arah2Annual).toFixed(2)),
      };
    });
  }, [selectedSite]);

  const grandTotal = useMemo(() => ({
    arah1: Number(summaryData.reduce((s, r) => s + r.arah1Annual, 0).toFixed(2)),
    arah2: Number(summaryData.reduce((s, r) => s + r.arah2Annual, 0).toFixed(2)),
    total: Number(summaryData.reduce((s, r) => s + r.totalAnnual, 0).toFixed(2)),
  }), [summaryData]);

  const yLabel = mode === "day" ? "tCO₂e/day" : "tCO₂e/year";
  const currentSiteLabel = SITE_OPTIONS.find((s) => s.id === selectedSite)?.label ?? selectedSite;

  return (
    <Card className="bg-white text-slate-900 flex flex-col h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center">
            <Leaf className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-wide text-slate-900">
              Carbon Emission
            </CardTitle>
            <p className="text-[11px] text-black/70">
              {currentSiteLabel} &mdash; {mode === "day" ? "Daily" : "Annual"} ({yLabel})
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 min-h-0 flex flex-col gap-2">
        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-[0.16em] text-black/50 font-semibold shrink-0">
            LCC 2030 – Mobility
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {/* Site selector */}
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 max-w-[180px]"
            >
              {SITE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Vehicle selector */}
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value as VehicleKind)}
              className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              {VEHICLE_OPTIONS.map((opt) => (
                <option key={opt.kind} value={opt.kind}>
                  {opt.label}
                </option>
              ))}
            </select>
            {/* Mode selector */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
              className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              <option value="day">Daily</option>
              <option value="year">Annual</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-[220px] bg-white">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 16, bottom: 32, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.45)" />
              <XAxis
                dataKey="dateLabel"
                tick={{ fontSize: 9, fill: "rgba(15,23,42,0.95)" }}
                interval={chartData.length > 20 ? 3 : 0}
                angle={-30}
                textAnchor="end"
                height={42}
              />
              <YAxis tick={{ fontSize: 10, fill: "rgba(15,23,42,0.95)" }} width={56} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.8)",
                  padding: 8,
                }}
                labelStyle={{ fontSize: 11, color: "#020617" }}
                formatter={(value: number, name: string) => [
                  `${value} ${yLabel}`,
                  name === "arah1" ? "Arah 1" : "Arah 2",
                ]}
              />
              <Legend
                formatter={(value: string) => (
                  <span style={{ fontSize: 11, color: "#0f172a" }}>
                    {value === "arah1" ? "Arah 1" : "Arah 2"}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="arah1"
                name="arah1"
                stroke="#2563eb"
                strokeWidth={2.2}
                dot={{ r: 2.8, strokeWidth: 1.2, stroke: "#bfdbfe", fill: "#3b82f6" }}
                activeDot={{ r: 4.2, stroke: "#eff6ff", strokeWidth: 2, fill: "#1d4ed8" }}
              />
              <Line
                type="monotone"
                dataKey="arah2"
                name="arah2"
                stroke="#f97316"
                strokeWidth={2.2}
                dot={{ r: 2.8, strokeWidth: 1.2, stroke: "#fed7aa", fill: "#fb923c" }}
                activeDot={{ r: 4.2, stroke: "#ffedd5", strokeWidth: 2, fill: "#ea580c" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Annual Summary Table */}
        <div className="mt-1">
          {/* Table header label */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-emerald-200" />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-emerald-700 whitespace-nowrap">
              Annual Mobility Carbon Emission Summary
            </span>
            <div className="h-px flex-1 bg-emerald-200" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr className="bg-emerald-50">
                  <th className="text-left px-3 py-2 font-semibold text-slate-700 border-b border-slate-200 whitespace-nowrap">
                    Vehicle Type
                  </th>
                  <th className="text-right px-3 py-2 font-semibold text-blue-700 border-b border-slate-200 whitespace-nowrap">
                    Arah 1 (tCO₂e/yr)
                  </th>
                  <th className="text-right px-3 py-2 font-semibold text-orange-600 border-b border-slate-200 whitespace-nowrap">
                    Arah 2 (tCO₂e/yr)
                  </th>
                  <th className="text-right px-3 py-2 font-semibold text-emerald-700 border-b border-slate-200 whitespace-nowrap">
                    Total (tCO₂e/yr)
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, i) => (
                  <tr
                    key={row.kind}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-3 py-1.5 text-slate-800 font-medium border-b border-slate-100">
                      {row.label}
                    </td>
                    <td className="px-3 py-1.5 text-right text-blue-700 tabular-nums border-b border-slate-100">
                      {row.arah1Annual.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right text-orange-600 tabular-nums border-b border-slate-100">
                      {row.arah2Annual.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right text-emerald-700 font-semibold tabular-nums border-b border-slate-100">
                      {row.totalAnnual.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-50 border-t-2 border-emerald-300">
                  <td className="px-3 py-2 font-bold text-slate-900 text-[11px] uppercase tracking-wide">
                    Grand Total
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-blue-800 tabular-nums">
                    {grandTotal.arah1.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-orange-700 tabular-nums">
                    {grandTotal.arah2.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-emerald-800 tabular-nums">
                    {grandTotal.total.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-[9.5px] text-slate-400 mt-1 text-right">
            * Based on avg. daily volume × 365 days × 1 km (constant) × LCC 2030 emission factors
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
