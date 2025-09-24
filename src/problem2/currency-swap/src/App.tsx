import { useState } from "react";
import CustomSelector from "./components/custom-selector";
import { currencyData } from "./data/currencyData.ts";
import { useForm } from "react-hook-form";

const generateExchangeRates = () => {
  const rates: Record<string, Record<string, number>> = {};

  currencyData.forEach((fromCurrency) => {
    rates[fromCurrency.currency] = {};

    currencyData.forEach((toCurrency) => {
      if (fromCurrency.currency === toCurrency.currency) {
        rates[fromCurrency.currency][toCurrency.currency] = 1;
      } else {
        rates[fromCurrency.currency][toCurrency.currency] =
          fromCurrency.price / toCurrency.price;
      }
    });
  });

  return rates;
};

const exchangeRates = generateExchangeRates();

function App() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("ETH");
  // const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [isExchanging, setIsExchanging] = useState(false);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm({ mode: "onChange", defaultValues: { fromAmount: "" } });

  const fromAmount: string = watch("fromAmount");

  const convertCurrency = (amount: string, from: string, to: string) => {
    if (!amount || amount === "0") return "";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "";

    if (from === to) return amount;
    const rate = exchangeRates[from]?.[to] || 1;
    return (rate * numAmount).toFixed(5);
  };

  const handleClearFromAmount = () => {
    setValue("fromAmount", "");
    setToAmount("");
  };

  const handleChangeCurrency = (currency: string, type: "from" | "to") => {
    if (fromAmount !== "") setIsExchanging(true);
    let converted;
    if (type === "from") {
      converted = convertCurrency(fromAmount, currency, toCurrency);
      setFromCurrency(currency);
    } else {
      converted = convertCurrency(fromAmount, fromCurrency, currency);
      setToCurrency(currency);
    }

    setTimeout(() => {
      setToAmount(converted);
      setIsExchanging(false);
    }, 1000);
  };

  const swapCurrencies = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSwapping(true);
    setTimeout(() => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      const converted = convertCurrency(fromAmount, toCurrency, fromCurrency);
      setToAmount(converted);
      setIsSwapping(false);
    }, 300);
  };

  const handleExchange = handleSubmit(async (data: { fromAmount: string }) => {
    setIsExchanging(true);
    setTimeout(() => {
      const converted = convertCurrency(
        data.fromAmount,
        fromCurrency,
        toCurrency
      );
      setToAmount(converted);
      setIsExchanging(false);
    }, 1000);
  });

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[800px] border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Currency Swap
          </h1>
        </div>

        <form onSubmit={handleExchange}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full bg-gray-50 rounded-2xl p-6 border-2 border-transparent hover:border-blue-200 transition-all duration-200">
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <CustomSelector
                    value={fromCurrency}
                    onChange={(currency) =>
                      handleChangeCurrency(currency, "from")
                    }
                    label="From"
                    focusColor="border-blue-500 ring-blue-500"
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="relative">
                    <input
                      {...register("fromAmount", {
                        required: "Please enter an amount",
                        maxLength: { value: 15, message: "Maximum length is 15 numbers" },
                        pattern: {
                          value: /^\d*\.?\d*$/,
                          message:
                            "Only numeric values and an optional decimal point are allowed",
                        },
                        validate: (value: string) => {
                          if (value === "") return "Please enter an amount";
                          const num = parseFloat(value);
                          if (isNaN(num)) return "Invalid number";
                          if (num <= 0) return "Amount must be greater than 0";
                          return true;
                        },
                      })}
                      name="fromAmount"
                      value={fromAmount}
                      placeholder="0"
                      className="w-full outline-none bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-lg text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {fromAmount && (
                      <span
                        onClick={handleClearFromAmount}
                        className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 hover:text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => swapCurrencies(e)}
                className="focus:outline-none bg-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform"
                aria-label="Swap currencies"
              >
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    isSwapping ? "animate-spin" : ""
                  } md:rotate-90`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            <div className="w-full bg-gray-50 rounded-2xl p-6 border-2 border-transparent hover:border-purple-200 transition-all duration-200">
              <div className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <CustomSelector
                    value={toCurrency}
                    onChange={(currency) =>
                      handleChangeCurrency(currency, "to")
                    }
                    label="To"
                    focusColor="border-purple-500 ring-purple-500"
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="relative">
                    <input
                      readOnly
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      placeholder="0"
                      className="w-full outline-none border-2 bg-white border-gray-200 rounded-xl px-4 py-3 pr-10 text-lg text-gray-800 placeholder-gray-400 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 w-full">
            {errors.fromAmount && (
              <p className="text-sm text-red-600">
                {errors.fromAmount.message?.toString()}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center user-select-none w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExchanging}
          >
            Complete Exchange
            {isExchanging && (
              <span className="ml-3 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
