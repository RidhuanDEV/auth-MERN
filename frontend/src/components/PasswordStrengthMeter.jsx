import { Check, X } from "lucide-react";
import React from "react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 Characters", met: password.length >= 6 },
    { label: "Contains Uppercase Letter", met: /[A-Z]/.test(password) },
    { label: "Contains Lowercase Letter", met: /[a-z]/.test(password) },
    { label: "Contains a Number", met: /\d/.test(password) },
    { label: "Contains Special Character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((items, index) => (
        <div key={items.label} className="flex items-center text-xs">
          {items.met ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <X className="size-4 text-red-500" />
          )}
          <span className={items.met ? "text-green-500" : "text-gray-300"}>
            {items.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[A-Z]/) && pass.match(/[a-z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const getStrengthText = (strength) => {
    switch (strength) {
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Very Weak";
    }
  };

  const getColor = (strength) => {
    switch (strength) {
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
              index < strength ? getColor(strength) : "bg-gray-600"
            }`}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
