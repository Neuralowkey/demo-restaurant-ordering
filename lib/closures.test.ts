import { describe, it, expect } from "vitest";
import { closureWindows, serviceStatus } from "./closures";

/**
 * These lock the two bugs that the naive candle-lighting → havdalah pairing
 * walks straight into: a two-day yom tov emitting a second nested window from
 * its inner candle lighting, and a plain Shabbat being mislabelled by a timed
 * event (a fast day) sitting next to it in the stream.
 */

const TISHREI_5787 = new Date(2026, 8, 8); // 8 Sep 2026, before Rosh Hashana

describe("closureWindows", () => {
  it("emits one continuous window for a two-day yom tov", () => {
    const windows = closureWindows(TISHREI_5787, 24);
    const rosh = windows.filter((w) => w.reason_en.startsWith("Rosh Hashana"));

    expect(rosh).toHaveLength(1);
    // Friday evening straight through to Sunday night — ~49 hours.
    const hours =
      (new Date(rosh[0].end).getTime() - new Date(rosh[0].start).getTime()) /
      3_600_000;
    expect(hours).toBeGreaterThan(40);
    expect(rosh[0].kind).toBe("holiday");
  });

  it("does not emit overlapping windows", () => {
    const windows = closureWindows(TISHREI_5787, 24);
    for (let i = 1; i < windows.length; i++) {
      expect(new Date(windows[i].start).getTime()).toBeGreaterThanOrEqual(
        new Date(windows[i - 1].end).getTime(),
      );
    }
  });

  it("labels a plain Shabbat as Shabbat even next to a fast day", () => {
    // The Shabbat of 18–19 Sep 2026 follows Tzom Gedaliah, whose timed
    // "Fast begins/ends" events sit adjacent to it in the event stream.
    const windows = closureWindows(TISHREI_5787, 24);
    const shabbat = windows.find((w) => w.start.startsWith("2026-09-18"));

    expect(shabbat).toBeDefined();
    expect(shabbat!.reason_en).toBe("Shabbat");
    expect(shabbat!.kind).toBe("shabbat");
  });

  it("names chagim in both languages", () => {
    const windows = closureWindows(TISHREI_5787, 24);
    const yk = windows.find((w) => w.reason_en === "Yom Kippur");

    expect(yk).toBeDefined();
    expect(yk!.reason_he).toContain("כִּפּוּר");
  });

  it("labels chol hamoed Shabbat as Shabbat, not Pesach", () => {
    const windows = closureWindows(new Date(2026, 2, 28), 14);
    const cholHamoed = windows.find((w) => w.start.startsWith("2026-04-03"));

    expect(cholHamoed?.reason_en).toBe("Shabbat");
  });
});

describe("serviceStatus", () => {
  it("reports shabbat — not 'hours' — while Shabbat is in progress", () => {
    // Midday Saturday: the window opened Friday evening, in the past.
    const status = serviceStatus(new Date("2026-08-01T09:00:00Z"));

    expect(status.open).toBe(false);
    expect(status.reason).toBe("shabbat");
    expect(status.reopensAt).not.toBeNull();
  });

  it("reports the holiday while a two-day yom tov is in progress", () => {
    // Second day of Rosh Hashana — deep inside the window.
    const status = serviceStatus(new Date("2026-09-13T09:00:00Z"));

    expect(status.open).toBe(false);
    expect(status.reason).toBe("holiday");
    expect(status.reason_en).toContain("Rosh Hashana");
  });

  it("is open during ordinary service hours", () => {
    // Sunday 13:00 Israel time.
    const status = serviceStatus(new Date("2026-08-02T10:00:00Z"));

    expect(status.open).toBe(true);
    expect(status.reason).toBeNull();
  });

  it("closes outside opening hours for a non-calendar reason", () => {
    // Sunday 03:00 Israel time.
    const status = serviceStatus(new Date("2026-08-02T00:00:00Z"));

    expect(status.open).toBe(false);
    expect(status.reason).toBe("hours");
  });

  it("is open on Friday morning, before candle lighting", () => {
    const status = serviceStatus(new Date("2026-08-07T09:00:00Z"));

    expect(status.open).toBe(true);
  });

  it("only surfaces closures that have not already ended", () => {
    const now = new Date("2026-08-02T10:00:00Z");
    const status = serviceStatus(now);

    for (const w of status.upcoming) {
      expect(new Date(w.end).getTime()).toBeGreaterThan(now.getTime());
    }
  });
});
