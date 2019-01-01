const axios = require('axios');
const $ = require('cheerio');
const fs = require('fs');

const url = 'https://pokemondb.net/pokedex/all';

async function main() {
  const response = await axios.get(url);
  const html = response.data;

  const pkmnTable = $('#pokedex', html)

  const pokemon = []

  $("tr", pkmnTable).each(function (index, item) {
    const id = $(".infocard-cell-data", item).text()
    const img = $(".infocard-cell-img .icon-pkmn", item).attr('data-src')
    var name = $(".ent-name", item).text()
    const subTxt = $(".cell-name .text-muted", item).text()

    if (subTxt.length > 0) {
      name = `${name} (${subTxt})`
    }
    if (id.length > 0) {
      pokemon.push({ id: id, name: name, img: img })
    }
  })

  const json = JSON.stringify(pokemon)
  fs.writeFile('pokelist.json', json, 'utf8', function (err) {
    if (err) {
      console.log(err)
    }
    console.log("complete")
  });
}

main()