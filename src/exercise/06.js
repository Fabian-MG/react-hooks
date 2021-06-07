// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'

// eslint-disable-next-line no-unused-vars
class MyErrorBoundary extends React.Component {
  state = { 
    error: null 
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { error } = this.state 
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }
    return this.props.children; 
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: 'idle',
    error: null
  })
  const {error, status, pokemon} = state

    React.useEffect(() => {
      if(!pokemonName) return

      setState({status: 'pending'})
      fetchPokemon(pokemonName).then(
        pokemonData => { 
          setState({status: 'resolved', pokemon: pokemonData})
        },
        error => {
          setState({status: 'rejected', error})
        },
      )
    }, [pokemonName])

  if(status === 'rejected') {
    throw error
  } else if(status === 'idle') {
    return 'Submit a pokemon'
  } else if(status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if(status === 'resolved'){
    return <PokemonDataView pokemon={pokemon} />
  }
  
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
      <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
        <hr />
        <div className="pokemon-info">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}
>
            <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
        </div>
      </div>
  )
}

export default App
