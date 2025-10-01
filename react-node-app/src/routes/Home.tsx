import Hello from '../components/Hello';
import { useCounter } from '../stores/useCounter';

export default function Home() {
  const { count, increment } = useCounter();
  return (
    <div>
      <h1>Home Page</h1>
      <Hello />
      <p>Counter: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}