import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('Renders Vite + React', () => {
    render(<App />);
    const element = screen.getByText('Vite + React');
    expect(element).toBeInTheDocument();
  });
});