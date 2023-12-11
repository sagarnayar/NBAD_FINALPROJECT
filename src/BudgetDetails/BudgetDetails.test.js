// src/components/BudgetDetails/BudgetDetails.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import BudgetDetails from './BudgetDetails';

test('renders budget details information', () => {
  render(<BudgetDetails usedBudget={500} />);
  const usedBudgetElement = screen.getByText(/Used Budget: \$500/i);
  expect(usedBudgetElement).toBeInTheDocument();
});
