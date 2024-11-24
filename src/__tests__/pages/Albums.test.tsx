import { render, screen } from '@testing-library/react';

import Albums from '@/app/albums/page';

describe('Albums', () => {
  it('renders the Components', () => {
    render(<Albums />);

    const heading = screen.getByText(/Album Details/i);

    expect(heading).toBeInTheDocument();
  });
});
