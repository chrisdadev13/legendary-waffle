import React, { useEffect, useRef } from "react"
import { useFeatureStore } from "@/store/features"
import { Avatar, AvatarImage, Button, Input } from "@calypso/ui"
import { openPeeps } from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
import classNames from "classnames"
import { motion, useInView } from "framer-motion"
import {
  BrandTiktok,
  ChartBar,
  ChartPie,
  Link as LinkIcon,
  Pointer,
} from "tabler-icons-react"

interface Props {
  children?: React.ReactNode
  id: string
}

export const FeatureTile: React.FC<Props> = ({ children, id }) => {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" })
  const setInviewFeature = useFeatureStore((state) => state.setInViewFeature)
  const inViewFeature = useFeatureStore((state) => state.inViewFeature)

  useEffect(() => {
    if (isInView) setInviewFeature(id)
    if (inViewFeature === "id" && !isInView) setInviewFeature(null)
  }, [isInView, id, setInviewFeature, inViewFeature])

  return (
    <p
      ref={ref}
      className={classNames(
        "font-heading py-16 text-5xl font-bold transition-colors",
        isInView ? "text-black" : "text-gray-300",
      )}
    >
      {children}
    </p>
  )
}

export const FeatureCard: React.FC<{
  children?: React.ReactNode
  gradient: string
  id: string
}> = ({ children, gradient, id }) => {
  const inViewFeature = useFeatureStore((state) => state.inViewFeature)
  return (
    <div
      className={classNames(
        "absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br transition-opacity",
        gradient,
        inViewFeature === id ? "opacity-100" : "opacity-0",
      )}
    >
      {children}
    </div>
  )
}

interface CardProps {
  id: string
}

export const FirstCard = ({ id }: CardProps) => (
  <FeatureCard id={id} gradient="from-green-100 to-green-200">
    <motion.div
      className=" flex h-full w-full cursor-pointer items-center justify-center p-20"
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="w-full rounded-xl bg-green-300 p-5 font-bold text-white">
        <h1>yala.la/me</h1>
      </div>
    </motion.div>
  </FeatureCard>
)

export const SecondCard = ({ id }: CardProps) => {
  const [isAnimated, setIsAnimated] = React.useState<number>(0)

  const linkStyle = [
    "rounded-full",
    "rounded-lg border border-r-4 border-b-4 border-black",
    "rounded-md",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimated((prev) => (prev + 1) % linkStyle.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <FeatureCard id={id} gradient="from-blue-50 to-blue-200">
      <div className="flex h-full w-full flex-col items-center justify-center">
        {[0, 1, 2].map(() => (
          <div
            className={classNames(
              "my-3 flex h-16 w-2/4 items-center justify-center rounded-full bg-gray-50 transition duration-1000 ease-in-out",
              linkStyle[isAnimated],
            )}
          >
            <LinkIcon className="text-gray-600" />
            <div className="ml-10 h-5 w-2/4 rounded-full bg-gray-300"></div>
          </div>
        ))}
      </div>
    </FeatureCard>
  )
}

export const ThirdCard = ({ id }: CardProps) => {
  const avatar = React.useMemo(() => {
    return createAvatar(openPeeps, {
      seed: "Taylor",
      size: 48,
      backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
    }).toDataUriSync()
  }, [])

  return (
    <FeatureCard id={id} gradient="from-purple-50 to-purple-200">
      <div className=" flex h-full w-full items-center justify-center">
        <div className=" flex w-2/4 flex-col items-center justify-center rounded-lg bg-white p-10">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} alt="User random avatar example" />
          </Avatar>
          <p className="font-bold">Taylor</p>
          <p>Hey visitor please subscribe!! </p>
          <div className="my-5">
            <Input type="text" placeholder="Email" />
            <small>Accept terms and conditions</small>
          </div>
          <Button variant="default" className="w-full">
            Subscribe
          </Button>
        </div>
      </div>
    </FeatureCard>
  )
}

export const FourthCard = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-orange-50 to-orange-200">
      <div className=" flex h-full w-full items-center justify-center">
        <div className=" flex w-2/4 flex-col rounded-lg bg-white p-10 text-left">
          <h1>Hello Taylor</h1>
          <p className="mb-5 text-sm">Take a look at your stats:</p>
          <div>
            <div className="flex items-center justify-between">
              <ChartBar />
              <ChartPie />
              <Pointer />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <small>Visits </small>
              <p>+12% </p>
            </div>
            <div>
              <small>Subs </small>
              <p>+50 </p>
            </div>
            <div>
              <small>Clicks </small>
              <p>+16.4 </p>
            </div>
          </div>
          <p className="mt-5 text-xs">
            *You had 50 visitors from your TikTok's bio
          </p>
        </div>
      </div>
    </FeatureCard>
  )
}
