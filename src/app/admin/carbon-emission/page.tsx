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
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf } from "lucide-react";

// Shared types with IOC widget (kept local to avoid tight coupling)
type VehicleKind = "motor" | "car" | "mpv" | "bus" | "light" | "heavy";
type Mode = "day" | "year";
type VehicleFilter = "all" | VehicleKind;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApecRow = Record<string, any>;

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
    .filter((row: ApecRow & { _dir: string }) => {
      const v = row["__1"];
      return (
        (row._dir === "Arah 1" || row._dir === "Arah 2") &&
        v != null &&
        v !== "" &&
        row.datetime !== "Jumlah"
      );
    }) as TaggedRow[];
}

// Emission factors from LCC 2030 calculator (g CO2e/km)
const EMISSION_FACTOR_G_PER_KM: Record<VehicleKind, number> = {
  motor: 116.4,
  car: 216.2,
  mpv: 324.7,
  bus: 781.1,
  light: 290.4,
  heavy: 792.1,
};

interface SummaryRow {
  kind: VehicleKind;
  label: string;
  daily: number;
  annual: number;
}

interface ChartPoint {
  label: string;
  value: number;
}

interface DailyRow {
  date: string;
  motorCount: number;
  motor: number;
  carCount: number;
  car: number;
  mpvCount: number;
  mpv: number;
  busCount: number;
  bus: number;
  lightCount: number;
  light: number;
  heavyCount: number;
  heavy: number;
  total: number;
}

const VEHICLE_META: { kind: VehicleKind; label: string }[] = [
  { kind: "motor", label: "Motorcycle" },
  { kind: "car", label: "Car" },
  { kind: "mpv", label: "MPV" },
  { kind: "bus", label: "Bus" },
  { kind: "light", label: "Light Truck" },
  { kind: "heavy", label: "Heavy Truck" },
];

const SITE_OPTIONS: { id: string; label: string }[] = [
  { id: "apec-bomba", label: "APEC Bomba" },
  { id: "hospital-cyberjaya", label: "Hospital Cyberjaya" },
  { id: "persiaran-semarak-api", label: "Persiaran Semarak API" },
  { id: "radius-cyberjaya", label: "Radius Cyberjaya" },
  { id: "setia-ecoglades", label: "Setia Eco Glades" },
  { id: "station-mrt-cyberjaya", label: "Station MRT Cyberjaya" },
];

// Preload all site data (same JSONs as IOC widget)
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

