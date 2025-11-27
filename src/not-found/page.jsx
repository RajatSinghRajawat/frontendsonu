import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-3xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-4 mb-8">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
