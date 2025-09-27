"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Item = {
  id: number
  title: string
  img: string
  alt: string
  overview: string
  attributes: {
    basic: { name: string; brand: string; model: string; sku: string; barcode: string }
    physical: { dimensions: string; weight: string; color: string; material: string; finish: string }
    functional: { features: string[]; specs: string[]; usage: string; compatibility: string }
    manufacturing: { origin: string; certifications: string[]; warranty: string; assembly: string }
    commercial: { price: string; currency: string; availability: string; shipping: string; returns: string }
    digital: { images: string; videos: string; reviews: string; keywords: string[]; category: string }
  }
}

const items: Item[] = [
  {
    id: 1,
    title: "Introduction to Algorithms, 3rd Edition — ₹40",
    img: "/images/home-sample-1.png",
    alt: "Stack of spiral-bound notebooks representing a study item",
    overview:
      "This highly respected textbook offers a comprehensive introduction to algorithms, blending rigorous theoretical concepts with practical problem-solving examples. It covers essential topics like sorting, graph algorithms, dynamic programming, and more, making it a cornerstone for computer science study. Ideal for students, instructors, and professionals who want both depth and clarity in understanding algorithms.",
    attributes: {
      basic: {
        name: "Introduction to Algorithms (Third Edition)",
        brand: "MIT Press",
        model: "CLRS-3e",
        sku: "ALG-CLRS-3E",
        barcode: "9780262033848",
      },
      physical: {
        dimensions: '9.5" x 7.0" x 2.1"',
        weight: "2.8 kg",
        color: "Multicolor cover",
        material: "Paper, hardcover",
        finish: "Matte jacket",
      },
      functional: {
        features: [
          "Rigorous proofs with intuitive explanations",
          "Wide coverage: sorting, graphs, DP, NP-completeness, amortized analysis",
          "Exercises and problems for every chapter",
        ],
        specs: ["1312 pages", "English", "Hardcover"],
        usage: "Course textbook and self-study reference",
        compatibility: "Applicable across CS curricula and interview prep",
      },
      manufacturing: {
        origin: "Printed in USA",
        certifications: ["FSC-certified paper"],
        warranty: "Not applicable",
        assembly: "No assembly required",
      },
      commercial: {
        price: "40",
        currency: "INR",
        availability: "In stock",
        shipping: "Ships in 2–4 business days",
        returns: "30-day return policy if unused",
      },
      digital: {
        images: "Front cover and sample pages",
        videos: "Author talks available online",
        reviews: "4.7/5 average rating",
        keywords: ["algorithms", "data structures", "computer science", "CLRS", "textbook"],
        category: "Books > Computer Science",
      },
    },
  },
  {
    id: 2,
    title: "TI-84 Plus Calculator — ₹30",
    img: "/images/home-sample-2.png",
    alt: "Compact white and light-blue electric iron (placeholder visual)",
    overview:
      "The TI-84 Plus is a trusted graphing calculator widely used in high school and college courses. It features advanced graphing capabilities, built-in applications, and support for statistics, calculus, and scientific functions. Approved for standardized tests such as the SAT, ACT, and AP exams, it’s a durable and reliable tool for both classroom and exam settings.",
    attributes: {
      basic: {
        name: "TI-84 Plus Graphing Calculator",
        brand: "Texas Instruments",
        model: "TI-84 Plus",
        sku: "TI84P-STD",
        barcode: "0033317195342",
      },
      physical: {
        dimensions: '7.5" x 3.4" x 0.9"',
        weight: "0.22 kg",
        color: "Black",
        material: "ABS plastic",
        finish: "Matte with textured back",
      },
      functional: {
        features: [
          "Graphing of functions, parametric, polar, and sequences",
          "Statistics and probability apps included",
          "USB connectivity and data transfer",
        ],
        specs: ["8 MB flash ROM", "96x64 pixel display", "AAA battery powered"],
        usage: "Math, science, and standardized testing",
        compatibility: "Approved for SAT, ACT, and AP exams",
      },
      manufacturing: {
        origin: "China",
        certifications: ["CE", "RoHS"],
        warranty: "1-year limited warranty",
        assembly: "No assembly required",
      },
      commercial: {
        price: "30",
        currency: "INR",
        availability: "In stock",
        shipping: "Standard and expedited shipping available",
        returns: "30-day return policy",
      },
      digital: {
        images: "Front, back, and display close-ups",
        videos: "Quick-start and graphing demos",
        reviews: "4.6/5 average rating",
        keywords: ["graphing calculator", "TI-84", "algebra", "calculus", "statistics"],
        category: "Electronics > Calculators",
      },
    },
  },
  {
    id: 3,
    title: "Noise-Cancelling Headphones — ₹80",
    img: "/images/ironbb.png",
    alt: "Stainless steel electric kettle (placeholder visual)",
    overview:
      "These over-ear noise-cancelling headphones are designed to block out distractions and deliver a rich, clear audio experience. With comfortable padding and long-lasting battery life, they are perfect for extended listening sessions at home, during travel, or while studying. Combining style, comfort, and performance, they create an immersive environment wherever you go.",
    attributes: {
      basic: {
        name: "QuietWave Over‑Ear ANC Headphones",
        brand: "SoundLayer",
        model: "QW-700",
        sku: "SL-QW700-ANC",
        barcode: "0810029745123",
      },
      physical: {
        dimensions: '7.8" x 6.5" x 3.1"',
        weight: "0.26 kg",
        color: "Charcoal",
        material: "ABS, aluminum sliders, protein leather",
        finish: "Soft-touch matte",
      },
      functional: {
        features: ["Hybrid active noise cancellation", "40mm dynamic drivers", "Multipoint Bluetooth pairing"],
        specs: ["Bluetooth 5.3", "Up to 45h battery (ANC off)", "USB‑C fast charging"],
        usage: "Study, commute, flights, and home listening",
        compatibility: "iOS, Android, Windows, macOS",
      },
      manufacturing: {
        origin: "Vietnam",
        certifications: ["FCC", "CE", "RoHS"],
        warranty: "2-year limited warranty",
        assembly: "No assembly required",
      },
      commercial: {
        price: "80",
        currency: "INR",
        availability: "In stock",
        shipping: "Ships within 24 hours",
        returns: "30-day hassle-free returns",
      },
      digital: {
        images: "Product, case, and lifestyle images",
        videos: "Noise-cancelling demo and unboxing",
        reviews: "4.5/5 average rating",
        keywords: ["headphones", "noise cancelling", "wireless", "Bluetooth", "study"],
        category: "Audio > Headphones",
      },
    },
  },
]

