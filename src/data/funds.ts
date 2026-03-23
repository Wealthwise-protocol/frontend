export type Fund = {
  id: string
  schemeCode?: number
  name: string
  amc: string
  category: "Equity" | "Debt" | "Hybrid" | "ELSS" | "Index"
  subcategory: string
  risk: "LOW" | "MODERATE" | "HIGH" | "VERY HIGH"
  returns: { "1Y": number; "3Y": number; "5Y": number }
  categoryAvg: { "1Y": number; "3Y": number; "5Y": number }
  nav: number
  navChange: number
  navChangePercent: number
  minSip: number
  minLumpsum: number
  aum: string
  expenseRatio: number
  description: string
}

export const funds: Fund[] = [
  {
    id: "ppfas-flexi",
    name: "Parag Parikh Flexi Cap",
    amc: "PPFAS Mutual Fund",
    category: "Equity",
    subcategory: "Flexi Cap",
    risk: "VERY HIGH",
    returns: { "1Y": 34.2, "3Y": 22.4, "5Y": 24.8 },
    categoryAvg: { "1Y": 28.15, "3Y": 19.8, "5Y": 18.5 },
    nav: 74.82,
    navChange: 0.45,
    navChangePercent: 0.6,
    minSip: 1000,
    minLumpsum: 5000,
    aum: "₹62,450 Cr",
    expenseRatio: 0.63,
    description:
      "An open-ended dynamic equity scheme investing across large cap, mid cap, small cap stocks. The fund aims to generate long-term capital appreciation from a portfolio primarily comprising equity and equity related securities.",
  },
  {
    id: "nippon-small",
    name: "Nippon India Small Cap",
    amc: "Nippon India Mutual Fund",
    category: "Equity",
    subcategory: "Small Cap",
    risk: "VERY HIGH",
    returns: { "1Y": 42.1, "3Y": 31.5, "5Y": 29.2 },
    categoryAvg: { "1Y": 38.5, "3Y": 28.0, "5Y": 24.0 },
    nav: 142.56,
    navChange: 1.23,
    navChangePercent: 0.87,
    minSip: 100,
    minLumpsum: 5000,
    aum: "₹46,800 Cr",
    expenseRatio: 0.86,
    description:
      "An open-ended equity scheme predominantly investing in small cap stocks. The fund seeks to generate long-term capital appreciation by investing predominantly in equity and equity related instruments of small cap companies.",
  },
  {
    id: "hdfc-balanced",
    name: "HDFC Balanced Advantage",
    amc: "HDFC Mutual Fund",
    category: "Hybrid",
    subcategory: "Dynamic",
    risk: "HIGH",
    returns: { "1Y": 21.2, "3Y": 14.1, "5Y": 15.9 },
    categoryAvg: { "1Y": 18.0, "3Y": 12.5, "5Y": 13.0 },
    nav: 410.32,
    navChange: 0.89,
    navChangePercent: 0.22,
    minSip: 500,
    minLumpsum: 5000,
    aum: "₹89,200 Cr",
    expenseRatio: 0.74,
    description:
      "An open-ended dynamic asset allocation fund that dynamically manages its equity and debt allocation based on market conditions, aiming for long-term capital appreciation with lower volatility.",
  },
  {
    id: "axis-elss",
    name: "Axis ELSS Tax Saver",
    amc: "Axis Mutual Fund",
    category: "ELSS",
    subcategory: "Tax Saving",
    risk: "VERY HIGH",
    returns: { "1Y": 28.5, "3Y": 18.2, "5Y": 20.1 },
    categoryAvg: { "1Y": 25.0, "3Y": 16.5, "5Y": 17.0 },
    nav: 88.45,
    navChange: 0.62,
    navChangePercent: 0.71,
    minSip: 500,
    minLumpsum: 500,
    aum: "₹38,900 Cr",
    expenseRatio: 0.54,
    description:
      "An open-ended equity linked saving scheme with a statutory lock-in of 3 years and tax benefit. The fund invests predominantly in equity and equity related instruments across market capitalizations.",
  },
  {
    id: "icici-debt",
    name: "ICICI Pru Corporate Bond",
    amc: "ICICI Prudential Mutual Fund",
    category: "Debt",
    subcategory: "Corporate Bond",
    risk: "MODERATE",
    returns: { "1Y": 7.8, "3Y": 6.5, "5Y": 7.2 },
    categoryAvg: { "1Y": 7.0, "3Y": 6.0, "5Y": 6.5 },
    nav: 26.1,
    navChange: 0.02,
    navChangePercent: 0.08,
    minSip: 1000,
    minLumpsum: 5000,
    aum: "₹28,500 Cr",
    expenseRatio: 0.36,
    description:
      "An open-ended debt scheme predominantly investing in AA+ and above rated corporate bonds. The fund aims to generate income through investments in a portfolio of high quality corporate bonds.",
  },
  {
    id: "sbi-bluechip",
    name: "SBI Blue Chip",
    amc: "SBI Mutual Fund",
    category: "Equity",
    subcategory: "Large Cap",
    risk: "HIGH",
    returns: { "1Y": 25.3, "3Y": 17.8, "5Y": 16.5 },
    categoryAvg: { "1Y": 22.0, "3Y": 15.5, "5Y": 14.0 },
    nav: 78.92,
    navChange: 0.54,
    navChangePercent: 0.69,
    minSip: 500,
    minLumpsum: 5000,
    aum: "₹45,600 Cr",
    expenseRatio: 0.72,
    description:
      "An open-ended equity scheme predominantly investing in large cap stocks. The fund aims to provide investors with opportunities for long-term growth of capital through active management of a diversified portfolio.",
  },
  {
    id: "uti-nifty",
    name: "UTI Nifty 50 Index",
    amc: "UTI Mutual Fund",
    category: "Index",
    subcategory: "Nifty 50",
    risk: "HIGH",
    returns: { "1Y": 22.8, "3Y": 15.1, "5Y": 14.9 },
    categoryAvg: { "1Y": 22.5, "3Y": 14.8, "5Y": 14.5 },
    nav: 152.34,
    navChange: 0.78,
    navChangePercent: 0.51,
    minSip: 500,
    minLumpsum: 1000,
    aum: "₹18,200 Cr",
    expenseRatio: 0.1,
    description:
      "An open-ended index scheme replicating/tracking the Nifty 50 Index. The fund seeks to provide returns that closely correspond to the total returns of the Nifty 50 Index, subject to tracking errors.",
  },
  {
    id: "mirae-emerging",
    name: "Mirae Asset Emerging Bluechip",
    amc: "Mirae Asset Mutual Fund",
    category: "Equity",
    subcategory: "Large & Mid Cap",
    risk: "VERY HIGH",
    returns: { "1Y": 32.1, "3Y": 24.5, "5Y": 22.8 },
    categoryAvg: { "1Y": 28.0, "3Y": 20.0, "5Y": 18.0 },
    nav: 125.67,
    navChange: 0.91,
    navChangePercent: 0.73,
    minSip: 1000,
    minLumpsum: 5000,
    aum: "₹32,100 Cr",
    expenseRatio: 0.68,
    description:
      "An open-ended equity scheme investing in both large cap and mid cap stocks. The fund aims to generate income and capital appreciation from a diversified portfolio predominantly investing in Indian equities and equity related securities.",
  },
  {
    id: "kotak-debt",
    name: "Kotak Bond Short Term",
    amc: "Kotak Mutual Fund",
    category: "Debt",
    subcategory: "Short Duration",
    risk: "LOW",
    returns: { "1Y": 7.1, "3Y": 5.9, "5Y": 6.8 },
    categoryAvg: { "1Y": 6.8, "3Y": 5.5, "5Y": 6.2 },
    nav: 44.58,
    navChange: 0.01,
    navChangePercent: 0.02,
    minSip: 1000,
    minLumpsum: 5000,
    aum: "₹15,800 Cr",
    expenseRatio: 0.39,
    description:
      "An open-ended short term debt scheme investing in instruments with a Macaulay duration of 1 to 3 years. The fund aims to generate reasonable returns with low risk by investing in a portfolio of debt and money market instruments.",
  },
  {
    id: "dsp-hybrid",
    name: "DSP Equity & Bond",
    amc: "DSP Mutual Fund",
    category: "Hybrid",
    subcategory: "Aggressive",
    risk: "HIGH",
    returns: { "1Y": 24.5, "3Y": 16.8, "5Y": 15.2 },
    categoryAvg: { "1Y": 20.0, "3Y": 14.0, "5Y": 13.5 },
    nav: 298.45,
    navChange: 1.12,
    navChangePercent: 0.38,
    minSip: 500,
    minLumpsum: 1000,
    aum: "₹10,200 Cr",
    expenseRatio: 0.82,
    description:
      "An open-ended hybrid scheme investing predominantly in equity and equity related instruments with a smaller allocation to debt securities. Aims to generate long-term capital appreciation and current income from a portfolio of equity and fixed income securities.",
  },
]