export default function AdminCarbonEmissionPage() {
  const [selectedSite, setSelectedSite] = useState<string>("apec-bomba");
  const [mode, setMode] = useState<Mode>("year");
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const rows = useMemo(
    () => tagRowsWithDirection(SITE_DATA[selectedSite] ?? []),
    [selectedSite]
  );

  const dateKeys = useMemo(() => {
    if (!rows.length) return [] as string[];
    return Object.keys(rows[0]).filter(
      (k) => k !== "" && k !== "__1" && k !== "datetime" && k !== "_dir"
    );
  }, [rows]);

  const numDays = dateKeys.length || 1;

  const summaryRows: SummaryRow[] = useMemo(() => {
    if (!rows.length || !numDays) return [];

    return VEHICLE_META.map(({ kind, label }) => {
      const ef = EMISSION_FACTOR_G_PER_KM[kind];
      let totalVol = 0;

      rows.forEach((row) => {
        if (labelToKind(row.__1) !== kind) return;
        const v = dateKeys.reduce(
          (sum, dk) => sum + (Number(row[dk] ?? 0) || 0),
          0
        );
        totalVol += v;
      });

      // Average daily volume across both directions × 1 km × EF → tCO₂e/day
      const avgDailyVol = totalVol / numDays;
      const daily = (avgDailyVol * ef) / 1_000_000;
      const annual = daily * 365;

      return {
        kind,
        label,
        daily: Number(daily.toFixed(2)),
        annual: Number(annual.toFixed(2)),
      };
    });
  }, [rows, dateKeys, numDays]);

  const filteredForChart = useMemo(
    () =>
      vehicleFilter === "all"
        ? summaryRows
        : summaryRows.filter((r) => r.kind === vehicleFilter),
    [summaryRows, vehicleFilter]
  );

  const chartData: ChartPoint[] = useMemo(
    () =>
      filteredForChart.map((r) => ({
        label: r.label,
        value: mode === "day" ? r.daily : r.annual,
      })),
    [filteredForChart, mode]
  );

  const currentSiteLabel =
    SITE_OPTIONS.find((s) => s.id === selectedSite)?.label ?? selectedSite;

  const grandTotalAnnual = summaryRows.reduce((sum, r) => sum + r.annual, 0);
  const grandTotalDaily = summaryRows.reduce((sum, r) => sum + r.daily, 0);

  // Per-date daily emission table (all vehicles, both directions)
  const dailyRows: DailyRow[] = useMemo(() => {
    if (!rows.length || !dateKeys.length) return [];

    return dateKeys.map((dk) => {
      let motorCount = 0;
      let motor = 0;
      let carCount = 0;
      let car = 0;
      let mpvCount = 0;
      let mpv = 0;
      let busCount = 0;
      let bus = 0;
      let lightCount = 0;
      let light = 0;
      let heavyCount = 0;
      let heavy = 0;

      rows.forEach((row) => {
        const kind = labelToKind(row.__1);
        if (!kind) return;
        const vol = Number(row[dk] ?? 0) || 0;
        const ef = EMISSION_FACTOR_G_PER_KM[kind];
        const tPerDay = (vol * ef) / 1_000_000;

        if (kind === "motor") {
          motorCount += vol;
          motor += tPerDay;
        } else if (kind === "car") {
          carCount += vol;
          car += tPerDay;
        } else if (kind === "mpv") {
          mpvCount += vol;
          mpv += tPerDay;
        } else if (kind === "bus") {
          busCount += vol;
          bus += tPerDay;
        } else if (kind === "light") {
          lightCount += vol;
          light += tPerDay;
        } else if (kind === "heavy") {
          heavyCount += vol;
          heavy += tPerDay;
        }
      });

      const total = motor + car + mpv + bus + light + heavy;

      return {
        date: dk,
        motorCount,
        motor: Number(motor.toFixed(3)),
        carCount,
        car: Number(car.toFixed(3)),
        mpvCount,
        mpv: Number(mpv.toFixed(3)),
        busCount,
        bus: Number(bus.toFixed(3)),
        lightCount,
        light: Number(light.toFixed(3)),
        heavyCount,
        heavy: Number(heavy.toFixed(3)),
        total: Number(total.toFixed(3)),
      };
    });
  }, [rows, dateKeys]);

  const totalPages = Math.max(1, Math.ceil(dailyRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedDailyRows = dailyRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
            <Leaf className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Carbon Emission (Mobility)
            </h1>
            <p className="text-sm text-muted-foreground">
              Annual mobility carbon emission summary by location &amp; vehicle type.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Based on APEC traffic counts &amp; LCC 2030 emission factors
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)]">
        {/* Left: Summary table */}
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base">
                Mobility Carbon Emission Summary
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Location: <span className="font-medium">{currentSiteLabel}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={selectedSite}
                onValueChange={setSelectedSite}
              >
                <SelectTrigger className="w-[210px] h-8 text-xs">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {SITE_OPTIONS.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="year">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Vehicle Type
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground">
                      Daily (tCO₂e/day)
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground">
                      Annual Emission (tCO₂e/yr)
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground">
                      Share (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row, idx) => {
                    const share =
                      grandTotalAnnual > 0 ? (row.annual / grandTotalAnnual) * 100 : 0;
                    return (
                      <tr
                        key={row.kind}
                        className={idx % 2 === 0 ? "bg-background" : "bg-muted/40"}
                      >
                        <td className="px-3 py-2 text-sm">{row.label}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                          {row.daily.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {row.annual.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                          {share.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-500/5 border-t">
                    <td className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                      Grand Total
                    </td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums text-muted-foreground">
                      {grandTotalDaily.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">
                      {grandTotalAnnual.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                      100.0
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Method: Average daily traffic volume (both directions) × 365 days ×
              section length (1 km) × emission factor (g CO₂e/km) / 1,000,000.
            </p>
          </CardContent>
        </Card>

        {/* Right: Chart */}
        <Card>
          <CardHeader className="pb-2 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">
                  {mode === "day"
                    ? "Daily Emission by Vehicle Type"
                    : "Annual Emission by Vehicle Type"}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Location: {currentSiteLabel}
                </p>
              </div>
              <Select
                value={vehicleFilter}
                onValueChange={(v) => setVehicleFilter(v as VehicleFilter)}
              >
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="All vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All vehicle types</SelectItem>
                  {VEHICLE_META.map((v) => (
                    <SelectItem key={v.kind} value={v.kind}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Showing {mode === "day" ? "average daily" : "annual"} emissions for{" "}
              {vehicleFilter === "all"
                ? "all vehicle types"
                : VEHICLE_META.find((v) => v.kind === vehicleFilter)?.label ?? ""}
              .
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 12, bottom: 40, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.4)" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "rgb(100,116,139)" }}
                    angle={-25}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "rgb(100,116,139)" }}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      padding: 8,
                    }}
                    labelStyle={{ fontSize: 11 }}
                    formatter={(value: number) => [
                      `${value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ${mode === "day" ? "tCO₂e/day" : "tCO₂e/yr"}`,
                      mode === "day" ? "Daily emission" : "Annual emission",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={2.2}
                    dot={{ r: 3, strokeWidth: 1, stroke: "#bbf7d0", fill: "#22c55e" }}
                    activeDot={{
                      r: 5,
                      stroke: "#ecfdf5",
                      strokeWidth: 2,
                      fill: "#16a34a",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily data table with pagination */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 pb-3">
          <div>
            <CardTitle className="text-base">
              Daily Emission Data (tCO₂e/day)
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Location: <span className="font-medium">{currentSiteLabel}</span>{" "}
              · {dailyRows.length} days
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded border bg-background disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded border bg-background disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-xs border-collapse">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground align-bottom">
                    Date
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-1 text-center font-semibold text-muted-foreground"
                  >
                    Motorcycle
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-1 text-center font-semibold text-muted-foreground"
                  >
                    Car
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-1 text-center font-semibold text-muted-foreground"
                  >
                    MPV
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-1 text-center font-semibold text-muted-foreground"
                  >
                    Bus
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-1 text-center font-semibold text-muted-foreground"
                  >
                    Light Trck
                  </th>
                  <th
                    colSpan={2}
                    className="px-3 py-1 text-center font-semibold text-muted-foreground"
                  >
                    Heavy Trck
                  </th>
                  <th
                    rowSpan={2}
                    className="px-3 py-2 text-right font-semibold text-muted-foreground align-bottom"
                  >
                    Total Emission
                    <br />
                    <span className="text-[10px] font-normal">
                      tCO₂e/day
                    </span>
                  </th>
                </tr>
                <tr>
                  <th />
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    Veh/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    tCO₂e/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    Veh/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    tCO₂e/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    Veh/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    tCO₂e/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    Veh/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    tCO₂e/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    Veh/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    tCO₂e/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    Veh/day
                  </th>
                  <th className="px-3 py-1 text-right font-semibold text-muted-foreground text-[11px]">
                    tCO₂e/day
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedDailyRows.map((row, idx) => (
                  <tr
                    key={row.date}
                    className={idx % 2 === 0 ? "bg-background" : "bg-muted/40"}
                  >
                    <td className="px-3 py-1.5 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                      {row.motorCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {row.motor.toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                      {row.carCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {row.car.toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                      {row.mpvCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {row.mpv.toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                      {row.busCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {row.bus.toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                      {row.lightCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {row.light.toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                      {row.heavyCount.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums">
                      {row.heavy.toFixed(3)}
                    </td>
                    <td className="px-3 py-1.5 text-right tabular-nums font-medium">
                      {row.total.toFixed(3)}
                    </td>
                  </tr>
                ))}
                {pagedDailyRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-4 text-center text-muted-foreground"
                    >
                      No data available for this location.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Each cell shows estimated daily emission (tCO₂e/day) for that date,
            aggregated over both directions and all sections in the dataset.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

