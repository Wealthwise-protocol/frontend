import type { User, Transaction } from "@/types"

export const mockUser: User = {
  id: "usr-1",
  firstName: "Sahyam",
  lastName: "Sahu",
  email: "sathyam@example.com",
  phone: "98765 43210",
  countryCode: "+91",
  kycVerified: true,
}

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    date: "12 Oct 2023",
    fundName: "Parag Parikh Flexi Cap Fund",
    type: "SIP",
    amount: 10000,
    units: 146.156,
    nav: 68.42,
    status: "Success",
  },
  {
    id: "t2",
    date: "10 Oct 2023",
    fundName: "HDFC Balanced Advantage Fund",
    type: "SIP",
    amount: 7500,
    units: 18.278,
    nav: 410.32,
    status: "Success",
  },
  {
    id: "t3",
    date: "08 Oct 2023",
    fundName: "ICICI Prudential Bluechip Fund",
    type: "Lumpsum",
    amount: 50000,
    units: 543.478,
    nav: 92.0,
    status: "Success",
  },
  {
    id: "t4",
    date: "05 Oct 2023",
    fundName: "Nippon India Small Cap Fund",
    type: "SIP",
    amount: 5000,
    units: 35.072,
    nav: 142.56,
    status: "Success",
  },
]
