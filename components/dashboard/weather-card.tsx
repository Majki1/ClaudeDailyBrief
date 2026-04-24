import { CloudSun, Droplets, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Brief } from "@/lib/brief-schema";

type WeatherBlock = NonNullable<Brief["weather"]>;

export function WeatherCard({ weather }: { weather?: WeatherBlock }) {
  const hasAny =
    weather && (weather.current || (weather.forecast && weather.forecast.length > 0));

  return (
    <Card
      icon={CloudSun}
      title="Weather"
      subtitle={weather?.location ?? "Rijeka, Croatia"}
      className="md:col-span-5 lg:col-span-4"
    >
      {!hasAny ? (
        <EmptyState icon={CloudSun} title="No weather data" />
      ) : (
        <div className="flex flex-col gap-4">
          {weather?.current ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-semibold text-[var(--color-text)] tabular-nums">
                    {Math.round(weather.current.tempC)}
                  </span>
                  <span className="text-lg text-[var(--color-text-muted)]">°C</span>
                </div>
                {weather.current.condition ? (
                  <p className="mt-1 text-sm text-[var(--color-text)]">
                    {weather.current.condition}
                  </p>
                ) : null}
                {typeof weather.current.feelsLikeC === "number" ? (
                  <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">
                    Feels like{" "}
                    <span className="font-mono">
                      {Math.round(weather.current.feelsLikeC)}°
                    </span>
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-[var(--color-text-muted)]">
                {typeof weather.current.humidity === "number" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5" strokeWidth={2} />
                    <span className="font-mono">{weather.current.humidity}%</span>
                  </span>
                ) : null}
                {typeof weather.current.windKph === "number" ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5" strokeWidth={2} />
                    <span className="font-mono">
                      {Math.round(weather.current.windKph)} km/h
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}

          {weather?.summary ? (
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              {weather.summary}
            </p>
          ) : null}

          {weather?.forecast && weather.forecast.length > 0 ? (
            <div className="-mx-5 overflow-x-auto px-5">
              <div className="flex min-w-full gap-3 pb-1">
                {weather.forecast.map((f, i) => (
                  <div
                    key={`${f.time}-${i}`}
                    className="flex min-w-[72px] flex-col items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2"
                  >
                    <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-subtle)]">
                      {f.time}
                    </span>
                    <span className="font-mono text-sm font-medium text-[var(--color-text)] tabular-nums">
                      {Math.round(f.tempC)}°
                    </span>
                    {f.condition ? (
                      <span className="max-w-[72px] truncate text-[11px] text-[var(--color-text-muted)]">
                        {f.condition}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
