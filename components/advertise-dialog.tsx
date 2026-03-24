"use client"

import Image from "next/image"
import {
  IconExternalLink,
  IconEye,
  IconSpeakerphone,
  IconUsers,
  IconBolt,
} from "@tabler/icons-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Ad {
  name: string
  description: string
  url: string
  favicon: string
}

const ads: Ad[] = [
  {
    name: "TurboStarter",
    description:
      "Ship your SaaS startup today with web, mobile and extension starter.",
    url: "https://turbostarter.dev",
    favicon: "https://turbostarter.dev/favicon.ico",
  },
]

const TOTAL_SPOTS = 4
const SPOTS_TAKEN = ads.length
const SPOTS_LEFT = TOTAL_SPOTS - SPOTS_TAKEN

const stats = [
  {
    icon: IconUsers,
    value: "15K+",
    label: "Monthly visitors",
  },
  {
    icon: IconEye,
    value: "High-intent",
    label: "Designers, devs & founders",
  },
  {
    icon: IconBolt,
    value: `${SPOTS_LEFT}/${TOTAL_SPOTS}`,
    label: "Spots left",
    highlight: true,
  },
]

export function AdvertiseSpots() {
  return (
    <Dialog>
      <section className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {ads.map((ad) => (
          <a
            key={ad.name}
            href={`${ad.url}?ref=loftlyy&utm_source=loftlyy&utm_medium=sponsorship&utm_campaign=ad_spot`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 transition-all hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
          >
            <Image
              src={ad.favicon}
              alt={ad.name}
              width={28}
              height={28}
              className="rounded-md"
              unoptimized
            />
            <span className="text-sm font-medium text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-neutral-100">
              {ad.name}
            </span>
            <span className="line-clamp-2 max-w-[90%] text-center text-[10px] leading-tight text-neutral-400 dark:text-neutral-500">
              {ad.description}
            </span>
          </a>
        ))}
        {Array.from({ length: SPOTS_LEFT }).map((_, i) => (
          <DialogTrigger
            key={`ad-spot-${i}`}
            className="group flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 opacity-50 transition-all hover:border-neutral-400 hover:opacity-80 dark:border-neutral-600 dark:hover:border-neutral-500"
          >
            <IconSpeakerphone
              size={24}
              className="text-neutral-400 transition-colors group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
            />
            <span className="text-sm font-medium text-neutral-400 transition-colors group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300">
              Advertise
            </span>
            <span className="text-xs text-neutral-400 transition-colors group-hover:text-neutral-500 dark:text-neutral-500 dark:group-hover:text-neutral-400">
              {SPOTS_LEFT}/{TOTAL_SPOTS} spots left
            </span>
          </DialogTrigger>
        ))}
      </section>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Advertise on Loftlyy</DialogTitle>
          <DialogDescription>
            Get your product in front of designers, developers, and founders
            every month.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 sm:gap-1.5 sm:p-3 ${
                stat.highlight
                  ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                  : "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800"
              }`}
            >
              <stat.icon
                size={18}
                className={`shrink-0 ${
                  stat.highlight
                    ? "text-red-500"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              />
              <span
                className={`text-xs font-semibold sm:text-sm ${
                  stat.highlight
                    ? "text-red-600 dark:text-red-400"
                    : "text-neutral-900 dark:text-neutral-100"
                }`}
              >
                {stat.value}
              </span>
              <span className="text-center text-[10px] leading-tight text-neutral-500 sm:text-xs dark:text-neutral-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            How it works
          </h4>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Your product appears in the sponsor slots on the Loftlyy homepage,
            visible to every visitor across all pages. Spots are limited to
            ensure maximum visibility for each advertiser.
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Pricing
            </p>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
              60% OFF
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              $199
            </span>
            <span className="text-sm text-neutral-400 line-through dark:text-neutral-500">
              $499
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              /month
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {SPOTS_LEFT} spots available now. Cancel anytime.
          </p>
        </div>

        <DialogFooter className="!flex-col gap-3">
          <a
            href="https://store.hextaui.com/checkout/buy/0fadcc42-8038-46e7-b0f8-5e3cae5d8935"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            Get started ($199/mo)
            <IconExternalLink size={14} />
          </a>
          <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
            Use code{" "}
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              LAUNCH20
            </span>{" "}
            for 20% off — only for the first 4 sponsors.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
