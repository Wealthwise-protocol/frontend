export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  kycVerified: boolean
}

export type SignUpPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  password: string
}

export type Installment = {
  id: string
  installmentDate: string
  amount: number
  nav: number
  units: number
  status: "COMPLETED" | "FAILED" | "PENDING"
}

export type SIP = {
  id: string
  fundId: string | null
  fundName: string
  monthlyAmt: number
  startDate: string
  nextDebit: string
  totalInvested: number
  currentValue: number
  status: "ACTIVE" | "PAUSED"
  installments: Installment[]
}

export type TransactionType = "SIP" | "Lumpsum" | "Redeem"
export type TransactionStatus = "Success" | "Processing" | "Failed"

export type Transaction = {
  id: string
  date: string
  fundName: string
  type: TransactionType
  amount: number
  units: number
  nav: number
  status: TransactionStatus
}

export type Holding = {
  id: string
  name: string
  category: string
  units: number
  avgNav: number
  curNav: number
  invested: number
  curValue: number
  gain: number
}
