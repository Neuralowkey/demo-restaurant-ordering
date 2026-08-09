import { HebrewCalendar, Location, flags, type Event } from "@hebcal/core";
import { HOURS } from "./brand";

/**
 * Shabbat and yom-tov closure windows.
 *
 * The production system called the Hebcal *web* API and cached the response.
 * This demo computes the same windows locally with `@hebcal/core`, so the app
 * has no network dependency and no failure mode where a Shabbat order slips
 * through because an upstream service was down.
 *
 * Kept server-side on purpose: `@hebcal/core` is a few hundred KB and none of
 * it needs to reach the browser. Pages compute the status and pass the plain
 * object below to client components as props.
 */

/** Candle lighting is this many minutes before sunset; havdalah after. */
const CANDLE_MIN = 18;
const HAVDALAH_MIN = 50;

/** Central Israel. The invented restaurant sits in this band. */
const LOCATION = Location.lookup("Tel Aviv");

export type ClosureWindow = {
  /** ISO instant the closure begins. */
  start: string;
  /** ISO instant it ends. */
  end: string;
  reason_he: string;
  reason_en: string;
  kind: "shabbat" | "holiday";
};

export type ServiceStatus = {
  open: boolean;
  /** Why we're shut, when we are. */
  reason: "shabbat" | "holiday" | "hours" | null;
  reason_he: string | null;
  reason_en: string | null;
  /** ISO instant service resumes, when known. */
  reopensAt: string | null;
  /** The next few windows, for the footer's "hours" block. */
  upcoming: ClosureWindow[];
};

/**
 * `HebrewCalendar.calendar()` is typed as returning plain `Event`s; only the
 * timed subclasses (candle lighting, havdalah, fast begins/ends) carry an
 * `eventTime`. Presence of that field is exactly the distinction the pairing
 * logic below relies on, so it is worth a proper guard rather than a cast.
 */
function eventTimeOf(event: Event): Date | undefined {
  return (event as Event & { eventTime?: Date }).eventTime;
}

/** Candle-lighting → havdalah pairs around `now`, out to `days` ahead. */
export function closureWindows(now: Date, days = 21): ClosureWindow[] {
  // Scan from a few days back, not from `now`: a closure already in progress
  // begins at a candle lighting in the past, and starting the scan at `now`
  // would drop it. Without this, ordering during Shabbat reports "outside
  // opening hours" — technically closed, but the wrong reason to show.
  const start = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const events = HebrewCalendar.calendar({
    start,
    end,
    candlelighting: true,
    location: LOCATION,
    il: true,
    candleLightingMins: CANDLE_MIN,
    havdalahMins: HAVDALAH_MIN,
    mask: flags.CHAG | flags.LIGHT_CANDLES | flags.YOM_TOV_ENDS,
  });

  const windows: ClosureWindow[] = [];

  for (let i = 0; i < events.length; i++) {
    const startEv = events[i];
    if (startEv.getDesc() !== "Candle lighting") continue;
    const startTime = eventTimeOf(startEv);
    if (!startTime) continue;

    // The matching havdalah is the next one after this lighting.
    let endTime: Date | undefined;
    let j = -1;
    for (let k = i + 1; k < events.length; k++) {
      const t = eventTimeOf(events[k]);
      if (events[k].getDesc() === "Havdalah" && t) {
        j = k;
        endTime = t;
        break;
      }
    }
    if (j === -1 || !endTime) continue;

    // Name the window after a chag falling *inside* it. All-day holiday
    // markers carry no eventTime, which is what separates them from timed
    // events — the second candle lighting of a two-day yom tov, or the
    // "Fast begins/ends" pair of a nearby fast day, both of which would
    // otherwise mislabel a plain Shabbat. "Erev X" always sits before the
    // lighting, so whatever is found in here is the chag itself.
    const chag = events
      .slice(i + 1, j)
      .find((e) => !eventTimeOf(e) && !e.getDesc().startsWith("Erev "));

    windows.push({
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      kind: chag ? "holiday" : "shabbat",
      reason_en: chag ? chag.render("en") : "Shabbat",
      reason_he: chag ? chag.render("he") : "שבת",
    });

    // Resume from the havdalah, so a two-day yom tov yields one continuous
    // window instead of a second nested one from its inner candle lighting.
    i = j;
  }

  return windows;
}

/** Are we inside opening hours for this wall-clock moment? */
function withinHours(now: Date): boolean {
  const today = HOURS.find((h) => h.day === now.getDay());
  if (!today || today.close === null) return false;
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= today.open && hour < today.close;
}

export function serviceStatus(now: Date = new Date()): ServiceStatus {
  const windows = closureWindows(now);
  const active = windows.find(
    (w) => new Date(w.start) <= now && now < new Date(w.end),
  );
  // The scan reaches back three days to catch an in-progress closure; windows
  // that have already ended are of no interest to anyone reading the page.
  const upcoming = windows.filter((w) => new Date(w.end) > now);

  if (active) {
    return {
      open: false,
      reason: active.kind,
      reason_he: active.reason_he,
      reason_en: active.reason_en,
      reopensAt: active.end,
      upcoming,
    };
  }

  if (!withinHours(now)) {
    return {
      open: false,
      reason: "hours",
      reason_he: null,
      reason_en: null,
      reopensAt: null,
      upcoming,
    };
  }

  return {
    open: true,
    reason: null,
    reason_he: null,
    reason_en: null,
    reopensAt: null,
    upcoming,
  };
}
