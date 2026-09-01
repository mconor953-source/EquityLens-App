# Equity Lens Insights

Build a completely new frontend for a financial research application called EQUITYLENS.

IMPORTANT:

This is the frontend for an existing working Python financial-analysis engine.

DO NOT invent a new financial algorithm.

DO NOT create fake AI trading logic.

DO NOT build a backend yet.

DO NOT add authentication yet.

DO NOT add payments.

DO NOT add a database.

For this first version, use clearly labelled realistic MOCK DATA solely to build the interface.

Later, this frontend will connect to my existing FastAPI backend which already provides:

- asset data

- market research

- technical analysis

- Strong Buy / Buy / Neutral / Sell / Strong Sell ratings

- financial health scoring

- fundamentals

- news / event risk

- market structure

- 4H / 1H / 15M / 5M analysis

- buyer and seller levels

- break / correction / continuation structure logic

- watchlists

- investment ideas

==================================================

PRODUCT

==================================================

Name:

EQUITYLENS

Subtitle:

Market Intelligence

Core idea:

EquityLens helps ordinary investors and more advanced users quickly understand:

- what markets are doing

- why an asset is moving

- whether technical conditions are bullish or bearish

- financial strength

- major upcoming risks/events

- multi-timeframe market structure

- what matters today

It should feel like a REAL FINTECH PRODUCT.

NOT:

- a student project

- a Streamlit app

- a generic AI dashboard

- a crypto casino

- a trading bot

- a colourful consumer investing game

Think:

professional financial research terminal

+

modern investment application

+

clean institutional research interface

but approachable enough for somebody who is relatively new to investing.

==================================================

DESIGN LANGUAGE

==================================================

I want an entirely new visual identity.

Main colours:

Charcoal:

#252A30

Dark graphite:

#1F2328

Steel grey:

#626D78

Soft grey:

#DCE1E5

App background:

#F1F3F5

White:

#FFFFFF

Muted financial blue:

#507A96

Teal / positive:

#398476

Amber / watch:

#B3843D

Muted red / negative:

#A94F4F

DO NOT dominate the product with navy blue.

The overall visual feeling should be:

CHARCOAL

GREY

WHITE

STEEL

SUBTLE BLUE

with teal / amber / red only where the financial meaning requires it.

==================================================

TYPOGRAPHY

==================================================

Use a professional finance-oriented sans-serif.

Preferred:

IBM Plex Sans

Alternative:

Inter

Use a mono/tabular style selectively for:

- prices

- tickers

- percentage changes

- important market values

Typography should feel precise and institutional.

No cartoonish fonts.

No oversized marketing headings.

==================================================

SHAPE / COMPONENT STYLE

==================================================

Use:

- 4px to 6px border radius

- thin grey borders

- flat white surfaces

- subtle hover states

- compact tables

- strong alignment

- tabular numbers

- restrained shadows or no shadows

- dense but readable information layout

AVOID:

- giant rounded cards

- glassmorphism

- gradients

- glowing elements

- huge empty areas

- bubble-style components

- floating widgets everywhere

- AI sparkles

- excessive animations

- colourful dashboard tiles

- generic SaaS aesthetics

This needs to look like professional FINANCIAL SOFTWARE.

==================================================

MAIN APPLICATION SHELL

==================================================

Desktop-first responsive layout.

LEFT SIDEBAR:

approximately 230px.

Charcoal background.

At top:

EQUITYLENS

Market Intelligence

Navigation:

Dashboard

Market Research

Market Structure

Investment Ideas

Watchlists

divider

Settings

Later we will add:

Portfolio Lab

Market Voices

Use understated line icons.

Selected page:

subtle steel/blue-grey background with a small accent.

Do not make selected navigation a giant bright pill.

==================================================

GLOBAL TOP BAR

==================================================

Main content should have a slim top bar.

Potential information:

Market status

Last updated

Search shortcut

Keep this very restrained.

==================================================

