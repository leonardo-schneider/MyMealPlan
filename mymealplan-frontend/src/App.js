import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';
import { useState } from 'react';

function App() {

  const [token, setToken] = useState(() => localStorage.getItem('access') || "");
  const [mealPlan, setMealPlan] = useState(null); // globally stored meal plan

  const handleMealPlanUpdate = (newMealPlan) => {
    setMealPlan(newMealPlan);
    // optionally trigger other updates here (e.g., re-fetch dashboard)
  };

  return (
    <Router>
      <AnimatedRoutes
        token={token}
        onMealPlanUpdate={handleMealPlanUpdate}
        mealPlan={mealPlan} 
      />
    </Router>
  );
}

export default App;
