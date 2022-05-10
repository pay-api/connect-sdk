import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { useConnect } from '@pay-api/connect-sdk';

// import { useConnect } from '../src/index'; // for local testing

export const App = () => {
  const [authorizationCode, setAuthorizationCode] = useState<string | null>(
    null
  );
  const [state, setState] = useState<string | null>();

  const onSuccess = ({
    authorizationCode,
    state,
  }: {
    authorizationCode: string;
    state?: string;
  }): void => {
    setAuthorizationCode(authorizationCode);
    if (state) setState(state);
  };
  const onError = ({ errorMessage }: { errorMessage: string }) =>
    console.error({ errorMessage });
  const onClose = () => console.log('User exited Connect');

  const { open } = useConnect({
    clientId: '88C0525D-067C4B8B-A96DD467-FAD7BE72',
    scopes: ['transactions', 'identity'],
    mode: 'retail',
    // provider: 'amazon', // optional param, will skip the provider selector page if set
    // sandbox: true, // if this flag is enabled, `provider` needs to be `provider: sandbox` above
    // state: '00000000-0000-0000-0000-000000000000', // optional - usually your internal identifier of a customer
    onSuccess,
    onError,
    onClose,
  });

  return (
    <div>
      <header>
        <p>Authorization Code: {authorizationCode}</p>
        <p>State (optional): {state}</p>
        <button type="button" onClick={() => open()}>
          open connect
        </button>
      </header>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container!); // eslint-disable-line @typescript-eslint/no-non-null-assertion

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