PAGE 1 — DASHBOARD

==================================================

This must immediately look substantially different from a Streamlit dashboard.

Header:

Dashboard

subtitle:

Markets, research and risk at a glance.

Right:

Thursday, 20 August 2026

Market data delayed

ROW 1:

compact 4-metric strip

Market Breadth

8 / 14 advancing

Biggest Mover

Silver

+4.68%

Event Risk

Low

Watchlist

5 assets

These should NOT look like giant individual cards.

Use one unified compact metrics strip or four very restrained panels.

--------------------------------------------------

ROW 2

--------------------------------------------------

Approximately 65 / 35 split.

LEFT:

MARKET OVERVIEW

tabs:

Global Markets

Major Assets

Movers

Example data:

S&P 500      7,676.08     -0.41%

NASDAQ       26,077.47    -0.96%

Dow Jones    53,050.20    -0.77%

FTSE 100     10,752.84    +0.09%

DAX          25,995.87    -0.37%

Nikkei 225   65,326.42    -3.16%

This should look like a real market monitor table.

RIGHT:

WHAT MATTERS TODAY

Example:

Markets are mixed today.

8 of 14 tracked assets are advancing.

Silver leads gains at +4.68%.

Nikkei 225 is the weakest at -3.16%.

Then a small section:

IMPORTANT TODAY

Fed speaker — 18:00

NVDA earnings — tomorrow

Gold — elevated momentum

GBP/USD — major UK data tomorrow

Make it concise.

--------------------------------------------------

ROW 3

--------------------------------------------------

LEFT:

WATCHLIST

Ticker

Price

1D

Technical

Structure

Event Risk

RIGHT:

RESEARCH HIGHLIGHTS

Examples:

NVDA

Technical rating: Strong Buy

Financial Health: 82/100

Gold

Structure: Watching Seller Level

GBP/JPY

Event risk: High

--------------------------------------------------

ROW 4

--------------------------------------------------

UPCOMING EVENTS

compact horizontal event list / timeline.

==================================================

PAGE 2 — MARKET RESEARCH

==================================================

This is one of the most important pages.

Header:

Market Research

subtitle:

Understand the asset in minutes.

At top:

large but compact asset search.

Example selected asset:

Apple Inc.

AAPL

NASDAQ

Price:

$316.83

Daily:

+2.19%

--------------------------------------------------

MAIN AREA

--------------------------------------------------

70 / 30 layout.

LEFT:

large professional price chart.

Use candlestick or clean line chart styling.

Include timeframe selector:

1M

3M

6M

1Y

5Y

RIGHT:

RESEARCH SNAPSHOT

Technical Rating:

STRONG BUY

Signal count:

6 Buy

1 Neutral

1 Sell

Financial Health:

78 / 100

Good

Trend:

Uptrend

Event Risk:

Low

Use compact horizontal status treatments.

DO NOT use massive colourful pills.

--------------------------------------------------

BELOW

--------------------------------------------------

TECHNICAL ANALYSIS

Keep the existing concept:

Strong Buy / Buy / Neutral / Sell / Strong Sell.

Include a clean sentiment meter:

Strong Sell

Sell

Neutral

Buy

Strong Buy

Then compact indicator table:

SMA 20

Buy

Price above 20-day average

SMA 50

Buy

RSI

Neutral

MACD

Sell

etc.

--------------------------------------------------

FINANCIAL HEALTH

Score:

78 / 100

Five categories:

Growth

20 / 20

Profitability

20 / 20

Balance Sheet

10 / 20

Cash Flow

20 / 20

Valuation

8 / 20

Then:

STRENGTHS

Revenue growth

Strong profitability

Strong free cash flow

WEAKNESSES

High valuation multiples

Make this look like professional equity research.

--------------------------------------------------

NEWS & EVENT RISK

Compact relevant-news list.

Example:

Apple supplier outlook improves

2h ago

US inflation data tomorrow

