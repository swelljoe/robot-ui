import React from 'react';
import { useSelector, useDispatch } from 'typeDux';
import { useIntl } from 'react-intl';

/** Mui Components */
import { Button } from '@mui/material';

/** Components */
import DeliverForm from './DeliverForm/DeliverForm';
import Dashboard from './Dashboard/Dashboard';
import MingleForm from './MingleForm/MingleForm';
import Text from 'components/Text/Text';

/** styles */

/** redux */
import {
  getDisplayMessage,
  getDisplayScreen,
  getIsConfirmationNeeded,
} from 'state/ui/ui.selectors';

/** helpers */
import useSocketIo from 'utilities/useSocketIo/useSocketIo';
import { DisplayScreenOptions } from 'appConstants';

interface MessageDisplayProps {
  formRef: React.RefObject<HTMLFormElement>;
}

export default function MessageDisplay({ formRef }: MessageDisplayProps) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const socket = useSocketIo(dispatch);
  const displayMessage = useSelector(getDisplayMessage);
  const displayScreen = useSelector(getDisplayScreen);
  const isConfirmationNeeded = useSelector(getIsConfirmationNeeded);

  if (displayMessage) {
    return (
      <>
        <Text variant='h2'>{displayMessage}</Text>
        {isConfirmationNeeded && (
          <Button
            onClick={() => {
              socket?.emit('ui_event', { name: 'user_confirmed', context: {} });
            }}
          >
            {intl.formatMessage({ id: 'done' })}
          </Button>
        )}
      </>
    );
  } else if (displayScreen === DisplayScreenOptions.Dashboard) {
    return <Dashboard />;
  } else if (displayScreen === DisplayScreenOptions.DeliverForm) {
    return <DeliverForm formRef={formRef} />;
  } else if (displayScreen === DisplayScreenOptions.MingleForm) {
    return <MingleForm formRef={formRef} />;
  }

  return <Text variant='h2'>Hello, I'm Hal</Text>;
}
