// input fields with their label above them
const InputField = ({ label, type, placeholder, icon }) => {
  return (
    <div className="mb-4">
      {/* Label Text */}
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>

      {/* The Input Container */}
      <div className='relative'>

        {/* Icon */}
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
          {icon}
        </div>

        {/* Input Field */}
        <input
          type={type}
          className='block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white sm:text-sm'
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default InputField;