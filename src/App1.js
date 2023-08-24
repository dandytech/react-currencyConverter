// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [result, setResult] = useState("");
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [curr, setCurr] = useState([]);
  console.log(from);
  console.log(to);

  const getConversion = async () => {
    await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
    )
      .then((res) => res.json())
      .then((data) => {
        setResult(data.rates);
        console.log(result);
      });
  };
  useEffect(() => {
    getConversion();
  }, [amount]);

  const getCurrency = async () => {
    await fetch(`https://api.frankfurter.app/currencies`)
      .then((res) => res.json())
      .then((data) => {
        setCurr([...Object.keys(data)]);
        console.log(curr);
      })
      .catch(() => {});
  };
  useEffect(() => {
    getCurrency();
  }, []);

  return (
    <div>
      <input
        value={amount}
        type="number"
        onChange={(e) => setAmount(e.target.value)}
      />
      <FromCurrency from={setFrom} curr={curr} />
      <span> to </span>
      <ToCurrency to={setTo} curr={curr} />
      <Result result={result} />
    </div>
  );
}

function FromCurrency({ from, curr, setFrom }) {
  return (
    <select onChange={(e) => from(e.target.value)}>
      {curr && curr.map((item) => <option value={item}>{item}</option>)}
    </select>
  );
}
function ToCurrency({ to, curr, setTo }) {
  return (
    <select onChange={(e) => setTo(e.target.value)}>
      {curr && curr.map((item) => <option value={item}>{item}</option>)}
    </select>
  );
}
function Result({ result }) {
  return <p>Result: {}</p>;
}
