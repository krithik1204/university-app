import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>
           <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
      </div>
    </div>
  )
}

export default App
