import { Snackbar as MuiSnackbar } from '@mui/material';
import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { setSnackbarMessage } from 'src/redux/uiSlice';
import Body from './typography/Body';

const Snackbar = () => {
  const dispatch = useDispatch();
  const { snackbarMessage } = useSelector((rootState: RootState) => rootState.ui);

  const onClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(setSnackbarMessage(undefined));
  };

  return (
    <MuiSnackbar
      classes={{ root: '!bottom-[100px]' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={snackbarMessage !== undefined}
      onClose={onClose}
      autoHideDuration={2000}
    >
      <div>
        <Body size="l" className="rounded-[4px] bg-navy-300 px-5 py-[10px] text-white shadow-md">
          {snackbarMessage}
        </Body>
      </div>
    </MuiSnackbar>
  );
};

export default Snackbar;
