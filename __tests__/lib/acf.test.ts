import { describe, it, expect } from "vitest";
import { normalizeAcfDemoUrls, withAcfDefaults } from "@/lib/acf";
import { DEMO_BOOKING_URL } from "@/site.config";

describe("normalizeAcfDemoUrls", () => {
  it("rewrites the legacy demo anchor to the booking URL", () => {
    expect(normalizeAcfDemoUrls("#book-a-demo")).toBe(DEMO_BOOKING_URL);
  });

  it("rewrites the anchor in top-level fields", () => {
    expect(
      normalizeAcfDemoUrls({
        hero_cta_url: "#book-a-demo",
        hero_cta_label: "Book a Demo",
      }),
    ).toEqual({
      hero_cta_url: DEMO_BOOKING_URL,
      hero_cta_label: "Book a Demo",
    });
  });

  it("rewrites the anchor inside repeater arrays and nested groups", () => {
    expect(
      normalizeAcfDemoUrls({
        personas: [
          { kind: "link", url: "#book-a-demo" },
          { kind: "link", url: "/product" },
        ],
        closing: { primary_url: "#book-a-demo" },
      }),
    ).toEqual({
      personas: [
        { kind: "link", url: DEMO_BOOKING_URL },
        { kind: "link", url: "/product" },
      ],
      closing: { primary_url: DEMO_BOOKING_URL },
    });
  });

  it("leaves other URLs and other anchors untouched", () => {
    const input = {
      a: "/product",
      b: "#motivational-interviewing",
      c: "https://example.com",
      d: "/chronilogix-mi-whitepaper.pdf",
    };
    expect(normalizeAcfDemoUrls(input)).toEqual(input);
  });

  it("does not rewrite strings that merely contain the anchor", () => {
    expect(normalizeAcfDemoUrls("see #book-a-demo below")).toBe(
      "see #book-a-demo below",
    );
  });

  it("passes through non-string primitives and null", () => {
    expect(normalizeAcfDemoUrls({ n: 3, t: true, z: null })).toEqual({
      n: 3,
      t: true,
      z: null,
    });
  });
});

describe("withAcfDefaults", () => {
  it("keeps defaults when acf is missing", () => {
    expect(withAcfDefaults({ a: "x" }, null)).toEqual({ a: "x" });
  });

  it("drops null, undefined and empty-string values", () => {
    expect(
      withAcfDefaults(
        { a: "x", b: "y", c: "z" },
        { a: null, b: undefined, c: "" } as never,
      ),
    ).toEqual({ a: "x", b: "y", c: "z" });
  });

  it("overrides defaults with supplied values", () => {
    expect(withAcfDefaults({ a: "x" }, { a: "y" })).toEqual({ a: "y" });
  });
});
