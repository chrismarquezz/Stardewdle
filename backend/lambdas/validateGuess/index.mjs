export const handler = async (event) => {
  const cropData = {
    potato: {
      type: "vegetable",
      regrows: false,
      season: ["spring"],
      growth_time: 6,
      xp_gain: 12,
      energy: 25,
      health: 11,
      base_price: 80,
      color: "brown",
      recipe_usage_count: 1
    },
    melon: {
      type: "fruit",
      regrows: false,
      season: ["summer"],
      growth_time: 12,
      xp_gain: 23,
      energy: 113,
      health: 50,
      base_price: 250,
      color: "pink",
      recipe_usage_count: 2
    }
  };

  let guess;
  try {
    guess = JSON.parse(event.body).guess.toLowerCase();
    if (!cropData[guess]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid crop name." }),
      };
    }
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request format." }),
    };
  }

  const answer = "potato";
  const guessed = cropData[guess];
  const target = cropData[answer];

  const compareNumber = (a, b) =>
    a === b ? "match" : a > b ? "higher" : "lower";

  const result = {
    type: guessed.type === target.type ? "match" : "mismatch",
    regrows: guessed.regrows === target.regrows ? "match" : "mismatch",
    season: JSON.stringify(guessed.season) === JSON.stringify(target.season)
      ? "match"
      : guessed.season.some(s => target.season.includes(s))
      ? "partial"
      : "mismatch",
    growth_time: compareNumber(guessed.growth_time, target.growth_time),
    xp_gain: compareNumber(guessed.xp_gain, target.xp_gain),
    energy: compareNumber(guessed.energy, target.energy),
    health: compareNumber(guessed.health, target.health),
    base_price: compareNumber(guessed.base_price, target.base_price),
    color: guessed.color === target.color ? "match" : "mismatch",
    recipe_usage_count: compareNumber(
      guessed.recipe_usage_count,
      target.recipe_usage_count
    ),
  };

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ result }),
  };
};
