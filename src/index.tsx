import * as api from '@pay-api/api';
import { useEffect } from 'react';

const CONNECT_URI = 'https://connect.pay-api.link';
// const CONNECT_URI = 'http://localhost:3000'; // for local testing
const DEFAULT_REDIRECT_URI = 'https://pay-api.link';
const CONNECT_IFRAME_ID = 'connect-iframe';
const AUTH_MESSAGE_NAME = 'auth-message';

const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export type SdkProps = {
  clientId: api.ClientId;
  scopes: api.Scopes;
  mode: api.Mode;
  provider?: api.Provider;
  sandbox?: boolean;
  state?: string;
  onSuccess?: Function; // eslint-disable-line @typescript-eslint/ban-types
  onError?: Function; // eslint-disable-line @typescript-eslint/ban-types
  onClose?: Function; // eslint-disable-line @typescript-eslint/ban-types
  zIndex?: number;
};

export const useConnect = (props: SdkProps) => {
  const {
    clientId,
    scopes = [],
    mode = 'retail',
    provider,
    state,
    // provider = 'sandbox',
    sandbox = false,
    onSuccess = noop,
    onError = noop,
    onClose = noop,
    zIndex = 999, // how much priority to give the modal
  } = props;

  const _constructAuthUrl = ({
    clientId,
    scopes,
  }: {
    clientId: api.ClientId;
    scopes: api.Scopes;
  }) => {
    const authUrl = new URL(CONNECT_URI);

    if (clientId) authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('scopes', scopes.join(' '));
    authUrl.searchParams.append('redirect_uri', DEFAULT_REDIRECT_URI);
    authUrl.searchParams.append('mode', mode);
    authUrl.searchParams.append('app_type', 'spa');
    if (state) authUrl.searchParams.append('state', state);
    if (provider) authUrl.searchParams.append('provider', provider);
    if (sandbox) authUrl.searchParams.append('sandbox', sandbox.toString());

    return authUrl.href;
  };

  const open = (): null | void => {
    if (document.getElementById(CONNECT_IFRAME_ID)) return null;

    const iframe = document.createElement('iframe');
    iframe.src = _constructAuthUrl({ clientId, scopes });
    iframe.frameBorder = '0';
    iframe.id = CONNECT_IFRAME_ID;
    iframe.style.position = 'fixed';
    iframe.style.zIndex = zIndex.toString();
    iframe.style.height = '100%';
    iframe.style.width = '100%';
    iframe.style.top = '0';
    iframe.style.backgroundColor = 'none transparent';
    iframe.style.border = 'none';
    document.body.prepend(iframe);
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    const frameToRemove = document.getElementById(CONNECT_IFRAME_ID);
    if (frameToRemove) {
      frameToRemove?.parentNode?.removeChild(frameToRemove);
      document.body.style.overflow = 'inherit';
    }
  };

  useEffect(() => {
    const handleAuth = (event: MessageEvent) => {
      const handleAuthSuccess = ({
        authorizationCode,
        state,
      }: {
        authorizationCode: string;
        state?: string;
      }) => onSuccess({ authorizationCode, state });
      const handleAuthError = (error: MessageEvent) =>
        onError({ errorMessage: error });
      const handleAuthClose = () => onClose();

      if (!event.data) return;
      if (event.data.name !== AUTH_MESSAGE_NAME) return;
      if (!event.origin.startsWith(CONNECT_URI)) return;

      const { authorizationCode, error, closed, state } = event.data;

      close();

      if (authorizationCode) handleAuthSuccess({ authorizationCode, state });
      if (error) handleAuthError(error);
      if (closed) handleAuthClose();
    };

    window.addEventListener('message', handleAuth);

    return () => window.removeEventListener('message', handleAuth);
  }, [onClose, onError, onSuccess]);

  return {
    open,
  };
};
