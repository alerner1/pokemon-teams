const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const qs = (selector) => document.querySelector(selector)
const ce = (element) => document.createElement(element)


document.addEventListener('DOMContentLoaded', e => { 
  fetch(TRAINERS_URL)
    .then(resp => resp.json())
    .then(json => renderTrainers(json));
    
  const renderTrainers = (trainers) => {
    main = document.querySelector('main');
    for (trainer of trainers) {      
      const newDiv = document.createElement('div')
      newDiv.className = 'card'
      newDiv.dataset.id = trainer.id

      const newName = ce('p')
      newName.textContent = trainer.name
      newDiv.append(newName)

      const newButton = ce('button')
      newButton.dataset.trainerId = trainer.id
      newButton.textContent = 'Add Pokemon'
      newDiv.append(newButton)
      
      const newUl = ce('ul')
      newDiv.append(newUl)    
      main.append(newDiv)

      for (pokemon of trainer.pokemons) {
        const newLi = ce('li')
        newLi.textContent = `${pokemon.nickname} (${pokemon.species})`
        newUl.append(newLi)

        const releaseButton = ce('button')
        releaseButton.className = 'release'
        releaseButton.dataset.pokemonId = pokemon.id
        releaseButton.textContent = 'release'   
        newLi.append(releaseButton)
      }
    }   
  };

  const addPokemon = (currentUl, pokemon) => {
    const newLi = ce('li')
    newLi.textContent = `${pokemon.nickname} (${pokemon.species})`
    currentUl.append(newLi)

    const releaseButton = ce('button')
    releaseButton.className = 'release'
    releaseButton.dataset.pokemonId = pokemon.id
    releaseButton.textContent = 'release'   
    newLi.append(releaseButton)
  }

  const deletePokemon = (target, pokemon)  => {
    target.parentNode.remove()
  }

  const clickHandler = () => { 
    document.addEventListener('click', e => {
      if (e.target.textContent == 'Add Pokemon') {
        currentUl = e.target.nextSibling
        if (currentUl.childElementCount == 6) {
          alert('Your team is full! You must release a Pokemon before adding a new one.')
        } else {
          fetch(POKEMONS_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "trainer_id": `${e.target.dataset.trainerId}`
            })
          })
          .then(resp => resp.json())
          .then(json => addPokemon(currentUl, json))
        }
      } else if (e.target.textContent == 'release') {
          fetch(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`, {
            method: "DELETE"
            
          }).then(resp=>resp.json())
          .then(json => deletePokemon(e.target, json))
          .catch(error => console.log(error.message))
          
      }
    })
  }

  clickHandler();
});