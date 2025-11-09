import {getConfig} from 'next/config'
// If you need to access runtime configuration
const { publicRuntimeConfig } = getConfig()

export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Next.js with React</p>
    </div>
  )
}