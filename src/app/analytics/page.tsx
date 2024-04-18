import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { getDate } from "@/utils";
import { analytics } from "@/utils/analytics";
import React from "react";

const analyticPage = async () => {
  const TRACKING_DAYS = 7;

  const pageview = await analytics.retrieveDays("pageview", TRACKING_DAYS);

  const totalPageViews = pageview.reduce(
    (acc, curr) =>
      acc + curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0),
    0
  );

  const avgPageViews = (totalPageViews / TRACKING_DAYS).toFixed(1);

  const amtVisitorsToday = pageview
    .filter((ev) => ev.date === getDate())
    .reduce(
      (acc, curr) =>
        acc +
        curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0),
      0
    );

  const topCountriesMap = new Map<string, number>();

  for (let i = 0; i < pageview.length; i++) {
    const day = pageview[i];
    if (!day) continue;
    for (let j = 0; j < day.events.length; j++) {
      const event = day.events[j];
      if (!event) continue;
      const key = Object.keys(event)[0]!;
      const value = Object.values(event)[0]!;

      const parsedKey = JSON.parse(key);
      const country = parsedKey?.country;

      if (country) {
        if (topCountriesMap.has(country)) {
          topCountriesMap.set(country, topCountriesMap.get(country)! + value);
        } else {
          topCountriesMap.set(country, value);
        }
      }
    }
  }

  const topCountries = Array.from(topCountriesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen w-full py-12 flex justify-center items-center">
      <div className="relative w-full max-w-6xl mx-auto text-white">
        <AnalyticsDashboard
          avgVisitorsPerDay={avgPageViews}
          amtVisitorsToday={amtVisitorsToday}
          timeseriesPageviews={pageview}
          topCountries={topCountries}
        />
      </div>
    </div>
  );
};

export default analyticPage;
