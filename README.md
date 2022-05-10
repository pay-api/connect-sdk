# connect-sdk

[![NPM](https://img.shields.io/npm/v/@pay-api/connect-sdk.svg)](https://www.npmjs.com/package/@pay-api/connect-sdk)

## Install

```bash
npm install --save @pay-api/connect-sdk
```

## Usage

typescript

```tsx
import React, { useState } from 'react';
import { useConnect } from '@pay-api/connect-sdk';

const App = () => {
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
    clientId: '<your-client-id>',
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
```

javascript

```jsx
import React, { useState } from 'react';
import { useConnect } from '@pay-api/connect-sdk';

const App = () => {
  const [authorizationCode, setAuthorizationCode] = useState(null);
  const [state, setState] = useState();

  const onSuccess = ({ authorizationCode, state }: {
    authorizationCode: string,
    state?: string
  }): void => {
    setAuthorizationCode(authorizationCode);
    if (state) setState(state);
  }
  const onError = ({ errorMessage }) => console.error(errorMessage);
  const onClose = () => console.log('User exited Connect');

  const { open } = useConnect({
    clientId: '<your-client-id>',
    scopes: ['transactions', 'identity'],
    // provider: '<amazon>',
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
          open pay-api connect
        </button>
      </header>
    </div>
  );
};
```
