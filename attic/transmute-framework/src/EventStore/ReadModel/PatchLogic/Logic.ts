export const isHeroBirthday = {
  and: [
    {
      "==": [
        {
          var: "hero.birthday"
        },
        {
          var: "date"
        }
      ]
    }
  ]
}
