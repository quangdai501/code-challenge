import { useEffect, useRef, useState } from "react";
import { currencyData } from "../../data/currencyData.ts";
import "./style.css";

const getTokenIcon = (currency: string) => {
  try {
    return `./tokens/${currency}.svg`;
  } catch {
    return null;
  }
};

interface CurrencyOption {
  code: string;
  name: string;
  icon: string | null;
  price: number | string;
  date: string;
}

const getUniqueCurrencies = (): CurrencyOption[] => {
  const uniqueCurrenciesMap: Record<string, CurrencyOption> = {};

  currencyData.forEach(item => {
    const code = item.currency;
    if (!uniqueCurrenciesMap[code]) {
      uniqueCurrenciesMap[code] = {
        code: code,
        name: code,
        icon: getTokenIcon(code),
        price: item.price,
        date: item.date
      };
    }
  });

  return Object.values(uniqueCurrenciesMap).sort((a, b) => a.code.localeCompare(b.code));
};

const currencies = getUniqueCurrencies();



interface CustomSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  focusColor: string;
}

const CustomSelector: React.FC<CustomSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select currency",
  label,
  focusColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCurrency = currencies.find((c) => c.code === value);
  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 hover:border-gray-300 ${
          isOpen ? `${focusColor} ring-2 ring-opacity-20` : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {selectedCurrency ? (
              <>
                <div className="w-8 h-8 flex items-center justify-center">
                  {selectedCurrency.icon ? (
                    <img 
                      src={selectedCurrency.icon} 
                      alt={selectedCurrency.code}
                      className="w-10 h-10"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div>
                  <div className="font-medium text-gray-800 pr-3">
                    {selectedCurrency.code}
                  </div>
                </div>
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {filteredCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    {currency.icon ? (
                      <img 
                        src={currency.icon} 
                        alt={currency.code}
                        className="w-8 h-8"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {currency.code}
                    </div>
                  </div>
                </div>
              ))}
              {filteredCurrencies.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  No currencies found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelector;
