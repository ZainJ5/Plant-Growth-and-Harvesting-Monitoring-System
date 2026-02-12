// input fields with their label above them
const InputField = ({ 
  label, 
  icon, 
  name, 
  value, 
  onChange,
  type, 
  placeholder,
  error,
  required = false
}) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-bold text-gray-800 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className='relative'>
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
          error ? 'text-red-400' : 'text-gray-400'
        }`}>
          {icon}
        </div>

        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={`block w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-gray-900 placeholder-gray-400 
            focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white sm:text-sm
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-200'
            }
            hover:border-gray-300`}
        />
      </div>
      
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

export default InputField;