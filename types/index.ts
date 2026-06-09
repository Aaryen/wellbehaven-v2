export interface User {
  id: string
  email: string
  username: string
  language: string
  situation: string
  isPro: boolean
  createdAt: string
}

export interface Room {
  id: string
  title: string
  desc: string
  category: string
  members: number
  capacity: number
  weeklyPrompt: string
  createdAt: string
}

export interface Message {
  id: string
  roomId: string
  userId: string
  username: string
  content: string
  translatedContent: string | null
  isHaven: boolean
  createdAt: string
}

export interface Subscription {
  userId: string
  stripeCustomerId: string
  stripePriceId: string
  status: string
  currentPeriodEnd: string
}
