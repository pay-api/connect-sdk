import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useConnect } from '../src/index';

const App = () => {
  const { open } = useConnect({
    clientId: '00000000-00000000-00000000-00000000',
    scopes: ['transactions', 'identity'],
    mode: 'retail',
    onSuccess: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    onError: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    onClose: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  });

  return (
    <div>
      <header>
        <button type="button" onClick={() => open()}>
          open connect
        </button>
      </header>
    </div>
  );
};

describe('app', () => {
  beforeEach(() => {
    render(<App />);
    // screen.debug(); // to debug...
  });

  it('renders without crashing', () => {
    const button = screen.getByRole('button');

    expect(button).toBeDefined();
  });
});
