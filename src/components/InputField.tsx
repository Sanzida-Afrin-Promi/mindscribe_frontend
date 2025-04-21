// components/InputField.tsx
interface InputFieldProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  const InputField: React.FC<InputFieldProps> = ({
    label,
    type = "text",
    value,
    onChange,
  }) => (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
  
  export default InputField;
  