export default function HomepageDescriptions({
  className,
}: {
  className?: string
}) {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className={cn("w-full", className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <button
              type="button"
              aria-expanded={openId === item.id}
              aria-controls={`desc-${item.id}`}
              onClick={() => toggle(item.id)}
              className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t-lg"
              title="Click to show product description"
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <Image
                  src={item.img || "/placeholder.svg"}
                  alt={item.alt}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>

            <div className="p-4">
              <h3 className="text-pretty text-base font-semibold">{item.title}</h3>

              <div id={`desc-${item.id}`} hidden={openId !== item.id} className="mt-4 space-y-3">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.overview}</p>

                <ul className="text-sm leading-6 list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium">Basic details:</span> Name: {item.attributes.basic.name}; Brand:{" "}
                    {item.attributes.basic.brand}; Model: {item.attributes.basic.model}; SKU:{" "}
                    {item.attributes.basic.sku}; Barcode: {item.attributes.basic.barcode}
                  </li>
                  <li>
                    <span className="font-medium">Physical attributes:</span> Dimensions:{" "}
                    {item.attributes.physical.dimensions}; Weight: {item.attributes.physical.weight}; Color:{" "}
                    {item.attributes.physical.color}; Material: {item.attributes.physical.material}; Finish:{" "}
                    {item.attributes.physical.finish}
                  </li>
                  <li>
                    <span className="font-medium">Functional:</span> Features:{" "}
                    {item.attributes.functional.features.join(", ")}; Specs:{" "}
                    {item.attributes.functional.specs.join(", ")}; Usage: {item.attributes.functional.usage};
                    Compatibility: {item.attributes.functional.compatibility}
                  </li>
                  <li>
                    <span className="font-medium">Manufacturing info:</span> Origin:{" "}
                    {item.attributes.manufacturing.origin}; Certifications:{" "}
                    {item.attributes.manufacturing.certifications.join(", ")}; Warranty:{" "}
                    {item.attributes.manufacturing.warranty}; Assembly: {item.attributes.manufacturing.assembly}
                  </li>
                  <li>
                    <span className="font-medium">Commercial:</span> Price: ${item.attributes.commercial.price}{" "}
                    {item.attributes.commercial.currency}; Availability: {item.attributes.commercial.availability};
                    Shipping: {item.attributes.commercial.shipping}; Returns: {item.attributes.commercial.returns}
                  </li>
                  <li>
                    <span className="font-medium">Digital elements:</span> Images: {item.attributes.digital.images};
                    Videos: {item.attributes.digital.videos}; Reviews: {item.attributes.digital.reviews}; Keywords:{" "}
                    {item.attributes.digital.keywords.join(", ")}; Category: {item.attributes.digital.category}
                  </li>
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
