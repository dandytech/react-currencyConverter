// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("USD");
  const [converted, setConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function getConversion() {
      try {
        setIsLoading(true);

        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error("Something went wrong fetching rate");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Rate not found");

        console.log(data);
        setConverted(data.rates[to]);

        setError("");
      } catch (err) {
        console.error(err.message);

        //display other errors other than AbortError
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    //if cuurency is the same, don't run the fetch function
    if (from === to) return setConverted(amount);
    getConversion();

    //cleanupfunction to cancel request when another request is made
    return function () {
      controller.abort();
    };
  }, [amount, from, to]);

  //
  //
  const getCurrency = async () => {
    await fetch(`https://api.frankfurter.app/currencies`)
      .then((res) => res.json())
      .then((data) => {
        setCurrency([...Object.keys(data)]);
        console.log(data);
      })
      .catch(() => {});
  };
  useEffect(() => {
    getCurrency();
  }, []);

  // useEffect(() => {
  //   const getCurrency = async (url) => {
  //     const response = await fetch(url);
  //     const responseData = await response.json();
  //     setResult(responseData);
  //   };
  //   getCurrency(`https://api.frankfurter.app/currencies`);
  // }, []);

  return (
    <div>
      <input
        value={amount}
        type="number"
        onChange={(e) => setAmount(Number(e.target.value))}
        disabled={isLoading}
      />

      <FromCurrency from={from} setFrom={setFrom} currency={currency} />
      <span> to </span>
      <ToCurrency to={to} setTo={setTo} currency={currency} />

      <p>{isLoading && <span>Loading...</span>}</p>

      <Result converted={converted} to={to} amount={amount} from={from} />
    </div>
  );
}

function FromCurrency({ setFrom, from, isLoading, currency }) {
  return (
    <select
      value={from}
      onChange={(e) => setFrom(e.target.value)}
      disabled={isLoading}
    >
      {currency && currency.map((item) => <option value={item}>{item}</option>)}
    </select>
  );
}

function ToCurrency({ setTo, to, isLoading, currency }) {
  return (
    <select
      value={to}
      onChange={(e) => setTo(e.target.value)}
      disabled={isLoading}
    >
      {currency && currency.map((item) => <option value={item}>{item}</option>)}
    </select>
  );
}

function Result({ converted, to, amount, from }) {
  return (
    <p>
      {amount} {from} to {to} = {converted} {to}
    </p>
  );
}
