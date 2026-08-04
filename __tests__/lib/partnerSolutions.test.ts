import { describe, it, expect } from "vitest";
import {
  mapPartnerLogos,
  mapBundles,
  buildPartnerToc,
} from "@/lib/partnerSolutions";
import {
  PARTNER_LOGOS,
  BUNDLES,
} from "@/components/partnerSolutions/partnerData";

describe("mapPartnerLogos", () => {
  it("falls back to defaults when acf is null", () => {
    expect(mapPartnerLogos(null)).toEqual(PARTNER_LOGOS);
  });

  it("falls back to defaults when the repeater is ACF's empty `false`", () => {
    expect(mapPartnerLogos({ partner_logos: false })).toEqual(PARTNER_LOGOS);
  });

  it("falls back to defaults when the repeater is an empty array", () => {
    expect(mapPartnerLogos({ partner_logos: [] })).toEqual(PARTNER_LOGOS);
  });

  it("maps logo rows to src/alt", () => {
    const acf = {
      partner_logos: [
        { logo: "https://wp.test/a.png", alt: "Partner A" },
        { logo: "https://wp.test/b.png", alt: "Partner B" },
      ],
    };
    expect(mapPartnerLogos(acf)).toEqual([
      { src: "https://wp.test/a.png", alt: "Partner A" },
      { src: "https://wp.test/b.png", alt: "Partner B" },
    ]);
  });

  it("drops rows with no image", () => {
    const acf = {
      partner_logos: [
        { logo: "", alt: "Empty" },
        { logo: "https://wp.test/b.png", alt: "Partner B" },
      ],
    };
    expect(mapPartnerLogos(acf)).toEqual([
      { src: "https://wp.test/b.png", alt: "Partner B" },
    ]);
  });
});

describe("mapBundles", () => {
  it("falls back to defaults when acf is null", () => {
    expect(mapBundles(null)).toEqual(BUNDLES);
  });

  it("falls back to defaults when the repeater is ACF's empty `false`", () => {
    expect(mapBundles({ bundles: false })).toEqual(BUNDLES);
  });

  it("assigns a 1-based index by position", () => {
    const acf = {
      bundles: [
        { key: "a", title: "A", graphic: "list", logo: "/a.png" },
        { key: "b", title: "B", graphic: "list", logo: "/b.png" },
        { key: "c", title: "C", graphic: "list", logo: "/c.png" },
      ],
    };
    expect(mapBundles(acf).map((b) => b.index)).toEqual([1, 2, 3]);
  });

  it("guards nested repeaters that come back as `false`", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "list",
          logo: "/a.png",
          lead: false,
          pointers: false,
          graphic_list: false,
          graphic_steps: false,
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.lead).toEqual([]);
    expect(b.pointers).toEqual([]);
    expect(b.graphicList).toEqual([]);
    expect(b.graphicSteps).toEqual([]);
  });

  it("flattens nested text repeaters to string arrays", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "list",
          logo: "/a.png",
          lead: [{ text: "para one" }, { text: "para two" }],
          pointers: [{ text: "point one" }],
          graphic_list: [{ text: "outcome one" }],
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.lead).toEqual(["para one", "para two"]);
    expect(b.pointers).toEqual(["point one"]);
    expect(b.graphicList).toEqual(["outcome one"]);
  });

  it("maps nested step rows and drops an empty meta", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "steps",
          logo: "/a.png",
          graphic_steps: [
            { heading: "Scan", body: "body one", meta: "m1 · m2" },
            { heading: "Improve", body: "body two", meta: "" },
          ],
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.graphicSteps).toEqual([
      { heading: "Scan", body: "body one", meta: "m1 · m2" },
      { heading: "Improve", body: "body two" },
    ]);
  });

  it("builds the video object only for the video graphic", () => {
    const acf = {
      bundles: [
        {
          key: "zenn",
          title: "Z",
          graphic: "video",
          logo: "/z.png",
          video_poster: "/p.jpg",
          video_src: "/v.mp4",
          video_runtime: "4:06",
          video_eyebrow: "Live demo",
          video_title: "Watch",
          video_blurb: "A blurb",
          video_credit: "Credit line",
        },
        {
          key: "other",
          title: "O",
          graphic: "list",
          logo: "/o.png",
          video_poster: "/p.jpg",
        },
      ],
    };
    const [zenn, other] = mapBundles(acf);
    expect(zenn.video).toEqual({
      poster: "/p.jpg",
      src: "/v.mp4",
      runtime: "4:06",
      eyebrow: "Live demo",
      title: "Watch",
      blurb: "A blurb",
      credit: "Credit line",
    });
    expect(other.video).toBeUndefined();
  });

  it("defaults an unrecognised graphic to list", () => {
    const acf = {
      bundles: [{ key: "a", title: "A", graphic: "wat", logo: "/a.png" }],
    };
    expect(mapBundles(acf)[0].graphic).toBe("list");
  });

  it("drops optional strings that are empty", () => {
    const acf = {
      bundles: [
        {
          key: "a",
          title: "A",
          graphic: "list",
          logo: "/a.png",
          pointers_heading: "",
          lead_after: "",
          graphic_heading: "",
          graphic_footnote: "",
        },
      ],
    };
    const [b] = mapBundles(acf);
    expect(b.pointersHeading).toBeUndefined();
    expect(b.leadAfter).toBeUndefined();
    expect(b.graphicHeading).toBeUndefined();
    expect(b.graphicFootnote).toBeUndefined();
  });
});

describe("buildPartnerToc", () => {
  it("brackets one entry per bundle with the fixed head and tail", () => {
    const bundles = [
      { key: "zenn", title: "ZENN + Balance for Life" },
      { key: "medimart", title: "Medimart + Chronilogix" },
    ] as any;
    expect(buildPartnerToc(bundles)).toEqual([
      { id: null, label: "Overview" },
      { id: "ps-zenn-label", label: "ZENN + Balance for Life" },
      { id: "ps-medimart-label", label: "Medimart + Chronilogix" },
      { id: "ps-your-solution-label", label: "Your solution" },
      { id: "book-a-demo", label: "Book a demo" },
    ]);
  });

  it("still emits the head and tail with no bundles", () => {
    expect(buildPartnerToc([])).toEqual([
      { id: null, label: "Overview" },
      { id: "ps-your-solution-label", label: "Your solution" },
      { id: "book-a-demo", label: "Book a demo" },
    ]);
  });
});
