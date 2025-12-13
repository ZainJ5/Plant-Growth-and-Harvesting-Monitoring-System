// input fields with their label above them
const InputField = ({ 
  label, 
  icon, 
  // Add these 3 new props so the parent can control the input
  name, 
  value, 
  onChange,
  // Keep your existing styling props
  type, 
  placeholder 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>

      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
          {icon}
        </div>

        <input
          /* 1. Connect the Identity */
          name={name}
          
          /* 2. Connect the State (What shows in the box) */
          value={value}
          
          /* 3. Connect the Logic (What happens when typing) */
          onChange={onChange}
          
          /* Standard attributes */
          type={type}
          placeholder={placeholder}
          className='block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white sm:text-sm'
        />
      </div>
    </div>
  )
}

export default InputField;