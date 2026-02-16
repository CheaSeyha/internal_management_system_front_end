"use client";

import React, { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

export function ChartBarInteractive({
  title = "Bar Chart - Interactive",
  description = "Showing total visitors for the last 3 months",
  data = [],
  chartConfig = {},
}) {
  // Automatically set the first key (e.g., desktop, mobile, etc.)
  const dataKeys = Object.keys(chartConfig);
  const [activeChart, setActiveChart] = useState(dataKeys[0] || "");

  const chartData =
    Array.isArray(data) && data.length > 0
      ? data
      : [{ date: new Date().toISOString(), [activeChart]: 0 }];

  // Compute total for all keys in chartConfig dynamically
  const total = useMemo(() => {
    const totals = {};
    dataKeys.forEach((key) => {
      totals[key] = chartData.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    });
    return totals;
  }, [chartData, dataKeys]);

  return (
    <Card className="py-0">
      {/* Header */}
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex">
          {dataKeys.map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-muted-foreground text-xs">
                {chartConfig[key]?.label || key}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {(total[key] || 0).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          style={{ aspectRatio: "2 / 1" }}
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill={chartConfig[activeChart]?.color || "var(--chart-1)"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