High importance

Upcoming earnings

24 Oct

Show why events/news might matter.

==================================================

PAGE 3 — MARKET STRUCTURE

==================================================

This is an advanced research feature.

Do NOT call it a trading strategy.

Page:

Market Structure

Subtitle:

Multi-timeframe price structure and key buyer/seller levels.

Selected example:

Gold Futures

GC=F

Price:

$4,536.30

Daily:

+1.04%

Structure Status:

WATCHING SELLER LEVEL

--------------------------------------------------

TIMEFRAMES

--------------------------------------------------

One horizontal row:

4H

Bullish

1H

Developing

15M

Bearish

5M

Bearish

The 4H and 1H establish higher-timeframe direction.

15M and 5M provide lower-timeframe confirmation.

--------------------------------------------------

MAIN AREA

--------------------------------------------------

70 / 30.

LEFT:

large structure chart.

Show price action.

Only show recent important:

HH

HL

LH

LL

Do NOT plaster hundreds of labels over the chart.

Use stronger markers for major structure.

Older/minor structure should be faded or hidden.

Display horizontal:

Seller Level

Buyer Level

with restrained red/teal dashed lines.

RIGHT:

KEY LEVELS

Seller level:

4,583.80

Buyer level:

4,378.00

CURRENT PHASE

Break:

Waiting

Correction:

Not confirmed

Continuation:

Not confirmed

STRUCTURE OUTLOOK

Example:

4H structure remains bullish.

1H is developing below the active seller level.

No confirmed candle-close break has occurred yet.

--------------------------------------------------

BELOW

--------------------------------------------------

ADVANCED STRUCTURE DETAILS

Collapsed by default.

EVENT RISK

Example:

No major high-impact events scheduled this week.

This page should feel like serious MARKET ANALYSIS SOFTWARE.

Not a trading bot.

No:

Entry

Stop Loss

Take Profit

Position Size

==================================================

RESPONSIVE BEHAVIOUR

==================================================

Desktop is the priority.

On tablet:

sidebar can collapse.

On mobile:

use stacked panels and bottom/slide navigation where appropriate.

Tables should remain usable.

==================================================

INTERACTION QUALITY

==================================================

Add subtle:

- hover states

- loading skeletons

- transitions around 120–180ms

- tab changes

- chart tooltip interactions

Do not make the app flashy.

==================================================

IMPORTANT DEVELOPMENT RULES

==================================================

For now:

USE MOCK DATA.

Structure the code cleanly so data can later come from REST API calls.

Create reusable components for:

AssetHeader

MetricStrip

MarketTable

ResearchSnapshot

StatusIndicator

SignalMeter

FinancialHealth

EventList

StructurePanel

PriceChart

Keep data separate from presentation.

Later I will connect these components to an existing FastAPI backend running endpoints such as:

/api/asset/{ticker}

/api/research/{ticker}

/api/technical/{ticker}

/api/fundamentals/{ticker}

/api/market-structure/{ticker}

/api/events/{ticker}

/api/watchlist

/api/investment-ideas

DO NOT implement replacement financial calculations.

==================================================

FIRST BUILD SCOPE

==================================================

For this first Lovable build ONLY create:

1. Global application shell/sidebar

2. Dashboard

3. Market Research

4. Market Structure

Also create simple placeholder navigation pages for:

Investment Ideas

Watchlists

Settings

DO NOT build:

Portfolio Lab

Market Voices

authentication

subscriptions

payment

backend

database

yet.

==================================================

SUCCESS TEST

==================================================

When I open the finished preview I should NOT think:

"this is the same EquityLens with different colours."

It should feel like an entirely new, professionally designed financial research application.

If it looks like:

- generic SaaS

- Streamlit

- AI-generated dashboard

- student project

KEEP IMPROVING IT.

The product should look credible enough that someone could believe it is a real fintech startup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4aa6bb48-0623-4daa-bd99-25fdeb167b42).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
