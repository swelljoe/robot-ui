import { createSlice } from 'typeDux';
import { DisplayScreenOptions } from '../../constants';
import { NavigationGoal } from 'relay-types';

interface RobotUiState {
  deliverLocations: NavigationGoal[];
  mingleLocations: NavigationGoal[];
  displayScreen:
    | 'Deliver Form'
    | 'Mingle Form'
    | 'Go-To Form'
    | 'Dashboard'
    | 'Home'
    | 'Passcode'
    | 'Settings';
  displayMessage: string;
  isConfirmationNeeded: boolean;
  inputName: string;
  theme: string;
  language: 'en' | 'es' | 'ja';
  deliverFormValues: {
    dropoff_location: string;
    dropoff_message: string;
  };
}

export const initialState: RobotUiState = {
  displayScreen: DisplayScreenOptions.DeliverForm,
  deliverLocations: [],
  mingleLocations: [],
  displayMessage: '',
  isConfirmationNeeded: false,
  inputName: '',
  theme: '',
  language: 'en',
  deliverFormValues: {
    dropoff_location: '',
    dropoff_message: '',
  },
};

const uiSlice = createSlice({
  name: 'uiSlice',
  initialState,
  reducers: {
    setInputName: (state, { payload }) => {
      state.inputName = payload;
    },
    setTheme: (state, { payload }) => {
      state.theme = payload;
    },
    setIsConfirmationNeeded: (state, { payload }) => {
      state.isConfirmationNeeded = payload;
    },
    setLanguage: (state, { payload }) => {
      state.language = payload;
    },
    setDisplayScreen: (state, { payload }) => {
      state.displayScreen = payload;
    },
    setDisplayMessage: (state, { payload }) => {
      state.displayMessage = payload;
    },
    setNavigationLocations: (state, { payload }) => {
      state.deliverLocations = payload.filter(
        (location: NavigationGoal) => !location?.tags?.includes('internal'),
      );
      state.mingleLocations = payload.filter(
        (location: NavigationGoal) => location?.tags?.includes('Mingle'),
      );
    },
    setDeliverFormValues: (state, { payload }) => {
      state.deliverFormValues = {
        ...state.deliverFormValues,
        ...payload,
      };
    },
  },
});

export const {
  setIsConfirmationNeeded,
  setNavigationLocations,
  setDeliverFormValues,
  setInputName,
  setDisplayScreen,
  setDisplayMessage,
  setTheme,
  setLanguage,
} = uiSlice.actions;

export default uiSlice.reducer;
