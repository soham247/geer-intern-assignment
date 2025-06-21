import React from 'react'

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-256px)]'>
        <h1 className='text-3xl font-bold'>404 - Not Found</h1>        
        <p className='text-center px-5 mt-5'>The page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound