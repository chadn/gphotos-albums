import { render, screen } from '@testing-library/react';

import HomePage from '@/app/homepage/page';

describe('Homepage', () => {
  it('renders the Components', () => {
    render(<HomePage />);

    const heading = screen.getByText(/A starter for Next.js/i);

    expect(heading).toBeInTheDocument();
  });
});
