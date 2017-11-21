export default [
  {
    type: "HERO_STATE_UPDATED",
    payload: {
      hero: {
        name: "bob",
        birthday: "2017-06-08",
        health: 100,
        inventory: ["stick"],
        gold: 100,
        spells: ["spark"]
      }
    }
  },
  {
    type: "HERO_STATE_UPDATED",
    payload: {
      hero: {
        name: "bob",
        birthday: "2017-06-08",
        health: 90,
        inventory: ["stick", "club"],
        gold: 120,
        spells: ["spark", "bolt"]
      }
    }
  },
  {
    type: "HERO_STATE_UPDATED",
    payload: {
      hero: {
        name: "bob",
        birthday: "2017-06-08",
        health: 70,
        inventory: ["club"],
        gold: 200,
        spells: ["spark", "bolt"]
      }
    }
  },
  {
    type: "HERO_STATE_UPDATED",
    payload: {
      hero: {
        name: "bob",
        birthday: "2017-06-08",
        health: 30,
        inventory: ["sword"],
        gold: 200,
        spells: ["spark", "bolt", "healing"]
      }
    }
  }
]
