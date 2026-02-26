import fetch from "node-fetch";

const DIVISIONS = [
  { name: "Men 16-54", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=1&region=0&scaled=0&sort=0" },
  { name: "Women 16-54", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=2&region=0&scaled=0&sort=0" },
  { name: "Men 55-59", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=7&region=0&scaled=0&sort=0" },
  { name: "Women 55-59", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=8&region=0&scaled=0&sort=0" },
  { name: "Men 60-64", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=36&region=0&scaled=0&sort=0" },
  { name: "Women 60-64", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=37&region=0&scaled=0&sort=0" },
  { name: "Men 65-69", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=40&region=0&scaled=0&sort=0" },
  { name: "Women 65-69", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=41&region=0&scaled=0&sort=0" },
  { name: "Men 70+", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=42&region=0&scaled=0&sort=0" },
  { name: "Women 70+", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=43&region=0&scaled=0&sort=0" },
  { name: "Boys 14-15", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=14&region=0&scaled=0&sort=0" },
  { name: "Girls 14-15", url: "https://c3po.crossfit.com/api/leaderboards/v2/competitions/open/2026/leaderboards?view=0&division=15&region=0&scaled=0&sort=0" },
];

export async function GET() {
  try {
    let total = 0;
    const divisions = [];

    for (const div of DIVISIONS) {
      const res = await fetch(div.url);
      const json = await res.json();

      // Grab the first page total
      const divTotal = json.pagination?.totalCompetitors || 0;
      total += divTotal;

      divisions.push({ division: div.name, total: divTotal });
    }

    return new Response(
      JSON.stringify({
        total,
        divisions,
        updatedAt: new Date().toISOString(),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching divisions:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
