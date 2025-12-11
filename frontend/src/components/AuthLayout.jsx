// Wrapper for authentication pages
const AuthLayout = ({ children, title, subtitle }) => {
  return (

    <div className='min-h-screen flex items-center justify-center p-4  bg-green-50'>
      {/* white login card */}
      <div className= 'rounded-2xl shadow-xl w-full max-w-md border border-green-100 bg-white p-8'>

        {/* section for the header */}
        <div className='text-center mb-8'>
          {title && (
            <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm mt-2 text-gray-500">{subtitle}</p>
          )}
        </div>

        {/* input fields */}
        {children}
      
      </div>
    </div>
  )
}

export default AuthLayout;